"use client";
import { useRouter } from "next/navigation";
import { useProductContext } from "@/context/ProductContext";
function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}
export default function ProductDetail() {
  const { product, setOrderedProductList } = useProductContext();
  const router = useRouter();
  const handleAddCart =
    (item: {
      id: number;
      title: string;
      price: number;
      description?: string;
      category?: string;
      image: string;
      amount?: number;
    }) =>
    () => {
      //@ts-ignore
      setOrderedProductList((prevList) => {
        const existingItemIndex = prevList.findIndex(
          //@ts-ignore
          (product) => product.id === item.id
        );
        if (existingItemIndex !== -1) {
          const updatedList = [...prevList];
          updatedList[existingItemIndex] = {
            ...updatedList[existingItemIndex],
            amount: updatedList[existingItemIndex].amount + 1,
          };
          router.push("/order");
          return updatedList;
        } else {
          router.push("/order");
          return [...prevList, { ...item, amount: 1 }];
        }
      });
    };
  return (
    <div className="bg-white">
      <div className="pb-16 pt-6 sm:pb-24">
        <div className="mx-auto mt-8 max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="lg:grid lg:auto-rows-min lg:grid-cols-12 lg:gap-x-8">
            <div className="lg:col-span-5 lg:col-start-8">
              <div className="flex justify-between">
                <h1 className="text-xl font-medium text-gray-900">
                  {product?.title}
                </h1>
              </div>
            </div>
            <div className="mt-8 lg:col-span-7 lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:mt-0">
              <h2 className="sr-only">Images</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-3 lg:gap-8 max-w-[400px]">
                <img
                  alt="Back of women's Basic Tee in black"
                  src={product?.image}
                  className={classNames("lg:col-span-2 lg:row-span-2 ")}
                />
              </div>
            </div>
            <div className="lg:col-span-5">
              <p className="mt-4 text-xl font-medium text-gray-400">
                {product?.category}
              </p>
              <p className="mt-4 text-xl font-bold text-red-600">
                {product?.price}&nbsp; $
              </p>

              <div className="mt-4">
                <h2 className="mb-4 text-lg font-bold text-gray-900">
                  Description
                </h2>
                <p>{product?.description}</p>
              </div>
              <button
                className="bg-[#ef233c] border-[2px] border-[#ef233c] text-white font-bold w-full rounded-[50px] text-[12px] px-4 py-2 my-2 hover:bg-white hover:text-[#c90f25] hover:border-[#c90f25]"
                //@ts-ignore
                onClick={handleAddCart(product)}
              >
                ADD TO CART
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
