import { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useLoading } from "../../hooks/useLoading";
import { useParams, useNavigate } from "react-router-dom";

const VerifyPayment = () => {
  const { showLoading, hideLoading } = useLoading();
  const { transaction_id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyPayment = async () => {
      if (!transaction_id) {
        toast.error("Transaction ID not found.");
        return;
      }

      showLoading();
      try {
        await axios.post("/api/payment/verify", { transaction_id });
        toast.success("Payment verified successfully!");
        navigate("/orders");
      } catch (error) {
        console.error("Verification Error:", error);
        toast.error("Payment verification failed. Please try again.");
      } finally {
        hideLoading();
        localStorage.removeItem("transaction_id");
      }
    };

    verifyPayment();
  }, [transaction_id, showLoading, hideLoading, navigate]);

  return <h1>Verifying Payment...</h1>;
};

export default VerifyPayment;
