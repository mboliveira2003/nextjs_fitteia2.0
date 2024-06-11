import React, { FC, ReactElement, useEffect, useState } from "react";

import LabeledSwitch from "@/components/common/forms/LabeledSwitch";
import Input from "@/components/common/forms/input";
import { SingleElementSelection } from "@/components/common/forms/ElementSelection";
import { Dataset, Function, Parameter } from "@/app/types";
import parseFunction, { FunctionInput } from "@/utils/parseFunction";
import MyChart from "@/components/common/charts/ScatterPlot";

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
}): ReactElement => {
  return (
    <div className="flex flex-col items-start w-full gap-y-8">
      {/*Header and Fit button*/}
      <div className="flex flex-row w-full justify-between items-center">
        <div className="flex flex-col items-start w-full">
          <h1 className="text-white font-semibold text-lg">
            Fitting Environment
          </h1>
          <p className="text-zinc-500 text-base font-normal">
            Choose a function and dataset to fit
          </p>
        </div>

        {/*Fit button*/}
        <button className="flex flex-row whitespace-nowrap items-center cursor-pointer text-sm group justify-center text-white shadow-md shadow-orange-500/10 font-semibold hover:scale-[0.98] ease-in-out transition-all duration-150 bg-orange-500 gap-x-1.5 px-3 py-2 rounded-md">
          Save and fit
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
      </div>

      <div className="flex flex-col items-center gap-y-6 w-full">
        <div className="w-full">
          <label
            htmlFor="Choose a function"
            className="mb-2 block text-sm font-medium text-zinc-300"
          >
            Fit Type
          </label>

          <LabeledSwitch
            enabledLabel="Individual"
            disabledLabel="Global"
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
          Parameters
        </label>
        <table className="min-w-full divide-y divide-zinc-500 ">
          {/*Table header*/}

          <thead>
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
                    value={parameter.Min || -1000}
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
                    value={parameter.initialValue || 0}
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
                    value={parameter.Max || 1000}
                    onChange={(e) => {
                      updateMax(index, parseFloat(e.target.value));
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

interface ParameterResultsMenuProps {
  parameters: Parameter[];
  selectedDataset: Dataset;
  selectedFunction: Function;
}

const ParameterResultsMenu: FC<ParameterResultsMenuProps> = ({
  parameters,
  selectedDataset,
  selectedFunction,
}): ReactElement => {
  // Fetch the fitted points for the current selected dataset and function
  // For now generate 20 random datapoints
  const fittedPoints = Array.from({ length: 20 }, () => ({
    independentVariable: Math.random() * 10,
    independentVariableError: Math.random() * 0.5,
    dependentVariable: Math.random() * 10,
    dependentVariableError: Math.random() * 0.5,
  }));

  return (
    <div className="w-full flex flex-col gap-y-8 pt-10">
      <div className="flex flex-col items-start w-full">
        <h1 className="text-white font-semibold text-lg">Results</h1>
        <p className="text-zinc-500 text-base font-normal">
          Showing results for {selectedFunction.name} and {selectedDataset.name}
        </p>
      </div>

      <MyChart
        dataPoints={selectedDataset.datapoints}
        fittedPoints={fittedPoints}
      />

      <div className="flex flex-col items-start gap-y-4">
        {/*Parameters Table*/}
        <div className="relative overflow-x-auto w-full">
          <table className="w-full text-sm text-left rtl:text-right divide-y divide-zinc-500">
            <thead className="">
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
              {parameters.map((parameter, index) => (
                <tr key={index} className="">
                  <th
                    scope="row"
                    className="px-10 py-4 font-medium text-zinc-300 whitespace-nowrap"
                  >
                    {parameter.name}
                  </th>
                  <td className="px-10 py-4 font-medium text-zinc-400 whitespace-nowrap">
                    {parameter.initialValue}
                  </td>
                  <td className="px-10 py-4 font-medium text-zinc-400 whitespace-nowrap">
                    {parameter.error}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/*Statistics Table*/}
        <div className="relative overflow-x-auto w-fit">
          <table className="w-full text-sm text-left rtl:text-right divide-y divide-zinc-500">
            <thead className="">
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
                  className="px-10 py-4 font-medium text-zinc-300 whitespace-nowrap"
                >
                  Chi Squared
                </th>
                <td className="px-10 py-4 font-medium text-zinc-400 whitespace-nowrap">
                  0.727
                </td>
              </tr>
              <tr key="points" className="">
                <th
                  scope="row"
                  className="px-10 py-4 font-medium text-zinc-300 whitespace-nowrap"
                >
                  Points
                </th>
                <td className="px-10 py-4 font-medium text-zinc-400 whitespace-nowrap">
                  123
                </td>
              </tr>
              <tr key="freeParameters" className="">
                <th
                  scope="row"
                  className="px-10 py-4 font-medium text-zinc-300 whitespace-nowrap"
                >
                  Free Parameters
                </th>
                <td className="px-10 py-4 font-medium text-zinc-400 whitespace-nowrap">
                  3
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

  // Whenever the selected function changes, update the parameters
  useEffect(() => {
    console.log("I was called!");
    const functionInput: FunctionInput = {
      mainFunction: selectedFunction.mainFunction,
      subfunctions: selectedFunction.subfunctions,
    };

    console.log("Function Input:", functionInput);

    const parsedOutput = parseFunction(functionInput);

    console.log("Parsed Output:", parsedOutput);
    if (typeof parsedOutput !== "string") {
      setParameters(
        parsedOutput.parameters.map((parameter) => ({
          name: parameter,
          Min: -1000,
          Max: 1000,
          fixed: false,
          initialValue: 0,
          error: 0,
        }))
      );
    }
  }, [selectedFunction]);

  console.log(parameters);

  // Upadate the parameters min value
  const updateMin = (index: number, value: number) => {
    const newParameters = [...parameters];
    newParameters[index].Min = value;
    setParameters(newParameters);
  };

  // Update the parameters max vallue
  const updateMax = (index: number, value: number) => {
    const newParameters = [...parameters];
    newParameters[index].Max = value;
    setParameters(newParameters);
  };

  // Update the parameters fixed value
  const updateFixed = (index: number, value: boolean) => {
    const newParameters = [...parameters];
    newParameters[index].fixed = value;
    setParameters(newParameters);
  };

  // Update the parameters initialValue
  const updateInitialValue = (index: number, value: number) => {
    const newParameters = [...parameters];
    newParameters[index].initialValue = value;
    setParameters(newParameters);
  };

  return (
    <div className="flex flex-col w-full divide-y divide-zinc-500">
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
      />
      <ParameterResultsMenu
        parameters={parameters}
        selectedDataset={selectedDataset}
        selectedFunction={selectedFunction}
      />
    </div>
  );
};

export default FittingMenu;
