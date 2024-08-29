"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of your context's data
interface Product {
  id: number;
  title: string;
  price: number;
  description?: string;
  category?: string;
  image: string;
  amount?: number;
}

interface ProductContextProps {
  product: Product | null;
  setProduct: (product: Product) => void;
  searchedProductList: Product[];
  setSearchedProductList: (products: Product[]) => void;
  orderedProductList: Product[];
  setOrderedProductList: (products: Product[]) => void;
}

// Create context with default values
const ProductContext = createContext<ProductContextProps | undefined>(
  undefined
);

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProductContext must be used within a ProductProvider");
  }
  return context;
};

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [searchedProductList, setSearchedProductList] = useState<Product[]>([]);
  const [orderedProductList, setOrderedProductList] = useState<Product[]>([]);

  return (
    <ProductContext.Provider
      value={{
        product,
        setProduct,
        searchedProductList,
        setSearchedProductList,
        orderedProductList,
        setOrderedProductList,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
