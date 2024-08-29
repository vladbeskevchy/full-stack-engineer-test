"use client";
import React, { useEffect, useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import apiServer from "@/app/utils/apiServer";

interface Product {
  id: number;
  title: string;
  category: string;
  description: string;
  price: string;
  image: string;
  amount: number;
}

interface Order {
  _id: string;
  created: string;
  totalPrice: string;
  products: Product[];
}
interface OrdersProps {
  orders: Order[];
}
const OrderHistory = () => {
  const [orderList, setOrderList] = useState<OrdersProps>();

  useEffect(() => {
    const fetchProduct = async () => {
      const orders = await apiServer.get("/api/order");
      setOrderList(orders.data);
    };
    fetchProduct();
  }, []);

  function formatDate(dateString: string) {
    const date = new Date(dateString);

    // Get day, month and year parts from the date object
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }

  return (
    <div className="bg-white">
      <div className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl sm:px-2 lg:px-8">
          <div className="mx-auto max-w-2xl px-4 lg:max-w-4xl lg:px-0">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Order history
            </h1>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="sr-only">Recent orders</h2>
          <div className="mx-auto max-w-7xl sm:px-2 lg:px-8">
            <div className="mx-auto max-w-2xl space-y-8 sm:px-4 lg:max-w-4xl lg:px-0">
              {orderList &&
                //@ts-ignore
                orderList.map((order: Order, index: number) => (
                  <div
                    key={index}
                    className="border-b border-t border-gray-200 bg-white shadow-sm sm:rounded-lg sm:border"
                  >
                    <h3 className="sr-only">
                      Order placed on{" "}
                      <time dateTime={formatDate(order.created)}>
                        {formatDate(order.created)}
                      </time>
                    </h3>

                    <div className="flex items-center border-b border-gray-200 p-4 sm:grid sm:grid-cols-4 sm:gap-x-6 sm:p-6">
                      <dl className="grid flex-1 grid-cols-2 gap-x-6 text-sm sm:col-span-3 sm:grid-cols-3 lg:col-span-2">
                        <div>
                          <dt className="font-medium text-gray-900">
                            Order number
                          </dt>
                          <dd className="mt-1 text-gray-500">
                            {order._id.substring(0, 12)}
                          </dd>
                        </div>
                        <div className="hidden sm:block">
                          <dt className="font-medium text-gray-900">
                            Date placed
                          </dt>
                          <dd className="mt-1 text-gray-500">
                            <time dateTime={formatDate(order.created)}>
                              {formatDate(order.created)}
                            </time>
                          </dd>
                        </div>
                        <div>
                          <dt className="font-medium text-gray-900">
                            Total amount
                          </dt>
                          <dd className="mt-1 font-medium text-gray-900">
                            {order.totalPrice}
                          </dd>
                        </div>
                      </dl>
                    </div>
                    <h4 className="sr-only">Items</h4>
                    <ul role="list" className="divide-y divide-gray-200">
                      {order.products.map((product) => (
                        <li key={product.id} className="p-4 sm:p-6">
                          <div className="flex items-center sm:items-start">
                            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200 sm:h-40 sm:w-40">
                              <img
                                alt={product.title}
                                src={product.image}
                                className="h-full w-full object-cover object-center"
                              />
                            </div>
                            <div className="ml-6 flex-1 text-sm">
                              <div className="font-medium sm:flex sm:justify-between">
                                <h5>{product.title}</h5>
                                <p className="mt-2 text-red-500 sm:mt-0">
                                  {product.price} &nbsp;$
                                </p>
                              </div>
                              <p className="font-bold text-gray-900 sm:mt-2 sm:block">
                                {product.category}
                              </p>
                              <p className="font-bold text-gray-900 sm:mt-2 sm:block">
                                {product.amount}
                              </p>
                              <p className="hidden text-gray-500 sm:mt-2 sm:block">
                                {product.description}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
