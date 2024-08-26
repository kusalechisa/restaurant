import React from "react";
import { useNavigate } from "react-router-dom";
import { useLoading } from "../../hooks/useLoading";
import { initializeChapaPayment } from "../../services/chapaService";
import { useCart } from "../../hooks/useCart";
import { toast } from "react-toastify";
import styles from "./ChapaButtons.module.css"; // Import the CSS module

export default function ChapaButtons({ order }) {
  return <Buttons order={order} />;
}

function Buttons({ order }) {
  const { clearCart } = useCart();
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();

  const handlePayment = async () => {
    // Check for required fields and handle null/undefined cases
    if (!order.name) {
      toast.error(
        "Missing customer information. Please check the order details.",
        {
          position: toast.POSITION.TOP_RIGHT,
        }
      );
      return;
    }

    try {
      showLoading();

      // Prepare Chapa payment details
      const paymentDetails = {
        amount: order.totalPrice.toString(), // Ensure amount is a string
        currency: "ETB",
        email: order.customerEmail,
        first_name: order.name || "Guest", // Provide default value if null
        phone_number: order.customerPhoneNumber || "0000000000", // Provide default value if null
        tx_ref: `TX-${Date.now()}`, // Unique transaction reference
        callback_url: "http://api/payment/verify", // Your backend endpoint to handle callback
        //return_url: "http://localhost:3000/", // Frontend route after successful payment
        customization: {
          title: "Order Payment",
          description: "Payment for your order at Keti Cafe",
        },
      };

      // Initialize payment with Chapa
      const response = await initializeChapaPayment(paymentDetails);

      if (response.status === "success" && response.data.checkout_url) {
        clearCart(); // Clear the cart after successful payment initialization
        window.location.href = response.data.checkout_url;
      } else {
        toast.error(
          "Payment initialization failed: " +
            (response.message || "Unknown error"),
          { position: toast.POSITION.TOP_RIGHT }
        );
      }
    } catch (error) {
      console.error(
        "Payment Error:",
        error.response ? error.response.data : error.message
      );
      toast.error("Payment failed. Please try again.", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } finally {
      hideLoading();
      navigate("/thank-you"); // Navigate to a thank-you page or any other page after hiding loading
    }
  };

  return (
    <div className={styles.chapaContainer}>
      <button onClick={handlePayment} className={styles.chapaButton}>
        Pay with Mobile Banking
      </button>
    </div>
  );
}
