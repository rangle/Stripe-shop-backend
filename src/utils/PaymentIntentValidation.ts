import { DbError, PaymentInput, PaymentIntent } from '../types';

export const validatePaymentIntent = (dataIn: PaymentInput) => {
    const errors: DbError[] = [];
    if (dataIn.amount <= 0) {
        errors['amount'] = 'Amount must be a positive number';
    }

    const params: PaymentIntent = {
        amount: dataIn.amount,
        currency: dataIn.currency ?? 'cad',
        payment_method_types: dataIn.payment_method_types ?? ['card'],
        capture_method: (dataIn.capture_method === 'manual') ? 'manual' : 'automatic',
        off_session: (dataIn.off_session) ?? false,
    };
    // if(params.capture_method === 'manual' && params.off_session) {
    //     errors['offSession'] = 'When Using Off Session Payments, capture_method must be automatic';
    // }

    if(dataIn.customer) params.customer = dataIn.customer;
    if(dataIn.description) params.description = dataIn.description;
    if(dataIn.metadata) params.metadata = dataIn.metadata;

    return (Object.keys(errors).length === 0)
        ? {isValid: true, params}
        : {isValid: false, errors};
}
