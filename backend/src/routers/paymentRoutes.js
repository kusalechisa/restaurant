import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const router = express.Router();
const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY;

router.use(cors());

router.post("/initialize", async (req, res) => {
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
    console.error("Error initializing payment with Chapa:", error);
    res.status(500).json({
      message: "Error initializing payment",
      error: error.message,
    });
  }
});

export default router;
