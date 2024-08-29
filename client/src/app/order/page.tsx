"use client";
import { PencilIcon, XMarkIcon, CheckIcon } from "@heroicons/react/20/solid";
import { useProductContext } from "@/context/ProductContext";
import { useState, useEffect } from "react";
import apiServer from "@/app/utils/apiServer";
import auth from "@/app/utils/auth-help";
import PlusAmount from "@/app/components/PlusAmount";
import { useRouter } from "next/navigation";
interface User {
  _id: string;
  email: string;
}
interface Jwt {
  _id: string;
  token: string;
  user: User;
}
interface ProductProps {
  id: number;
  title: string;
  price: number;
  description?: string;
  category?: string;
  image: string;
  amount?: number;
}

const Order = () => {
  const { orderedProductList, setOrderedProductList } = useProductContext();
  const [price, setPrice] = useState<number>(0);
  const [userData, setUserData] = useState<Jwt | false | undefined>(undefined);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const router = useRouter();

  useEffect(() => {
    const result = auth.isAuthenticated();
    if (result && result.token && result.user) {
      // Ensure result is of type Jwt
      const jwt = result as Jwt;
      setUserData(jwt);
    } else {
      setUserData(false);
    }
  }, []);

  useEffect(() => {
    const calculateTotalPrice = (): number =>
      orderedProductList.reduce((total: number, item: ProductProps) => {
        const itemAmount = item.amount ?? 1;
        return total + item.price * itemAmount;
      }, 0);

    setPrice(calculateTotalPrice);
  }, [orderedProductList]);

  const handlePurchase = async () => {
    const result = auth.isAuthenticated();
    if (!(result && result.token && result.user)) {
      router.push("/signin");
    } else {
      if (orderedProductList && userData && typeof userData !== "boolean") {
        await apiServer.post("/api/order", {
          products: orderedProductList,
          userId: userData.user._id,
          totalPrice: price,
        });
        router.push("/orderhistory");
      }
    }
  };

  const handleRemove = (id: number) => {
    //@ts-ignore
    setOrderedProductList((prevList) =>
      //@ts-ignore
      prevList.filter((product) => product.id !== id)
    );
  };

  const handleEdit = (id: number) => {
    setSelectedProduct(id);
  };

  const handleUpdate = (id: number) => {
    //@ts-ignore
    setOrderedProductList((prevList) =>
      //@ts-ignore
      prevList.map((item) =>
        item.id === id ? { ...item, amount: quantity } : item
      )
    );
    resetSelection();
  };

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
  };

  const resetSelection = () => {
    setQuantity(1);
    setSelectedProduct(null);
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Shopping Cart
        </h1>
        <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <h2 id="cart-heading" className="sr-only">
              Items in your shopping cart
            </h2>
            <ul
              role="list"
              className="divide-y divide-gray-200 border-b border-t border-gray-200"
            >
              {orderedProductList?.map((product, index) => (
                <li key={product.id} className="flex py-6 sm:py-10">
                  <div className="flex-shrink-0">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="h-24 w-24 rounded-md object-cover object-center sm:h-48 sm:w-48"
                    />
                  </div>
                  <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                    <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                      <div>
                        <div className="flex justify-between">
                          <h3 className="text-sm">
                            <a
                              href={`/products/${product.id}`}
                              className="font-medium text-gray-700 hover:text-gray-800"
                            >
                              {product.title}
                            </a>
                          </h3>
                        </div>
                        <p className="text-xl font-medium text-red-600">
                          {product.price}&nbsp; $
                        </p>
                        {selectedProduct === product.id ? (
                          <PlusAmount
                            initialQuantity={product.amount}
                            onQuantityChange={handleQuantityChange}
                          />
                        ) : (
                          <p className="text-xl font-bold text-gray-600">
                            {product.amount}
                          </p>
                        )}
                      </div>
                      <div className="mt-4 sm:mt-0 sm:pr-9">
                        <label
                          htmlFor={`quantity-${index}`}
                          className="sr-only"
                        >
                          {product.title}
                        </label>
                        <div className="absolute right-0 top-0">
                          {selectedProduct === product.id ? (
                            <button
                              className="mx-2 inline-flex p-2 text-gray-400 hover:text-gray-500"
                              onClick={() => handleUpdate(product.id)}
                            >
                              <span className="sr-only">Confirm</span>
                              <CheckIcon
                                aria-hidden="true"
                                className="h-5 w-5"
                              />
                            </button>
                          ) : (
                            <button
                              className="mx-2 inline-flex p-2 text-gray-400 hover:text-gray-500"
                              onClick={() => handleEdit(product.id)}
                            >
                              <span className="sr-only">Edit</span>
                              <PencilIcon
                                aria-hidden="true"
                                className="h-5 w-5"
                              />
                            </button>
                          )}
                          <button
                            className="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500"
                            onClick={() => handleRemove(product.id)}
                          >
                            <span className="sr-only">Remove</span>
                            <XMarkIcon aria-hidden="true" className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
          <section
            aria-labelledby="summary-heading"
            className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
          >
            <h2
              id="summary-heading"
              className="text-lg font-medium text-gray-900"
            >
              Order summary
            </h2>
            <dl className="mt-6 space-y-4">
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="text-base font-medium text-gray-900">
                  Order total
                </dt>
                <dd className="text-base font-medium text-gray-900">
                  {price.toFixed(2)}
                </dd>
              </div>
            </dl>
            <div className="mt-6">
              <button
                className="bg-[#ef233c] border-[2px] border-[#ef233c] text-white font-bold w-full rounded-[50px] text-[12px] px-4 py-2 my-2 hover:bg-white hover:text-[#c90f25] hover:border-[#c90f25]"
                onClick={handlePurchase}
              >
                Checkout
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Order;
