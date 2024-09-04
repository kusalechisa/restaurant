import { useEffect } from "react";
import { verifyChapaPayment, pay } from "../../services/orderService";
import { useCart } from "../../hooks/useCart";
import { useLoading } from "../../hooks/useLoading";
import { toast } from "react-toastify";

const PaymentVerification = ({ transactionId }) => {
  const { clearCart } = useCart();
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    const verifyPayment = async () => {
      if (!transactionId) {
        toast.error("Transaction ID is missing.");
        return;
      }

      try {
        showLoading();
        // Verify payment with Chapa
        const response = await verifyChapaPayment(transactionId);
        if (response.status === "success") {
          // Process the payment after successful verification
          await pay(response.data.payment_id);
          clearCart();
          toast.success("Payment successful!");
        } else {
          toast.error(
            `Payment verification failed: ${
              response.message || "Unknown error"
            }`
          );
        }
      } catch (error) {
        console.error(
          "Payment Verification Error:",
          error.response?.data || error.message
        );
        toast.error("Payment verification failed. Please try again.");
      } finally {
        hideLoading();
      }
    };

    verifyPayment();
  }, [transactionId, showLoading, hideLoading, clearCart]);

  return <div>Verifying payment...</div>;
};

export default PaymentVerification;
