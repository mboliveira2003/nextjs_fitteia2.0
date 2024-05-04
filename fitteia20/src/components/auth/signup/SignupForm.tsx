'use client'

import { FC, ReactElement, useState, useEffect, Fragment } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "@/firebase";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";

import AuthInput from "../AuthInput";
import LoadingCircle from "@/components/visuals/loading/LoadingCircle";

const SignupForm: FC = (): ReactElement => {
  // Function to navigate to a new page
  const router = useRouter();
  // States to store the alerts visibility
  const [alertVisible, setAlertVisible] = useState(false);
  const [passwordMatchAlertVisible, setPasswordMatchAlertVisible] =
    useState(false);
  const [weakPasswordAlertVisible, setWeakPasswordAlertVisible] =
    useState(false);

  useEffect(() => {
    // Wait 2 seconds before hiding the alert
    const timer = setTimeout(() => {
      setAlertVisible(false);
    }, 2000);
    return () => {
      clearTimeout(timer);
    };
  }, [alertVisible]);

  useEffect(() => {
    // Wait 2 seconds before hiding the alert
    const timer = setTimeout(() => {
      setPasswordMatchAlertVisible(false);
    }, 2000);
    return () => {
      clearTimeout(timer);
    };
  }, [passwordMatchAlertVisible]);

  useEffect(() => {
    // Wait 2 seconds before hiding the alert
    const timer = setTimeout(() => {
      setWeakPasswordAlertVisible(false);
    }, 2000);
    return () => {
      clearTimeout(timer);
    };
  }, [weakPasswordAlertVisible]);

  const [loading, setLoading] = useState(false);

  // Function to handle the form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check if the passwords match
    if (
      e.currentTarget.password.value !==
      e.currentTarget["confirm-password"].value
    ) {
      setPasswordMatchAlertVisible(true);
      return;
    }

    // Check if the password is weak
    if (e.currentTarget.password.value.length < 6) {
      setWeakPasswordAlertVisible(true);
      return;
    }

    // Register user in Firebase
    try {
      // Initiate loading animation
      setLoading(true);

      // Firebase SignUp
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        e.currentTarget.email.value,
        e.currentTarget.password.value,
      );

      // Send and email verification
      auth.languageCode = "en";
      sendEmailVerification(userCredential.user);

      // Redirect to the user's fits page
      router.push("/authenticated/my-fits");
      // Stop loading animation
      setLoading(false);
      console.log("Success signing up user in Firebase", userCredential);
    } catch (error) {
      // Stop loading animation and show alert
      setLoading(false);
      setAlertVisible(true);
      console.log("Error creating user in Firebase", error);
      return;
    }
  };

  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
      <form className="relative space-y-4 md:space-y-5" onSubmit={handleSubmit}>
        <div>
          <AuthInput
            label="Email"
            type="email"
            name="email"
            id="email"
            placeholder="name@email.com"
            required
          />
        </div>
        <div>
          <AuthInput
            label="Password"
            type="password"
            name="password"
            id="password"
            placeholder="••••••••"
            required
          />
        </div>
        <div>
          <AuthInput
            label="Confirm password"
            type="password"
            name="confirm-password"
            id="confirm-password"
            placeholder="••••••••"
            required
          />
        </div>

        {/*Submit Button*/}
        <button
          type="submit"
          className="flex w-full justify-center rounded-lg bg-orange-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm transition-all duration-300 ease-in-out hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
        >
          {loading ? (
            <div className="py-1">
              <LoadingCircle />
            </div>
          ) : (
            "Create account"
          )}
        </button>

        {/* Account exists alert */}
        <Transition
          show={alertVisible}
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1 scale-95"
          enterTo="opacity-100 translate-y-0 scale-100"
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="absolute bottom-14 left-0 right-0 mx-auto flex w-fit flex-row items-center justify-center gap-x-4 rounded-md bg-stone-900 bg-opacity-95 px-4 py-2 text-center text-orange-600 shadow-lg backdrop-blur-3xl duration-300 animate-in fade-in slide-in-from-bottom-10">
            <ExclamationTriangleIcon className="-mb-0.5 h-8 w-8 text-orange-600" />
            <div className="flex w-full flex-col items-start justify-center">
              <p className="text-md font-medium">
                This account already exists!
              </p>
              <p className="text-sm text-stone-400">
                Change your email and try again.
              </p>
            </div>
          </div>
        </Transition>

        {/*Password match alert*/}
        <Transition
          show={passwordMatchAlertVisible}
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
              <p className="font-medium text-md">The passwords don't match!</p>
              <p className="text-sm text-stone-400">
                Verify your password and try again.
              </p>
            </div>
          </div>
        </Transition>

        {/*Weak password alert*/}
        <Transition
          show={passwordMatchAlertVisible}
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
              <p className="font-medium text-md">Your password is weak!</p>
              <p className="text-sm text-stone-400">
                Your password must be at least 6 characters long.
              </p>
            </div>
          </div>
        </Transition>

      </form>
    </div>
  );
};

export default SignupForm;
