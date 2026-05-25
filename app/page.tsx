"use client";

import { useEffect, useState } from "react";

export default function Home() {

  const [products, setProducts] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  async function loadProducts() {

    const res = await fetch(
      "http://localhost:3000/api/products"
    );

    const data = await res.json();

    setProducts(data);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function reserveProduct(
    productId: number,
    warehouseId: number
  ) {

    const res = await fetch(
      "http://localhost:3000/api/reservations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          warehouseId,
          quantity: 1,
        }),
      }
    );

    const data = await res.json();

    if (data.id) {

      setMessage(
        `Reservation Confirmed Successfully ✅`
      );

      await fetch(
        `http://localhost:3000/api/reservations/${data.id}/confirm`,
        {
          method: "POST",
        }
      );

      loadProducts();

    } else {

      setMessage("Reservation Failed ❌");

    }
  }

  return (

    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        padding: "40px",
        fontFamily: "Arial",
        color: "white",
      }}
    >

      <h1
        style={{
          textAlign: "center",
          fontSize: "42px",
          marginBottom: "10px",
        }}
      >
        Allo Inventory System
      </h1>

      <p
        style={{
          textAlign: "center",
          marginBottom: "40px",
          color: "#94a3b8",
        }}
      >
        Inventory Reservation Management
      </p>

      {message && (

        <div
          style={{
            background: "#16a34a",
            padding: "15px",
            borderRadius: "10px",
            marginBottom: "30px",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {message}
        </div>

      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "25px",
        }}
      >

        {products.map((item) => (

          <div
            key={item.id}
            style={{
              background: "#1e293b",
              padding: "25px",
              borderRadius: "16px",
              boxShadow:
                "0px 4px 20px rgba(0,0,0,0.3)",
            }}
          >

            <h2
              style={{
                fontSize: "28px",
                marginBottom: "15px",
              }}
            >
              {item.product.name}
            </h2>

            <p>
              <strong>Warehouse:</strong>
              {" "}
              {item.warehouse.name}
            </p>

            <p>
              <strong>Total Stock:</strong>
              {" "}
              {item.totalStock}
            </p>

            <p>
              <strong>Reserved Stock:</strong>
              {" "}
              {item.reservedStock}
            </p>

            <button
              onClick={() =>
                reserveProduct(
                  item.productId,
                  item.warehouseId
                )
              }
              style={{
                marginTop: "20px",
                width: "100%",
                padding: "14px",
                background: "#2563eb",
                border: "none",
                borderRadius: "10px",
                color: "white",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Reserve Product
            </button>

          </div>

        ))}

      </div>

    </div>
  );
}