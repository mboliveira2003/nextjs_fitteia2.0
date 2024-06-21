"use client";

import { FC, use, useState } from "react";
import {
  InformationCircleIcon,
  UserCircleIcon,
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { Transition } from "@headlessui/react";
import { useParams, usePathname, useRouter } from "next/navigation";

import { LogoSmall } from "../visuals/logos/Logo";
import clsx from "clsx";
import Link from "next/link";

const NavBar: FC = () => {
  // TO DO: Allow changes in Profile Picture

  // Get the current location root path
  const currentUrl = usePathname();
  const location = "/" + currentUrl.split("/")[2];

  // Sign out functionality
  const router = useRouter();
  const handleSignOut = () => {
    try {
      const response = signOut(auth);
      console.log("Success signing out user in Firebase", response);
    } catch (error) {
      console.log("Error signing out user in Firebase", error);
    }
    router.push("/login");
  };

  // State to store the menu open state
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="fixed top-0 z-20 flex h-fit w-full flex-row  items-center justify-between bg-white/[0.025] border-b border-white/[0.075] px-6 py-3 backdrop-blur-sm">
      <h3 className="flex whitespace-nowrap items-end  font-semibold justify-center text-lg flex-row gap-x-4 text-zinc-500">
        <LogoSmall />
        {location}
      </h3>

      {location !== "/my-fits" && <Tabs currentUrl={currentUrl} />}

      <div className=" flex flex-row items-center justify-center gap-x-4 ">
        <InformationCircleIcon className="h-7 w-7 cursor-pointer text-zinc-500 transition-all duration-200 ease-in-out hover:text-zinc-400" />

        <div className="relative" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <UserCircleIcon className="h-7 w-7 cursor-pointer text-zinc-500 transition-all duration-200 ease-in-out hover:text-zinc-400" />
          <Transition
            show={isMenuOpen}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
            className="absolute right-0 top-12 flex w-fit flex-col items-center justify-center gap-y-2 rounded-md backdrop-blur-md"
          >
            <div className="cursor-pointer rounded-md bg-zinc-800 ring-1 ring-zinc-700 ring-inset p-2 text-zinc-400 backdrop-blur-md hover:text-zinc-300">
              <div
                onClick={() => {
                  setIsMenuOpen(false), handleSignOut();
                }}
              >
                <div className="text-md group flex flex-row items-center justify-center gap-x-1 rounded-lg px-2 py-1 font-semibold  transition duration-300 ease-in-out">
                  <p className="whitespace-nowrap text-xs">Sign Out</p>
                  <ArrowRightStartOnRectangleIcon className="h-4 w-4" />
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  );
};

interface TabsProps {
  currentUrl: string;
}

const Tabs: FC<TabsProps> = ({ currentUrl }) => {
  // Fetch the fitId from the URL
  const fitId = useParams()["fit-id"];

  const tabs = [
    { name: "Datasets", href: `/authenticated/fit-env/${fitId}/datasets` },
    { name: "Functions", href: `/authenticated/fit-env/${fitId}/functions` },
    { name: "Fitting Environment", href: `/authenticated/fit-env/${fitId}/fit` },
  ];

  return (
    <div className="fixed w-full inset-0 flex flex-row items-center justify-center">
      <nav className="flex flex-row gap-x-8" aria-label="Tabs">
        {tabs.map((tab) => (
          <Link
            key={tab.name}
            href={tab.href}
            className={clsx(
              currentUrl === tab.href
                ? "border-white text-white"
                : "border-transparent text-zinc-500 hover:border-zinc-400 hover:text-zinc-400",
              "whitespace-nowrap border-b-2 py-[17px] px-1 text-sm font-medium transition-all duration-150 ease-in-out"
            )}
          >
            {tab.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default NavBar;
