import { FC, ReactElement } from "react";
import Link from "next/link";

import Logo from "@/components/visuals/logos/Logo";
import TopographyPattern from "@/components/visuals/backgrounds/TopographyPattern";
import RecoverPasswordForm from "@/app/recover-password/RecoverPasswordForm";

const RecoverPassword: FC = (): ReactElement => {
  return (
    <>
      {/* Topography background pattern */}
      <TopographyPattern />

      <div className="flex min-h-screen w-full flex-1 flex-col items-center justify-center px-6 py-12 lg:px-8">
        <div className="flex w-fit flex-col items-center justify-center gap-y-10 overflow-hidden rounded-lg bg-white/[0.025] ring-inset ring-white/[0.075] ring-1 px-12 py-10 backdrop-blur-sm sm:px-16 sm:py-10">
          <div className="flex w-full max-w-sm flex-col items-center justify-center gap-y-8">
            <Logo />
          </div>

          <div className="sm:w-96">
            <RecoverPasswordForm />
          </div>

          {/* Sign up link */}
          <p className=" text-center text-sm text-zinc-500">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className=" cursor-pointer leading-6 text-orange-600 underline-offset-2 transition-all duration-300 ease-in-out hover:text-orange-500"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default RecoverPassword;
