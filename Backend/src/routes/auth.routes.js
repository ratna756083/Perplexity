import {Router} from 'express'
import {registerController,loginController,getMeController,logout,googleCallback} from '../controllers/auth.controller.js'
import {validateRegister} from '../validators/auth.validator.js'
import verifyUser from '../middleware/auth.middleware.js'
import passport from 'passport'

const router=Router()

router.post('/register',validateRegister,registerController)
router.post('/login',loginController)
router.get("/google",passport.authenticate("google",{scope:["profile","email"]}))
router.get("/google/callback",
    passport.authenticate("google", {
        session:false,
        failureRedirect:"https://perplexity-frontend-9e0x.onrender.com/login"
    }),
        googleCallback
    )
router.get("/get-me",verifyUser,getMeController)


router.get("/logout",verifyUser,logout)


export default router