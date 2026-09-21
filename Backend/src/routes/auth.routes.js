import {Router} from 'express'
import {registerController,verifyEmailController,loginController,getMeController} from '../controllers/auth.controller.js'
import {validateRegister} from '../validators/auth.validator.js'
import verifyUser from '../middleware/auth.middleware.js'

const router=Router()

router.post('/register',validateRegister,registerController)
router.post('/login',loginController)
router.get("/get-me",verifyUser,getMeController)
router.get('/verify-email',verifyEmailController)




export default router