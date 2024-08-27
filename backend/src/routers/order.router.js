import { Router } from "express";
import handler from "express-async-handler";
import auth from "../middleware/auth.mid.js";
import { BAD_REQUEST, UNAUTHORIZED } from "../constants/httpStatus.js";
import { OrderModel } from "../models/order.model.js";
import { OrderStatus } from "../constants/orderStatus.js";
import { UserModel } from "../models/user.model.js";
import { sendEmailReceipt } from "../helpers/mail.helper.js";

const router = Router();
router.use(auth);

// Create a new order for the current user
router.post(
  "/create",
  handler(async (req, res) => {
    const order = req.body;

    if (!order.items || order.items.length <= 0) {
      return res.status(BAD_REQUEST).send("Cart is empty!");
    }

    // Create a new order without deleting existing ones
    const newOrder = new OrderModel({
      ...order,
      user: req.user.id,
      status: OrderStatus.NEW,
    });
    await newOrder.save();
    res.send(newOrder);
  })
);

// Pay for an existing order
router.put(
  "/pay",
  handler(async (req, res) => {
    const { paymentId } = req.body;
    const order = await getNewOrderForCurrentUser(req);

    if (!order) {
      return res.status(BAD_REQUEST).send("Order not found!");
    }

    order.paymentId = paymentId;
    order.status = OrderStatus.PAID;
    await order.save();

    sendEmailReceipt(order);

    res.send(order._id);
  })
);

// Track an order by its ID
router.get(
  "/track/:orderId",
  handler(async (req, res) => {
    const { orderId } = req.params;
    const user = await UserModel.findById(req.user.id);

    const filter = {
      _id: orderId,
    };

    if (!user.isAdmin) {
      filter.user = user._id;
    }

    const order = await OrderModel.findOne(filter);

    if (!order) {
      return res
        .status(UNAUTHORIZED)
        .send("Order not found or unauthorized access!");
    }

    return res.send(order);
  })
);

// Get the most recent new order for the current user
router.get(
  "/newOrderForCurrentUser",
  handler(async (req, res) => {
    const order = await getNewOrderForCurrentUser(req);
    if (order) {
      res.send(order);
    } else {
      res.status(BAD_REQUEST).send("No new order found for current user!");
    }
  })
);

// Get all possible order statuses
router.get("/allstatus", (req, res) => {
  const allStatus = Object.values(OrderStatus);
  res.send(allStatus);
});

// Get all orders by status
router.get(
  "/:status?",
  handler(async (req, res) => {
    const status = req.params.status;
    const user = await UserModel.findById(req.user.id);
    const filter = {};

    if (!user.isAdmin) {
      filter.user = user._id;
    }
    if (status) {
      filter.status = status;
    }

    const orders = await OrderModel.find(filter).sort("-createdAt");
    res.send(orders);
  })
);

// Helper function to get the new order for the current user
const getNewOrderForCurrentUser = async (req) =>
  await OrderModel.findOne({
    user: req.user.id,
    status: OrderStatus.NEW,
  }).populate("user");

export default router;
