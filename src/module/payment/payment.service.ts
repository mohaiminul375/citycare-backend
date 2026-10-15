import config from "../../config"
import { getBkashIdToken } from "../../lib/bkash"

const createPaymentAndUpdateStatusToDB = async () => {
    // check is pending payment

    const bkashIdToken = await getBkashIdToken();
    if (!bkashIdToken) {
        throw new Error('No bkash idToken found');
    }
    const bkashCreatePayment = await fetch(`${config.bkash_base_url}/tokenized-checkout/payment/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: bkashIdToken,
            "X-App-Key": config.bkash_app_key
        },
        body: JSON.stringify({
            // mode: "0011",
            // payerReference: "0123456789",
            // callbackURL: `${config.bkash_callback_url}/payment/callback`,
            // amount: "100",
            // currency: "BDT",
            // intent: "sale",
            // merchantInvoiceNumber: "Inv0781" // complaint id

            payerReference: "TEST001ABC",
            callbackURL: `${config.bkash_callback_url}/payment/callback`,
            amount: "2.90",
            currency: "BDT",
            intent: "sale",
            merchantInvoiceNumber: "test00156227",
            subMerchantName: "Test",
            merchantAssociationInfo: "MI05MID54RF09123456789"
        }),
    })
    const bkashCreaetPaymentResult = bkashCreatePayment.json();

    return bkashCreaetPaymentResult

}

const paymentCallback = async () => {
    return {
        success: true
    }
}

export const paymentService = {
    createPaymentAndUpdateStatusToDB,
    paymentCallback
}