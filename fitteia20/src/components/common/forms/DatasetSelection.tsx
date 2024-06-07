import { Listbox } from "@headlessui/react";
import clsx from "clsx";
import React, { FC, ReactElement } from "react";
import { ChevronUpDownIcon } from "@heroicons/react/24/outline";

interface DatasetSelectionProps {
  datasetNames: string[];
  selectedDatasets: string[];
  updateSelectedDatasets: (selectedDatasets: string[]) => void;
}

const DatasetSelection: FC<DatasetSelectionProps> = ({
  datasetNames,
  selectedDatasets,
  updateSelectedDatasets,
}): ReactElement => {
  return (
    <Listbox>
      <Listbox.Button
        className={clsx(
          selectedDatasets.length === 0
            ? "justify-end py-2"
            : "justify-between",
          "relative w-full flex flex-row items-center rounded-md bg-zinc-600 bg-opacity-20 backdrop-blur-2xl border-0 py-1.5 pl-3 pr-3 text-zinc-200 ring-1 ring-inset ring-zinc-500 transition duration-200 placeholder:text-zinc-400 focus:ring-inset focus:ring-zinc-400 sm:text-sm sm:leading-6"
        )}
      >
        {/*Display the name of all selected datasets separated by commas*/}
        {selectedDatasets.join(", ")}
        <ChevronUpDownIcon className="h-5 w-5" />
      </Listbox.Button>
      <Listbox.Options className="absolute z-30 animate-in slide-in-from-top-4 fade-in mt-2 rounded-md w-fit bg-zinc-800 backdrop-blur-2xl ring-1 ring-inset ring-zinc-500">
        <div className="flex flex-row gap-x-2 w-32 items-center justify-between px-3">
          <Listbox.Option
            className="block rounded-md border-0 py-1.5 text-zinc-200  transition-all duration-200 placeholder:text-zinc-400 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6"
            value={datasetNames}
          >
            Select All
          </Listbox.Option>

          <input
            type="checkbox"
            checked={selectedDatasets.length === datasetNames.length}
            className="w-4 h-4 rounded-2xl text-zinc-600 bg-gray-100 border-gray-300 accent-orange-400"
            onClick={() => {
              if (selectedDatasets.length === datasetNames.length) {
                updateSelectedDatasets([]);
              } else {
                updateSelectedDatasets(datasetNames);
              }
            }}
          />
        </div>
        <div className="w-full h-[0.1px] bg-zinc-500 bg-opacity-60"></div>
        {datasetNames.map((datasetName, index) => (
          <div className="flex flex-row gap-x-2 w-32 items-center justify-between px-3">
            <Listbox.Option
              className="block rounded-md border-0 py-1.5 text-zinc-200  transition-all duration-200 placeholder:text-zinc-400 focus:ring-inset focus:ring-orange-400 sm:text-sm sm:leading-6"
              key={index}
              value={datasetName}
            >
              {datasetName}
            </Listbox.Option>

            <input
              type="checkbox"
              checked={selectedDatasets.includes(datasetName)}
              className="w-4 h-4 rounded-2xl text-zinc-600 bg-gray-100 border-gray-300 accent-orange-400"
              onClick={() => {
                if (selectedDatasets.includes(datasetName)) {
                  updateSelectedDatasets(
                    selectedDatasets.filter((name) => name !== datasetName)
                  );
                } else {
                  updateSelectedDatasets([...selectedDatasets, datasetName]);
                }
              }}
            />
          </div>
        ))}
      </Listbox.Options>
    </Listbox>
  );
};

export default DatasetSelection;
