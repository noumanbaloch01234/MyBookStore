import express from "express";
import { signup } from "../Controller/User.controller.js";
import { login } from "../Controller/User.controller.js";
const router= express.Router()

router.post("/signup",signup)
router.post("/login",login)

export default router