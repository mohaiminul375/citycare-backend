import { PaymentStatus } from "../../../generated/prisma/enums"
import config from "../../config"
import { getBkashIdToken } from "../../lib/bkash"
import { prisma } from "../../lib/prisma"
import { IExecutedPaymentResult } from "./payment.interface"

const createPaymentAndUpdateStatusToDB = async (complaintId: string, citizenId: string) => {
    // check is already paid
    const isPaid = await prisma.complaint.findFirst({
        where: {
            id: complaintId,
            citizenId: citizenId,
            paymentStatus: PaymentStatus.PENDING
        }
    })
    console.log(isPaid);
    if (!isPaid) {
        throw new Error("Already paid or not owner of this complaint")
    }




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
            amount: "100",
            currency: "BDT",
            intent: "sale",
            merchantInvoiceNumber: complaintId,
            subMerchantName: "Test",
            merchantAssociationInfo: "MI05MID54RF09123456789"
        }),
    })
    const bkashCreaetPaymentResult = bkashCreatePayment.json();

    return bkashCreaetPaymentResult

}

const paymentCallback = async (query: Record<string, any>) => {
    const paymentId = query.paymentID;
    if (!paymentId) {
        throw new Error("Payment id missing")
    }
    const status = query.status;
    if (!status) {
        throw new Error("Payment status missing")
    }

    const bkashIdToken = await getBkashIdToken();
    if (!bkashIdToken) {
        throw new Error('No bkash idToken found');
    }
    const executedPayment = await fetch(`${config.bkash_base_url}/tokenized-checkout/payment/execute`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: bkashIdToken,
            "X-App-Key": config.bkash_app_key
        },
        body: JSON.stringify({
            paymentId: paymentId
        })
    })
    const executedPaymentResult = await executedPayment.json();
    if (status === "success") {
        await prisma.complaint.update({
            where: {
                id: executedPaymentResult.merchantInvoiceNumber
            },
            data: {
                paymentStatus: PaymentStatus.PAID
            }
        })
        return {

            executedPaymentResult,
            redirectUrl: `${config.frontend_url}/citizen-dashboard?status=success`
        }
    }
    if (status === "failure") {
        return {
            executedPaymentResult,
            redirectUrl: `${config.frontend_url}/dashboard/citizen-dashboard?status=failure`
        }
    }
    if (status === "cancel") {
        return {
            executedPaymentResult,
            redirectUrl: `${config.frontend_url}/dashboard/citizen-dashboard?status=cancel`
        }
    }
    return {
        executedPaymentResult,
        redirectUrl: `${config.frontend_url}/citizen-dashboard`
    }
}

export const paymentService = {
    createPaymentAndUpdateStatusToDB,
    paymentCallback
}