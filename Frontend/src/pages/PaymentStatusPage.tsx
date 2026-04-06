import { useParams, Link } from 'react-router-dom';
import { usePaymentStatus } from '../hooks/usePaymentStatus';
import ErrorAlert from '../components/ErrorAlert';

export function PaymentStatusPage() {
    const { reservationId } = useParams<{ reservationId: string }>();

    const { reservation, isLoading, error, isPolling, status } = usePaymentStatus(reservationId ?? null);

    if (isLoading) {
        return (
            <div className="text-center p-10">
                <h1 className="text-2xl font-semibold">Processing your payment...</h1>
                <p className="text-gray-600">Please wait, we are confirming your payment with the bank.</p>
                {/* You can add a spinner here */}
            </div>
        );
    }

    if (error) {
        return <ErrorAlert message={`An error occurred: ${error.message}`} />;
    }

    return (
        <div className="text-center p-10">
            {status === 'PAID' && (
                <>
                    <h1 className="text-3xl font-bold text-green-600">Payment Successful!</h1>
                    <p className="mt-2 text-lg">Your reservation for <strong>{reservation?.tournamentName}</strong> is confirmed.</p>
                    <Link to="/profile/reservations" className="mt-6 inline-block bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
                        View My Reservations
                    </Link>
                </>
            )}

            {status === 'PENDING' && !isPolling && (
                <>
                    <h1 className="text-3xl font-bold text-yellow-600">Payment Confirmation Pending</h1>
                    <p className="mt-2 text-lg">Your payment has been submitted, but we are still waiting for final confirmation.</p>
                    <p className="mt-2">We will notify you once the status is updated. You can check the status again in your reservations list.</p>
                    <Link to="/profile/reservations" className="mt-6 inline-block bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
                        View My Reservations
                    </Link>
                </>
            )}

            {(status === 'CANCELLED' || status === 'EXPIRED') && (
                <>
                    <h1 className="text-3xl font-bold text-red-600">Payment Failed</h1>
                    <p className="mt-2 text-lg">The reservation has been {status?.toLowerCase()}.</p>
                    <Link to={`/reservations/${reservationId}/pay`} className="mt-6 inline-block bg-gray-600 text-white font-bold py-2 px-4 rounded hover:bg-gray-700">
                        Try Again
                    </Link>
                </>
            )}
        </div>
    );
}
