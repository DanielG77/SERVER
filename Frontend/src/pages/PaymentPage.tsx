import { useParams } from 'react-router-dom';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useEffect, useMemo } from 'react';
import { useReservation } from '../hooks/useReservation';
import { usePayment } from '../hooks/usePayment';
import { CheckoutForm } from '../components/CheckoutForm';
import ErrorAlert from '../components/ErrorAlert';

export function PaymentPage() {
    const { reservationId } = useParams<{ reservationId?: string }>();

    console.log("ENV KEYS:", import.meta.env);

    console.log("StripeKey:", import.meta.env.VITE_STRIPE_PUBLIC_KEY);


    const stripePromise = useMemo(() => {
        const key = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

        if (!key || typeof key !== 'string') {
            console.error('❌ VITE_STRIPE_PUBLIC_KEY is missing or invalid');
            return null;
        }

        console.log('✅ Stripe public key loaded:', key.substring(0, 20) + '...');
        return loadStripe(key);
    }, []);

    const {
        data: reservation,
        isLoading: isLoadingReservation,
        error: reservationError,
    } = useReservation(reservationId ?? '');

    const paymentMutation = usePayment();
    const {
        mutate: initiatePayment,
        data: paymentData,
        error: paymentError,
        isPending: isInitiatingPayment,
    } = paymentMutation;

    useEffect(() => {
        if (reservationId && reservation?.status === 'PENDING' && !paymentData) {
            initiatePayment(reservationId);
        }
    }, [reservationId, reservation?.status, paymentData, initiatePayment]);

    const options: StripeElementsOptions | undefined = useMemo(() => {
        if (!paymentData?.clientSecret) return undefined;

        return {
            clientSecret: paymentData.clientSecret,
            appearance: { theme: 'stripe' },
        };
    }, [paymentData?.clientSecret]);

    if (!stripePromise) {
        return <ErrorAlert message="Stripe failed to initialize." />;
    }

    if (!reservationId) {
        return <ErrorAlert message="Reservation ID is missing." />;
    }

    if (isLoadingReservation) return <div>Loading reservation details...</div>;
    if (reservationError) {
        return (
            <ErrorAlert
                message={`Error loading reservation: ${reservationError.message}`}
            />
        );
    }
    if (!reservation) return <ErrorAlert message="Reservation not found." />;

    if (reservation.status === 'PAID') {
        return (
            <div className="text-green-500">
                This reservation has already been paid.
            </div>
        );
    }

    if (reservation.status === 'EXPIRED' || reservation.status === 'CANCELLED') {
        return (
            <div className="text-red-500">
                This reservation is {reservation.status.toLowerCase()} and cannot be paid.
            </div>
        );
    }

    if (isInitiatingPayment) return <div>Loading payment form...</div>;

    if (paymentError) {
        return (
            <ErrorAlert
                message={`Failed to initialize payment: ${paymentError.message}`}
            />
        );
    }

    if (!paymentData?.clientSecret) {
        return <ErrorAlert message="No payment client secret received from the server." />;
    }

    return (
        <div className="container mx-auto p-4 max-w-md">
            <h1 className="text-2xl font-bold mb-4">Complete Your Payment</h1>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-4">
                    <p>
                        <strong>Tournament:</strong> {reservation.tournamentName}
                    </p>
                    <p>
                        <strong>Amount:</strong>{' '}
                        {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: reservation.currency,
                        }).format(reservation.amount)}
                    </p>
                </div>

                {options && (
                    <Elements options={options} stripe={stripePromise}>
                        <CheckoutForm
                            clientSecret={paymentData.clientSecret}
                            reservationId={reservationId}
                        />
                    </Elements>
                )}
            </div>
        </div>
    );
}
