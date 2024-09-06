import { Router } from "express";
import axios from "axios";
import dotenv from "dotenv";
import handler from "express-async-handler";
import auth from "../middleware/auth.mid.js";
import { BAD_REQUEST, UNAUTHORIZED } from "../constants/httpStatus.js";
import { OrderModel } from "../models/order.model.js";
import { OrderStatus } from "../constants/orderStatus.js";
import { UserModel } from "../models/user.model.js";
import { sendEmailReceipt } from "../helpers/email.service.js";
dotenv.config();

const router = Router();
const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY;

router.use(auth); // Make sure all routes require authentication

// Initialize Chapa Payment
router.post(
  "/initialize",
  handler(async (req, res) => {
    const paymentDetails = req.body;

    try {
      const response = await axios.post(
        "https://api.chapa.co/v1/transaction/initialize",
        paymentDetails,
        {
          headers: {
            Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      res.json(response.data);
    } catch (error) {
      console.error("Error initializing payment with Chapa:", {
        message: error.message,
        response: error.response?.data,
        statusCode: error.response?.status,
      });
      res.status(500).json({
        message: "Error initializing payment",
        error: error.message,
      });
    }
  })
);

// Verify Chapa Payment
router.post(
  "/verify",
  handler(async (req, res) => {
    const { transaction_id } = req.body;

    if (!transaction_id) {
      return res.status(BAD_REQUEST).send("Transaction ID is required.");
    }

    try {
      // Verify the payment with Chapa
      const response = await axios.get(
        `https://api.chapa.co/v1/transaction/verify/${transaction_id}`,
        {
          headers: {
            Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const verificationData = response.data;

      if (verificationData.status === "success") {
        const paymentId = verificationData.data.tx_ref;
        const order = await OrderModel.findOne({ paymentId });

        if (!order) {
          return res.status(BAD_REQUEST).send("Order not found for payment!");
        }

        if (order.status === OrderStatus.PAID) {
          return res.send({ orderId: order._id }); // Payment already processed
        }

        // Update order status to PAID
        order.status = OrderStatus.PAID;
        await order.save();

        // Send email receipt
        await sendEmailReceipt(order);

        // Respond with the order ID
        res.send({ orderId: order._id });
      } else {
        res.status(BAD_REQUEST).send("Payment verification failed.");
      }
    } catch (error) {
      console.error("Error verifying payment with Chapa:", {
        message: error.message,
        response: error.response?.data,
        statusCode: error.response?.status,
      });
      res.status(500).json({
        message: "Error verifying payment",
        error: error.message,
      });
    }
  })
);
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

router.put(
  "/pay",
  handler(async (req, res) => {
    const { paymentId } = req.body;

    // Find the latest new order for the current user
    const order = await OrderModel.findOne({
      user: req.user.id,
      status: OrderStatus.NEW,
    })
      .sort({ createdAt: -1 }) // Fetch the most recent order
      .exec();

    if (!order) {
      return res.status(BAD_REQUEST).send("Order not found!");
    }

    // Update the found order with the paymentId and status
    order.paymentId = paymentId;

    try {
      await order.save();
      // sendEmailReceipt(order); // Uncomment if you want to send email receipt
      res.send({ orderId: order._id });
    } catch (error) {
      console.error("Error saving order:", {
        message: error.message,
        response: error.response?.data,
        statusCode: error.response?.status,
      });
      res.status(500).send("Failed to update order status.");
    }
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
    const order = await OrderModel.findOne({
      user: req.user.id,
      status: OrderStatus.NEW,
    })
      .sort({ createdAt: -1 }) // Fetch the most recent order by sorting
      .populate("user");

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

export default router;
