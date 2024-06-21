import { Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import React, { FC, ReactElement, useState } from "react";

import Input from "@/components/common/forms/input";
import {
  ChevronUpIcon,
  PlusCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Function } from "@/app/types";

/* Main Function Components*/
interface MainFunctionDefinitionProps {
  functionOption: Function;
  updateMainFunction: (mainFunction: string) => void;
}

const MainFunctionDefinition: FC<MainFunctionDefinitionProps> = ({
  functionOption,
  updateMainFunction,
}): ReactElement => {
  return (
    <div className="flex flex-col items-center px-28 gap-y-6">
      {/*Main function definition input*/}
      <div className="w-full">
        <label
          htmlFor="Main Function"
          className="mb-2 block text-sm font-medium text-zinc-300"
        >
          Main Function
        </label>

        <Input
          type="text"
          name={`main-function-${functionOption.id}`}
          id={`main-function-${functionOption.id}`}
          value={functionOption.mainFunction}
          onChange={(e) => updateMainFunction(e.target.value)}
          extraPadding={true}
        />
      </div>
    </div>
  );
};

/* Advanced Options Components*/
interface DisplayAdvancedOptionsButtonProps {
  showAdvancedOptions: boolean;
  setShowAdvancedOptions: (showAdvancedOptions: boolean) => void;
}

const DisplayAdvancedOptionsButton: FC<DisplayAdvancedOptionsButtonProps> = ({
  showAdvancedOptions,
  setShowAdvancedOptions,
}): ReactElement => {
  return (
    <button
      onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
      className={clsx(
        showAdvancedOptions ? "text-zinc-400" : "text-zinc-500",
        "flex flex-row items-center cursor-pointer text-sm group justify-center hover:text-zinc-400 transition-all ease-in-out duration-150 font-semibold gap-x-1.5 rounded-md"
      )}
    >
      Advanced Options
      {showAdvancedOptions ? (
        <ChevronUpIcon className="h-5 w-5" />
      ) : (
        <ChevronDownIcon className="h-5 w-5" />
      )}
    </button>
  );
};

interface SubfunctionDefinitionProps {
  subfunctions: string[];
  updateSubfunctions: (subfunctions: string[]) => void;
}

const SubfunctionDefinition: FC<SubfunctionDefinitionProps> = ({
  subfunctions,
  updateSubfunctions,
}): ReactElement => {
  return (
    <>
      {subfunctions.map((subfunction, index) => (
        <div className="flex flex-row items-center w-full gap-x-2 animate-in fade-in slide-in-from-top-4">
          {/*Subfunction definition input*/}
          <div className="w-full">
            <label
              htmlFor={`Subfunction ${index + 1}`}
              className="mb-2 block text-sm font-medium text-zinc-300"
            >
              {`Subfunction ${index + 1}`}
            </label>
            <div className="flex flex-row items-center gap-x-2">
              <Input
                type="text"
                name={`subfunction-${index}`}
                id={`subfunction-${index}`}
                value={subfunction}
                onChange={(e) => {
                  const newSubfunctions = [...subfunctions];
                  newSubfunctions[index] = e.target.value;
                  updateSubfunctions(newSubfunctions);
                }}
                extraPadding={true}
              />

              {/*Remove subfunction button*/}
              <XMarkIcon
                className="h-5 w-5 cursor-pointer text-zinc-500 hover:text-zinc-400 transition-all ease-in-out"
                onClick={() =>
                  subfunctions.length > 1 &&
                  updateSubfunctions(subfunctions.filter((_, i) => i !== index))
                }
              />
            </div>
          </div>
        </div>
      ))}

      {/*Add subfunction button*/}
      <div
        onClick={() => updateSubfunctions([...subfunctions, ""])}
        className="flex flex-row gap-x-1 items-center cursor-pointer text-zinc-500 hover:text-zinc-400 transition-all ease-in-out -mt-3"
      >
        {" "}
        <PlusCircleIcon className="h-4 w-4" />
        Add subfunction
      </div>
    </>
  );
};

/* Main Component*/
interface FunctionMenuProps {
  functionOption: Function;
  updateFunction: (id: number, functionOption: Function) => void;
  removeFunction: (id: number) => void;
}

const FunctionMenu: FC<FunctionMenuProps> = ({
  functionOption,
  updateFunction,
  removeFunction,
}): ReactElement => {
  // State to store the expanded state of the function menu
  const [isExpanded, setIsExpanded] = useState(false);

  // State to store the advanced options visibility
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  // Function to update the main function
  const updateMainFunction = (mainFunction: string) => {
    updateFunction(functionOption.id, {
      ...functionOption,
      mainFunction,
    });
  };

  // Function to update the subfunctions
  const updateSubfunctions = (subfunctions: string[]) => {
    updateFunction(functionOption.id, {
      ...functionOption,
      subfunctions,
    });
  };

  return (
    <div
      key={functionOption.id}
      className={clsx(
        " items-start flex flex-col text-sm group justify-center text-zinc-300 font-semibold  transition-all duration-150 ease-in-out"
      )}
    >
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className={clsx(
          isExpanded
            ? "bg-zinc-500 bg-opacity-20"
            : "hover:bg-zinc-600 hover:bg-opacity-20",
          "w-full h-full flex flex-row items-center justify-between cursor-pointer gap-x-1.5 transition-all ease-in-out duration-150 px-3 py-2"
        )}
      >
        <div className="flex flex-row gap-x-1.5 items-center">
          {functionOption.name}
          {isExpanded ? (
            <ChevronDownIcon className="h-5 w-5 transform rotate-180" />
          ) : (
            <ChevronDownIcon className="h-5 w-5" />
          )}
        </div>
        <XMarkIcon
          onClick={() => removeFunction(functionOption.id)}
          className="h-5 w-5 text-zinc-500 hover:text-zinc-300 transition-all ease-in-out"
        />
      </div>

      <Transition
        as="div"
        show={isExpanded}
        appear={true}
        enter="transition ease-in-out duration-300 transform origin-top"
        enterFrom="opacity-0 scale-y-0"
        enterTo="opacity-100 scale-y-100"
        leave="transition ease-in-out duration-300 transform origin-top hidden"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-0"
        className="h-fit w-full"
      >
        <div className="flex-col flex w-full px-3 gap-y-6 py-6">
          
          {/*Main function definition*/}
          <MainFunctionDefinition
            functionOption={functionOption}
            updateMainFunction={updateMainFunction}
          />

          <div className="flex flex-col items-start px-28 pb-5 gap-y-6">
            <DisplayAdvancedOptionsButton
              showAdvancedOptions={showAdvancedOptions}
              setShowAdvancedOptions={setShowAdvancedOptions}
            />

            {/*Advanced options Menu*/}
            <div
              className={clsx(
                showAdvancedOptions ? "block" : "hidden",
                "flex flex-col items-start w-full gap-y-6"
              )}
            >
              <SubfunctionDefinition
                subfunctions={functionOption.subfunctions}
                updateSubfunctions={updateSubfunctions}
              />
            </div>
          </div>
        </div>
      </Transition>
    </div>
  );
};

export default FunctionMenu;
