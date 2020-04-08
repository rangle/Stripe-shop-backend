export const successHandler = (callback, results) => {
    console.log('successHandler', {results});
    return responseHandler(callback, results, 200);
};

export const errorHandler = (callback, msg, error) => {
    console.log('errorHandler', {msg, error});
    const response = {
        message: msg,
        errorDetails: error,
    };

    return responseHandler(callback, response, 500);
};

const responseHandler = (callback, response, statusCode) => {
    callback(null,{
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
    });
    return;
};
