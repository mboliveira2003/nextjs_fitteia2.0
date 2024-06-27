import React, { FC, ReactElement, useEffect, useState } from "react";

import LabeledSwitch from "@/components/common/forms/LabeledSwitch";
import Input from "@/components/common/forms/input";
import {
  MultipleElementSelection,
  SingleElementSelection,
} from "@/components/common/forms/ElementSelection";
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
  ExclamationTriangleIcon,
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

interface FittingDefinitionMenuProps {
  parameters: Parameter[];
  updateMax: (index: number, value: number) => void;
  updateMin: (index: number, value: number) => void;
  updateFixed: (index: number, value: boolean) => void;
  updateInitialValue: (index: number, value: number) => void;
  selectedFunction: Function;
  selectedDatasets: Dataset[];
  updateSelectedFunction: (functionName: string) => void;
  updateSelectedDatasets: (datasetNames: string[]) => void;
  globalFit: boolean;
  setGlobalFit: (value: boolean) => void;
  errorParsingParameters?: string | null;
  updateFitResults: (
    selectedDatasets: Dataset[],
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
  selectedDatasets,
  updateSelectedFunction,
  updateSelectedDatasets,
  globalFit,
  setGlobalFit,
  errorParsingParameters,
  updateFitResults,
}): ReactElement => {
  // Function to scroll to the div with id results.
  // The top pf the div should touch the top of the screen when the scroll is complete
  const scrollToResults = () => {
    const resultsDiv = document.getElementById("results");
    if (resultsDiv) {
      resultsDiv.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

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
          onClick={() => {
            updateFitResults(
              selectedDatasets,
              selectedFunction,
              globalFit,
              true
            ),
              scrollToResults();
          }}
          className="flex flex-row whitespace-nowrap items-center cursor-pointer text-sm group justify-center text-white shadow-md shadow-zinc-700/10 font-semibold hover:bg-zinc-500 ease-in-out transition-all duration-200 bg-zinc-600 gap-x-1.5 px-3 py-2 rounded-md"
        >
          {selectedDatasets.length > 1 ? "Plot datasets" : "Plot dataset"}
        </button>
        <button
          onClick={() => {
            updateFitResults(
              selectedDatasets,
              selectedFunction,
              globalFit,
              false
            ),
              scrollToResults();
          }}
          className="flex flex-row whitespace-nowrap items-center cursor-pointer text-sm group justify-center text-white shadow-md shadow-orange-500/10 font-semibold hover:bg-orange-600 ease-in-out transition-all duration-200 bg-orange-500 gap-x-1.5 px-3 py-2 rounded-md"
        >
          {selectedDatasets.length > 1 ? "Fit datasets" : "Fit dataset"}
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

          <MultipleElementSelection
            selectedElementNames={selectedDatasets.map(
              (dataset) => dataset.name
            )}
            updateSelectedElementNames={updateSelectedDatasets}
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
            defaultSwitchToDisabled={selectedDatasets.length === 1}
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
  fittedDatasets: Dataset[];
  fittedFunction: Function | null;
  loadingFitResults: boolean;
}

const FittingResultsMenu: FC<FittingResultsMenuProps> = ({
  fitResults,
  errorFetchingFitResults,
  fittedDatasets,
  fittedFunction,
  loadingFitResults,
}): ReactElement => {
  const isFitGlobal = fitResults ? fitResults.FitType === "Global" : false;

  const parameterTables: ParameterTable[][] = fitResults
    ? fitResults["par-tables"]
    : [];

  const chi2Array = fitResults
    ? extractChiSquared(fitResults["fit-results"])
    : [];

  const reducedChi2Array =
    chi2Array.length > 0
      ? chi2Array.map(
          (chi2, index) =>
            chi2 /
            (fittedDatasets[index].datapoints.length -
              parameterTables[isFitGlobal ? 0 : index].filter(
                (param) => param.free
              ).length)
        )
      : [];

  const fittedPointsArray = fitResults
    ? fitResults["fit-curves"].map((curveString) =>
        curveString ? extractXYPairs(curveString) : []
      )
    : [];

  const datasetOnly = fitResults
    ? fitResults["fit-curves"][0] === "dataset-only"
    : false;

  console.log("Fit Results:", fitResults)
  console.log("Parameter Tables:", parameterTables)
  console.log("Chi2 Array:", chi2Array)
  console.log("Reduced Chi2 Array:", reducedChi2Array)
  console.log("Fitted Points Array:", fittedPointsArray)
  console.log("Fitted Datasets:", fittedDatasets)
  console.log("Fitted Function:", fittedFunction)

  if (loadingFitResults) {
    return (
      <div id="results" className="w-full flex flex-col gap-y-8 pt-10">
        <div className="flex flex-col items-start w-full">
          <h1 className="text-white font-semibold text-lg">Results</h1>
          <p className="text-zinc-500 text-base font-normal">
            View your plotted datasets and fitted functions
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

  if (errorFetchingFitResults) {
    return (
      <div id="results" className="w-full flex flex-col gap-y-8 pt-10">
        <div className="flex flex-col items-start w-full">
          <h1 className="text-white font-semibold text-lg">Results</h1>
          <p className="text-zinc-500 text-base font-normal">
            View your plotted datasets and fitted functions
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

  if (datasetOnly) {
    return (
      <div id="results" className="w-full flex flex-col gap-y-8 pt-10">
        <div className="flex flex-col items-start w-full">
          <h1 className="text-white font-semibold text-lg">Results</h1>
          <p className="text-zinc-500 text-base font-normal">
            Showing plot of {fittedDatasets[0].name}{" "}
            {fittedDatasets.length > 1 &&
              "to " + fittedDatasets[fittedDatasets.length - 1].name}
          </p>
        </div>

        {fittedDatasets.map((dataset, index) => (
          <div className="w-full px-14" key={index}>
            <MyChart
              dataPoints={fittedDatasets[index].datapoints}
              // Need to update to select the correct fitted points
              fittedPoints={[]}
              datasetName={dataset.name}
              functionName={""}
              independentVariableName={dataset.independentVariableName}
              dependentVariableName={dataset.dependentVariableName}
              datasetOnly={true}
            />
          </div>
        ))}
      </div>
    );
  }

  if (
    !fitResults ||
    parameterTables.length === 0 ||
    fittedPointsArray.length === 0 ||
    fittedDatasets.length === 0 ||
    !fittedFunction
  ) {
    return (
      <div id="results" className="w-full flex flex-col gap-y-8 pt-10">
        <div className="flex flex-col items-start w-full">
          <h1 className="text-white font-semibold text-lg">Results</h1>
          <p className="text-zinc-500 text-base font-normal">
            View your plotted datasets and fitted functions
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
    <div id="results" className="w-full flex flex-col gap-y-8 pt-10">
      <div className="flex flex-col items-start w-full">
        <h1 className="text-white font-semibold text-lg">Results</h1>
        <p className="text-zinc-500 text-base font-normal">
          Showing results for {fittedFunction.name} and {fittedDatasets[0].name}{" "}
          {fittedDatasets.length > 1 &&
            "to " + fittedDatasets[fittedDatasets.length - 1].name}
        </p>
      </div>

      {fittedDatasets.map((dataset, index) => (
        <div className="w-full h-full flex flex-col gap-y-10" key={index}>
          <div className="w-full px-14">
            <MyChart
              dataPoints={dataset.datapoints}
              // Need to update to select the correct fitted points
              fittedPoints={fittedPointsArray[index] || []}
              datasetName={dataset.name}
              functionName={fittedFunction.name}
              independentVariableName={dataset.independentVariableName}
              dependentVariableName={dataset.dependentVariableName}
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
                      className="px-10 py-3 flex flex-row gap-x-2 items-center font-semibold text-sm text-white"
                    >
                      Error
                      <ExclamationTriangleIcon title="These errors may not provide a correct estimate of the true uncertainty of the fitted values of the parameters." className="w-4 h-4 text-orange-400 cursor-pointer mt-1" />
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-500">
                  {parameterTables[isFitGlobal ? 0 : index]?.map(
                    (parameter, paramIndex) => (
                      <tr key={paramIndex} className="">
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
                    )
                  )}
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
                      {chi2Array[index] ? chi2Array[index] : "N/A"}
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
                      {reducedChi2Array[index] ? reducedChi2Array[index] : "N/A"}
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
                      {fittedDatasets[index].datapoints.length}
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
                      {
                        parameterTables[isFitGlobal ? 0 : index].filter(
                          (param) => param.free
                        ).length
                      }
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

interface FittingMenuProps {
  selectedFunction: Function;
  selectedDatasets: Dataset[];
  updateSelectedDatasets: (datasetNames: string[]) => void;
  updateSelectedFunction: (functionName: string) => void;
  globalFit: boolean;
  setGlobalFit: (value: boolean) => void;
}

const FittingMenu: FC<FittingMenuProps> = ({
  selectedFunction,
  selectedDatasets,
  updateSelectedDatasets,
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

  // State to store the previously fitted datasets
  const [previousDatasets, setPreviousDatasets] = useState<Dataset[]>([]);

  // State to store the previously fitted function
  const [previousFunction, setPreviousFunction] = useState<Function | null>(
    null
  );

  // Function to update the fit resuls
  async function updateFitResults(
    selectedDatasets: Dataset[],
    selectedFunction: Function,
    isFitGlobal: boolean,
    datasetOnly?: boolean
  ) {
    setErrorFetchingFitResults(null);
    setLoadingFitResults(true);

    // Store the datasets and the function used for this fit
    setPreviousDatasets(selectedDatasets);
    setPreviousFunction(selectedFunction);

    if (datasetOnly) {
      setFitResults({
        "fit-curves": ["dataset-only"],
        "fit-results": "dataset-only",
        "par-tables": [],
      } as FitResponse);
      setLoadingFitResults(false);
      return;
    }

    const response = await fetch("/api/fit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        selectedDatasets,
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
    // Verify if all the selected datasets have the same auxiliary variables name
    const firstAuxiliarIndependentVariablesArrayName =
      selectedDatasets[0].auxiliarIndependentVariablesArrayName;
    const auxiliarIndependentVariablesArrayNameEqual = selectedDatasets.every(
      (dataset) =>
        dataset.auxiliarIndependentVariablesArrayName ===
        firstAuxiliarIndependentVariablesArrayName
    );

    const functionInput: FunctionInput = {
      mainFunction: selectedFunction.mainFunction,
      subfunctions: selectedFunction.subfunctions,
      auxiliaryVariable: auxiliarIndependentVariablesArrayNameEqual
        ? selectedDatasets[0].auxiliarIndependentVariablesArrayName
        : "",
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
        initialValue: 1,
        error: 0,
      })
    );
    updateParameters(newParameters, selectedFunction);
    setParameters(newParameters);
    // Update the dependentVariable, independentVariable and the processed function
    updateIndepentVariable(parsedOutput.independentVar, selectedFunction);
    updateDependentVariable(parsedOutput.dependentVar, selectedFunction);
    updateProcessedFunction(parsedOutput.processedFunction, selectedFunction);
  }, [selectedFunction, selectedDatasets]);

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
        selectedDatasets={selectedDatasets}
        updateSelectedFunction={updateSelectedFunction}
        updateSelectedDatasets={updateSelectedDatasets}
        globalFit={globalFit}
        setGlobalFit={setGlobalFit}
        errorParsingParameters={errorParsingParameters}
        updateFitResults={updateFitResults}
      />
      {parameters.length !== 0 && (
        <FittingResultsMenu
          fitResults={fitResults}
          errorFetchingFitResults={errorFetchingFitResults}
          fittedDatasets={previousDatasets}
          fittedFunction={previousFunction}
          loadingFitResults={loadingFitResults}
        />
      )}
    </div>
  );
};

export default FittingMenu;
