import express from "express"
import controller from "../controllers/message.js"

const router = express.Router()

// Definindo rotas da aplicação 
router.post("/save", controller.save)
router.get("/messages", controller.getMessagens)

export default router