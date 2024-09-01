import React, { useState, useEffect } from "react";
import classes from "./paymentPage.module.css";
import { getNewOrderForCurrentUser } from "../../services/orderService";
import Title from "../../components/Title/Title";
import OrderItemsList from "../../components/OrderItemsList/OrderItemsList";
import ChapaButtons from "../../components/PaypalButtons/ChapaButtons";

export default function PaymentPage() {
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // State to manage loading status

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

      {/* Removed the Title and Map component for "Your Location" */}

      <div className={classes.buttonsContainers}>
        <ChapaButtons order={order} />
      </div>
      {/* <div className={classes.buttonsContainer}>
        <PaypalButtons order={order} />
      </div> */}
    </div>
  );
}
