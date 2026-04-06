package com.tournaments.presentation.controller;

import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.PaymentIntent;
import com.stripe.net.Webhook;
import com.tournaments.application.usecase.ConfirmPaymentUseCase;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/webhooks")
@RequiredArgsConstructor
@Slf4j
public class StripeWebhookController {

    private final ConfirmPaymentUseCase confirmPaymentUseCase;

    @Value("${stripe.webhook.secret}")
    private String webhookSecret;

    @PostMapping("/stripe")
    public ResponseEntity<String> handleStripeEvent(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader) {

        Event event;

        try {
            event = Webhook.constructEvent(payload, sigHeader, webhookSecret);
        } catch (SignatureVerificationException e) {
            log.error("Webhook signature verification failed.", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Signature verification failed.");
        } catch (Exception e) {
            log.error("Error parsing webhook event.", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error parsing event.");
        }

        // Filtrar solo eventos 'payment_intent.succeeded'
        if ("payment_intent.succeeded".equals(event.getType())) {
            PaymentIntent paymentIntent = (PaymentIntent) event.getData().getObject();
            log.info("Received payment_intent.succeeded for: {}", paymentIntent.getId());

            try {
                confirmPaymentUseCase.execute(paymentIntent.getId());
            } catch (Exception e) {
                log.error("Error processing payment confirmation for intent_id: {}", paymentIntent.getId(), e);
                // Devolver un error 500 para que Stripe reintente el webhook
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing payment.");
            }
        } else {
            log.info("Received unhandled event type: {}", event.getType());
        }

        return ResponseEntity.ok("Event received.");
    }
}
