"use client";

import React, { FC, ReactElement, useState } from "react";

import { getDatasets, getFitType, getFunctions } from "@/utils/storage";
import { Dataset, Function } from "@/app/types";
import FittingMenu from "./FittingMenu";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { updateSelectedDataset as updateSelectedDatasetApi } from "@/utils/storage";
import { get } from "http";

const Page: FC = (): ReactElement => {
  // Fetch the datasets and functions
  const datasets = getDatasets();
  const functions = getFunctions();
  const fitType = getFitType();

  // State to store the selected dataset, function and fit type
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(
    datasets.length === 0 ? null : datasets[0]
  );
  const [selectedFunction, setSelectedFunction] = useState<Function | null>(
    functions.length === 0 ? null : functions[0]
  );
  const [globalFit, setGlobalFit] = useState<boolean>(fitType);

  // Function to update the selected datasets by name
  const updateSelectedDataset = (datasetName: string) => {
    const foundDataset = datasets.find((dataset) =>
      datasetName.includes(dataset.name)
    );
    if (foundDataset) {
      setSelectedDataset(foundDataset);
      updateSelectedDatasetApi(foundDataset);
    }
  };

  // Function to update the selected function by name
  const updateSelectedFunction = (functionName: string) => {
    const foundFunction = functions.find((func) =>
      functionName.includes(func.name)
    );
    if (foundFunction) {
      setSelectedFunction(foundFunction);
    }
  };

  if (!selectedFunction || !selectedDataset) {
    return (
      <div className="w-fit h-fit bg-white/[0.025] backdrop-blur-md ring-1 ring-white/[0.075] ring-inset px-7 py-5 flex flex-row gap-x-5 items-center rounded-lg">
        <ExclamationCircleIcon className="w-10 h-10 text-orange-500" />
        <div className="flex flex-col items-start">
        <p className="text-md font-medium text-zinc-300">
          You must specify at least a dataset and function to use the fitting
          environment!
        </p>
        <p className="text-base text-zinc-500">
          Please go back and add the missing objects.
        </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-fit min-h-screen bg-white/[0.025] backdrop-blur-md ring-1 ring-white/[0.075] ring-inset px-10 py-5 gap-y-8 flex flex-col rounded-lg">
      <FittingMenu
        selectedDataset={selectedDataset}
        selectedFunction={selectedFunction}
        updateSelectedDataset={updateSelectedDataset}
        updateSelectedFunction={updateSelectedFunction}
        globalFit={globalFit}
        setGlobalFit={setGlobalFit}
      />
    </div>
  );
};

export default Page;
