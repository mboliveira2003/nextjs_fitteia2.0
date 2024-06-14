"use client";

import { FC, ReactElement, useEffect, useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebase";

import AuthInput from "../../components/auth/AuthInput";
import LoadingCircle from "@/components/visuals/loading/LoadingCircle";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import AuthAlert from "@/components/auth/AuthAlert";

const PasswordRecoverForm: FC = (): ReactElement => {
  // State to control the email sent status
  const [emailSent, setEmailSent] = useState<boolean | null>(null);
  // State to control the loading status of the email response
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setEmailSent(null);
    }, 2000);
    return () => clearTimeout(timer);
  }, [emailSent]);

  // Function to handle the form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Set the email language to portuguese
      auth.languageCode = "en";
      setLoading(true);
      const response = await sendPasswordResetEmail(
        auth,
        e.currentTarget.email.value
      );
      setLoading(false);
      setEmailSent(true);
      console.log("Password reset email sent successfully!", response);
    } catch (error) {
      setLoading(false);
      setEmailSent(false);
      console.log("Error sending password reset email!", error);
      return;
    }
  };

  return (
    <div className=" sm:mx-auto sm:w-full sm:max-w-sm">
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

        {/**Email sent sucessfully alert*/}
        <AuthAlert
          alertVisible={emailSent === true}
          icon={<CheckCircleIcon className="w-10 h-10 mt-1" />}
          title="Recovery email sent sucessfully!"
          message="Check your inbox and follow the instructions."
        />

        {/**Email not sent alert*/}
        <AuthAlert
          alertVisible={emailSent === false}
          icon={<ExclamationTriangleIcon className="w-10 h-10 mt-1"/>}
          title="Error sending the verification email!"
          message="Verify your email and try again."
        />

        {/**Submit button*/}

        <button
          type="submit"
          className="flex w-full justify-center rounded-lg bg-orange-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm transition-all duration-300 ease-in-out hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
        >
          <div className="flex h-full w-full items-center justify-center">
            {/**Fetching response from firebase*/}
            {loading ? (
              <div className="py-1 ">
                <LoadingCircle />
              </div>
            ) : (
              "Send password recovery email"
            )}
          </div>
        </button>
      </form>
    </div>
  );
};

export default PasswordRecoverForm;
