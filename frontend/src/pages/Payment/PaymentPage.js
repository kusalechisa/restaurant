import React, { useState, useEffect } from "react";
import classes from "./paymentPage.module.css";
import { getNewOrderForCurrentUser, pay } from "../../services/orderService";
import Title from "../../components/Title/Title";
import OrderItemsList from "../../components/OrderItemsList/OrderItemsList";
import ChapaButtons from "../../components/PaypalButtons/ChapaButtons";
import { useCart } from "../../hooks/useCart";

export default function PaymentPage() {
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // State to manage loading status
  const { clearCart } = useCart();
  const [setError] = useState(null);

  useEffect(() => {
    const fetchLatestOrder = async () => {
      try {
        const data = await getNewOrderForCurrentUser();
        setOrder(data);
      } catch (error) {
        console.error("Failed to fetch the latest order:", error);
      } finally {
        setIsLoading(false); // Stop loading once the data is fetched
      }
    };

    fetchLatestOrder();
  }, []);

  if (isLoading) return <div>Loading...</div>; // Show loading indicator while fetching data

  if (!order) return <div>No recent order found.</div>; // Handle case where no order is found

  const handlePaymentResponse = async (response) => {
    try {
      const tx_ref = response.tx_ref; // Use tx_ref instead of payment_id
      console.log("Transaction Reference:", tx_ref);

      // Use tx_ref in the pay function instead of payment_id
      await pay(tx_ref);
      clearCart(); // Clear the cart after successful payment
    } catch {
      setError("Payment processing failed. Please try again later.");
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.orderSection}>
        <Title title="Order Summary" fontSize="1.8rem" />
        <div className={classes.summary}>
          <div className={classes.summaryItem}>
            <h3>Name:</h3>
            <span>{order.name}</span>
          </div>
          <div className={classes.summaryItem}>
            <h3>Address:</h3>
            <span>{order.address}</span>
          </div>
        </div>
        <OrderItemsList order={order} />
      </div>

      <div className={classes.buttonsContainers}>
        {order.status === "NEW" && (
          <ChapaButtons
            order={order}
            onPaymentResponse={handlePaymentResponse}
          />
        )}
      </div>
    </div>
  );
}
