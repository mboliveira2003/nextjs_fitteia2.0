'use client'

import { FC, ReactElement, useEffect, useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebase";

import AuthInput from "../AuthInput";
import LoadingCircle from "@/components/visuals/loading/LoadingCircle";
import { CheckCircleIcon, ExclamationTriangleIcon} from "@heroicons/react/24/outline";
import { Fragment } from "react";
import { Transition } from "@headlessui/react";

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
        e.currentTarget.email.value,
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
        <Transition
          show={emailSent === true}
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1 scale-95"
          enterTo="opacity-100 translate-y-0 scale-100"
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="absolute bottom-14 left-0 right-0 mx-auto flex w-fit flex-row items-center justify-center gap-x-4 rounded-md bg-stone-900 bg-opacity-95 px-4 py-2 text-center text-orange-600 shadow-lg backdrop-blur-3xl duration-300 animate-in fade-in slide-in-from-bottom-10">
            <CheckCircleIcon className="-mb-0.5 h-8 w-8 text-orange-600" />
            <div className="flex w-full flex-col items-start justify-center">
              <p className="text-md font-medium">Recovery email sent sucessfully!</p>
              <p className="text-sm text-stone-400">
                Check your inbox and follow the instructions.
              </p>
            </div>
          </div>
        </Transition>

        {/**Email not sent alert*/}
        <Transition
          show={emailSent === false}  
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
                Error sending the verification email!
              </p>
              <p className="text-sm text-stone-400">
                Verify your email and try again.
              </p>
            </div>
          </div>
        </Transition>

        {/**Submit button*/}
        <div>
          <button
            type="submit"
            className="flex w-full justify-center rounded-lg bg-orange-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm transition-all duration-300 ease-in-out hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
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
        </div>
      </form>
    </div>
  );
};

export default PasswordRecoverForm;
