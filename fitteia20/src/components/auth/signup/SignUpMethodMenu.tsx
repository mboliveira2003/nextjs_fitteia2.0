'use client'

import { useState, Fragment, useEffect } from "react";
import Link from "next/link";
import { sendEmailVerification, signInWithPopup } from "firebase/auth";
import { auth, googleAuthProvider } from "@/firebase";
import { Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

import LoadingCircle from "@/components/visuals/loading/LoadingCircle";

const SignUpMethodMenu = () => {
  // Function to redirect to a new page
  const router = useRouter();
  // Loading state
  const [loading, setLoading] = useState<boolean>(false);
  // State to store the login error
  const [loginError, setLoginError] = useState<boolean>(false);

  // After 3 seconds, hide the alert
  useEffect(() => {
    setTimeout(() => {
      setLoginError(false);
    }, 3000);
  }, [loginError]);

  // Function to handle sign in with Google
  const handleGoogleSignIn = async () => {
    try {
      // Initiate loading animations
      setLoading(true);

      // Sign in with Google
      const response = await signInWithPopup(auth, googleAuthProvider);

      // Set the language code for the email verification
      auth.languageCode = "en";
      sendEmailVerification(response.user);

      // Redirect to the user's fits page
      router.push("/authenticated/my-fits");

      // Stop loading animations
      setLoading(false);
      console.log("Success signing in user in Firebase", response);
    } catch (error) {
      // Stop loading animations and show alert
      setLoading(false);
      setLoginError(true);
      console.log("Error creating user in Firebase", error);
      return;
    }
  };

  return (
    <div className="relative flex flex-col gap-y-6 sm:mx-auto sm:w-full sm:max-w-sm">
      <Link href="/signup/email">
        <button className="flex w-full justify-center rounded-lg bg-orange-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 transition-all duration-300 ease-in-out">
          <div className="flex flex-row items-center justify-center gap-x-1">
            Sign Up with Email
          </div>
        </button>
      </Link>
      <button
        onClick={handleGoogleSignIn}
        className="flex w-full justify-center rounded-lg bg-orange-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 transition-all duration-300 ease-in-out"
      >
        {loading ? (
          <div className="py-1">
            <LoadingCircle />
          </div>
        ) : (
          <div className="flex flex-row items-center justify-center gap-x-1">
            <img src="/icons8-google.svg" className="h-6 w-6"></img>Sign Up with Google
          </div>
        )}
      </button>

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
        <div className="absolute bottom-14 left-0 right-0 mx-auto flex w-fit flex-row items-center justify-center gap-x-4 rounded-md bg-stone-900 bg-opacity-95 px-4 py-2 text-center text-orange-600 shadow-lg backdrop-blur-3xl duration-300 animate-in fade-in slide-in-from-bottom-10">
          <ExclamationTriangleIcon className="h-8 w-8 text-orange-600 -mb-0.5" />
          <div className="w-full flex flex-col items-start justify-center">
            <p className="font-medium text-md">Error signing up with Google!</p>
            <p className="text-sm text-stone-400">
              Try again later or sign up with email.
            </p>
          </div>
        </div>
      </Transition>
    </div>
  );
};

export default SignUpMethodMenu;
