const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getMyOrders,
  cancelOrder,
} = require("../controllers/orderController");

router.post("/order", createOrder);
router.get("/orders", getOrders);
router.get("/my-orders", auth, getMyOrders);
router.get("/order/:id", getOrderById);
router.put("/order/:id", auth, updateOrderStatus);
router.delete("/order/:id", auth, deleteOrder);
router.put("/cancel/:id", auth, cancelOrder);

module.exports = router;
