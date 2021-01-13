export const successHandler = (results) => {
    console.log('successHandler', {results});
    return responseHandler(results, 200);
};

export const errorHandler = (msg, error) => {
    console.log('errorHandler', {msg, error});
    const response = {
        message: msg,
        errorDetails: error,
    };

    return responseHandler(response, 500);
};

const responseHandler = (response, statusCode) => {
    return {
        statusCode: statusCode,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin' : '*', // Required for CORS support to work
            'Access-Control-Allow-Credentials' : true, // Required for cookies, authorization headers with HTTPS
            'Access-Control-Allow-Methods': 'PUT, POST, GET, DELETE, OPTIONS',
        },
        body: JSON.stringify(response,
            null,
            2,
        ),
    };
};
