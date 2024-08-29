"use client";

import React, { useState } from "react";
import apiServer from "@/app/utils/apiServer";
import auth from "@/app/utils/auth-help";
import { useRouter } from "next/navigation";

interface User {
  email?: string;
  password?: string;
}

export default function Index() {
  const [userData, setUserData] = useState<User>({});
  const [emailError, setEmailError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "email") {
      validateEmail(value);
    }
    setUserData({ ...userData, [name]: value });
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError(null);
    }
  };

  const handleSubmit = async () => {
    if (!emailError && userData.password !== "") {
      try {
        const result = await apiServer.post("/auth/signin", {
          email: userData.email,
          password: userData.password,
        });

        if (result.status === 200) {
          auth.authenticate(result.data, () => {
            router.push("/");
          });
        } else {
          console.error("Login failed:", result.data.message);
        }
      } catch (error) {
        console.error("An error occurred while login:", error);
      }
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[680px]">
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <form className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className={`block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ${
                      emailError ? "ring-red-500" : "ring-gray-300"
                    } placeholder:text-gray-400 focus:ring-2 focus:ring-inset ${
                      emailError
                        ? "focus:ring-red-600"
                        : "focus:ring-indigo-600"
                    } sm:text-sm sm:leading-6`}
                    onChange={handleChange}
                  />
                  {emailError && (
                    <p className="mt-2 text-sm text-red-600">{emailError}</p>
                  )}
                </div>
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <button
                  type="button"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  onClick={handleSubmit}
                >
                  Sign in
                </button>
              </div>
            </form>
          </div>
          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{" "}
            <a
              href="signup"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Go to Register Page
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
