import { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import { useParams } from "react-router-dom";

const VerifyPayment = () => {
  const { transaction_id } = useParams();

  useEffect(() => {
    const verifyPayment = async () => {
      if (!transaction_id) {
        toast.error("Transaction ID not found.");
        return;
      }

      try {
        await axios.post("/api/payment/verify", { transaction_id });
        toast.success("Payment verified successfully!");
      } catch (error) {
        console.error("Verification Error:", error);
        toast.error("Payment verification failed. Please try again.");
      } finally {
        // No navigation and no localStorage operations anymore
      }
    };

    verifyPayment();
  }, [transaction_id]);

  return <h1>Verifying Payment...</h1>;
};

export default VerifyPayment;
