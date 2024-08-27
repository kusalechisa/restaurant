import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLoading } from "../../hooks/useLoading";
import {
  initializeChapaPayment,
  verifyChapaPayment,
} from "../../services/chapaService";
import { useCart } from "../../hooks/useCart";
import { toast } from "react-toastify";
import styles from "./ChapaButtons.module.css";
import { pay } from "../../services/orderService";

export default function ChapaButtons({ order }) {
  return <Buttons order={order} />;
}

function Buttons({ order }) {
  const { clearCart } = useCart();
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();

  const handlePayment = async () => {
    if (!order.name) {
      showToast(
        "Missing customer information. Please check the order details."
      );
      return;
    }

    const paymentDetails = {
      amount: order.totalPrice.toString(),
      currency: "ETB",
      email: order.customerEmail,
      first_name: order.name || "Guest",
      phone_number: order.customerPhoneNumber || "0000000000",
      tx_ref: `TX-${Date.now()}`,
      callback_url: "http://api/payment/verify",
      customization: {
        title: "Order Payment",
        description: "Payment for your order at Keti Cafe",
      },
    };

    try {
      showLoading();
      const response = await initializeChapaPayment(paymentDetails);

      if (response.status === "success" && response.data.checkout_url) {
        clearCart();
        window.location.href = response.data.checkout_url;
      } else {
        showToast(
          `Payment initialization failed: ${
            response.message || "Unknown error"
          }`
        );
      }
    } catch (error) {
      console.error("Payment Error:", error.response?.data || error.message);
      showToast("Payment failed. Please try again.");
    } finally {
      hideLoading();
    
    }
  };

  useEffect(() => {
    const handleCallbackVerification = async (transactionId) => {
      try {
        showLoading();
        const verificationResponse = await verifyChapaPayment(transactionId);

        if (verificationResponse.status === "success") {
          const orderId = await pay(verificationResponse.data.payment_id);
          showToast("Payment Saved Successfully", "success");
          navigate(`/track/${orderId}`);
        } else {
          showToast(
            `Payment verification failed: ${
              verificationResponse.message || "Unknown error"
            }`
          );
        }
      } catch (error) {
        console.error(
          "Verification Error:",
          error.response?.data || error.message
        );
        showToast("Payment verification failed. Please try again.");
      } finally {
        hideLoading();
      }
    };

    const urlParams = new URLSearchParams(window.location.search);
    const transactionId = urlParams.get("transaction_id");
    if (transactionId) {
      handleCallbackVerification(transactionId);
    }
  }, [navigate, showLoading, hideLoading]);

  const showToast = (message, type = "error") => {
    toast[type](message, { position: toast.POSITION.TOP_RIGHT });
  };

  return (
    <div className={styles.chapaContainer}>
      <button onClick={handlePayment} className={styles.chapaButton}>
        Pay with Mobile Banking
      </button>
    </div>
  );
}
