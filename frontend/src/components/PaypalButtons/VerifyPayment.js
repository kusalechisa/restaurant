import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import styles from "./VerifyPayment.module.css";
import { toast } from "react-toastify";

const VerifyPayment = () => {
  const { transaction_id } = useParams();
  const [paymentInfo, setPaymentInfo] = useState(null);

  useEffect(() => {
    // Retrieve payment information from localStorage
    const storedPaymentInfo = JSON.parse(localStorage.getItem("paymentInfo"));
    setPaymentInfo(storedPaymentInfo);

    const verifyPayment = async () => {
      if (!transaction_id) {
        toast.error("Transaction ID not found.");
        return;
      }

      try {
        await axios.post("/api/payment/verify", {
          transaction_id,
        });
        // Optionally, clear payment information from local storage
        localStorage.removeItem("paymentInfo");
      } catch (error) {
        console.error("Verification Error:", error);
        toast.error("Payment verification failed. Please try again.");
      }
    };

    verifyPayment();
  }, [transaction_id]);

  const downloadImage = () => {
    if (!paymentInfo) return;

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;

    // Set background color
    context.fillStyle = "#fff";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Set font and color
    context.font = "16px Arial";
    context.fillStyle = "#000";

    // Add text to canvas
    let yPosition = 20;
    const addText = (text) => {
      context.fillText(text, 20, yPosition);
      yPosition += 30;
    };

    addText(`Transaction Reference: ${paymentInfo.tx_ref}`);
    addText(`Amount: ${paymentInfo.amount} ${paymentInfo.currency}`);
    addText(`Customer Email: ${paymentInfo.email}`);
    addText(`Customer Name: ${paymentInfo.first_name}`);
    addText(`Phone Number: ${paymentInfo.phone_number}`);
    addText(`Title: ${paymentInfo.customization.title}`);
    addText(`Description: ${paymentInfo.customization.description}`);

    // Convert canvas to image
    const image = canvas.toDataURL("image/png");

    // Create download link
    const link = document.createElement("a");
    link.href = image;
    link.download = "payment_info.png";
    link.click();
  };

  const qrValue = paymentInfo ? JSON.stringify(paymentInfo) : "";

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <button onClick={downloadImage} className={styles.downloadButton}>
          <FontAwesomeIcon icon={faDownload} />
        </button>
        <h1>Payment Verification</h1>
        {paymentInfo ? (
          <div className={styles.content}>
            <QRCodeSVG value={qrValue} size={128} />
            <div className={styles.info}>
              <p>
                <strong>Transaction Reference:</strong> {paymentInfo.tx_ref}
              </p>
              <p>
                <strong>Amount:</strong> {paymentInfo.amount}{" "}
                {paymentInfo.currency}
              </p>
              <p>
                <strong>Customer Email:</strong> {paymentInfo.email}
              </p>
              <p>
                <strong>Customer Name:</strong> {paymentInfo.first_name}
              </p>
              <p>
                <strong>Phone Number:</strong> {paymentInfo.phone_number}
              </p>
              <p>
                <strong>Title:</strong> {paymentInfo.customization.title}
              </p>
              <p>
                <strong>Description:</strong>{" "}
                {paymentInfo.customization.description}
              </p>
            </div>
          </div>
        ) : (
          <p>Loading payment information...</p>
        )}
      </div>
    </div>
  );
};

export default VerifyPayment;
