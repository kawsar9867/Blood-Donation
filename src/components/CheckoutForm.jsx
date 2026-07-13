import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import { Loader, Heart } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

export default function CheckoutForm({ amount, onSuccess, onCancel }) {
  const stripe = useStripe();
  const elements = useElements();
  const { token } = useAuth();
  
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    if (card === null) return;

    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount greater than zero.");
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // 1. Get PaymentIntent Client Secret from server
      const payResponse = await axios.post(
        `${API_URL}/funding/pay`,
        { amount: parseFloat(amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const { clientSecret } = payResponse.data;

      // 2. Confirm card payment
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            name: 'Anonymous Donor',
          },
        },
      });

      if (paymentResult.error) {
        setError(paymentResult.error.message);
        setProcessing(false);
      } else {
        if (paymentResult.paymentIntent.status === 'succeeded') {
          // 3. Confirm payment on the server
          await axios.post(
            `${API_URL}/funding/confirm`,
            {
              amount: parseFloat(amount),
              transactionId: paymentResult.paymentIntent.id
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          Swal.fire({
            icon: 'success',
            title: 'Funding Success!',
            text: `Thank you so much! Your contribution of $${amount} was received.`,
            confirmButtonColor: 'var(--primary)'
          });
          
          setProcessing(false);
          onSuccess();
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Payment processing failed.');
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ border: '1px solid var(--border)', padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: '#f8fafc' }}>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: 'var(--text-primary)',
                '::placeholder': {
                  color: 'var(--text-muted)',
                },
              },
              invalid: {
                color: 'var(--danger)',
              },
            },
          }}
        />
      </div>

      {error && <p style={{ color: 'var(--danger)', fontSize: '0.85rem', fontWeight: '500' }}>{error}</p>}

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <button 
          type="button" 
          className="btn btn-ghost" 
          style={{ flex: 1 }} 
          onClick={onCancel}
          disabled={processing}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="btn btn-primary" 
          style={{ flex: 1 }}
          disabled={!stripe || processing}
        >
          {processing ? (
            <>
              <Loader className="animate-spin" size={18} style={{ animation: 'spin 1s linear infinite' }} />
              Processing...
            </>
          ) : (
            <>
              <Heart fill="white" size={16} />
              Pay ${amount}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
