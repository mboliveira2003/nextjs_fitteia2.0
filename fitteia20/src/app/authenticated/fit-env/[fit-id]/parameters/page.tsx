"use client";

import React, { FC, ReactElement, use, useEffect, useState } from "react";

import MyChart from "@/components/common/charts/ScatterPlot";
import ParametersMenu from "./ParametersMenu";
import { getDatasets, getFunctions } from "@/utils/storage";
import { Dataset, Function } from "@/app/types";

const Page: FC = (): ReactElement => {
  // Fetch the datasets and functions
  const datasets = getDatasets();
  const functions = getFunctions();

  // State to store the selected dataset and function
  const [selectedDatasets, setSelectedDatasets] = useState<Dataset[]>([
    datasets[0],
  ]);
  const [selectedFunction, setSelectedFunction] = useState<Function>(
    functions[0]
  );

  // Function to update the selected datasets by name
  const updateSelectedDatasets = (datasetNames: string[]) => {
    setSelectedDatasets(
      datasets.filter((dataset) => datasetNames.includes(dataset.name))
    );
  };

  // Fetch the fitted points for the current selected dataset and function
  // For now generate 20 random datapoints
  const fittedPoints = Array.from({ length: 20 }, () => ({
    independentVariable: Math.random() * 10,
    independentVariableError: Math.random() * 0.5,
    dependentVariable: Math.random() * 10,
    dependentVariableError: Math.random() * 0.5,
  }));

  return (
    <div className="w-full h-fit bg-white/[0.025] backdrop-blur-md ring-1 ring-white/[0.075] ring-inset px-10 py-5 gap-y-8 flex flex-col rounded-lg">
      {selectedDatasets.map((selectedDataset) => (
        <div className="px-24">
          <MyChart
            dataPoints={selectedDataset.datapoints}
            fittedPoints={fittedPoints}
          />
        </div>
      ))}
      <div className="flex flex-col w-full divide-y divide-zinc-500">
        {functions.map((func, index) => (
          <div
            className="w-full h-fit"
            onClick={() => setSelectedFunction(functions[index])}
          >
            <ParametersMenu
              key={func.id}
              currentFunction={func}
              selectedDatasets={selectedDatasets.map((dataset) => dataset.name)}
              updateSelectedDatasets={updateSelectedDatasets}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
