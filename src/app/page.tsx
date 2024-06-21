"use client";

import TopographyPattern from "@/components/visuals/backgrounds/TopographyPattern";
import LoadingCircle from "@/components/visuals/loading/LoadingCircle";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const RedirectToLogin = () => {
  // Function to redirect to a new page
  const router = useRouter();

  useEffect(() => {
    router.push("/login");
  }, []);

  return (
    <>
      <div className="fixed inset-0 w-full h-full -z-10 flex items-center justify-center">
        <LoadingCircle />
      </div>
      <TopographyPattern />{" "}
    </>
  );
};

export default RedirectToLogin;
