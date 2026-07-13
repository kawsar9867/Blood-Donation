import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import CheckoutForm from '../components/CheckoutForm';
import { DollarSign, Gift, Loader, Heart } from 'lucide-react';
import Swal from 'sweetalert2';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
const API_URL = import.meta.env.VITE_API_URL;

export default function Funding() {
  const { token } = useAuth();
  
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [showStripeForm, setShowStripeForm] = useState(false);

  const fetchFunds = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/funding`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFunds(response.data);
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Failed to fetch funding history.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchFunds();
    }
  }, [token]);

  const handleOpenDonate = () => {
    setAmount('');
    setShowStripeForm(false);
    setModalOpen(true);
  };

  const handleAmountSubmit = (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      return Swal.fire('Invalid Amount', 'Please enter a valid amount to contribute.', 'warning');
    }
    setShowStripeForm(true);
  };

  const handlePaymentSuccess = () => {
    setModalOpen(false);
    fetchFunds(); // reload table
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={{ maxWidth: '900px', margin: '3rem auto', padding: '0 1.5rem' }}>
      {/* Header and Action Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '1.25rem', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', color: 'var(--secondary)' }}>Support Our Platform</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Help keep our platform free and running by giving small contributions.</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenDonate}>
          <DollarSign size={18} />
          Give Fund
        </button>
      </div>

      {/* Funding History Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem 0' }}>
          <Loader className="animate-spin" size={48} color="var(--primary)" style={{ animation: 'spin 1.5s linear infinite', margin: '0 auto' }} />
          <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading transactions history...</p>
        </div>
      ) : funds.length > 0 ? (
        <div className="card">
          <h3 style={{ marginBottom: '1.25rem' }}>Funding History</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Contributor</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Transaction ID</th>
                </tr>
              </thead>
              <tbody>
                {funds.map(fund => (
                  <tr key={fund._id}>
                    <td>
                      <p style={{ fontWeight: '600' }}>{fund.userName}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{fund.userEmail}</p>
                    </td>
                    <td style={{ fontWeight: '700', color: 'var(--success)' }}>
                      ${fund.amount.toFixed(2)}
                    </td>
                    <td>{formatDate(fund.date)}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {fund.transactionId}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 0' }}>
          <Gift size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem auto' }} />
          <h4>No Funding Yet</h4>
          <p style={{ color: 'var(--text-muted)' }}>Be the first to support our blood donation platform!</p>
        </div>
      )}

      {/* Give Fund Modal */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--primary)' }}>Support LifeBlood</h3>
            
            {!showStripeForm ? (
              <form onSubmit={handleAmountSubmit}>
                <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                  Enter the amount you would like to donate to support our blood donation services.
                </p>
                <div className="form-group">
                  <label className="form-label">Amount (USD)</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '12px', top: '9px', fontWeight: 'bold', color: 'var(--text-muted)' }}>$</span>
                    <input 
                      type="number" 
                      min="1" 
                      className="form-control" 
                      style={{ paddingLeft: '25px' }}
                      placeholder="10" 
                      required
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                  <button 
                    type="button" 
                    className="btn btn-ghost" 
                    style={{ flex: 1 }} 
                    onClick={() => setModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    style={{ flex: 1 }}
                  >
                    Continue
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                  Enter your card details below to finalize the payment of <strong>${amount}</strong>.
                </p>
                <Elements stripe={stripePromise}>
                  <CheckoutForm 
                    amount={amount} 
                    onSuccess={handlePaymentSuccess}
                    onCancel={() => setShowStripeForm(false)}
                  />
                </Elements>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
