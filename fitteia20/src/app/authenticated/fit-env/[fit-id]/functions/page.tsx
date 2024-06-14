"use client";

import { PlusIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import React, { FC, ReactElement, useState, useEffect } from "react";

import FunctionMenu from "./FunctionMenu";
import { Function } from "@/app/types";
import { getDatasets, getFunctions, updateFunctions } from "@/utils/storage";

const Page: FC = (): ReactElement => {
  // State to store the functions
  const [functions, setFunctions] = useState<Function[]>([]);

  // On mount fetch the functions
  useEffect(() => {
    const functions = getFunctions();
    if (functions.length > 0) {
      setFunctions(functions);
    }
  }, []);

  // Update the functions whenever the object changes
  useEffect(() => {
    updateFunctions(functions);
  }, [functions]);

  const addFunction = () => {
    setFunctions([
      ...functions,
      {
        id: functions.length + 1,
        name: "Function " + (functions.length + 1),
        mainFunction: "y(x) = x^2",
        subfunctions: ["z(x) = x + 7"],
      },
    ]);
  };

  const removeFunction = (id: number) => {
    setFunctions(functions.filter((f) => f.id !== id));
  };

  const updateFunction = (id: number, functionOption: Function) => {
    setFunctions(functions.map((f) => (f.id === id ? functionOption : f)));
  };

  return (
    <div className="w-full h-fit bg-white/[0.025] ring-inset items-center ring-1 ring-white/[0.075] backdrop-blur-md px-10 py-5 gap-y-8 flex flex-col rounded-lg min-h-full">
      <div className="flex flex-row items-end justify-between w-full">
        {/*Title and description*/}
        <div className="flex flex-col items-start">
          <h1 className="text-lg font-semibold text-white">Functions</h1>
          <p className="text-base text-zinc-500">
            Specify your functions and the datasets they apply to
          </p>
        </div>

        {/*Save and fit button*/}
        <Link
          href="/authenticated/fit-env/new/fit"
          className="flex flex-row items-center cursor-pointer text-sm group justify-center text-white shadow-md shadow-orange-500/10 font-semibold hover:scale-[0.98] ease-in-out transition-all duration-300 bg-orange-500 gap-x-1.5 px-3 py-2 rounded-md"
        >
          Save and fit
        </Link>
      </div>

      <div className="flex flex-col w-full divide-y divide-zinc-500">
        {functions.map((functionOption) => (
          <FunctionMenu
            key={functionOption.id}
            functionOption={functionOption}
            updateFunction={updateFunction}
            removeFunction={removeFunction}
          />
        ))}
      </div>

      <div
        onClick={() => addFunction()}
        className="flex flex-col gap-y-2 w-fit"
      >
        <div className="flex flex-row items-center group rounded-md cursor-pointer border border-dashed border-zinc-500 text-sm group justify-center text-orange-500 font-semibold ease-in-out transition-all duration-300 gap-x-1.5 px-3 py-2">
          <div className="flex flex-row items-center gap-x-1.5 group-hover:scale-105 transition-all ease-in-out duration-300">
            <PlusIcon className="h-5 w-5" />
            Add Function
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
