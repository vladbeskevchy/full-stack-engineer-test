import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProductContext } from "@/context/ProductContext";
interface ProductProps {
  id: number;
  title: string;
  price: number;
  description?: string;
  category?: string;
  image: string;
  amount?: number;
}

const ProductCard: React.FC<ProductProps> = ({
  id,
  title,
  price,
  description,
  category,
  image,
}) => {
  const { setProduct, setOrderedProductList } = useProductContext();
  const router = useRouter();

  const handleViewDetail =
    (item: {
      id: number;
      title: string;
      price: number;
      description?: string;
      category?: string;
      image: string;
    }) =>
    () => {
      setProduct(item);
      router.push(`/product/${item.id}`);
    };
  const handleAddCart = (item: ProductProps) => () => {
    //@ts-ignore
    setOrderedProductList((prevList) => {
      const existingItemIndex = prevList.findIndex(
        (product: ProductProps) => product.id === item.id
      );
      if (existingItemIndex !== -1) {
        const updatedList = [...prevList];
        updatedList[existingItemIndex] = {
          ...updatedList[existingItemIndex],
          amount: (updatedList[existingItemIndex].amount || 0) + 1,
        };
        return updatedList;
      } else {
        return [...prevList, { ...item, amount: 1 }];
      }
    });
    router.push("/order");
  };

  return (
    <div className="flex flex-col justify-center items-center border-[2px] border-gray-300 w-[240px] ">
      <img
        alt={title}
        src={image}
        className="group-hover:opacity-75 h-[200px]"
      />
      <p>{title.substring(0, 10)}...</p>
      <p className="text-gray-500">{category}</p>
      <p className="text-[#c90f25] font-bold">${price}</p>
      <div className="flex flex-col w-full h-full justify-center items-center bg-gray-800">
        <button
          className="bg-[#ef233c] border-[2px] border-[#ef233c] text-white font-bold w-fit rounded-[50px] text-[12px] px-4 py-2 my-2 hover:bg-white hover:text-[#c90f25] hover:border-[#c90f25]"
          onClick={handleAddCart({
            id,
            title,
            price,
            description,
            category,
            image,
          })}
        >
          ADD TO CART
        </button>
        <button
          className="bg-[#ef233c] border-[2px] border-[#ef233c] text-white font-bold w-fit rounded-[50px] text-[12px] px-4 py-2 my-2 hover:bg-white hover:text-[#c90f25] hover:border-[#c90f25]"
          onClick={handleViewDetail({
            id,
            title,
            price,
            description,
            category,
            image,
          })}
        >
          VIEW DETAIL
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
