const { body, validationResult } = require('express-validator');

const userSignupInputRule = () => {
    return [
        body('firstname').not().isEmpty().withMessage("first name is required").isLength({ min: 2 }),
        body('lastname').not().isEmpty().withMessage("last name is required").isLength({ min: 2 }),
        body('email').isEmail(),
        body('phone').not().isEmpty().withMessage("phone number is required").isLength({ min: 10, max: 14 }),
        body('password').not().isEmpty().withMessage("password is required").isLength({ min: 6 }),
    ];
}

const userSigninInputRule = () => {
    return [
        body('email').isEmail(),
        body('password').not().isEmpty().withMessage("password is required").isLength({ min: 6 }),
    ];
}

const validateInput = (req, resp, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) return next();

    const extractedErrors = []
    errors.array().map(er => extractedErrors.push({ [er.param]: er.msg }));

    return resp.status(422).json({
        errors: extractedErrors
    })
}

module.exports = {
    userSignupInputRule,
    userSigninInputRule,
    validateInput
}
