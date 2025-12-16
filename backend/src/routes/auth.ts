import { Router } from "express";
import UserService from "../services/user.js";


const router = Router();

const userService = new UserService();


router.post("/register", userService.register);
router.post("/login", userService.login);

export default router;
