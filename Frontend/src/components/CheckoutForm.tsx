import { FormEvent, useState, useEffect } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { StripePaymentElementOptions } from '@stripe/stripe-js';

interface CheckoutFormProps {
    clientSecret: string;
    reservationId: string;
}

export function CheckoutForm({ clientSecret, reservationId }: CheckoutFormProps) {
    const stripe = useStripe();
    const elements = useElements();

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        console.log('🔍 [CheckoutForm] Stripe ready:', !!stripe);
        console.log('🔍 [CheckoutForm] Elements ready:', !!elements);
        console.log('🔍 [CheckoutForm] clientSecret recibido:', clientSecret ? '✅' : '❌');
    }, [stripe, elements, clientSecret]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!stripe || !elements) {
            console.error('❌ Stripe o Elements no están listos');
            setErrorMessage('Payment system not ready. Please try again.');
            return;
        }

        setIsProcessing(true);
        setErrorMessage(null);

        const returnUrl = `${window.location.origin}/reservations/${reservationId}/status`;
        console.log('🔍 [CheckoutForm] return_url:', returnUrl);

        try {
            const { error } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: returnUrl,
                },
            });

            if (error) {
                console.error('❌ Stripe confirmPayment error:', error);

                if (error.type === 'card_error' || error.type === 'validation_error') {
                    setErrorMessage(error.message || 'An unexpected error occurred.');
                } else {
                    setErrorMessage('An unexpected error occurred. Please try again.');
                }
            } else {
                console.log('✅ Stripe confirmPayment exitoso (sin error)');
            }
        } catch (err) {
            console.error('❌ Excepción en confirmPayment:', err);
            setErrorMessage('An unexpected error occurred. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const paymentElementOptions: StripePaymentElementOptions = {
        layout: 'tabs',
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit}>
            <PaymentElement id="payment-element" options={paymentElementOptions} />

            <button
                disabled={isProcessing || !stripe || !elements}
                id="submit"
                className="w-full bg-cyan-600 text-white font-bold py-2 px-4 rounded mt-4 hover:bg-cyan-700 disabled:bg-gray-400"
            >
                <span id="button-text">
                    {isProcessing ? 'Processing...' : 'Pay now'}
                </span>
            </button>

            {errorMessage && (
                <div id="payment-message" className="text-red-500 mt-2">
                    {errorMessage}
                </div>
            )}
        </form>
    );
}
