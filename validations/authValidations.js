import {body} from "express-validator"
export const RegisterValidation = [
body("name").trim()
.notEmpty()
.withMessage("enter name")
.isLength({min:3})
.withMessage("enter atleast 3 char name") ,



body("email").notEmpty()
.withMessage("enter Email")
.normalizeEmail()
.isEmail()  ,

body("password").notEmpty()
.withMessage("enter password")
.isLength({min:8 , max:12})
.isStrongPassword()
.withMessage("enter password a strong nd in between 8-12"),

body("phone").notEmpty()
.withMessage("enter mobile number")
.isLength({min:10})
.withMessage("enter 10 digit number")

]