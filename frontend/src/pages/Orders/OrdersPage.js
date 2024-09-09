import React, { useEffect, useReducer, useCallback, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getAll, getAllStatus } from "../../services/orderService";
import classes from "./ordersPage.module.css";
import Title from "../../components/Title/Title";
import DateTime from "../../components/DateTime/DateTime";
import Price from "../../components/Price/Price";
import NotFound from "../../components/NotFound/NotFound";

const initialState = {
  allStatus: [],
  orders: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case "ALL_STATUS_FETCHED":
      return { ...state, allStatus: action.payload };
    case "ORDERS_FETCHED":
      return { ...state, orders: action.payload };
    default:
      return state;
  }
};

const OrderStatusLinks = ({ allStatus, filter }) => (
  <div className={classes.all_status}>
    <Link to="/orders" className={!filter ? classes.selected : ""}>
      All
    </Link>
    {allStatus.map((state) => (
      <Link
        key={state}
        className={state === filter ? classes.selected : ""}
        to={`/orders/${state}`}
      >
        {state}
      </Link>
    ))}
  </div>
);

const OrderSummary = ({ order, index }) => (
  <div key={order.id} className={classes.order_summary}>
    <div className={classes.header}>
      <span>Order #{index}</span>
      <span>
        <DateTime date={order.createdAt} />
      </span>
      <span>{order.status}</span>
    </div>
    <div className={classes.items}>
      {order.items.map((item) => (
        <Link key={item.food.id} to={`/food/${item.food.id}`}>
          <img src={item.food.imageUrl} alt={item.food.name} />
        </Link>
      ))}
    </div>
    <div className={classes.footer}>
      <div>
        <Link to={`/track/${order.id}`}>Show Order</Link>
      </div>
      <div>
        <span className={classes.price}>
          <Price price={order.totalPrice} />
        </span>
      </div>
    </div>
  </div>
);

export default function OrdersPage() {
  const [{ allStatus, orders }, dispatch] = useReducer(reducer, initialState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { filter } = useParams();

  const fetchData = useCallback(async () => {
    try {
      const status = await getAllStatus();
      dispatch({ type: "ALL_STATUS_FETCHED", payload: status });

      const fetchedOrders = await getAll(filter);
      dispatch({ type: "ORDERS_FETCHED", payload: fetchedOrders });
    } catch {
      setError("Failed to fetch orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <div>Loading...</div>;
  if (error) return <NotFound message={error} linkText="Go To Home Page" />;

  // Sort orders by creation date in descending order
  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className={classes.container}>
      <Title title="Orders" margin="1.5rem 0 0 .2rem" fontSize="1.9rem" />

      {allStatus.length > 0 && (
        <OrderStatusLinks allStatus={allStatus} filter={filter} />
      )}

      {sortedOrders.length === 0 ? (
        <NotFound
          linkRoute={filter ? "/orders" : "/"}
          linkText={filter ? "Show All" : "Go To Home Page"}
        />
      ) : (
        sortedOrders.map((order, index) => (
          <OrderSummary
            key={order.id}
            order={order}
            index={sortedOrders.length - index}
          />
        ))
      )}
    </div>
  );
}
