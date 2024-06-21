"use client";

import { FC, ReactElement, useState, useEffect, Fragment } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "@/firebase";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

import AuthInput from "@/components/auth/AuthInput";
import LoadingCircle from "@/components/visuals/loading/LoadingCircle";
import AuthAlert from "@/components/auth/AuthAlert";

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
        e.currentTarget.password.value
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
          className="flex w-full justify-center rounded-lg bg-orange-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm transition-all duration-200 ease-in-out hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
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
        <AuthAlert
          alertVisible={alertVisible}
          icon={<ExclamationTriangleIcon className="w-10 h-10 mt-1" />}
          title="This account already exists!"
          message="Change your email and try again."
        />

        {/*Password match alert*/}
        <AuthAlert
          alertVisible={passwordMatchAlertVisible}
          icon={<ExclamationTriangleIcon className="w-10 h-10 mt-1"/>}
          title="The passwords don't match!"
          message="Verify your password and try again."
        />

        {/*Weak password alert*/}
        <AuthAlert
          alertVisible={weakPasswordAlertVisible}
          icon={<ExclamationTriangleIcon className="w-10 h-10 mt-1" />}
          title="Your password is weak!"
          message="Your password must be at least 6 characters long."
        />
      </form>
    </div>
  );
};

export default SignupForm;
