const jwt = require('jsonwebtoken');



exports.signJwtToken = async (payload) => {
    const payload_data = {
        ...payload,
        name: payload.name.split(' ')[0]
    }

    return await jwt.sign(payload_data, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN,
        algorithm: 'HS256'
    })
}


exports.verifyJwtToken = async (token) => {
    return await jwt.verify(token, process.env.JWT_SECRET_KEY, {
        algorithms: ['HS256'],
    });
}

