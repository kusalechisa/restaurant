import { useLoading } from "../../hooks/useLoading";
import { initializeChapaPayment, pay } from "../../services/orderService"; // Use the updated import
import { useCart } from "../../hooks/useCart";
import { toast } from "react-toastify";
import styles from "./ChapaButtons.module.css";

export default function ChapaButtons({ order }) {
  return <Buttons order={order} />;
}

function Buttons({ order }) {
  const { clearCart } = useCart();
  const { showLoading, hideLoading } = useLoading();

  const handlePayment = async () => {
    if (!order.name) {
      showToast("Missing your information.");
      return;
    }

    const paymentDetails = {
      amount: order.totalPrice.toString(),
      currency: "ETB",
      email: order.customerEmail,
      first_name: order.name || "Guest",
      phone_number: order.customerPhoneNumber || "0000000000",
      tx_ref: `TX-${Date.now()}`,
      callback_url: `${window.location.origin}/api/payment/verify`, // Ensure this matches the backend verification URL
      return_url: `${window.location.origin}/track/${order.id}`, // Dynamic return URL with the order ID
      customization: {
        title: "Order Payment",
        description: "Payment for your order at Keti Cafe",
      },
    };

    try {
      showLoading();
      // Initialize payment with Chapa
      const response = await initializeChapaPayment(paymentDetails);

      if (response.status === "success" && response.data.checkout_url) {
        // Capture the payment ID returned from Chapa and update order status

        await pay(response.data.payment_id);

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

  const showToast = (message, type = "error") => {
    toast[type](message, { position: toast.POSITION.TOP_RIGHT });
  };

  return (
    <div className={styles.chapaContainer}>
      <button onClick={handlePayment} className={styles.chapaButton}>
        Pay Now
      </button>
    </div>
  );
}
