"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { useProductContext } from "@/context/ProductContext";
import { useRouter } from "next/navigation";
import {
  Bars3Icon,
  XMarkIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import auth from "@/app/utils/auth-help";

interface User {
  _id: string;
  email: string;
}
interface Jwt {
  token: string;
  user: User;
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userData, setUserData] = useState<Jwt | false | undefined>(undefined);
  const { orderedProductList } = useProductContext();
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

  const handleClickCart = () => {
    router.push("/order");
  };

  const handleClick = () => {
    router.push("/");
  };

  return (
    <header className="bg-white">
      <nav
        aria-label="Global"
        className="flex items-center justify-between p-4 lg:px-20"
      >
        <div className="flex lg:flex-1">
          <button
            onClick={handleClick}
            className="-m-1.5 p-1.5 focus:outline-none"
          >
            <span className="">
              E-<span className="text-[#ff0097] font-bold">Commerce</span>
            </span>
          </button>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="h-6 w-6" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          <button
            onClick={handleClick}
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Product
          </button>
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <button
            className="group -m-2 flex items-center p-2"
            onClick={handleClickCart}
          >
            <ShoppingBagIcon
              aria-hidden="true"
              className=" h-6 w-6 flex-shrink-0 text-red-600 group-hover:text-red-600"
            />
            <span className="-ml-[5px] -mt-[20px] text-sm font-bold text-red-600">
              {orderedProductList?.length}
            </span>
            <span className="sr-only">items in cart, view bag</span>
          </button>
          {userData ? (
            <a
              href="/orderhistory"
              className="mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
            >
              {userData.user.email}
            </a>
          ) : (
            <a
              href="/signin"
              className="mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
            >
              Log in
            </a>
          )}
        </div>
      </nav>
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <button onClick={handleClick} className="-m-1.5 p-1.5">
              <span className="">
                E-<span className="text-[#ff0097] font-bold">Commerce</span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <button
                  onClick={handleClick}
                  className="text-sm font-semibold leading-6 text-gray-900"
                >
                  Product
                </button>
              </div>
              <div className="py-6">
                <a href="/order" className="group -m-2 flex items-center p-2">
                  <ShoppingBagIcon
                    aria-hidden="true"
                    className="h-6 w-6 flex-shrink-0 text-red-400 group-hover:text-red-500"
                  />
                  <span className="-ml-[5px] -mt-[20px] text-sm font-bold text-red-600">
                    {orderedProductList?.length}
                  </span>
                  <span className="sr-only">items in cart, view bag</span>
                </a>
                {userData ? (
                  <a
                    href="/orderhistory"
                    className="mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    {userData.user.email}
                  </a>
                ) : (
                  <a
                    href="/signin"
                    className="mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Log in
                  </a>
                )}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
