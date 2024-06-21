import { FC, ReactElement } from "react";
import TopographyPattern from "../visuals/backgrounds/TopographyPattern";
import {
  CheckCircleIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

const BlockSmallScreens: FC = (): ReactElement => {
  return (
    <>
      {/* Topography background pattern */}
      <TopographyPattern />

      <div className="flex min-h-screen w-full flex-1 flex-col items-center justify-center px-10 py-12 lg:hidden">
        <div className="flex w-fit flex-col items-center justify-center gap-y-8 sm:gap-y-6 overflow-hidden rounded-lg bg-white/[0.025] ring-inset ring-white/[0.075] ring-1 px-12 py-10 backdrop-blur-sm">
          
          <div className="flex flex-row items-center justify-center gap-x-10">
            <div className="flex flex-row items-center justify-center gap-x-1.5">
              <DevicePhoneMobileIcon className="h-8 w-8 md:h-10 md:w-10 text-zinc-500" />
              <XCircleIcon className="md:h-6 md:w-6 h-5 w-5 text-orange-500" />
            </div>
            <div className="flex flex-row items-center justify-center gap-x-2">
              <ComputerDesktopIcon className="h-8 w-8 md:h-10 md:w-10 text-zinc-500" />
              <CheckCircleIcon className="md:h-6 md:w-6 h-5 w-5 text-orange-500" />
            </div>
          </div>

          <div className="flex w-fit flex-row items-center justify-center gap-x-4">
            <div className="flex flex-col items-center justify-center gap-y-1">
              <div className="text-center  md:text-xl sm:text-lg text-md text-zinc-400">
                <span className="font-bold text-orange-500">Fitteia</span>
                <span className="font-bold text-white">2.</span> is a fitting
                environment developed for large screens.
              </div>
              <div className="sm:text-md md:text-lg text-sm text-center text-zinc-500">
                Please use a larger screen to access the platform.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlockSmallScreens;
