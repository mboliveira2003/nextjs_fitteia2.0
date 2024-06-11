"use client";

import React, { FC, ReactElement, useState } from "react";

import { getDatasets, getFunctions } from "@/utils/storage";
import { Dataset, Function } from "@/app/types";
import FittingMenu from "./ParametersMenu";

const Page: FC = (): ReactElement => {
  // Fetch the datasets and functions
  const datasets = getDatasets();
  const functions = getFunctions();

  // State to store the selected dataset and function
  const [selectedDataset, setSelectedDataset] = useState<Dataset>(datasets[0]);
  const [selectedFunction, setSelectedFunction] = useState<Function>(
    functions[0]
  );

  // State to store the fit type
  const [globalFit, setGlobalFit] = useState<boolean>(false);

  // Function to update the selected datasets by name
  const updateSelectedDataset = (datasetName: string) => {
    const foundDataset = datasets.find((dataset) =>
      datasetName.includes(dataset.name)
    );
    if (foundDataset) {
      setSelectedDataset(foundDataset);
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

  return (
    <div className="w-full h-fit bg-white/[0.025] backdrop-blur-md ring-1 ring-white/[0.075] ring-inset px-10 py-5 gap-y-8 flex flex-col rounded-lg">
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
