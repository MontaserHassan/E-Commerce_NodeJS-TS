import express from "express";

import { userController } from '../../Controllers/index.controller';


const router = express.Router();


router.post('/register', userController.registerUserByForm);
router.post('/login', userController.login);



export default router