package com.tournaments.application.service;

import java.math.BigDecimal;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.model.Refund;
import com.stripe.net.RequestOptions;
import com.stripe.param.RefundCreateParams;
import com.tournaments.domain.exception.PaymentRefundException;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StripeRefundService {

    private static final Logger logger = LoggerFactory.getLogger(StripeRefundService.class);

    @PostConstruct
    public void logStripeConfig() {
        try {
            String apiKey = com.stripe.Stripe.apiKey;
            if (apiKey == null || apiKey.isEmpty()) {
                logger.error("CRITICAL: Stripe API key is NOT configured! (null or empty)");
            } else {
                // Mostrar solo primeros 4 y últimos 4 caracteres por seguridad
                String maskedKey = apiKey.length() > 8 
                    ? apiKey.substring(0, 4) + "..." + apiKey.substring(apiKey.length() - 4)
                    : "***";
                logger.info("Stripe API key configured: {}", maskedKey);
                // logger.info("Stripe API version: {}", com.stripe.Stripe.apiVersion);
            }
        } catch (Exception e) {
            logger.error("CRITICAL: Stripe API is NOT properly configured! {}", e.getMessage(), e);
        }
    }

    public RefundResult refundPayment(String paymentIntentId, BigDecimal amount, String idempotencyKey) {
        // ========== LOGS DE ENTRADA ==========
        logger.info("=== BEGIN REFUND ===");
        logger.debug("Input paymentIntentId: '{}' (length={})", paymentIntentId, 
                paymentIntentId != null ? paymentIntentId.length() : 0);
        logger.debug("Input amount: {}", amount);
        logger.debug("Input idempotencyKey: '{}'", idempotencyKey);

        // Validaciones iniciales de entrada
        if (paymentIntentId == null || paymentIntentId.trim().isEmpty()) {
            logger.error("INPUT NULL: paymentIntentId is null or empty");
            throw new PaymentRefundException("null", "paymentIntentId cannot be null");
        }
        if (amount == null) {
            logger.error("INPUT NULL: amount is null");
            throw new PaymentRefundException(paymentIntentId, "amount cannot be null");
        }
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            logger.error("INPUT INVALID: amount <= 0: {}", amount);
            throw new PaymentRefundException(paymentIntentId, "amount must be positive");
        }
        if (idempotencyKey == null || idempotencyKey.trim().isEmpty()) {
            logger.warn("INPUT NULL: idempotencyKey is null or empty - Stripe may reject or process duplicate");
        }

        try {
            // ========== 1. RECUPERAR PAYMENTINTENT ==========
            logger.debug("Calling PaymentIntent.retrieve('{}')", paymentIntentId);
            PaymentIntent intent = PaymentIntent.retrieve(paymentIntentId);
            logger.debug("PaymentIntent object retrieved successfully");

            // Verificar campos del intent
            logger.info("PaymentIntent details: id={}, status={}, amount={}, amount_received={}, amount_capturable={}, charge_id={}",
                    intent.getId(), intent.getStatus(), intent.getAmount(), 
                    intent.getAmountReceived(), intent.getAmountCapturable(),
                    intent.getLatestCharge());

            if (intent.getStatus() == null) {
                logger.error("NULL FIELD: PaymentIntent status is null");
                throw new PaymentRefundException(paymentIntentId, "PaymentIntent status is null");
            }

            // ========== 2. VALIDAR ESTADO ==========
            // CORRECCIÓN: Solo succeeded es reembolsable
            if (!"succeeded".equals(intent.getStatus())) {
                String errorMsg = String.format("Invalid status for refund: '%s'. Only 'succeeded' is allowed.", intent.getStatus());
                logger.error(errorMsg);
                logger.debug("Full PaymentIntent dump for debugging: id={}, status={}, last_payment_error={}", 
                        intent.getId(), intent.getStatus(), intent.getLastPaymentError());
                throw new PaymentRefundException(paymentIntentId, errorMsg);
            }
            logger.debug("Status validation passed: status = succeeded");

            // ========== 3. OBTENER CHARGE ID ==========
            String chargeId = intent.getLatestCharge();
            logger.debug("Raw latestCharge from PaymentIntent: '{}'", chargeId);
            
            if (chargeId == null || chargeId.trim().isEmpty()) {
                logger.error("NULL CHARGE ID: latestCharge is null or empty");
                logger.error("Possible reasons: PaymentIntent not captured, or charge object missing.");
                logger.debug("Intent amount_received={}, status={}", intent.getAmountReceived(), intent.getStatus());
                throw new PaymentRefundException(paymentIntentId, 
                        "No charge found. PaymentIntent must be captured first (status=succeeded).");
            }
            logger.info("Charge ID obtained: {}", chargeId);

            // ========== 4. CONVERTIR MONTO A CENTAVOS ==========
            long amountInCents;
            try {
                amountInCents = amount.multiply(BigDecimal.valueOf(100)).longValueExact(); // mejor que longValue()
                logger.debug("Amount conversion: {} {} → {} cents", amount, intent.getCurrency(), amountInCents);
            } catch (ArithmeticException e) {
                logger.error("Amount conversion error: {} cannot be converted to cents without overflow", amount, e);
                throw new PaymentRefundException(paymentIntentId, "Amount too large or has too many decimal places: " + amount);
            }

            if (amountInCents <= 0) {
                logger.error("Amount in cents is <= 0: {}", amountInCents);
                throw new PaymentRefundException(paymentIntentId, "Amount must be greater than 0 after conversion");
            }

            // ========== 5. CREAR PARÁMETROS DE REFUND ==========
            logger.debug("Building RefundCreateParams with charge={}, amount={}", chargeId, amountInCents);
            RefundCreateParams params = RefundCreateParams.builder()
                    .setCharge(chargeId)
                    .setAmount(amountInCents)
                    .build();

            // ========== 6. OPCIONES CON IDEMPOTENCY KEY ==========
            RequestOptions requestOptions;
            if (idempotencyKey != null && !idempotencyKey.isEmpty()) {
                logger.debug("Using idempotency key: {}", idempotencyKey);
                requestOptions = RequestOptions.builder()
                        .setIdempotencyKey(idempotencyKey)
                        .build();
            } else {
                logger.warn("No idempotency key provided – Stripe may process duplicate refunds");
                requestOptions = RequestOptions.builder().build();
            }

            // ========== 7. EJECUTAR REFUND ==========
            logger.info("Calling Stripe Refund API with params: charge={}, amount_cents={}", chargeId, amountInCents);
            Refund refund = Refund.create(params, requestOptions);
            logger.info("Stripe Refund API call successful");

            // ========== 8. VALIDAR RESPUESTA ==========
            logger.debug("Refund object: id={}, status={}, amount={}, charge={}, created={}, reason={}",
                    refund.getId(), refund.getStatus(), refund.getAmount(), refund.getCharge(),
                    refund.getCreated(), refund.getReason());

            if (refund.getId() == null) {
                logger.error("NULL FIELD: Refund ID is null – unexpected response from Stripe");
                throw new PaymentRefundException(paymentIntentId, "Refund created but ID is null");
            }

            if (refund.getAmount() == null || refund.getAmount() <= 0) {
                logger.warn("Refund amount is null or zero: {}. Refund may not have processed correctly.", refund.getAmount());
            }

            if (!"succeeded".equals(refund.getStatus())) {
                logger.warn("Refund status is not 'succeeded': {}. Reason: {}", refund.getStatus(), refund.getReason());
            }

            logger.info("=== REFUND SUCCESS: refundId={}, status={}, amount={} ===",
                    refund.getId(), refund.getStatus(), refund.getAmount());

            return RefundResult.builder()
                    .refundId(refund.getId())
                    .status(refund.getStatus())
                    .amount(refund.getAmount())
                    .success(true)
                    .build();

        } catch (StripeException e) {
            logger.error("=== REFUND FAILED (StripeException) ===");
            logger.error("Stripe error code: {}", e.getCode());
            logger.error("Stripe error message: {}", e.getMessage());
            logger.error("Stripe request ID: {}", e.getRequestId());
            logger.error("Stripe status code: {}", e.getStatusCode());
            if (e.getStripeError() != null) {
                logger.error("Stripe error type: {}, param: {}", e.getStripeError().getType(), e.getStripeError().getParam());
            }
            logger.debug("Full Stripe exception stack trace:", e);
            throw new PaymentRefundException(paymentIntentId,
                    String.format("Stripe error [%s]: %s", e.getCode(), e.getMessage()), e);
        } catch (PaymentRefundException e) {
            // relanzar excepciones conocidas
            throw e;
        } catch (Exception e) {
            logger.error("=== REFUND FAILED (Unexpected Exception) ===");
            logger.error("Exception type: {}", e.getClass().getName());
            logger.error("Exception message: {}", e.getMessage());
            logger.error("Full stack trace:", e);
            throw new PaymentRefundException(paymentIntentId,
                    "Unexpected error: " + e.getMessage(), e);
        }
    }

    // Clase RefundResult igual que antes...
    public static class RefundResult {
        private String refundId;
        private String status;
        private Long amount;
        private boolean success;

        public RefundResult() {}

        public RefundResult(String refundId, String status, Long amount, boolean success) {
            this.refundId = refundId;
            this.status = status;
            this.amount = amount;
            this.success = success;
        }

        public static RefundResultBuilder builder() {
            return new RefundResultBuilder();
        }

        public static class RefundResultBuilder {
            private String refundId;
            private String status;
            private Long amount;
            private boolean success;

            public RefundResultBuilder refundId(String refundId) {
                this.refundId = refundId;
                return this;
            }

            public RefundResultBuilder status(String status) {
                this.status = status;
                return this;
            }

            public RefundResultBuilder amount(Long amount) {
                this.amount = amount;
                return this;
            }

            public RefundResultBuilder success(boolean success) {
                this.success = success;
                return this;
            }

            public RefundResult build() {
                return new RefundResult(refundId, status, amount, success);
            }
        }

        public String getRefundId() { return refundId; }
        public String getStatus() { return status; }
        public Long getAmount() { return amount; }
        public boolean isSuccess() { return success; }
    }
}