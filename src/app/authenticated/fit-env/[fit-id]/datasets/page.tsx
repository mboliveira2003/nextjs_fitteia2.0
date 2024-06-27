"use client";

import { PlusIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import React, { FC, ReactElement, useEffect, useState } from "react";

import { ArrowDownTrayIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/16/solid";
import DatasetTable from "./DatasetTable";
import { Dataset } from "../../../../types";
import { getDatasets, updateDatasets } from "@/utils/storage";
import parseCsvContent from "@/utils/parseCsv";
import LoadingCircle from "@/components/visuals/loading/LoadingCircle";

const Page: FC = (): ReactElement => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);

  // State to wether a dataset csv is being processed
  const [processingCsv, setProcessingCsv] = useState<boolean>(false);

  // State to store an error processing the csv
  const [csvError, setCsvError] = useState<string | null>(null);

  // After 5 seconds, remove the error message
  useEffect(() => {
    if (csvError) {
      setTimeout(() => {
        setCsvError(null);
      }, 5000);
    }
  }, [csvError]);

  // On mount fetch the datasets
  useEffect(() => {
    const datasets = getDatasets();
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
            independentVariable: 1,
            independentVariableError: 0,
            dependentVariable: 1,
            dependentVariableError: 0.1,
          },
        ],
        dependentVariableName: "Y Label",
        independentVariableName: "X Label",
        auxiliarIndependentVariablesArray: [1],
        auxiliarIndependentVariablesArrayName: "dum"
      },
    ]);
  };

  const addDatasetViaCsv = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setCsvError(null);
    setProcessingCsv(true);

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      const reader = new FileReader();

      reader.onload = (event: ProgressEvent<FileReader>): void => {
        const content = event.target?.result;

        if (typeof content === "string") {
          try {
            const {
              dataPoints,
              independentVariableName,
              dependentVariableName,
            } = parseCsvContent(content);

            setDatasets((prevDatasets: Dataset[]): Dataset[] => [
              ...prevDatasets,
              {
                id: prevDatasets.length + 1,
                name: "Dataset " + (prevDatasets.length + 1),
                datapoints: dataPoints,
                independentVariableName: independentVariableName || "X Label",
                dependentVariableName: dependentVariableName || "Y Label",
                auxiliarIndependentVariablesArray: [1],
                auxiliarIndependentVariablesArrayName: "dum"
              },
            ]);
          } catch (error: any) {
            console.log(error.message)
            setCsvError(error.message);
            setProcessingCsv(false);
          }
        }
      };

      reader.readAsText(file);
      e.target.value = "";
      setProcessingCsv(false);
    }
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
    <div className="w-full h-fit bg-white/[0.025] ring-inset ring-1 ring-white/[0.075] backdrop-blur-md px-10 py-5 gap-y-8 flex flex-col rounded-lg min-h-full max-w-screen-2xl">
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
          className="flex flex-row items-center gap-x-2 cursor-pointer text-sm group justify-center text-white shadow-md shadow-orange-500/10 font-semibold hover:bg-orange-600 ease-in-out transition-all duration-200 bg-orange-500 px-3 py-2 rounded-md"
        >
          Next
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>

      {/*Datasets tables*/}
      <div className=" flex flex-col w-full divide-y divide-zinc-500">
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
          className="flex flex-row  items-center group rounded-md cursor-pointer border border-dashed border-zinc-500 text-sm group justify-center hover:bg-white/5  text-orange-500 font-semibold ease-in-out transition-all duration-200 gap-x-1.5 px-3 py-2"
        >
          <div className="flex flex-row items-center gap-x-1.5 transition-all ease-in-out duration-150">
            <PlusIcon className="h-5 w-5" />
            Add dataset
          </div>
        </div>

        <p className="flex flex-row px-3 items-center justify-center text-zinc-300 text-sm">
          or
        </p>

        {/*Import CSV button*/}
        <label
          htmlFor="fileInput"
          className="flex flex-row  items-center group rounded-md cursor-pointer border border-dashed border-zinc-500 text-sm group justify-center hover:bg-white/5 text-orange-500 font-semibold ease-in-out transition-all duration-200 gap-x-1.5 px-3 py-2"
        >
          <input
            type="file"
            id="fileInput"
            accept=".csv,.txt"
            className="sr-only"
            onChange={addDatasetViaCsv}
          />
          <div className="flex flex-row items-center gap-x-1.5 transition-all ease-in-out duration-150">
            {processingCsv ? (
              <LoadingCircle className="h-5 w-5" />
            ) : (
              <>
                <ArrowDownTrayIcon className="h-5 w-5" />
                <p> Import CSV </p>
              </>
            )}
          </div>
        </label>
      </div>




      {/*Error message*/}
      {csvError && (
         <div className="animate-in zoom-in-95 fade-in w-full h-fit bg-zinc-600/20 backdrop-blur-md px-7 py-5 flex flex-row gap-x-5 items-center justify-center rounded-lg">
         <ExclamationCircleIcon className="w-10 h-10 text-orange-500" />
         <div className="flex flex-col items-start">
           <p className="text-md font-medium text-zinc-300">
             An error occurred while processing the csv!
           </p>
           <p className="text-base font-normal  text-zinc-500">
             {csvError}
           </p>
         </div>
       </div>
      )}

    </div>
  );
};

export default Page;
