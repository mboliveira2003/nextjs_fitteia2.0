"use client";

import { FC, ReactElement, useEffect, useState, Fragment } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleAuthProvider } from "@/firebase";
import { Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";

import AuthInput from "../AuthInput";
import LoadingCircle from "@/components/visuals/loading/LoadingCircle";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const LoginForm: FC = (): ReactElement => {
  // Function to redirect to a new page
  const router = useRouter();
  // useState for login error
  const [loginError, setLoginError] = useState<boolean>(false);
  // useState for loading
  const [loadingEmail, setLoadingEmail] = useState<boolean>(false);
  const [loadingGoogle, setLoadingGoogle] = useState<boolean>(false);

  // Function to handle sign in with Google
  const handleGoogleSignIn = async () => {
    try {
      // Initiate loading animation
      setLoadingGoogle(true);

      // Firebase Google SignIn
      const response = await signInWithPopup(auth, googleAuthProvider);

      // Redirect to the user's fits page
      router.push("/authenticated/my-fits");

      // Stop loading animation
      setLoadingGoogle(false);
      console.log("Success signing in user in Firebase", response);
    } catch (error) {
      // Stop loading animation and set show error message
      setLoadingGoogle(false);
      setLoginError(true);
      console.log("Error creating user in Firebase", error);
      return;
    }
  };

  // Function to handle the form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Initialize loading animation
      setLoadingEmail(true);

      // Firebase Email and Password SignIn
      const responseFirebase = await signInWithEmailAndPassword(
        auth,
        e.currentTarget.email.value,
        e.currentTarget.password.value
      );

      // Redirect to the user's fits page
      router.push("/authenticated/my-fits");

      // Stop loading animation
      setLoadingEmail(false);
      console.log("Success signing in user in Firebase", responseFirebase);
    } catch (error) {
      // Stop loading animation and show error message
      setLoadingEmail(false);
      setLoginError(true);
      console.log("Error creating user in Firebase", error);
      return;
    }
  };

  // After 2 seconds, remove the error message
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoginError(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [loginError]);

  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
      <form
        className="relative space-y-6"
        onSubmit={handleSubmit}
        method="POST"
      >
        {/**Email Input*/}
        <div>
          <AuthInput
            label="Email"
            type="email"
            name="email"
            id="email"
            placeholder="name@email.com"
            autoComplete="email"
            required
          />
        </div>

        {/**Password Input*/}
        <div>
          <AuthInput
            label="Password"
            type="password"
            name="password"
            id="password"
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />
          <div className="mt-2 flex justify-end text-sm">
            <Link
              href="/recover-password"
              className="cursor-pointer text-stone-500 transition-all duration-300 ease-in-out hover:text-stone-400"
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        {/**Alert message for login error*/}
        <Transition
          show={loginError}
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1 scale-95"
          enterTo="opacity-100 translate-y-0 scale-100"
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="absolute bottom-32 left-0 right-0 mx-auto flex w-fit flex-row items-center justify-center gap-x-4 rounded-md bg-stone-900 bg-opacity-95 px-4 py-2 text-center text-orange-600 shadow-lg backdrop-blur-3xl duration-300 animate-in fade-in slide-in-from-bottom-10">
            <ExclamationTriangleIcon className="h-8 w-8 text-orange-600 -mb-0.5" />
            <div className="w-full flex flex-col items-start justify-center">
              <p className="font-medium text-md">
                Invalid authentication data!
              </p>
              <p className="text-sm text-stone-400">
                Verify your email and password and try again.
              </p>
            </div>
          </div>
        </Transition>

        {/**Login Button*/}
        <div className="flex flex-col items-center gap-y-2">
          <button
            type="submit"
            className="tramsition-all flex w-full justify-center rounded-lg bg-orange-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm duration-300 ease-in-out hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
          >
            {/**Fetching response from firebase*/}
            {loadingEmail ? (
              <div className="py-1 ">
                <LoadingCircle />
              </div>
            ) : (
              "Sign In"
            )}
          </button>

          <div className="flex w-full flex-row items-center gap-x-4">
            <div className="mt-0.5 h-[0.07rem] w-full rounded-lg bg-stone-400 opacity-60" />
            <p className="w-fit text-center text-sm font-semibold text-white">
              or
            </p>
            <div className="mt-0.5 h-[0.07rem] w-full rounded-lg bg-stone-400 opacity-60" />
          </div>

          <button
            onClick={() => handleGoogleSignIn()}
            type="button"
            className="duartion-300 flex w-full justify-center rounded-lg bg-orange-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm transition-all ease-in-out hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
          >
            {loadingGoogle ? (
              <div className="py-1">
                <LoadingCircle />
              </div>
            ) : (
              <div className="flex flex-row items-center justify-center gap-x-1">
                <img src="/icons8-google.svg" className="h-6 w-6"></img>Sign In
                with Google
              </div>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
