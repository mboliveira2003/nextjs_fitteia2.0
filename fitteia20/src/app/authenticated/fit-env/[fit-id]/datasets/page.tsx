"use client";

import { PlusIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import React, { FC, ReactElement, useEffect, useState } from "react";

import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import DatasetTable from "./DatasetTable";
import { Dataset } from "../../../../types";
import { getDatasets, updateDatasets } from "@/utils/storage";

const Page: FC = (): ReactElement => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);

  // On mount fetch the datasets
  useEffect(() => {
    const datasets = getDatasets()
    if (datasets.length > 0) {
      setDatasets(datasets);
    }
  }, []);

  // Update the datasets whenever the object changes
  useEffect(() => {
    updateDatasets(datasets);
  }, [datasets]);

  const addDataset = () => {
    setDatasets([
      ...datasets,
      {
        id: datasets.length + 1,
        name: "Dataset " + (datasets.length + 1),
        datapoints: [
          {
            independentVariable: 0,
            independentVariableError: 0,
            dependentVariable: 0,
            dependentVariableError: 0,
          },
        ],
        dependentVariableName: "Y Label",
        independentVariableName: "X Label",
        auxiliarDependentVariables: [ { name: "Auxiliar Variable", value: 0 }],
      },
    ]);
  };

  const removeDataset = (id: number) => {
    const newDatasets = datasets.filter((dataset) => dataset.id !== id);
    setDatasets(newDatasets);
  };

  const updateDataset = (id: number, newDataset: Dataset) => {
    const newDatasets = datasets.map((dataset) =>
      dataset.id === id ? newDataset : dataset
    );
    setDatasets(newDatasets);
  };

  return (
    <div className="w-full h-fit bg-white/[0.025] ring-inset ring-1 ring-white/[0.075] backdrop-blur-md px-10 py-5 gap-y-8 flex flex-col rounded-lg min-h-full">
      <div className="flex flex-row items-end justify-between">
        {/*Title and description*/}
        <div className="flex flex-col items-start">
          <h1 className="text-lg font-semibold text-white">Datasets</h1>
          <p className="text-base text-zinc-500">
            Insert your datapoints and variables
          </p>
        </div>

        {/*Save and move to functions button*/}
        <Link
          href="/authenticated/fit-env/new/functions"
        
          className="flex flex-row items-center cursor-pointer text-sm group justify-center text-white shadow-md shadow-orange-500/10 font-semibold hover:scale-[0.98] ease-in-out transition-all duration-150 bg-orange-500 gap-x-1.5 px-3 py-2 rounded-md"
        >
          Save and move to functions
        </Link>
      </div>

      {/*Datasets tables*/}
      <div className="flex flex-col w-full divide-y divide-zinc-500">
        {datasets.map((dataset) => (
          <DatasetTable
            key={dataset.id}
            dataset={dataset}
            updateDataset={updateDataset}
            removeDataset={removeDataset}
          />
        ))}
      </div>

      <div className="flex flex-row gap-x-2 w-full items-center justify-center ">
        {/*Add dataset button*/}
        <div
          onClick={() => addDataset()}
          className="flex flex-row  items-center group rounded-md cursor-pointer border border-dashed border-zinc-500 text-sm group justify-center text-orange-500 font-semibold ease-in-out transition-all duration-300 gap-x-1.5 px-3 py-2"
        >
          <div className="flex flex-row items-center gap-x-1.5 group-hover:scale-105 transition-all ease-in-out duration-150">
            <PlusIcon className="h-5 w-5" />
            Add dataset
          </div>
        </div>

        <p className="flex flex-row px-3 items-center justify-center text-zinc-300 text-sm">
          or
        </p>

        {/*Import CSV button*/}
        <div className="flex flex-row  items-center group rounded-md cursor-pointer border border-dashed border-zinc-500 text-sm group justify-center text-orange-500 font-semibold ease-in-out transition-all duration-300 gap-x-1.5 px-3 py-2">
          <div className="flex flex-row items-center gap-x-1.5 group-hover:scale-105 transition-all ease-in-out duration-150">
            <ArrowDownTrayIcon className="h-5 w-5" />
            Import CSV
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
