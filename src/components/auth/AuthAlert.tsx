import { FC, Fragment } from "react";
import { Transition } from "@headlessui/react";
import clsx from "clsx";

interface AuthAlertProps {
  alertVisible: boolean;
  icon: JSX.Element;
  title: string;
  message: string;
  furtherUp?: boolean;
}

const AuthAlert: FC<AuthAlertProps> = ({
  alertVisible,
  icon,
  title,
  message,
  furtherUp,
}) => {
  return (
    <Transition
      show={alertVisible}
      as={Fragment}
      enter="transition ease-out duration-200"
      enterFrom="opacity-0 translate-y-10"
      enterTo="opacity-100 translate-y-0"
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className={clsx(furtherUp ? "bottom-32" : "bottom-14", "absolute left-0 right-0 mx-auto flex w-fit flex-row items-center justify-center gap-x-4 rounded-md bg-zinc-800 ring-1 ring-inset ring-zinc-700 px-4 py-2 text-orange-500 shadow-lg backdrop-blur-3xl")}>
        {icon}
        <div className="flex w-full flex-col items-start justify-center">
          <p className="text-md font-medium ">{title}</p>
          <p className="text-sm text-zinc-400">{message}</p>
        </div>
      </div>
    </Transition>
  );
};

export default AuthAlert;
