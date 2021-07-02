exports.sendResponse = (statusCode, data, res) => {
    res.status(statusCode).send({
        status: "success",
        results: data instanceof Array ? data.length : undefined,
        message: {
            data
        }
    });
}

exports.sendResponseWithToken = (statusCode, data, res, token) => {

    const cookieOption = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 60 * 60 * 24 * 1000),
        httpOnly: true
    }

    if (process.env.NODE_ENV == "production") cookieOption.secure = true;
    res.cookie('jwt', cookieOption);

    res.status(statusCode).json({
        status: "success",
        token,
        results: data instanceof Array ? data.length : undefined,
        message: {
            data
        }
    });
}
