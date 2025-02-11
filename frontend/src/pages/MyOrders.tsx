"use client";

import type React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import type { IOrder } from "@/types";
import { OrderItem } from "@/components/OrderItem";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { BASE_URL } from "@/config/baseurl";

export const MyOrders: React.FC = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get<{ orders: IOrder[] }>(
          BASE_URL+"/api/orders",
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );
        setOrders(response.data.orders);
        setError(null);
      } catch (err) {
        setError("Failed to fetch orders. Please try again later.");
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.token) {
      fetchOrders();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container  mx-auto px-4 py-8 text-center">
        <p className="text-red-500">{error}</p>
        <Button
          className="mt-4 bg-purple-600 hover:bg-purple-700"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        <div>
          {orders?.map((order) => (
            <OrderItem key={order._id} order={order} />
          ))}
        </div>
      )}
     
    </div>
  );
};
