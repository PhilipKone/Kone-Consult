import React, { useState, useEffect, useCallback } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { FaWallet, FaCheckCircle, FaArrowLeft, FaShieldAlt, FaLock, FaMobileAlt, FaCreditCard, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './KonePay.css';

const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_placeholder';

const SERVICES = {
  'Kone Consult': [
    { label: 'Academic Research Assistance', amount: 500 },
    { label: 'Business Data Analysis', amount: 800 },
    { label: 'Research Mentorship (1 Session)', amount: 300 },
    { label: 'Academic Thesis Writing', amount: 1200 },
    { label: 'Business Report Writing', amount: 600 },
    { label: 'Custom Amount', amount: 0 },
  ],
  'Kone Code': [
    { label: 'Web App Template Purchase', amount: 450 },
    { label: 'Custom Web Development', amount: 2000 },
    { label: 'API Integration Service', amount: 700 },
    { label: 'Code Review & Audit', amount: 350 },
    { label: 'Custom Amount', amount: 0 },
  ],
  'Kone Lab': [
    { label: 'Hardware Prototype Consultation', amount: 500 },
    { label: 'Robotics Workshop Enrollment', amount: 800 },
    { label: '3D Design Project', amount: 600 },
    { label: 'IoT System Setup', amount: 1500 },
    { label: 'Custom Amount', amount: 0 },
  ],
  'Kone Academy': [
    { label: 'Training Enrollment (1 Course)', amount: 300 },
    { label: 'Group Training (5 People)', amount: 1200 },
    { label: 'Corporate Training Package', amount: 3000 },
    { label: 'Online Bootcamp Access', amount: 250 },
    { label: 'Custom Amount', amount: 0 },
  ],
};

const DIVISION_COLORS = {
  'Kone Consult': { primary: '#0088FE', glow: 'rgba(0, 136, 254, 0.15)', bg: 'rgba(0, 136, 254, 0.05)' },
  'Kone Code': { primary: '#00C49F', glow: 'rgba(0, 196, 159, 0.15)', bg: 'rgba(0, 196, 159, 0.05)' },
  'Kone Lab': { primary: '#FFBB28', glow: 'rgba(255, 187, 40, 0.15)', bg: 'rgba(255, 187, 40, 0.05)' },
  'Kone Academy': { primary: '#8884d8', glow: 'rgba(136, 132, 216, 0.15)', bg: 'rgba(136, 132, 216, 0.05)' },
};

const loadPaystack = () => {
  return new Promise((resolve) => {
    if (window.PaystackPop) { resolve(window.PaystackPop); return; }
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v2/inline.js';
    script.onload = () => resolve(window.PaystackPop);
    document.head.appendChild(script);
  });
};

const generateTransactionId = () => `KNP-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

export default function KonePay() {
  const [step, setStep] = useState(1); // 1=select, 2=details, 3=success
  const [division, setDivision] = useState('Kone Consult');
  const [selectedService, setSelectedService] = useState(SERVICES['Kone Consult'][0]);
  const [customAmount, setCustomAmount] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionRef, setTransactionRef] = useState('');

  const colors = DIVISION_COLORS[division];
  const isCustom = selectedService.label === 'Custom Amount';
  const amount = isCustom ? parseFloat(customAmount) || 0 : selectedService.amount;

  useEffect(() => {
    setSelectedService(SERVICES[division][0]);
    setCustomAmount('');
  }, [division]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email is required';
    if (!form.phone.match(/^\+?[\d\s\-]{8,}$/)) e.phone = 'Valid phone number is required';
    if (amount < 1) e.amount = 'Please enter a valid amount (min ₵1)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePay = useCallback(async () => {
    if (!validate()) return;
    setIsProcessing(true);

    try {
      const PaystackPop = await loadPaystack();
      const txRef = generateTransactionId();
      setTransactionRef(txRef);

      const handler = PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email: form.email,
        amount: amount * 100, // Paystack uses pesewas
        currency: 'GHS',
        ref: txRef,
        metadata: {
          custom_fields: [
            { display_name: 'Customer Name', variable_name: 'customer_name', value: form.name },
            { display_name: 'Phone', variable_name: 'phone', value: form.phone },
            { display_name: 'Division', variable_name: 'division', value: division },
            { display_name: 'Service', variable_name: 'service', value: selectedService.label },
          ],
        },
        callback: async (response) => {
          // Payment successful — log to Firestore
          try {
            await addDoc(collection(db, 'payments'), {
              transactionId: response.reference,
              customer: form.name,
              email: form.email,
              phone: form.phone,
              division,
              type: selectedService.label,
              amount,
              method: 'Card/MoMo',
              status: 'success',
              paystackRef: response.reference,
              createdAt: serverTimestamp(),
            });
          } catch (err) {
            console.error('Firestore log error:', err);
          }
          setStep(3);
          setIsProcessing(false);
        },
        onClose: () => {
          setIsProcessing(false);
        },
      });

      handler.openIframe();
    } catch (err) {
      console.error('Paystack error:', err);
      setIsProcessing(false);
      alert('Payment system failed to load. Please try again.');
    }
  }, [form, amount, division, selectedService]);

  return (
    <>
      <Helmet>
        <title>Kone Pay | Secure Payments - Kone Academy Ecosystem</title>
        <meta name="description" content="Pay securely for Kone Academy services including Kone Consult, Kone Code, Kone Lab, and Kone Academy training programs." />
      </Helmet>

      <div className="konepay-page">
        {/* Background */}
        <div className="konepay-bg">
          <div className="konepay-glow" style={{ background: colors.glow.replace('0.15', '0.08') }} />
        </div>

        {/* Header */}
        <header className="konepay-header">
          <Link to="/" className="konepay-back">
            <FaArrowLeft /> Back to Site
          </Link>
          <div className="konepay-brand">
            <div className="konepay-logo"><FaWallet /></div>
            <span>Kone Pay</span>
          </div>
          <div className="konepay-secure">
            <FaLock /> Secured by Paystack
          </div>
        </header>

        <main className="konepay-main">
          {step === 1 && (
            <div className="konepay-card animate-fade-in">
              <h1 className="konepay-title">What are you paying for?</h1>
              <p className="konepay-subtitle">Select a division and service to get started</p>

              {/* Division Selector */}
              <div className="division-tabs">
                {Object.keys(SERVICES).map((div) => (
                  <button
                    key={div}
                    className={`division-tab ${division === div ? 'active' : ''}`}
                    style={division === div ? {
                      background: DIVISION_COLORS[div].bg,
                      borderColor: DIVISION_COLORS[div].primary,
                      color: DIVISION_COLORS[div].primary
                    } : {}}
                    onClick={() => setDivision(div)}
                  >
                    {div.replace('Kone ', '')}
                  </button>
                ))}
              </div>

              {/* Service List */}
              <div className="service-list">
                {SERVICES[division].map((svc) => (
                  <button
                    key={svc.label}
                    className={`service-item ${selectedService.label === svc.label ? 'selected' : ''}`}
                    style={selectedService.label === svc.label ? {
                      borderColor: colors.primary,
                      background: colors.bg
                    } : {}}
                    onClick={() => { setSelectedService(svc); setCustomAmount(''); }}
                  >
                    <span className="service-label">{svc.label}</span>
                    {svc.amount > 0 && (
                      <span className="service-price" style={{ color: colors.primary }}>
                        ₵{svc.amount.toLocaleString()}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Custom Amount */}
              {isCustom && (
                <div className="custom-amount-wrap">
                  <label>Enter Amount (GHS)</label>
                  <div className="amount-input-wrap">
                    <span className="currency-prefix">₵</span>
                    <input
                      type="number"
                      min="1"
                      className="amount-input"
                      placeholder="0.00"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                    />
                  </div>
                  {errors.amount && <p className="field-error">{errors.amount}</p>}
                </div>
              )}

              {/* Summary Bar */}
              <div className="summary-bar" style={{ borderColor: colors.primary }}>
                <div>
                  <p className="summary-label">Total to Pay</p>
                  <p className="summary-amount" style={{ color: colors.primary }}>
                    ₵{amount > 0 ? amount.toLocaleString() : '—'}
                  </p>
                </div>
                <button
                  className="btn-pay-next"
                  style={{ background: colors.primary }}
                  onClick={() => {
                    if (amount < 1) { setErrors({ amount: 'Please enter a valid amount' }); return; }
                    setErrors({});
                    setStep(2);
                  }}
                  disabled={amount < 1}
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="konepay-card animate-fade-in">
              <button className="back-btn" onClick={() => setStep(1)}>
                <FaArrowLeft /> Back
              </button>
              <h1 className="konepay-title">Your Details</h1>
              <p className="konepay-subtitle">
                Paying <strong style={{ color: colors.primary }}>₵{amount.toLocaleString()}</strong> for <em>{selectedService.label}</em>
              </p>

              <div className="konepay-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    className={`form-input ${errors.name ? 'error' : ''}`}
                    placeholder="e.g. Philip Kone"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                  {errors.name && <p className="field-error">{errors.name}</p>}
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    placeholder="e.g. philip@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                  {errors.email && <p className="field-error">{errors.email}</p>}
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    className={`form-input ${errors.phone ? 'error' : ''}`}
                    placeholder="e.g. +233 55 199 3820"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                  {errors.phone && <p className="field-error">{errors.phone}</p>}
                </div>
              </div>

              <div className="payment-methods">
                <p className="methods-label">Accepted Payment Methods</p>
                <div className="methods-row">
                  <span className="method-badge"><FaCreditCard /> Card</span>
                  <span className="method-badge"><FaMobileAlt /> MoMo</span>
                  <span className="method-badge">Visa</span>
                  <span className="method-badge">Mastercard</span>
                </div>
              </div>

              <button
                className="btn-pay-final"
                style={{ background: `linear-gradient(135deg, ${colors.primary}, #000)` }}
                onClick={handlePay}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <><FaSpinner className="spin-icon" /> Processing...</>
                ) : (
                  <><FaShieldAlt /> Pay ₵{amount.toLocaleString()} Securely</>
                )}
              </button>

              <p className="security-note">
                <FaLock /> Your payment is encrypted and processed by Paystack. Kone Pay never stores your card details.
              </p>
            </div>
          )}

          {step === 3 && (
            <div className="konepay-card konepay-success animate-fade-in">
              <div className="success-icon" style={{ color: colors.primary }}>
                <FaCheckCircle />
              </div>
              <h1 className="konepay-title">Payment Successful!</h1>
              <p className="konepay-subtitle">
                Thank you, <strong>{form.name}</strong>. Your payment of <strong style={{ color: colors.primary }}>₵{amount.toLocaleString()}</strong> has been received.
              </p>
              <div className="receipt-box">
                <div className="receipt-row">
                  <span>Service</span><span>{selectedService.label}</span>
                </div>
                <div className="receipt-row">
                  <span>Division</span><span>{division}</span>
                </div>
                <div className="receipt-row">
                  <span>Amount</span><span style={{ color: colors.primary, fontWeight: 'bold' }}>₵{amount.toLocaleString()}</span>
                </div>
                <div className="receipt-row">
                  <span>Ref</span><span className="mono">{transactionRef}</span>
                </div>
              </div>
              <p className="success-note">A confirmation will be sent to <strong>{form.email}</strong>. Our team will contact you within 24 hours.</p>
              <div className="success-actions">
                <Link to="/" className="btn-home">← Back to Home</Link>
                <button className="btn-pay-another" onClick={() => { setStep(1); setForm({ name: '', email: '', phone: '' }); }}>
                  Make Another Payment
                </button>
              </div>
            </div>
          )}
        </main>

        <footer className="konepay-footer">
          <p>© {new Date().getFullYear()} Kone Academy Ecosystem. All payments secured by <a href="https://paystack.com" target="_blank" rel="noopener noreferrer">Paystack</a>.</p>
        </footer>
      </div>
    </>
  );
}
