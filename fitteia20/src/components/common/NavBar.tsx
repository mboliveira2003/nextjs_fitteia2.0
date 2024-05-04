'use client'

import { FC, useState } from "react";
import {
  InformationCircleIcon,
  UserCircleIcon,
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { Transition } from "@headlessui/react";
import { usePathname, useRouter } from "next/navigation";

import { LogoSmall } from "../visuals/logos/Logo";


const NavBar: FC = () => {
  // TO DO: Allow changes in Profile Picture

  // Get the current location root path
  const location = "/" + usePathname().split("/")[2];

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

  console.log(isMenuOpen);

  return (
    <div className="fixed top-0 z-20 flex h-fit w-full flex-row  items-center justify-between bg-[#1B0300] bg-opacity-50 px-6 py-3 backdrop-blur-sm">
      <h3 className="flex whitespace-nowrap items-end  font-semibold justify-center text-lg flex-row gap-x-4 text-stone-500">
        <LogoSmall />
        {location}
      </h3>

      <div className=" flex flex-row items-center justify-center gap-x-4 ">
        <InformationCircleIcon className="h-7 w-7 cursor-pointer text-stone-500 transition-all duration-200 ease-in-out hover:text-stone-400" />

        <div className="relative" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <UserCircleIcon className="h-7 w-7 cursor-pointer text-stone-500 transition-all duration-200 ease-in-out hover:text-stone-400" />
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
            <div className="cursor-pointer rounded-md bg-[#1B0300] bg-opacity-90 p-2 text-stone-500 ring-1 ring-stone-600/20 backdrop-blur-md hover:text-stone-400">
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

export default NavBar;
