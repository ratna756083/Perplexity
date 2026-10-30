import { body, validationResult } from 'express-validator'

function validateRequest(req,res,next){
    const errors=validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).json({
            errors:errors.array()
        })
    }

    next()
}




export const validateRegisterUser = [
    body("username")
        .isString().withMessage("username must be a string")
        .bail()
        .trim(),
    body("email")
        .isString().withMessage("email must be a string")
         .isEmail().withMessage("invalid email format"),
    body("password")
        .isString().withMessage("password must be a string")
        .isLength({min:6})
        .notEmpty().withMessage("password is required"),
    
      validateRequest
]


export const validateLoginUser=[
     body("email")
        .isString().withMessage("email must be a string")
        .bail()
        .trim()
        .isEmail().withMessage("invalid email format"),
    body("password")
        .isString().withMessage("password must be a string")
        .isLength({min:6})
        .notEmpty().withMessage("password is required"),
        
        validateRequest
]