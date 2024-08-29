"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "@/app/components/ProductCard";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

const searchProducts = (products: Product[], searchTerm: string): Product[] => {
  const regex = new RegExp(`^${searchTerm}`, "i");
  return products.filter(
    (product) =>
      regex.test(product.title) ||
      regex.test(product.description) ||
      regex.test(product.category)
  );
};

const Index = () => {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchKey, setSearchKey] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get<Product[]>(
          "https://fakestoreapi.com/products"
        );
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    if (!products) fetchProduct();
  }, [products]);

  useEffect(() => {
    if (products) {
      const results = searchProducts(products, searchKey);
      setFilteredProducts(results);
    }
  }, [searchKey, products]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //@ts-ignore
    if (e.target.value == "") return setFilteredProducts(products);
    setSearchKey(e.target.value);
  };

  if (!products) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <img src="loading.gif" width={75} height={75} />
      </div>
    );
  }

  return (
    <>
      <div className="my-4 ">
        <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 border border-gray-500 rounded-[6px] p-4 w-full">
          <div className="relative flex">
            <label htmlFor="search-field" className="sr-only">
              Search
            </label>
            <MagnifyingGlassIcon
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 h-full w-[24px]"
            />
            <input
              id="search-field"
              name="search"
              type="search"
              placeholder="Search..."
              className="block h-full w-full  text-[14px] border-0 py-0 pl-8 pr-0 placeholder:focus:ring-0 sm:text-sm bg-transparent  focus:outline-none focus:ring-0"
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
      <ul
        role="list"
        className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
      >
        {filteredProducts &&
          filteredProducts.map((item) => (
            <li key={item.id}>
              <ProductCard
                id={item.id}
                title={item.title}
                description={item.description}
                category={item.category}
                image={item.image}
                price={item.price}
              />
            </li>
          ))}
      </ul>
    </>
  );
};

export default Index;
