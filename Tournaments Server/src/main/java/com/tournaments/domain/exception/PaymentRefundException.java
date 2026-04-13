package com.tournaments.domain.exception;

/**
 * Excepción lanzada cuando un reembolso de pago a Stripe falla.
 * Debe resultar en una respuesta HTTP 500 Internal Server Error.
 * Incluye el mensaje de error devuelto por Stripe para auditoría.
 */
public class PaymentRefundException extends RuntimeException {

    private final String paymentId;
    private final String stripeErrorMessage;

    public PaymentRefundException(String paymentId, String stripeErrorMessage) {
        super(String.format("Payment refund failed for payment %s: %s", paymentId, stripeErrorMessage));
        this.paymentId = paymentId;
        this.stripeErrorMessage = stripeErrorMessage;
    }

    public PaymentRefundException(String paymentId, String stripeErrorMessage, Throwable cause) {
        super(String.format("Payment refund failed for payment %s: %s", paymentId, stripeErrorMessage), cause);
        this.paymentId = paymentId;
        this.stripeErrorMessage = stripeErrorMessage;
    }

    public String getPaymentId() {
        return paymentId;
    }

    public String getStripeErrorMessage() {
        return stripeErrorMessage;
    }
}
