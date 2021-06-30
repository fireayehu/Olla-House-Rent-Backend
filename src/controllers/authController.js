const userModel = require('../models/userModel');
const { signJwtToken, verifyJwtToken } = require('../utils/processJWT');


exports.login = (req, res) => {

}

exports.register = async (req, res, next) => {
    const { firstname, lastname, email, password } = req.body;


}
