import React, { useState } from 'react';
import { db } from '../../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FaPlus, FaTrash, FaTimes } from 'react-icons/fa';

// Extend jsPDF with autoTable type
interface jsPDFWithAutoTable extends jsPDF {
    lastAutoTable: {
        finalY: number;
    };
    autoTable: (options: any) => void;
}

interface InvoiceItem {
    description: string;
    quantity: number;
    unitPrice: number;
}

interface InvoiceGeneratorModalProps {
    isOpen: boolean;
    onClose: () => void;
    activeSite?: string;
    onInvoiceSaved?: () => void;
}

export default function InvoiceGeneratorModal({ isOpen, onClose, activeSite, onInvoiceSaved }: InvoiceGeneratorModalProps) {
    const [clientName, setClientName] = useState('');
    const [clientEmail, setClientEmail] = useState('');
    const [clientAddress, setClientAddress] = useState('');
    const [invoiceNumber, setInvoiceNumber] = useState(`KC-INV-${Date.now().toString().slice(-6)}`);
    const [dateIssued, setDateIssued] = useState(new Date().toISOString().split('T')[0]);
    const [dueDate, setDueDate] = useState(() => {
        const d = new Date();
        d.setDate(d.getDate() + 30);
        return d.toISOString().split('T')[0];
    });
    const [division, setDivision] = useState(activeSite || 'Kone Consult');
    const [notes, setNotes] = useState('Payment is due within 30 days. You can pay online via Kone Pay.');
    
    const [items, setItems] = useState<InvoiceItem[]>([
        { description: 'PhD Research Contract - Initial Deposit', quantity: 1, unitPrice: 1500 }
    ]);

    const [isSaving, setIsSaving] = useState(false);

    if (!isOpen) return null;

    const handleAddItem = () => {
        setItems([...items, { description: '', quantity: 1, unitPrice: 0 }]);
    };

    const handleRemoveItem = (index: number) => {
        if (items.length === 1) return;
        setItems(items.filter((_, i) => i !== index));
    };

    const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
        const newItems = [...items];
        if (field === 'quantity') {
            newItems[index][field] = parseInt(value as string) || 0;
        } else if (field === 'unitPrice') {
            newItems[index][field] = parseFloat(value as string) || 0;
        } else {
            newItems[index][field] = value as never;
        }
        setItems(newItems);
    };

    const calculateSubtotal = () => {
        return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    };

    const generatePDF = () => {
        try {
            const doc = new jsPDF() as jsPDFWithAutoTable;
            const subtotal = calculateSubtotal();

            // Styling colors
            const primaryColor = [0, 136, 254]; // Kone Consult blue
            const textColor = [60, 60, 60];

            // Title and Header
            doc.setFontSize(22);
            doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            doc.text('INVOICE', 20, 20);

            // Company Info
            doc.setFontSize(10);
            doc.setTextColor(textColor[0], textColor[1], textColor[2]);
            doc.text('Kone Consult', 140, 20);
            doc.text('Academic & Business Research', 140, 25);
            doc.text('info@koneconsult.com', 140, 30);
            doc.text('consult.koneacademy.com', 140, 35);

            // Divider line
            doc.setDrawColor(220, 220, 220);
            doc.line(20, 42, 190, 42);

            // Invoice Metadata
            doc.setFontSize(10);
            doc.text(`Invoice No: ${invoiceNumber}`, 20, 52);
            doc.text(`Date Issued: ${new Date(dateIssued).toLocaleDateString()}`, 20, 58);
            doc.text(`Due Date: ${new Date(dueDate).toLocaleDateString()}`, 20, 64);
            doc.text(`Division: ${division}`, 20, 70);

            // Client Info
            doc.text('Bill To:', 120, 52);
            doc.setFont('helvetica', 'bold');
            doc.text(clientName || 'Client Name', 120, 58);
            doc.setFont('helvetica', 'normal');
            doc.text(clientEmail || 'Client Email', 120, 64);
            if (clientAddress) {
                doc.text(clientAddress, 120, 70);
            }

            // Line Items Table
            const tableBody = items.map(item => [
                item.description,
                item.quantity.toString(),
                `GHS ${item.unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
                `GHS ${(item.quantity * item.unitPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
            ]);

            doc.autoTable({
                startY: 80,
                head: [['Description', 'Qty', 'Unit Price', 'Total']],
                body: tableBody,
                theme: 'striped',
                headStyles: { fillColor: primaryColor },
                styles: { fontSize: 9, cellPadding: 4 },
                columnStyles: {
                    0: { cellWidth: 90 },
                    1: { cellWidth: 20, halign: 'center' },
                    2: { cellWidth: 30, halign: 'right' },
                    3: { cellWidth: 30, halign: 'right' }
                }
            });

            // Summary Table
            const finalY = doc.lastAutoTable.finalY || 120;
            doc.setFontSize(10);
            doc.text('Total Amount Due:', 110, finalY + 15);
            doc.setFont('helvetica', 'bold');
            doc.text(`GHS ${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 150, finalY + 15);

            // Notes
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(120, 120, 120);
            doc.text('Notes & Payment Terms:', 20, finalY + 30);
            doc.text(notes, 20, finalY + 35, { maxWidth: 170 });

            // Save PDF
            doc.save(`Invoice_${invoiceNumber}.pdf`);
            return true;
        } catch (error) {
            console.error('Error generating invoice PDF:', error);
            alert('Failed to generate PDF. Check console.');
            return false;
        }
    };

    const handleSaveAndDownload = async () => {
        if (!clientName.trim() || !clientEmail.trim()) {
            alert('Client Name and Email are required.');
            return;
        }

        setIsSaving(true);
        try {
            const subtotal = calculateSubtotal();
            
            // 1. Save to Firestore
            await addDoc(collection(db, 'invoices'), {
                invoiceNumber,
                clientName,
                clientEmail,
                clientAddress,
                dateIssued,
                dueDate,
                division,
                notes,
                items,
                totalAmount: subtotal,
                status: 'Sent',
                createdAt: serverTimestamp()
            });

            // 2. Generate and Download PDF
            generatePDF();

            // 3. Notify parent
            if (onInvoiceSaved) {
                onInvoiceSaved();
            }

            alert('Invoice saved and downloaded successfully!');
            onClose();
        } catch (error) {
            console.error('Error saving invoice:', error);
            alert('Failed to save invoice to database.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content-custom animate-fade-in" style={{ maxWidth: '850px' }}>
                <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom border-secondary">
                    <h4 className="text-white mb-0">Generate Custom Invoice</h4>
                    <button className="btn btn-link text-white p-0" style={{ fontSize: '1.25rem' }} onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                <div className="modal-body-content" style={{ maxHeight: '70vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
                    <div className="row g-3">
                        {/* Client Info */}
                        <div className="col-12 col-md-6">
                            <label className="text-secondary small mb-1 d-block">Client Name *</label>
                            <input 
                                type="text" 
                                className="form-control-dark" 
                                value={clientName} 
                                onChange={(e) => setClientName(e.target.value)} 
                                placeholder="e.g. University of Ghana"
                                required
                            />
                        </div>
                        <div className="col-12 col-md-6">
                            <label className="text-secondary small mb-1 d-block">Client Email *</label>
                            <input 
                                type="email" 
                                className="form-control-dark" 
                                value={clientEmail} 
                                onChange={(e) => setClientEmail(e.target.value)} 
                                placeholder="e.g. finance@university.edu"
                                required
                            />
                        </div>
                        <div className="col-12">
                            <label className="text-secondary small mb-1 d-block">Client Billing Address</label>
                            <input 
                                type="text" 
                                className="form-control-dark" 
                                value={clientAddress} 
                                onChange={(e) => setClientAddress(e.target.value)} 
                                placeholder="e.g. Department of Computer Science, Legon"
                            />
                        </div>

                        {/* Invoice Metadata */}
                        <div className="col-12 col-md-3">
                            <label className="text-secondary small mb-1 d-block">Invoice Number</label>
                            <input 
                                type="text" 
                                className="form-control-dark" 
                                value={invoiceNumber} 
                                onChange={(e) => setInvoiceNumber(e.target.value)} 
                            />
                        </div>
                        <div className="col-12 col-md-3">
                            <label className="text-secondary small mb-1 d-block">Date Issued</label>
                            <input 
                                type="date" 
                                className="form-control-dark" 
                                value={dateIssued} 
                                onChange={(e) => setDateIssued(e.target.value)} 
                            />
                        </div>
                        <div className="col-12 col-md-3">
                            <label className="text-secondary small mb-1 d-block">Due Date</label>
                            <input 
                                type="date" 
                                className="form-control-dark" 
                                value={dueDate} 
                                onChange={(e) => setDueDate(e.target.value)} 
                            />
                        </div>
                        <div className="col-12 col-md-3">
                            <label className="text-secondary small mb-1 d-block">Division</label>
                            <select 
                                className="form-control-dark" 
                                value={division} 
                                onChange={(e) => setDivision(e.target.value)}
                            >
                                <option value="Kone Consult">Kone Consult</option>
                                <option value="Kone Code">Kone Code</option>
                                <option value="Kone Lab">Kone Lab</option>
                                <option value="Kone Academy">Kone Academy</option>
                            </select>
                        </div>

                        {/* Line Items */}
                        <div className="col-12 mt-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h6 className="text-white mb-0">Line Items</h6>
                                <button 
                                    type="button" 
                                    onClick={handleAddItem}
                                    className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
                                >
                                    <FaPlus size={10} /> Add Item
                                </button>
                            </div>

                            <div className="table-responsive">
                                <table className="table table-dark table-borderless align-middle">
                                    <thead>
                                        <tr>
                                            <th className="text-secondary small fw-normal ps-0" style={{ width: '55%' }}>Description</th>
                                            <th className="text-secondary small fw-normal" style={{ width: '15%' }}>Qty</th>
                                            <th className="text-secondary small fw-normal" style={{ width: '20%' }}>Unit Price (GHS)</th>
                                            <th className="text-secondary small fw-normal text-end pe-0" style={{ width: '10%' }}></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map((item, index) => (
                                            <tr key={index}>
                                                <td className="ps-0">
                                                    <input 
                                                        type="text" 
                                                        className="form-control-dark" 
                                                        value={item.description} 
                                                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                                        placeholder="Service description"
                                                        required
                                                    />
                                                </td>
                                                <td>
                                                    <input 
                                                        type="number" 
                                                        className="form-control-dark text-center" 
                                                        value={item.quantity} 
                                                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                                        min="1"
                                                        required
                                                    />
                                                </td>
                                                <td>
                                                    <input 
                                                        type="number" 
                                                        className="form-control-dark text-end" 
                                                        value={item.unitPrice} 
                                                        onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                                                        min="0"
                                                        step="0.01"
                                                        required
                                                    />
                                                </td>
                                                <td className="text-end pe-0">
                                                    <button 
                                                        type="button" 
                                                        onClick={() => handleRemoveItem(index)}
                                                        className="btn btn-link text-danger p-0"
                                                        disabled={items.length === 1}
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Notes & Terms */}
                        <div className="col-12 mt-3">
                            <label className="text-secondary small mb-1 d-block">Notes & Payment Terms</label>
                            <textarea 
                                className="form-control-dark" 
                                rows={3}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Payment terms, bank details, etc."
                            ></textarea>
                        </div>
                    </div>
                </div>

                {/* Footer / Actions */}
                <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top border-secondary">
                    <div className="text-white">
                        <span className="text-secondary small d-block">Subtotal</span>
                        <span className="h4 mb-0 fw-bold">GHS {calculateSubtotal().toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="d-flex gap-2">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="btn btn-secondary px-4"
                            disabled={isSaving}
                        >
                            Cancel
                        </button>
                        <button 
                            type="button" 
                            onClick={handleSaveAndDownload} 
                            className="btn btn-primary px-4 fw-bold"
                            disabled={isSaving}
                        >
                            {isSaving ? 'Saving...' : 'Save & Download PDF'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
