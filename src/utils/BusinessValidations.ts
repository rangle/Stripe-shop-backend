import uuid = require("uuid");
import { Business, BusinessInput, DbError, validBusiness } from '../types';

export const validateBusiness = (dataIn: BusinessInput): validBusiness => {
    const errors: DbError[] = [];
    const timestamp = new Date().getTime();

    const params: Business = {
        businessId: uuid.v1(),
        createdAt: timestamp,
        updatedAt: timestamp,
    };

    const required: any = [
        'businessName',
        'email',
        'address',
    ];
    const optional: any = [
        'contactName',
        'phone',
    ];

    const reqParams: BusinessInput = {
        businessName: '',
        email: '',
        address: {
            line1: '',
            city: '',
            country: '',
            postalCode: '',
        },
    };
    required.map(key => {
        dataIn[key] && (reqParams[key] = dataIn[key]) || (errors.push({
            error: key + ' Is a required field',
            message: key + ' Is a required field',
        }));
    });

    if (errors.length > 0) {
        return {isValid: false, errors};
    }

    const optParams: any = {};
    optional.map(key => {
        dataIn[key] && dataIn[key].length && (optParams[key] = dataIn[key]);
    });

    const finalParams: Business = {
        ...optParams,
        ...reqParams,
        ...params,
    };

    return {isValid: true, params: finalParams};
}
