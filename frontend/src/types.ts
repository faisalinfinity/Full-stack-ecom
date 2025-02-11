export interface Product {
    _id: string;
    name: string;
    price: number;
    stock: number;
    image: string;
  }
  

  
  export interface IOrderProduct {
    product: Product;
    quantity: number;
    price: number;
    _id: string;
  }
  
  export interface IOrder {
    _id: string;
    user: string;
    products: IOrderProduct[];
    totalPrice: number;
    shippingAddress: string;
    paymentStatus: "Pending" | "Paid" | "Failed";
    orderStatus: "Pending" | "Processing" | "Shipped" | "Delivered";
    createdAt: string;
  }
  