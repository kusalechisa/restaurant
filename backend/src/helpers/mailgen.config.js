// mailgen.config.js
import Mailgen from "mailgen";

const mailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "Keti Restaurant",
    link: "https://foodmine.com",
  },
});

export function generateEmail(order) {
  const email = {
    body: {
      name: order.name,
      intro:
        "Your order has been successfully paid and is now being processed.",
      table: {
        data: order.items.map((item) => ({
          item: item.food.name,
          "Unit Price": `$${item.food.price}`,
          Quantity: item.quantity,
          "Total Price": `$${item.price.toFixed(2)}`,
        })),
        columns: [
          { header: "Item", key: "item" },
          { header: "Unit Price", key: "Unit Price" },
          { header: "Quantity", key: "Quantity" },
          { header: "Total Price", key: "Total Price" },
        ],
      },
      outro: `Total Price: $${order.totalPrice}\nShipping Address: ${order.address}`,
    },
  };

  return mailGenerator.generate(email);
}
