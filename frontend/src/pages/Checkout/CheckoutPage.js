import React, { useState } from "react";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { createOrder } from "../../services/orderService";
import classes from "./checkoutPage.module.css";
import Title from "../../components/Title/Title";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import OrderItemsList from "../../components/OrderItemsList/OrderItemsList";

export default function CheckoutPage() {
  const { cart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState({ ...cart });

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const submit = async (data) => {
    // Check if address is provided
    if (!data.address) {
      toast.warning("Please enter your address.");
      return;
    }

    try {
      await createOrder({ ...order, name: data.name, address: data.address });
      navigate("/payment");
    } catch (error) {
      toast.error("Failed to create order. Please try again.");
      console.error("Order creation error:", error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(submit)} className={classes.container}>
        <div className={classes.content}>
          <Title title="Order Form" fontSize="1.6rem" />
          <div className={classes.inputs}>
            <Input
              defaultValue={user.name}
              label="Your name"
              {...register("name", { required: "Name is required" })}
              error={errors.name}
            />
            <Input
              label="Block, Dorm Number"
              {...register("address", { required: "Address is required" })}
              error={errors.address}
              onChange={(e) => setOrder({ ...order, address: e.target.value })}
            />
          </div>
          <OrderItemsList order={order} />
        </div>

        <div className={classes.buttons_container}>
          <div className={classes.buttons}>
            <Button
              type="submit"
              text="Go To Payment"
              width="100%"
              height="3rem"
            />
          </div>
        </div>
      </form>
    </>
  );
}
