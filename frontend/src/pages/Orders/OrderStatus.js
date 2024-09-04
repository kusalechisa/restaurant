// import React, { useState } from "react";
// import axios from "axios";

// const PayOrder = () => {
//   const [paymentId, setPaymentId] = useState("");
//   const [status, setStatus] = useState("");
//   const [error, setError] = useState("");

//   const handlePayment = async () => {
//     try {
//       const response = await axios.put("/api/payment/pay", { paymentId });

//       if (response.data) {
//         setStatus("Order has been updated to PAID.");
//       }
//     } catch (err) {
//       setError("Failed to update order: " + err.message);
//     }
//   };

//   return (
//     <div>
//       <h1>Pay for Order</h1>
//       <input
//         type="text"
//         placeholder="Payment ID"
//         value={paymentId}
//         onChange={(e) => setPaymentId(e.target.value)}
//       />
//       <button onClick={handlePayment}>Pay Now</button>
//       {status && <p>{status}</p>}
//       {error && <p style={{ color: "red" }}>{error}</p>}
//     </div>
//   );
// };

// export default PayOrder;
