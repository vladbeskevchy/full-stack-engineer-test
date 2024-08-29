import express from "express";
import orderCtrl from "../controllers/order.controller.js";

const router = express.Router();

router.route("/api/order").get(orderCtrl.list).post(orderCtrl.create);

export default router;
