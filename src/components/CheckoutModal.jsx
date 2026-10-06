import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck, CheckCircle2, Lock, Sparkles, Building2, MapPin, Phone, Mail, User, ArrowRight, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

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
    paymentMethod: 'razorpay',
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

    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      addToast('Please enter a valid 10-digit phone number', 'error');
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Ensure Razorpay Checkout script is loaded
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        addToast('Failed to load Razorpay SDK. Please check your internet connection.', 'error');
        setIsProcessing(false);
        return;
      }

      // 2. Create Razorpay Order on Backend
      const orderReceipt = `rcpt_${Date.now()}`;
      const rzpOrder = await api.createRazorpayOrder(totalAmount, 'INR', orderReceipt);

      if (!rzpOrder || !rzpOrder.orderId) {
        throw new Error('Unable to create Razorpay payment order');
      }

      // 3. Configure Razorpay Standard Modal Options
      const options = {
        key: rzpOrder.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_TkYuKxWMNnETgA',
        amount: rzpOrder.amount, // amount in paise
        currency: rzpOrder.currency || 'INR',
        name: 'Aravez (Rave Services)',
        description: `Order for ${cartItems.length} Commercial Hardware Product(s)`,
        image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=200&q=80',
        order_id: rzpOrder.orderId,
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: cleanPhone,
        },
        notes: {
          shipping_address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
          total_items: cartItems.length,
        },
        theme: {
          color: '#ea0028', // Aravez Crimson Brand Color
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            addToast('Payment cancelled by user', 'info');
          },
        },
        handler: async function (response) {
          try {
            setIsProcessing(true);
            const clientGeneratedOrderId = `ARAVEZ-ORD-${Math.floor(100000 + Math.random() * 900000)}`;

            const orderPayload = {
              orderId: clientGeneratedOrderId,
              customer: {
                name: formData.fullName,
                phone: cleanPhone,
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
              paymentMethod: 'Razorpay Online (UPI/Cards/NetBanking)',
              paymentStatus: 'PAID',
              status: 'Processing',
              createdAt: new Date().toISOString(),
            };

            // 4. Verify Payment Signature with Backend
            const verificationRes = await api.verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderData: orderPayload,
            });

            const confirmedOrder = verificationRes.data || {
              ...orderPayload,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
            };

            setCompletedOrder(confirmedOrder);
            clearCart();
            addToast(`Payment verified! Order ${confirmedOrder.orderId} placed successfully 🎉`, 'success');
          } catch (verifyErr) {
            console.error('Razorpay verification error:', verifyErr);
            addToast('Payment verification error: ' + (verifyErr.message || 'Signature mismatch'), 'error');
          } finally {
            setIsProcessing(false);
          }
        },
      };

      const paymentWindow = new window.Razorpay(options);

      paymentWindow.on('payment.failed', function (resp) {
        setIsProcessing(false);
        const errDesc = resp?.error?.description || resp?.error?.reason || 'Transaction declined by bank';
        addToast(`Payment failed: ${errDesc}`, 'error');
      });

      paymentWindow.open();
    } catch (err) {
      console.error('Checkout error:', err);
      addToast(err.message || 'Payment initiation failed. Please try again.', 'error');
      setIsProcessing(false);
    }
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
      paymentMethod: 'razorpay',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-none max-w-2xl w-full overflow-hidden shadow-2xl border border-gray-200 relative animate-fade-in my-8 max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="bg-[#1d1d1d] text-white p-5 sm:p-6 flex items-center justify-between shrink-0 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-none bg-[#ea0028] text-white flex items-center justify-center font-bold text-lg shadow-md">
              💳
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                {completedOrder ? 'Order Confirmation' : 'Secure Express Checkout'}
              </h2>
              <p className="text-[11px] text-gray-400">
                {completedOrder ? 'Payment Verified & Order Received' : 'Direct Online Payment • Pan-India Insured Dispatch'}
              </p>
            </div>
          </div>
          <button
            onClick={handleCloseAll}
            className="p-2 rounded-none bg-[#2a2a2a] hover:bg-[#ea0028] text-gray-200 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-grow">
          
          {/* STEP 2: ORDER SUCCESS SCREEN */}
          {completedOrder ? (
            <div className="text-center py-6 space-y-6 animate-fade-in">
              <div className="w-16 h-16 rounded-none bg-red-50 text-[#ea0028] flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#ea0028] uppercase tracking-widest">Order Placed Successfully</span>
                <h3 className="text-2xl font-bold text-gray-900">Thank You For Your Order!</h3>
                <p className="text-xs text-gray-500">Order Reference: <strong className="font-mono text-[#ea0028]">{completedOrder.orderId}</strong></p>
              </div>

              {/* Summary Card */}
              <div className="bg-gray-50 rounded-none p-5 border border-gray-200 text-left space-y-3 text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200 font-semibold text-gray-700">
                  <span>Customer: {completedOrder.customer.name}</span>
                  <span className="bg-red-50 text-[#ea0028] px-2.5 py-0.5 rounded-none font-bold">
                    PAID (Razorpay Verified)
                  </span>
                </div>
                <div className="space-y-1.5 text-gray-600">
                  <p><strong>Phone:</strong> {completedOrder.customer.phone}</p>
                  <p><strong>Email:</strong> {completedOrder.customer.email}</p>
                  <p><strong>Delivery Address:</strong> {completedOrder.customer.address}</p>
                  {completedOrder.razorpayPaymentId && (
                    <p className="flex items-center gap-1.5 pt-1">
                      <strong>Payment Ref / ID:</strong>
                      <span className="font-mono text-slate-800 bg-white border border-slate-200 px-2 py-0.5 rounded-none text-[11px] font-bold">
                        {completedOrder.razorpayPaymentId}
                      </span>
                    </p>
                  )}
                </div>
                <div className="pt-2 border-t border-gray-200 flex justify-between items-center font-bold text-sm text-gray-900">
                  <span>Total Amount Paid:</span>
                  <span className="text-[#ea0028] text-base font-extrabold">₹{Number(completedOrder.totalAmount).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                onClick={handleCloseAll}
                className="w-full bg-[#1d1d1d] hover:bg-[#ea0028] text-white font-bold py-3.5 rounded-none shadow-md transition-transform hover:scale-[1.01] flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <span>Continue Shopping</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            
            /* STEP 1: CHECKOUT FORM */
            <form onSubmit={handlePlaceOrder} className="space-y-6">
              
              {/* Cart Items Recap Banner */}
              <div className="bg-gray-50 p-4 rounded-none border border-gray-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-gray-900 font-semibold">
                  <Package className="w-4 h-4 text-[#ea0028]" />
                  <span>{cartItems.length} Product(s) in Cart</span>
                </div>
                <span className="font-extrabold text-[#1d1d1d] text-sm">
                  Total Payable: ₹{Number(totalAmount).toLocaleString('en-IN')}
                </span>
              </div>

              {/* Customer Contact Details */}
              <div className="space-y-3">
                <h3 className="font-bold text-gray-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-4 h-4 text-[#ea0028]" />
                  <span>1. Contact & Customer Info</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Full Name / Business Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      placeholder="e.g. Rajesh Kumar / Tech Corp"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-none px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#ea0028]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Mobile Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="10-digit Mobile No."
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-none px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#ea0028] font-mono"
                    />
                  </div>
                </div>
                <div className="text-xs">
                  <label className="block font-semibold text-gray-700 mb-1">Email Address (For Invoice & Tracking) *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-none px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#ea0028]"
                  />
                </div>
              </div>

              {/* Delivery Address */}
              <div className="space-y-3">
                <h3 className="font-bold text-gray-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#ea0028]" />
                  <span>2. Delivery Address (Pan-India Shipping)</span>
                </h3>
                <div className="text-xs">
                  <label className="block font-semibold text-gray-700 mb-1">Street Address / Office Building *</label>
                  <input
                    type="text"
                    name="address"
                    required
                    placeholder="SCO / Plot No., Floor, Street Name"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-none px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#ea0028]"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">City *</label>
                    <input
                      type="text"
                      name="city"
                      required
                      placeholder="Chandigarh"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-none px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#ea0028]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">State *</label>
                    <input
                      type="text"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-none px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#ea0028]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Pincode *</label>
                    <input
                      type="text"
                      name="pincode"
                      required
                      placeholder="160017"
                      value={formData.pincode}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-none px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#ea0028] font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Razorpay Online Payment Gateway Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-[#ea0028]" />
                    <span>3. Payment Gateway (Razorpay Verified)</span>
                  </h3>
                  <span className="text-[10px] font-bold text-white bg-[#ea0028] px-2.5 py-0.5 rounded-none shadow-xs uppercase tracking-wider">
                    Razorpay Gateway
                  </span>
                </div>

                {/* Razorpay Card Container */}
                <div className="border-2 border-red-100 bg-gradient-to-br from-red-50/50 via-white to-slate-50 p-4 sm:p-5 rounded-none space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-none bg-[#ea0028] text-white flex items-center justify-center font-black text-xs shadow-xs">
                        ⚡
                      </div>
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                          Razorpay Instant Payment Gateway
                        </h4>
                        <p className="text-[11px] text-slate-500 font-medium">
                          All Indian Payment Methods Supported • 100% Encrypted &amp; Secure
                        </p>
                      </div>
                    </div>
                    <span className="hidden sm:inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-none">
                      Active &amp; Verified
                    </span>
                  </div>

                  {/* Payment Methods Badges Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center">
                    <div className="bg-white border border-slate-200 p-2 rounded-none shadow-2xs">
                      <span className="text-xs block font-bold text-slate-800">📱 UPI / QR</span>
                      <span className="text-[10px] text-slate-500">GPay, PhonePe, Paytm</span>
                    </div>
                    <div className="bg-white border border-slate-200 p-2 rounded-none shadow-2xs">
                      <span className="text-xs block font-bold text-slate-800">💳 Cards</span>
                      <span className="text-[10px] text-slate-500">Visa, Master, RuPay</span>
                    </div>
                    <div className="bg-white border border-slate-200 p-2 rounded-none shadow-2xs">
                      <span className="text-xs block font-bold text-slate-800">🏦 NetBanking</span>
                      <span className="text-[10px] text-slate-500">50+ Indian Banks</span>
                    </div>
                    <div className="bg-white border border-slate-200 p-2 rounded-none shadow-2xs">
                      <span className="text-xs block font-bold text-slate-800">👛 Wallets / EMI</span>
                      <span className="text-[10px] text-slate-500">Mobikwik, Freecharge</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit & Pay Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-[#ea0028] hover:bg-[#cc0020] text-white font-bold py-4 rounded-none shadow-lg shadow-red-950/20 transition-all transform active:scale-98 flex items-center justify-center gap-2 text-sm disabled:opacity-60 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Connecting to Razorpay Gateway...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-white" />
                      <span>Pay ₹{Number(totalAmount).toLocaleString('en-IN')} with Razorpay</span>
                      <ArrowRight className="w-4 h-4 text-white" />
                    </>
                  )}
                </button>
                <div className="flex items-center justify-center gap-2 text-[11px] text-gray-500 mt-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#ea0028]" />
                  <span>256-Bit Bank Encrypted Payment Processing • PCI-DSS Compliant</span>
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
