import { FC, ReactElement, useEffect } from "react";
import Link from "next/link";

import Logo from "@/components/visuals/logos/Logo";
import TopographyPattern from "@/components/visuals/backgrounds/TopographyPattern";

interface SignupProps {
  children: ReactElement;
}

const Signup: FC<SignupProps> = ({ children }): ReactElement => {
  return (
    <>
      {/* Topography background pattern */}
      <TopographyPattern />

      <div className="flex min-h-screen w-full flex-1 flex-col items-center justify-center px-6 py-12 lg:px-8">
        <div className="flex w-fit flex-col items-center justify-center gap-y-10 overflow-hidden rounded-lg bg-stone-800 bg-opacity-40 px-12 py-10 backdrop-blur-sm sm:px-16 sm:py-10">
          <div className="flex w-full max-w-sm flex-col items-center justify-center gap-y-8">
            <Logo />
          </div>

          <div className="sm:w-96">{children}</div>

          {/* Sign up link */}
          <p className=" text-center text-sm text-stone-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className=" cursor-pointer leading-6 text-orange-700 underline-offset-2 transition-all duration-300 ease-in-out hover:text-orange-600"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Signup;
