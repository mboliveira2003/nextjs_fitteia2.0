import { Listbox } from "@headlessui/react";
import clsx from "clsx";
import React, { FC, ReactElement, useEffect, useState } from "react";
import { ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { getDatasets, getFunctions } from "@/utils/storage";

interface MultipleElementSelectionProps {
  selectedElementNames: string[];
  updateselectedElementNames: (selectedElementNames: string[]) => void;
  elementType: "function" | "dataset";
}

const MultipleElementSelection: FC<MultipleElementSelectionProps> = ({
  selectedElementNames,
  updateselectedElementNames,
  elementType,
}): ReactElement => {
  // State to store the element names
  const [elementNames, updateElementNames] = useState<string[]>([]);

  // Fetch the element names based on the element type on mount
  useEffect(() => {
    if (elementType === "dataset") {
      const elementNames = getDatasets().map((element) => element.name);
      updateElementNames(elementNames);
    } else {
      const elementNames = getFunctions().map((element) => element.name);
      updateElementNames(elementNames);
    }
  }, [elementType]);

  return (
    <Listbox>
      <Listbox.Button
        className={clsx(
          selectedElementNames.length === 0
            ? "justify-end py-2"
            : "justify-between",
          "relative w-full flex flex-row items-center rounded-md bg-zinc-600 bg-opacity-20 backdrop-blur-2xl border-0 py-1.5 pl-3 pr-3 text-zinc-200 ring-1 ring-inset ring-zinc-500 transition duration-200 placeholder:text-zinc-400 focus:ring-inset focus:ring-zinc-400 sm:text-sm sm:leading-6"
        )}
      >
        {/*Display the name of all selected datasets separated by commas*/}
        {selectedElementNames.join(", ")}
        <ChevronUpDownIcon className="h-5 w-5" />
      </Listbox.Button>
      <Listbox.Options className="absolute z-30 animate-in slide-in-from-top-4 fade-in mt-2 rounded-md w-fit bg-zinc-800 backdrop-blur-2xl ring-1 ring-inset ring-zinc-500">
        <div className="flex flex-row gap-x-2 w-32 items-center justify-between px-3">
          <Listbox.Option
            className="block rounded-md border-0 py-1.5 text-zinc-200  transition-all duration-200 placeholder:text-zinc-400 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6"
            value={elementNames}
          >
            Select All
          </Listbox.Option>

          <input
            type="checkbox"
            checked={selectedElementNames.length === elementNames.length}
            className="w-4 h-4 rounded-2xl text-zinc-600 bg-gray-100 border-gray-300 accent-orange-400"
            onClick={() => {
              if (selectedElementNames.length === elementNames.length) {
                updateselectedElementNames([]);
              } else {
                updateselectedElementNames(elementNames);
              }
            }}
          />
        </div>

        <div className="w-full h-[0.1px] bg-zinc-500 bg-opacity-60"></div>
        {elementNames.map((elementName, index) => (
          <div key={index} className="flex flex-row gap-x-2 w-32 items-center justify-between px-3">
            <Listbox.Option
              className="block rounded-md border-0 py-1.5 text-zinc-200  transition-all duration-200 placeholder:text-zinc-400 focus:ring-inset focus:ring-orange-400 sm:text-sm sm:leading-6"
              key={index}
              value={elementName}
            >
              {elementName}
            </Listbox.Option>

            <input
              type="checkbox"
              checked={selectedElementNames.includes(elementName)}
              className="w-4 h-4 rounded-2xl text-zinc-600 bg-gray-100 border-gray-300 accent-orange-400"
              onClick={() => {
                if (selectedElementNames.includes(elementName)) {
                  updateselectedElementNames(
                    selectedElementNames.filter((name) => name !== elementName)
                  );
                } else {
                  updateselectedElementNames([
                    ...selectedElementNames,
                    elementName,
                  ]);
                }
              }}
            />
          </div>
        ))}
      </Listbox.Options>
    </Listbox>
  );
};

interface SingleElementSelectionProps {
  selectedElementName: string;
  updateSelectedElementName: (selectedElementName: string) => void;
  elementType: "function" | "dataset";
}

const SingleElementSelection: FC<SingleElementSelectionProps> = ({
  selectedElementName,
  updateSelectedElementName,
  elementType,
}): ReactElement => {
  // State to store the element names
  const [elementNames, updateElementNames] = useState<string[]>([]);

  // Fetch the element names based on the element type on mount
  useEffect(() => {
    if (elementType === "dataset") {
      const elementNames = getDatasets().map((element) => element.name);
      updateElementNames(elementNames);
    } else {
      const elementNames = getFunctions().map((element) => element.name);
      updateElementNames(elementNames);
    }
  }, [elementType]);

  return (
    <Listbox>
      <Listbox.Button className="relative w-full flex justify-between flex-row items-center rounded-md bg-zinc-600 bg-opacity-20 backdrop-blur-2xl border-0 py-1.5 pl-3 pr-3 text-zinc-200 ring-1 ring-inset ring-zinc-500 transition duration-200 placeholder:text-zinc-400 focus:ring-inset focus:ring-zinc-400 sm:text-sm sm:leading-6">
        {/*Display the name of all selected datasets separated by commas*/}
        {selectedElementName}
        <ChevronUpDownIcon className="h-5 w-5" />
      </Listbox.Button>
      <Listbox.Options className="absolute z-30 animate-in slide-in-from-top-4 fade-in mt-2 rounded-md w-fit bg-zinc-800 backdrop-blur-2xl ring-1 ring-inset ring-zinc-500">
        <div className="w-full h-[0.1px] bg-zinc-500 bg-opacity-60"></div>
        {elementNames.map((elementName, index) => (
          <div key={index} className="flex flex-row gap-x-2 w-32 items-center justify-between px-3">
            <Listbox.Option
              className="block rounded-md border-0 py-1.5 text-zinc-200  transition-all duration-200 placeholder:text-zinc-400 focus:ring-inset focus:ring-orange-400 sm:text-sm sm:leading-6"
              key={index}
              value={elementName}
            >
              {elementName}
            </Listbox.Option>

            <input
              type="checkbox"
              checked={selectedElementName === elementName}
              className="w-4 h-4 rounded-2xl text-zinc-600 bg-gray-100 border-gray-300 accent-orange-400"
              onClick={() => {
                if (selectedElementName !== elementName) {
                  updateSelectedElementName(elementName);
                }
                else {
                  updateSelectedElementName(" ");
                }
              }}
            />
          </div>
        ))}
      </Listbox.Options>
    </Listbox>
  );
};

export { MultipleElementSelection, SingleElementSelection };
