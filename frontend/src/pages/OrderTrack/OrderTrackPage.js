import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { trackOrderById, pay } from "../../services/orderService";
import NotFound from "../../components/NotFound/NotFound";
import classes from "./orderTrackPage.module.css";
import DateTime from "../../components/DateTime/DateTime";
import OrderItemsList from "../../components/OrderItemsList/OrderItemsList";
import Title from "../../components/Title/Title";
import { useCart } from "../../hooks/useCart";
import ChapaButtons from "../../components/PaypalButtons/ChapaButtons";

const OrderDetails = ({ order }) => (
  <div className={classes.orderDetails}>
    <div>
      <strong>Date:</strong> <DateTime date={order.createdAt} />
    </div>
    <div>
      <strong>Name:</strong> {order.name}
    </div>
    <div>
      <strong>Address:</strong> {order.address}
    </div>
    <div>
      <strong>Status:</strong> {order.status}
    </div>
    {order.paymentId && (
      <div>
        <strong>Payment ID:</strong> {order.paymentId}
      </div>
    )}
  </div>
);

export default function OrderTrackPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { clearCart } = useCart();

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError("Order ID is missing.");
        setLoading(false);
        return;
      }

      try {
        const fetchedOrder = await trackOrderById(orderId);
        setOrder(fetchedOrder);
      } catch {
        setError("Failed to fetch order. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handlePaymentResponse = async (response) => {
    try {
      await pay(response.data.payment_id);
      clearCart();
    } catch {
      setError("Payment processing failed. Please try again later.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <NotFound message={error} linkText="Go To Home Page" />;
  if (!order)
    return <NotFound message="Order Not Found" linkText="Go To Home Page" />;

  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <Title
          title={`Order #${order.id}`}
          fontSize="1rem"
          margin="0 0 1rem 0"
        />
        <OrderDetails order={order} />
      </div>
      <OrderItemsList order={order} />
      {order.status === "NEW" && (
        <ChapaButtons order={order} onPaymentResponse={handlePaymentResponse} />
      )}
    </div>
  );
}
