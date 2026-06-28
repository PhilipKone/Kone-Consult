import React, { useMemo, useState } from 'react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, 
    Tooltip as RechartsTooltip, PieChart, Pie, Cell 
} from 'recharts';
import { 
    FaWallet, FaMoneyBillWave, FaArrowUp, 
    FaHistory, FaCreditCard, FaMobileAlt, FaDownload,
    FaCheckCircle, FaChartLine,
    FaFileInvoiceDollar, FaEnvelope
} from 'react-icons/fa';
import { db } from '../../firebase/config';
import { collection, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import InvoiceGeneratorModal from './InvoiceGeneratorModal';
import { sendEmail } from '../../utils/emailService';

// Extend jsPDF with autoTable type
interface jsPDFWithAutoTable extends jsPDF {
    lastAutoTable: {
        finalY: number;
    };
    autoTable: (options: any) => void;
}

interface Payment {
    id?: string;
    amount: number;
    division: string;
    customer: string;
    method: string;
    status: string;
    type?: string;
    createdAt?: { seconds: number } | any;
    transactionId: string;
}

interface InvoiceItem {
    description: string;
    quantity: number;
    unitPrice: number;
}

interface Invoice {
    id: string;
    invoiceNumber: string;
    clientName: string;
    clientEmail: string;
    clientAddress?: string;
    division: string;
    dateIssued: string;
    dueDate: string;
    totalAmount: number;
    status?: string;
    items?: InvoiceItem[];
    notes?: string;
}

interface KonePayFinancialsProps {
    payments: Payment[];
    totalRevenue: number;
    activeSite: string;
    invoices?: Invoice[];
}

const COLORS = ['#FFD700', '#00C49F', '#0088FE', '#FF8042'];

const KonePayFinancials: React.FC<KonePayFinancialsProps> = ({ payments, totalRevenue, activeSite, invoices = [] }) => {
    const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
    
    // 1. Process Trend Data (Last 7 Days)
    const trendData = useMemo(() => {
        const dateCounts: Record<string, number> = {};
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            dateCounts[dateStr] = 0;
        }

        payments.filter(p => p.status === 'success').forEach(p => {
            const date = p.createdAt?.seconds ? new Date(p.createdAt.seconds * 1000) : new Date();
            const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            if (dateCounts.hasOwnProperty(dateStr)) {
                dateCounts[dateStr] += (Number(p.amount) || 0);
            }
        });

        return Object.entries(dateCounts).map(([date, amount]) => ({ date, amount }));
    }, [payments]);

    // 2. Process Division Distribution
    const divisionData = useMemo(() => {
        const counts: Record<string, number> = {};
        payments.filter(p => p.status === 'success').forEach(p => {
            const div = p.division || 'Uncategorized';
            counts[div] = (counts[div] || 0) + (Number(p.amount) || 0);
        });
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [payments]);

    const handleSeedTransactions = async () => {
        if (!window.confirm("Seed 5 test transactions into the database?")) return;
        
        const testData = [
            { amount: 1500, division: 'Kone Consult', customer: 'Global Energy Ltd', method: 'Card', status: 'success', type: 'Consultation Fee' },
            { amount: 450, division: 'Kone Code', customer: 'Philip Kone', method: 'MoMo', status: 'success', type: 'Template Purchase' },
            { amount: 200, division: 'Kone Lab', customer: 'Tech StartUp', method: 'MoMo', status: 'pending', type: 'Hardware Prototype' },
            { amount: 3000, division: 'Kone Academy', customer: 'Student Group', method: 'Card', status: 'success', type: 'Training Enrollment' },
            { amount: 120, division: 'Kone Code', customer: 'Dev User', method: 'MoMo', status: 'failed', type: 'Bug Bounty' },
        ];

        try {
            for (const t of testData) {
                await addDoc(collection(db, 'payments'), {
                    ...t,
                    createdAt: serverTimestamp(),
                    transactionId: `KNP-${Math.floor(Math.random() * 1000000)}`
                });
            }
            alert("Test transactions seeded successfully!");
        } catch (err) {
            console.error(err);
            alert("Error seeding data. Check console.");
        }
    };

    const downloadInvoicePDF = (inv: Invoice) => {
        try {
            const doc = new jsPDF() as jsPDFWithAutoTable;
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
            doc.text(`Invoice No: ${inv.invoiceNumber}`, 20, 52);
            doc.text(`Date Issued: ${new Date(inv.dateIssued).toLocaleDateString()}`, 20, 58);
            doc.text(`Due Date: ${new Date(inv.dueDate).toLocaleDateString()}`, 20, 64);
            doc.text(`Division: ${inv.division}`, 20, 70);

            // Client Info
            doc.text('Bill To:', 120, 52);
            doc.setFont('helvetica', 'bold');
            doc.text(inv.clientName || 'Client Name', 120, 58);
            doc.setFont('helvetica', 'normal');
            doc.text(inv.clientEmail || 'Client Email', 120, 64);
            if (inv.clientAddress) {
                doc.text(inv.clientAddress, 120, 70);
            }

            // Line Items Table
            const tableBody = (inv.items || []).map(item => [
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
            doc.text(`GHS ${inv.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 150, finalY + 15);

            // Notes
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(120, 120, 120);
            doc.text('Notes & Payment Terms:', 20, finalY + 30);
            doc.text(inv.notes || '', 20, finalY + 35, { maxWidth: 170 });

            // Save PDF
            doc.save(`Invoice_${inv.invoiceNumber}.pdf`);
        } catch (error) {
            console.error('Error generating invoice PDF:', error);
            alert('Failed to generate PDF.');
        }
    };

    const [sendingInvoiceId, setSendingInvoiceId] = useState<string | null>(null);

    const handleSendInvoiceEmail = async (inv: Invoice) => {
        if (!window.confirm(`Send invoice ${inv.invoiceNumber} to ${inv.clientName} (${inv.clientEmail})?`)) return;
        
        setSendingInvoiceId(inv.id);
        
        const payUrl = `${window.location.origin}/pay?division=${encodeURIComponent(inv.division)}&amount=${inv.totalAmount}&email=${encodeURIComponent(inv.clientEmail)}&name=${encodeURIComponent(inv.clientName)}&service=${encodeURIComponent(inv.items?.[0]?.description || 'Invoice Payment')}`;
        
        const emailBody = `Dear ${inv.clientName},\n\n` +
            `Please find the invoice summary below for your contract with Kone Consult:\n\n` +
            `• Invoice Number: ${inv.invoiceNumber}\n` +
            `• Date Issued: ${new Date(inv.dateIssued).toLocaleDateString()}\n` +
            `• Due Date: ${new Date(inv.dueDate).toLocaleDateString()}\n` +
            `• Total Amount: GHS ${inv.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}\n\n` +
            `Line Items:\n` +
            (inv.items || []).map(item => `  - ${item.description} (Qty: ${item.quantity}) - GHS ${(item.quantity * item.unitPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}`).join('\n') + `\n\n` +
            `You can view and pay this invoice securely online by clicking the link below:\n` +
            `${payUrl}\n\n` +
            `If you have any questions, please feel free to reply to this email.\n\n` +
            `Thank you for your business!\n\n` +
            `Best regards,\n` +
            `Kone Consult Team`;

        try {
            await sendEmail(inv.clientEmail, inv.clientName, `Invoice ${inv.invoiceNumber} from Kone Consult`, emailBody);
            
            // Update Firestore invoice status to 'Emailed'
            await updateDoc(doc(db, 'invoices', inv.id), {
                status: 'Emailed',
                emailedAt: serverTimestamp()
            });

            alert(`Invoice ${inv.invoiceNumber} emailed successfully to ${inv.clientEmail}!`);
        } catch (error: any) {
            console.error('Error emailing invoice:', error);
            alert(`Failed to email invoice. ${error.message || 'Check credentials.'}`);
        } finally {
            setSendingInvoiceId(null);
        }
    };

    return (
        <div className="financials-container animate-fade-in">
            {/* Wallet & Stats */}
            <div className="row g-3 mb-4">
                <div className="col-12 col-md-4">
                    <div className="wallet-card-premium">
                        <div className="wallet-pattern"></div>
                        <div className="d-flex justify-content-between position-relative">
                            <div>
                                <p className="text-white text-opacity-60 small mb-1">Current Balance</p>
                                <h2 className="text-white fw-bold mb-0">₵{totalRevenue.toLocaleString()}</h2>
                                <p className="text-white text-opacity-40 small mt-2">Kone Pay Unified Wallet</p>
                            </div>
                            <div className="wallet-icon-glow"><FaWallet /></div>
                        </div>
                        <div className="mt-4 d-flex flex-column gap-2 position-relative">
                            <div className="d-flex gap-2">
                                <button className="btn btn-light btn-sm flex-grow-1 rounded-pill fw-bold py-2">Withdraw</button>
                                <button onClick={handleSeedTransactions} className="btn btn-outline-light btn-sm flex-grow-1 rounded-pill py-2">Seed Test</button>
                            </div>
                            <button 
                                onClick={() => setIsInvoiceModalOpen(true)} 
                                className="btn btn-warning btn-sm w-100 rounded-pill fw-bold py-2 text-dark d-flex align-items-center justify-content-center gap-2"
                            >
                                <FaFileInvoiceDollar /> Generate Invoice
                            </button>
                        </div>
                    </div>
                </div>
                
                <div className="col-12 col-md-4">
                    <div className="metric-card-glass h-100">
                        <div className="d-flex justify-content-between">
                            <div>
                                <p className="text-secondary small mb-1">Growth (MTD)</p>
                                <h3 className="text-white mb-0">+12.5%</h3>
                                <p className="text-success small mb-0 mt-2"><FaArrowUp /> Increasing daily</p>
                            </div>
                            <div className="metric-icon gold"><FaMoneyBillWave /></div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-4">
                    <div className="metric-card-glass h-100">
                        <div className="d-flex justify-content-between">
                            <div>
                                <p className="text-secondary small mb-1">Active Payouts</p>
                                <h3 className="text-white mb-0">0</h3>
                                <p className="text-secondary small mb-0 mt-2">No pending withdrawals</p>
                            </div>
                            <div className="metric-icon cyan"><FaCheckCircle /></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-4">
                {/* Revenue Chart */}
                <div className="col-12 col-lg-8">
                    <div className="chart-card-glass">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h6 className="text-white mb-0 d-flex align-items-center gap-2">
                                <FaChartLine className="text-warning" /> Revenue Stream (GHS)
                            </h6>
                            <button className="btn btn-outline-secondary btn-sm border-0"><FaDownload /></button>
                        </div>
                        <div style={{ width: '100%', height: 280 }}>
                            <ResponsiveContainer>
                                <AreaChart data={trendData}>
                                    <defs>
                                        <linearGradient id="colorGold" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#FFD700" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#FFD700" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" vertical={false} />
                                    <XAxis dataKey="date" stroke="#666" fontSize={11} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#666" fontSize={11} tickLine={false} axisLine={false} />
                                    <RechartsTooltip 
                                        contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                                    />
                                    <Area type="monotone" dataKey="amount" stroke="#FFD700" fillOpacity={1} fill="url(#colorGold)" strokeWidth={3} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Division Mix Pie */}
                <div className="col-12 col-lg-4">
                    <div className="chart-card-glass h-100">
                        <h6 className="text-white mb-4">Division Revenue Mix</h6>
                        <div style={{ width: '100%', height: 280 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={divisionData}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {divisionData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Transaction Table */}
                <div className="col-12">
                    <div className="glass-card p-4">
                        <h5 className="text-white mb-4">Transaction History</h5>
                        <div className="table-responsive">
                            <table className="table table-dark table-hover align-middle">
                                <thead>
                                    <tr>
                                        <th className="small text-secondary">TRANSACTION ID</th>
                                        <th className="small text-secondary">CUSTOMER</th>
                                        <th className="small text-secondary">DIVISION</th>
                                        <th className="small text-secondary">METHOD</th>
                                        <th className="small text-secondary">AMOUNT</th>
                                        <th className="small text-secondary">STATUS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payments.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="text-center py-4 py-md-5 text-secondary">
                                                <FaHistory size={30} className="mb-3 opacity-20" /><br/>
                                                No transactions found.
                                            </td>
                                        </tr>
                                    ) : (
                                        payments.map(p => (
                                            <tr key={p.id}>
                                                <td className="font-monospace small">{p.transactionId}</td>
                                                <td>
                                                    <div className="text-white">{p.customer}</div>
                                                    <div className="text-secondary x-small">{p.type}</div>
                                                </td>
                                                <td>
                                                    <span className={`badge-division ${p.division?.replace(' ', '-').toLowerCase()}`}>
                                                        {p.division}
                                                    </span>
                                                </td>
                                                <td>
                                                    {p.method === 'Card' ? <FaCreditCard className="text-info" /> : <FaMobileAlt className="text-success" />}
                                                    <span className="ms-2 small">{p.method}</span>
                                                </td>
                                                <td className="text-white fw-bold">₵{p.amount}</td>
                                                <td>
                                                    {p.status === 'success' ? (
                                                        <span className="badge bg-success bg-opacity-20 text-success border border-success border-opacity-20">Successful</span>
                                                    ) : p.status === 'pending' ? (
                                                        <span className="badge bg-warning bg-opacity-20 text-warning border border-warning border-opacity-20">Pending</span>
                                                    ) : (
                                                        <span className="badge bg-danger bg-opacity-20 text-danger border border-danger border-opacity-20">Failed</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Invoices Table */}
                <div className="col-12">
                    <div className="glass-card p-4">
                        <h5 className="text-white mb-4">Generated Invoices</h5>
                        <div className="table-responsive">
                            <table className="table table-dark table-hover align-middle">
                                <thead>
                                    <tr>
                                        <th className="small text-secondary">INVOICE NUMBER</th>
                                        <th className="small text-secondary">CLIENT</th>
                                        <th className="small text-secondary">DIVISION</th>
                                        <th className="small text-secondary">DATE ISSUED</th>
                                        <th className="small text-secondary">DUE DATE</th>
                                        <th className="small text-secondary">AMOUNT</th>
                                        <th className="small text-secondary">STATUS</th>
                                        <th className="small text-secondary">ACTION</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoices.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="text-center py-4 py-md-5 text-secondary">
                                                <FaFileInvoiceDollar size={30} className="mb-3 opacity-20" /><br/>
                                                No invoices generated yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        invoices.map(inv => (
                                            <tr key={inv.id}>
                                                <td className="font-monospace small">{inv.invoiceNumber}</td>
                                                <td>
                                                    <div className="text-white">{inv.clientName}</div>
                                                    <div className="text-secondary x-small">{inv.clientEmail}</div>
                                                </td>
                                                <td>
                                                    <span className={`badge-division ${inv.division?.replace(' ', '-').toLowerCase()}`}>
                                                        {inv.division}
                                                    </span>
                                                </td>
                                                <td>{new Date(inv.dateIssued).toLocaleDateString()}</td>
                                                <td>{new Date(inv.dueDate).toLocaleDateString()}</td>
                                                <td className="text-white fw-bold">₵{inv.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                                <td>
                                                    <span className="badge bg-info bg-opacity-20 text-info border border-info border-opacity-20">{inv.status || 'Sent'}</span>
                                                </td>
                                                <td>
                                                    <div className="d-flex gap-2">
                                                        <button 
                                                            onClick={() => downloadInvoicePDF(inv)}
                                                            className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1 py-1 px-2 rounded-pill"
                                                            title="Download PDF"
                                                        >
                                                            <FaDownload size={12} /> PDF
                                                        </button>
                                                        <button 
                                                            onClick={() => handleSendInvoiceEmail(inv)}
                                                            disabled={sendingInvoiceId === inv.id}
                                                            className="btn btn-outline-info btn-sm d-flex align-items-center gap-1 py-1 px-2 rounded-pill"
                                                            title="Email Invoice"
                                                        >
                                                            {sendingInvoiceId === inv.id ? (
                                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" style={{ width: '12px', height: '12px' }}></span>
                                                            ) : (
                                                                <FaEnvelope size={12} />
                                                            )}
                                                            Email
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Invoice Generator Modal */}
            <InvoiceGeneratorModal 
                isOpen={isInvoiceModalOpen}
                onClose={() => setIsInvoiceModalOpen(false)}
                activeSite={activeSite}
            />
        </div>
    );
};

export default KonePayFinancials;
