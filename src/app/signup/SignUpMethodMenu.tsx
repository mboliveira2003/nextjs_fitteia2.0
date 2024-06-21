"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { sendEmailVerification, signInWithPopup } from "firebase/auth";
import { auth, googleAuthProvider } from "@/firebase";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

import LoadingCircle from "@/components/visuals/loading/LoadingCircle";
import AuthAlert from "@/components/auth/AuthAlert";

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
        <button className="flex w-full justify-center rounded-lg bg-orange-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 transition-all duration-200 ease-in-out">
          <div className="flex flex-row items-center justify-center gap-x-1">
            Sign Up with Email
          </div>
        </button>
      </Link>

      <button
        onClick={handleGoogleSignIn}
        className="flex w-full justify-center rounded-lg bg-orange-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 transition-all duration-200 ease-in-out"
      >
        {loading ? (
          <div className="py-1">
            <LoadingCircle />
          </div>
        ) : (
          <div className="flex flex-row items-center justify-center gap-x-1">
            <img src="/icons8-google.svg" className="h-6 w-6"></img>Sign Up with
            Google
          </div>
        )}
      </button>

      <AuthAlert
        alertVisible={loginError}
        icon={<ExclamationTriangleIcon className="w-10 h-10 mt-1" />}
        title="Error signing up with Google!"
        message="Try again later or sign up with email."
      />
    </div>
  );
};

export default SignUpMethodMenu;
