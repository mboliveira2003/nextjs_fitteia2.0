import React, { FC, ReactElement, useEffect, useState } from "react";

import LabeledSwitch from "@/components/common/forms/LabeledSwitch";
import Input from "@/components/common/forms/input";
import { SingleElementSelection } from "@/components/common/forms/ElementSelection";
import {
  Dataset,
  FitResponse,
  FittedDatapoint,
  Function,
  Parameter,
  ParameterTable,
} from "@/app/types";
import parseFunction, { FunctionInput } from "@/utils/parseFunction";
import MyChart from "@/components/common/charts/ScatterPlot";
import {
  ArrowPathIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import {
  getFunctions,
  updateDependentVariable,
  updateIndepentVariable,
  updateParameters,
  updateProcessedFunction,
} from "@/utils/storage";
import extractXYPairs from "@/utils/extractFittedPoints";
import extractChiSquared from "@/utils/extractChiSquared";
import { set } from "firebase/database";

interface FittingDefinitionMenuProps {
  parameters: Parameter[];
  updateMax: (index: number, value: number) => void;
  updateMin: (index: number, value: number) => void;
  updateFixed: (index: number, value: boolean) => void;
  updateInitialValue: (index: number, value: number) => void;
  selectedFunction: Function;
  selectedDataset: Dataset;
  updateSelectedFunction: (functionName: string) => void;
  updateSelectedDataset: (datasetName: string) => void;
  globalFit: boolean;
  setGlobalFit: (value: boolean) => void;
  errorParsingParameters?: string | null;
  updateFitResults: (
    selectedDataset: Dataset,
    selectedFunction: Function,
    isFitGlobal: boolean,
    datasetOnly?: boolean
  ) => void;
}

const FittingDefinitionMenu: FC<FittingDefinitionMenuProps> = ({
  parameters,
  updateMax,
  updateMin,
  updateFixed,
  updateInitialValue,
  selectedFunction,
  selectedDataset,
  updateSelectedFunction,
  updateSelectedDataset,
  globalFit,
  setGlobalFit,
  errorParsingParameters,
  updateFitResults,
}): ReactElement => {
  return (
    <div className="flex flex-col items-start w-full gap-y-8">
      {/*Header and Fit button*/}
      <div className="flex flex-row w-full justify-between gap-x-4 items-center">
        <div className="flex flex-col items-start w-full">
          <h1 className="text-white font-semibold text-lg">
            Fitting Environment
          </h1>
          <p className="text-zinc-500 text-base font-normal">
            Choose a function and dataset to fit
          </p>
        </div>

        {/*Fit button*/}
        <button
          onClick={() =>
            updateFitResults(selectedDataset, selectedFunction, globalFit, true)
          }
          className="flex flex-row whitespace-nowrap items-center cursor-pointer text-sm group justify-center text-white shadow-md shadow-zinc-700/10 font-semibold hover:scale-[0.98] ease-in-out transition-all duration-150 bg-zinc-700 gap-x-1.5 px-3 py-2 rounded-md"
        >
          Plot dataset
        </button>
        <button
          onClick={() =>
            updateFitResults(selectedDataset, selectedFunction, globalFit, false)
          }
          className="flex flex-row whitespace-nowrap items-center cursor-pointer text-sm group justify-center text-white shadow-md shadow-orange-500/10 font-semibold hover:scale-[0.98] ease-in-out transition-all duration-150 bg-orange-500 gap-x-1.5 px-3 py-2 rounded-md"
        >
          Fit dataset
        </button>
      </div>

      <div className="flex flex-row items-center gap-x-6 w-full">
        <div className="w-full">
          <label
            htmlFor="Choose a function"
            className="mb-2 block text-sm font-medium text-zinc-300"
          >
            Choose a function
          </label>

          <SingleElementSelection
            selectedElementName={selectedFunction.name}
            updateSelectedElementName={updateSelectedFunction}
            elementType="function"
            mainFunction={selectedFunction.mainFunction}
          />
        </div>

        <div className="w-full">
          <label
            htmlFor="Choose a function"
            className="mb-2 block text-sm font-medium text-zinc-300"
          >
            Choose a Dataset
          </label>

          <SingleElementSelection
            selectedElementName={selectedDataset.name}
            updateSelectedElementName={updateSelectedDataset}
            elementType="dataset"
          />
        </div>
        <div className="w-fit">
          <label
            htmlFor="Choose a function"
            className="mb-2 block text-sm font-medium text-zinc-300"
          >
            Fit Type
          </label>

          <LabeledSwitch
            enabledLabel="Global"
            disabledLabel="Individual"
            enabled={globalFit}
            setEnabled={setGlobalFit}
          />
        </div>
      </div>

      <div className="flex flex-col items-start w-full ">
        <label
          htmlFor="Choose a function"
          className="mb-2 block text-sm font-medium text-zinc-300"
        >
          Function parameters
        </label>
        {parameters.length === 0 ? (
          <div className="w-full h-fit bg-zinc-600/20 backdrop-blur-md px-7 py-5 flex flex-row gap-x-5 items-center justify-center rounded-lg">
            <ExclamationCircleIcon className="w-10 h-10 text-orange-500" />
            <div className="flex flex-col items-start">
              <p className="text-md font-medium text-zinc-300">
                {errorParsingParameters
                  ? errorParsingParameters
                  : "The chosen function must have at least one parameter!"}
              </p>
              <p className="text-base font-normal  text-zinc-500">
                Please modify the function or chose a different one.
              </p>
            </div>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-zinc-500 rounded-md overflow-hidden">
            {/*Table header*/}

            <thead className="bg-zinc-600/20">
              <tr className="">
                <th
                  scope="col"
                  className="py-2 pl-10 pr-5 text-left text-sm font-semibold"
                ></th>
                <th
                  scope="col"
                  className="py-2 px-5 text-left text-sm font-semibold"
                ></th>
                <th
                  scope="col"
                  className="py-2 px-5 text-left text-sm font-semibold "
                >
                  <div className="block w-full rounded-md  border-0 bg-transparent text-zinc-200 transition-all duration-200 placeholder:text-zinc-400 focus:ring-inset focus:ring-zinc-600 sm:text-sm sm:leading-6">
                    Min
                  </div>
                </th>
                <th
                  scope="col"
                  className="py-2 px-5 text-left text-sm font-semibold "
                >
                  <div className="block w-full rounded-md  border-0 bg-transparent text-zinc-200 transition-all duration-200 placeholder:text-zinc-400 focus:ring-inset focus:ring-zinc-600 sm:text-sm sm:leading-6">
                    Initial Value
                  </div>
                </th>
                <th
                  scope="col"
                  className="py-2 px-5 text-left text-sm font-semibold "
                >
                  <div className="block w-full rounded-md  border-0 bg-transparent text-zinc-200 transition-all duration-200 placeholder:text-zinc-400 focus:ring-inset focus:ring-zinc-600 sm:text-sm sm:leading-6">
                    Max
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-500 text-zinc-400">
              {parameters.map((parameter, index) => (
                <tr
                  key={index}
                  className="animate-in fade-in slide-in-from-top-4 duration-300 "
                >
                  <td className="whitespace-nowrap py-3 pl-10 pr-5 text-base font-semibold text-zinc-300">
                    {parameter.name}
                  </td>
                  {/*Switch to toggle between fixed and free parameters*/}
                  <td className="whitespace-nowrap py-3 px-5 text-sm w-fit flex items-center font-medium">
                    <LabeledSwitch
                      enabledLabel="Fixed"
                      disabledLabel="Free"
                      enabled={parameter.fixed}
                      setEnabled={(value) => updateFixed(index, value)}
                    />
                  </td>
                  <td className="whitespace-nowrap py-3 px-5 text-sm text-zinc-500">
                    <Input
                      type="number"
                      name={"parameter-" + index + "-min"}
                      id={"parameter-" + index + "-min"}
                      value={parameter.Min}
                      onChange={(e) => {
                        updateMin(index, parseFloat(e.target.value));
                      }}
                    />
                  </td>
                  <td className="whitespace-nowrap py-3 px-5 text-sm text-zinc-500">
                    <Input
                      type="number"
                      name={"parameter" + index + "-initial-value"}
                      id={"parameter-" + index + "-initial-value"}
                      value={parameter.initialValue}
                      onChange={(e) => {
                        updateInitialValue(index, parseFloat(e.target.value));
                      }}
                    />
                  </td>
                  <td className="whitespace-nowrap py-3 pr-10 pl-5  text-sm text-zinc-500">
                    <Input
                      type="number"
                      name={"parameter-" + index + "-max"}
                      id={"parameter-" + index + "-max"}
                      value={parameter.Max}
                      onChange={(e) => {
                        updateMax(index, parseFloat(e.target.value));
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

interface FittingResultsMenuProps {
  fitResults: FitResponse | null;
  errorFetchingFitResults: string | null;
  selectedDataset: Dataset;
  selectedFunction: Function;
  loadingFitResults: boolean;
}

const FittingResultsMenu: FC<FittingResultsMenuProps> = ({
  fitResults,
  errorFetchingFitResults,
  selectedDataset,
  selectedFunction,
  loadingFitResults,
}): ReactElement => {
  // States to store the data from the fit results
  const [parameterTables, setParameterTables] = useState<ParameterTable[]>([]);
  const [chi2, setChi2] = useState<number | string>("-");
  const [reducedChi2, setReducedChi2] = useState<number | string>("-");
  const [fittedPoints, setFittedPoints] = useState<FittedDatapoint[]>([]);

  // Keeps track of wether to display only the dataset or the fit results
  const [datasetOnly, setDatasetOnly] = useState<boolean>(false);

  // When fitResults changes update all data
  useEffect(() => {
    setDatasetOnly(false);

    if (
      !fitResults ||
      !fitResults["par-tables"] ||
      !fitResults["fit-results"] ||
      !fitResults["fit-curves"]
    ) {
      console.log("Returned");
      return;
    }

    if (fitResults["fit-curves"][0] === "dataset-only") {
      setFittedPoints([]);
      setParameterTables([]);
      setChi2("-");
      setReducedChi2("-");
      setDatasetOnly(true);
      console.log("Dataset only", datasetOnly);
      return;
    }

    // Retrive the parameters from the fit results
    const parameterTables = fitResults["par-tables"][0];
    setParameterTables(parameterTables);

    // Retrieve the statistics from the fit results
    const chi2 = extractChiSquared(fitResults["fit-results"]);
    setChi2(chi2);

    // Calculate the number of datapoints
    const numberOfPoints = selectedDataset.datapoints.length;

    // Calculate the number of free parameters
    const numberOfFreeParameters = parameterTables.filter(
      (param) => param.free
    ).length;

    // Calculate the reduced chi squared
    const reducedChi2 =
      typeof chi2 === "number"
        ? chi2 / (numberOfPoints - numberOfFreeParameters)
        : "-";
    setReducedChi2(reducedChi2);

    // Fetch the fitted points from the fit results
    const fittedPoints = extractXYPairs(fitResults["fit-curves"][0]);
    setFittedPoints(fittedPoints);
  }, [fitResults]);

  if (loadingFitResults) {
    return (
      <div className="w-full flex flex-col gap-y-8 pt-10">
        <div className="flex flex-col items-start w-full">
          <h1 className="text-white font-semibold text-lg">Results</h1>
          <p className="text-zinc-500 text-base font-normal">
            Showing results for {selectedFunction.name} and{" "}
            {selectedDataset.name}
          </p>
        </div>
        <div className="w-full h-fit bg-zinc-600/20 backdrop-blur-md px-7 py-5 flex flex-row gap-x-5 items-center justify-center rounded-lg animate-pulse duration-1000 transition-opacity">
          <ArrowPathIcon className="w-10 h-10 text-orange-500" />
          <div className="flex flex-col items-start">
            <p className="text-md font-medium text-zinc-300">
              Loading fit results...
            </p>
            <p className="text-base font-normal  text-zinc-500">
              Please wait while the fit results are being processed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (datasetOnly) {
    return (
      <div className="w-full flex flex-col gap-y-8 pt-10">
        <div className="flex flex-col items-start w-full">
          <h1 className="text-white font-semibold text-lg">Results</h1>
          <p className="text-zinc-500 text-base font-normal">
            Showing plot of {selectedDataset.name}
          </p>
        </div>

        <div className="w-full px-14">
          <MyChart
            dataPoints={selectedDataset.datapoints}
            fittedPoints={fittedPoints}
            datasetName={selectedDataset.name}
            functionName={selectedFunction.name}
            independentVariableName={selectedDataset.independentVariableName}
            dependentVariableName={selectedDataset.dependentVariableName}
            datasetOnly={true}
          />
        </div>
      </div>
    );
  }

  if (errorFetchingFitResults) {
    return (
      <div className="w-full flex flex-col gap-y-8 pt-10">
        <div className="flex flex-col items-start w-full">
          <h1 className="text-white font-semibold text-lg">Results</h1>
          <p className="text-zinc-500 text-base font-normal">
            Showing results for {selectedFunction.name} and{" "}
            {selectedDataset.name}
          </p>
        </div>
        <div className="w-full h-fit bg-zinc-600/20 backdrop-blur-md px-7 py-5 flex flex-row gap-x-5 items-center justify-center rounded-lg">
          <ExclamationCircleIcon className="w-10 h-10 text-orange-500" />
          <div className="flex flex-col items-start">
            <p className="text-md font-medium text-zinc-300">
              An error occurred while fetching the fit results!
            </p>
            <p className="text-base font-normal  text-zinc-500">
              {errorFetchingFitResults}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!fitResults) {
    return (
      <div className="w-full flex flex-col gap-y-8 pt-10">
        <div className="flex flex-col items-start w-full">
          <h1 className="text-white font-semibold text-lg">Results</h1>
          <p className="text-zinc-500 text-base font-normal">
            Showing results for {selectedFunction.name} and{" "}
            {selectedDataset.name}
          </p>
        </div>
        <div className="w-full h-fit bg-zinc-600/20 backdrop-blur-md px-7 py-5 flex flex-row gap-x-5 items-center justify-center rounded-lg">
          <ExclamationCircleIcon className="w-10 h-10 text-orange-500" />
          <div className="flex flex-col items-start">
            <p className="text-md font-medium text-zinc-300">
              There are no fit results available!
            </p>
            <p className="text-base font-normal  text-zinc-500">
              Please fit the data to see the results.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-y-8 pt-10">
      <div className="flex flex-col items-start w-full">
        <h1 className="text-white font-semibold text-lg">Results</h1>
        <p className="text-zinc-500 text-base font-normal">
          Showing results for {selectedFunction.name} and {selectedDataset.name}
        </p>
      </div>

      <div className="w-full px-14">
        <MyChart
          dataPoints={selectedDataset.datapoints}
          fittedPoints={fittedPoints}
          datasetName={selectedDataset.name}
          functionName={selectedFunction.name}
          independentVariableName={selectedDataset.independentVariableName}
          dependentVariableName={selectedDataset.dependentVariableName}
        />
      </div>

      <div className="flex flex-row-reverse items-start gap-x-20">
        {/*Parameters Table*/}
        <div className="relative w-full">
          <table className="w-full text-sm text-left rtl:text-right divide-y rounded-md overflow-hidden divide-zinc-500">
            <thead className="bg-zinc-600/20">
              <tr>
                <th
                  scope="col"
                  className="px-10 py-3 font-semibold text-sm text-white"
                >
                  Parameter
                </th>
                <th
                  scope="col"
                  className="px-10 py-3 font-semibold text-sm text-white"
                >
                  Value
                </th>
                <th
                  scope="col"
                  className="px-10 py-3 font-semibold text-sm text-white"
                >
                  Error
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-500">
              {parameterTables.map((parameter, index) => (
                <tr key={index} className="">
                  <th
                    scope="row"
                    className="px-10 py-4 font-normal text-zinc-300 whitespace-nowrap"
                  >
                    {parameter.name}
                  </th>
                  <td className="px-10 py-4 font-normal text-zinc-400 whitespace-nowrap">
                    {parameter.value}
                  </td>
                  <td className="px-10 py-4 font-normal text-zinc-400 whitespace-nowrap">
                    {parameter.err}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/*Statistics Table*/}
        <div className="relative w-fit">
          <table className="w-full text-sm text-left rtl:text-right divide-y divide-zinc-500 rounded-md overflow-hidden">
            <thead className="bg-zinc-600/20">
              <tr>
                <th
                  scope="col"
                  className="px-10 py-3 font-semibold text-sm text-white"
                >
                  Statistic
                </th>
                <th
                  scope="col"
                  className="px-10 py-3 font-semibold text-sm text-white"
                >
                  Value
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-500">
              <tr key="Chi2" className="">
                <th
                  scope="row"
                  className="px-10 py-4 font-normal text-zinc-300 whitespace-nowrap"
                >
                  Chi Squared
                </th>
                <td className="px-10 py-4 font-normal text-zinc-400 whitespace-nowrap">
                  {chi2}
                </td>
              </tr>
              <tr key="Reduced Chi2" className="">
                <th
                  scope="row"
                  className="px-10 py-4 font-normal text-zinc-300 whitespace-nowrap"
                >
                  Reduced Chi Squared
                </th>
                <td className="px-10 py-4 font-normal text-zinc-400 whitespace-nowrap">
                  {reducedChi2}
                </td>
              </tr>
              <tr key="points" className="">
                <th
                  scope="row"
                  className="px-10 py-4 font-normal text-zinc-300 whitespace-nowrap"
                >
                  Points
                </th>
                <td className="px-10 py-4 font-normal text-zinc-400 whitespace-nowrap">
                  {selectedDataset.datapoints.length}
                </td>
              </tr>
              <tr key="freeParameters" className="">
                <th
                  scope="row"
                  className="px-10 py-4 font-normal text-zinc-300 whitespace-nowrap"
                >
                  Free Parameters
                </th>
                <td className="px-10 py-4 font-normal text-zinc-400 whitespace-nowrap">
                  {parameterTables.filter((param) => param.free).length}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

interface FittingMenuProps {
  selectedFunction: Function;
  selectedDataset: Dataset;
  updateSelectedDataset: (datasetName: string) => void;
  updateSelectedFunction: (functionName: string) => void;
  globalFit: boolean;
  setGlobalFit: (value: boolean) => void;
}

const FittingMenu: FC<FittingMenuProps> = ({
  selectedFunction,
  selectedDataset,
  updateSelectedDataset,
  updateSelectedFunction,
  globalFit,
  setGlobalFit,
}): ReactElement => {
  // State to store the parameters
  const [parameters, setParameters] = useState<Parameter[]>([]);

  // State to store an error status of the parameters parsing
  const [errorParsingParameters, setErrorParsingParameters] = useState<
    string | null
  >(null);

  // State to store the fit reults
  const [fitResults, setFitResults] = useState<FitResponse | null>(null);

  // State to store an error fetching the fit results
  const [errorFetchingFitResults, setErrorFetchingFitResults] = useState<
    string | null
  >(null);

  // State to store the loading state of the fit results
  const [loadingFitResults, setLoadingFitResults] = useState<boolean>(false);

  // Function to update the fit resuls
  async function updateFitResults(
    selectedDataset: Dataset,
    selectedFunction: Function,
    isFitGlobal: boolean,
    datasetOnly?: boolean
  ) {
    setErrorFetchingFitResults(null);
    setLoadingFitResults(true);

    if (datasetOnly) {
      console.log("Dataset only", datasetOnly);
      setFitResults({
        "fit-curves": ["dataset-only"],
        "fit-results": "dataset-only",
        "par-tables": [[]],
      } as FitResponse);
      setLoadingFitResults(false);
      console.log(fitResults);
      return;
    }

    const response = await fetch("/api/fit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        selectedDataset,
        selectedFunction,
        isFitGlobal,
      }),
    });

    if (!response.ok) {
      setLoadingFitResults(false);
      const errorJson = await response.json();
      setErrorFetchingFitResults(errorJson.error);
      return;
    }

    const data = await response.json();
    setFitResults(data);
    setLoadingFitResults(false);
  }

  // Whenever the selected function changes, update the parameters
  useEffect(() => {
    const functionInput: FunctionInput = {
      mainFunction: selectedFunction.mainFunction,
      subfunctions: selectedFunction.subfunctions,
    };

    const parsedOutput = parseFunction(functionInput);

    // If the function is not valid, return
    if (typeof parsedOutput === "string") {
      setErrorParsingParameters(parsedOutput);
      return;
    }

    // Get the previous parameters
    const previousParameters =
      getFunctions().find((f) => f.id === selectedFunction.id)?.parameters ||
      ([] as Parameter[]);

    // If the previous parameters are the same as the computed ones, keep the previous values
    if (
      previousParameters.length === parsedOutput.parameters.length &&
      parsedOutput.parameters.every(
        (parameter, index) => parameter === previousParameters[index].name
      )
    ) {
      const newParameters: Parameter[] = previousParameters.map(
        (parameter) => ({
          name: parameter.name,
          Min: parameter.Min,
          Max: parameter.Max,
          fixed: parameter.fixed,
          initialValue: parameter.initialValue,
          error: parameter.error,
        })
      );

      // Update the parameters
      updateParameters(newParameters, selectedFunction);
      setParameters(newParameters);
      // Update the dependentVariable, independentVariable and processed function
      updateIndepentVariable(parsedOutput.independentVar, selectedFunction);
      updateDependentVariable(parsedOutput.dependentVar, selectedFunction);
      updateProcessedFunction(parsedOutput.processedFunction, selectedFunction);
      return;
    }

    // If the previous parameters are different, reset the values
    const newParameters: Parameter[] = parsedOutput.parameters.map(
      (parameter) => ({
        name: parameter,
        Min: -1000,
        Max: 1000,
        fixed: false,
        initialValue: 0,
        error: 0,
      })
    );
    updateParameters(newParameters, selectedFunction);
    setParameters(newParameters);
    // Update the dependentVariable, independentVariable and the processed function
    updateIndepentVariable(parsedOutput.independentVar, selectedFunction);
    updateDependentVariable(parsedOutput.dependentVar, selectedFunction);
    updateProcessedFunction(parsedOutput.processedFunction, selectedFunction);
  }, [selectedFunction]);

  // Upadate the parameters min value
  const updateMin = (index: number, value: number) => {
    const newParameters = [...parameters];
    newParameters[index].Min = value;
    updateParameters(newParameters, selectedFunction);
    setParameters(newParameters);
  };

  // Update the parameters max vallue
  const updateMax = (index: number, value: number) => {
    const newParameters = [...parameters];
    newParameters[index].Max = value;
    updateParameters(newParameters, selectedFunction);
    setParameters(newParameters);
  };

  // Update the parameters fixed value
  const updateFixed = (index: number, value: boolean) => {
    const newParameters = [...parameters];
    newParameters[index].fixed = value;
    updateParameters(newParameters, selectedFunction);
    setParameters(newParameters);
  };

  // Update the parameters initialValue
  const updateInitialValue = (index: number, value: number) => {
    const newParameters = [...parameters];
    newParameters[index].initialValue = value;
    updateParameters(newParameters, selectedFunction);
    setParameters(newParameters);
  };

  return (
    <div className="flex flex-col w-full divide-zinc-500">
      <FittingDefinitionMenu
        parameters={parameters}
        updateMax={updateMax}
        updateMin={updateMin}
        updateFixed={updateFixed}
        updateInitialValue={updateInitialValue}
        selectedFunction={selectedFunction}
        selectedDataset={selectedDataset}
        updateSelectedFunction={updateSelectedFunction}
        updateSelectedDataset={updateSelectedDataset}
        globalFit={globalFit}
        setGlobalFit={setGlobalFit}
        errorParsingParameters={errorParsingParameters}
        updateFitResults={updateFitResults}
      />
      {parameters.length !== 0 && (
        <FittingResultsMenu
          fitResults={fitResults}
          errorFetchingFitResults={errorFetchingFitResults}
          selectedDataset={selectedDataset}
          selectedFunction={selectedFunction}
          loadingFitResults={loadingFitResults}
        />
      )}
    </div>
  );
};

export default FittingMenu;
