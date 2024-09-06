import { useLoading } from "../../hooks/useLoading";
import { initializeChapaPayment } from "../../services/orderService";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import styles from "./ChapaButtons.module.css";

function ChapaButtons({ order, onPaymentResponse }) {
  const { showLoading, hideLoading } = useLoading();
  const tx_ref = `TX-${Date.now()}`;

  const handlePayment = async () => {
    if (!order.name) {
      showToast("Missing your information.");
      return;
    }

    const paymentDetails = getPaymentDetails(order);

    try {
      showLoading();
      const response = await initializeChapaPayment(paymentDetails);

      // Pass the tx_ref along with the payment response
      handlePaymentResponse(response, tx_ref);
    } catch (error) {
      console.error("Payment Error:", error.response?.data || error.message);
      showToast("Payment failed. Please try again.");
    } finally {
      hideLoading();
    }
  };

  const getPaymentDetails = (order) => ({
    amount: order.totalPrice.toString(),
    currency: "ETB",
    email: order.customerEmail,
    first_name: order.name || "Guest",
    phone_number: order.customerPhoneNumber || "0000000000",
    tx_ref: tx_ref,
    callback_url: `${window.location.origin}/api/payment/verify`,
    return_url: `${window.location.origin}/verify/${tx_ref}`,
    customization: {
      title: "Order Payment",
      description: "Payment for your order at Keti Cafe",
    },
  });

  const handlePaymentResponse = (response, tx_ref) => {
    if (response.status === "success" && response.data.checkout_url) {
      // Optionally, redirect the user to the checkout page
       window.location.href = response.data.checkout_url;
    } else {
      showToast(
        `Payment initialization failed: ${response.message || "Unknown error"}`
      );
    }

    if (typeof onPaymentResponse === "function") {
      // Pass both the response and tx_ref
      onPaymentResponse({ ...response, tx_ref });
    } else {
      console.warn("onPaymentResponse is not a function");
    }
  };

  const showToast = (message, type = "error") => {
    toast[type](message, { position: toast.POSITION.TOP_RIGHT });
  };

  return (
    <div className={styles.chapaContainer}>
      <button onClick={handlePayment} className={styles.chapaButton}>
        Pay Price
      </button>
    </div>
  );
}

ChapaButtons.propTypes = {
  order: PropTypes.object.isRequired,
  onPaymentResponse: PropTypes.func.isRequired,
};

export default ChapaButtons;
