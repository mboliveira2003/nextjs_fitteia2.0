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
    <div className="flex min-h-screen flex-1 flex-col md:flex-row ">
      <NavBar />

      <TopographyPattern />

      <div className="flex w-full flex-col items-center gap-y-6 px-10 py-7 mt-14">
        {children}
      </div>
    </div>
  );
};

export default Authenticated;
