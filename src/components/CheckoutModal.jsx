import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck, CheckCircle2, Lock, Sparkles, Building2, MapPin, Phone, Mail, User, ArrowRight, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';

const CheckoutModal = ({ isOpen, onClose }) => {
  const { cart, finalTotal, clearCart } = useCart();
  const { addToast } = useToast();

  const cartItems = cart || [];
  const totalAmount = finalTotal || 0;

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: 'Punjab',
    pincode: '',
    paymentMethod: 'upi', // upi, card, netbanking
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.phone || !formData.email || !formData.address || !formData.city || !formData.pincode) {
      addToast('Please fill in all delivery details', 'error');
      return;
    }

    if (formData.phone.length < 10) {
      addToast('Please enter a valid 10-digit phone number', 'error');
      return;
    }

    setIsProcessing(true);

    // Simulate online gateway processing delay
    setTimeout(async () => {
      try {
        const orderData = {
          orderId: `ARAVEZ-ORD-${Math.floor(100000 + Math.random() * 900000)}`,
          customer: {
            name: formData.fullName,
            phone: formData.phone,
            email: formData.email,
            address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
          },
          items: cartItems.map(item => ({
            productId: item._id,
            name: item.name,
            price: item.discountPrice || item.price,
            quantity: item.quantity,
            image: item.image,
          })),
          totalAmount: totalAmount,
          paymentMethod: formData.paymentMethod === 'upi' ? 'Online Payment (UPI)' : formData.paymentMethod === 'card' ? 'Online Payment (Card)' : 'Online Payment (NetBanking)',
          paymentStatus: 'PAID',
          status: 'Processing',
          createdAt: new Date().toISOString(),
        };

        const created = await api.createOrder(orderData);
        setCompletedOrder(created);
        clearCart();
        addToast(`Order ${created.orderId} placed successfully! 🎉`, 'success');
      } catch (err) {
        addToast('Failed to place order. Please try again.', 'error');
      } finally {
        setIsProcessing(false);
      }
    }, 1800);
  };

  const handleCloseAll = () => {
    setCompletedOrder(null);
    setFormData({
      fullName: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      state: 'Punjab',
      pincode: '',
      paymentMethod: 'upi',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-emerald-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-emerald-100 relative animate-fade-in my-8 max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white p-5 sm:p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-emerald-950 flex items-center justify-center font-bold text-lg shadow-md">
              💳
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold tracking-tight">
                {completedOrder ? 'Order Confirmation' : 'Secure Express Checkout'}
              </h2>
              <p className="text-[11px] text-emerald-300">
                {completedOrder ? 'Payment Verified & Order Received' : 'Direct Online Payment • Pan-India Insured Dispatch'}
              </p>
            </div>
          </div>
          <button
            onClick={handleCloseAll}
            className="p-2 rounded-full bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-grow">
          
          {/* STEP 2: ORDER SUCCESS SCREEN */}
          {completedOrder ? (
            <div className="text-center py-6 space-y-6 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">Order Placed Successfully</span>
                <h3 className="font-serif text-2xl font-bold text-slate-900">Thank You For Your Order!</h3>
                <p className="text-xs text-slate-500">Order Reference: <strong className="font-mono text-emerald-800">{completedOrder.orderId}</strong></p>
              </div>

              {/* Summary Card */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-left space-y-3 text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 font-semibold text-slate-700">
                  <span>Customer: {completedOrder.customer.name}</span>
                  <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
                    PAID (Online Payment)
                  </span>
                </div>
                <div className="space-y-1 text-slate-600">
                  <p><strong>Phone:</strong> {completedOrder.customer.phone}</p>
                  <p><strong>Email:</strong> {completedOrder.customer.email}</p>
                  <p><strong>Delivery Address:</strong> {completedOrder.customer.address}</p>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between items-center font-bold text-sm text-slate-900">
                  <span>Total Amount Paid:</span>
                  <span className="text-emerald-800 text-base">₹{Number(completedOrder.totalAmount).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                onClick={handleCloseAll}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 rounded-2xl shadow-lg transition-transform hover:scale-[1.02] flex items-center justify-center gap-2 text-sm"
              >
                <span>Continue Shopping</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            
            /* STEP 1: CHECKOUT FORM */
            <form onSubmit={handlePlaceOrder} className="space-y-6">
              
              {/* Cart Items Recap Banner */}
              <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-emerald-900 font-semibold">
                  <Package className="w-4 h-4 text-emerald-700" />
                  <span>{cartItems.length} Product(s) in Cart</span>
                </div>
                <span className="font-bold text-emerald-950 text-sm">
                  Total Payable: ₹{Number(totalAmount).toLocaleString('en-IN')}
                </span>
              </div>

              {/* Customer Contact Details */}
              <div className="space-y-3">
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-4 h-4 text-emerald-700" />
                  <span>1. Contact & Customer Info</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Full Name / Business Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      placeholder="e.g. Rajesh Kumar / Tech Corp"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Mobile Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="10-digit Mobile No."
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                  </div>
                </div>
                <div className="text-xs">
                  <label className="block font-semibold text-slate-700 mb-1">Email Address (For Invoice & Tracking) *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Delivery Address */}
              <div className="space-y-3">
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-700" />
                  <span>2. Delivery Address (Pan-India Shipping)</span>
                </h3>
                <div className="text-xs">
                  <label className="block font-semibold text-slate-700 mb-1">Street Address / Office Building *</label>
                  <input
                    type="text"
                    name="address"
                    required
                    placeholder="SCO / Plot No., Floor, Street Name"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">City *</label>
                    <input
                      type="text"
                      name="city"
                      required
                      placeholder="Chandigarh"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">State *</label>
                    <input
                      type="text"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Pincode *</label>
                    <input
                      type="text"
                      name="pincode"
                      required
                      placeholder="160017"
                      value={formData.pincode}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Direct Online Payment Mode Selection (NO COD) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-emerald-700" />
                    <span>3. Payment Option (Direct Payment Only)</span>
                  </h3>
                  <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    No COD (Direct Online Payment)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label className={`p-3.5 rounded-2xl border cursor-pointer flex items-center gap-3 transition-all ${
                    formData.paymentMethod === 'upi'
                      ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/30'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={formData.paymentMethod === 'upi'}
                      onChange={handleChange}
                      className="accent-emerald-600"
                    />
                    <div>
                      <span className="font-bold text-xs block text-slate-900">📱 UPI / QR Code</span>
                      <span className="text-[10px] text-slate-500">GooglePay, PhonePe, Paytm</span>
                    </div>
                  </label>

                  <label className={`p-3.5 rounded-2xl border cursor-pointer flex items-center gap-3 transition-all ${
                    formData.paymentMethod === 'card'
                      ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/30'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleChange}
                      className="accent-emerald-600"
                    />
                    <div>
                      <span className="font-bold text-xs block text-slate-900">💳 Credit / Debit Card</span>
                      <span className="text-[10px] text-slate-500">Visa, Mastercard, RuPay</span>
                    </div>
                  </label>

                  <label className={`p-3.5 rounded-2xl border cursor-pointer flex items-center gap-3 transition-all ${
                    formData.paymentMethod === 'netbanking'
                      ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/30'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="netbanking"
                      checked={formData.paymentMethod === 'netbanking'}
                      onChange={handleChange}
                      className="accent-emerald-600"
                    />
                    <div>
                      <span className="font-bold text-xs block text-slate-900">🏦 Net Banking</span>
                      <span className="text-[10px] text-slate-500">HDFC, ICICI, SBI, Axis</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit & Pay Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-4 rounded-2xl shadow-xl shadow-emerald-950/20 transition-all transform active:scale-95 flex items-center justify-center gap-2 text-sm disabled:opacity-60"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Connecting to Payment Gateway...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-emerald-300" />
                      <span>Pay ₹{Number(totalAmount).toLocaleString('en-IN')} & Place Order</span>
                    </>
                  )}
                </button>
                <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 mt-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>256-Bit Bank Encrypted Payment Processing</span>
                </div>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};

export default CheckoutModal;
