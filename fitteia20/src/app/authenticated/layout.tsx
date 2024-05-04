'use client'

import { FC, ReactElement } from "react";
import { useRouter } from "next/navigation";

import NavBar from "@/components/common/NavBar";
import TopographyPattern from "@/components/visuals/backgrounds/TopographyPattern";
import { auth } from "@/firebase";

interface AuthenticatedProps {
  children: ReactElement;
}

const Authenticated: FC<AuthenticatedProps> = ({ children }) => {
  // Function to move to a new page
  const router = useRouter();

  // Get the current user
  const user = auth.currentUser;

  // If the user is not logged in, redirect to the login page
  if (!user) {
    router.push("/login");
    return;
  }

  return (
    <div className="flex min-h-screen flex-1 flex-col pb-20 md:flex-row lg:pb-0">
      <NavBar />

      <TopographyPattern />

      <div className="top-0 flex w-full flex-col items-center gap-y-6 px-7 py-5 sm:ml-0 sm:px-10 sm:py-7">
        {children}
      </div>
    </div>
  );
};

export default Authenticated;
