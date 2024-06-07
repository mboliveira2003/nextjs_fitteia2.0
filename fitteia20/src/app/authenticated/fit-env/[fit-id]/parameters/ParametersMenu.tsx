import { Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import React, {
  FC,
  ReactElement,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";

import LabeledSwitch from "@/components/common/forms/LabeledSwitch";
import Input from "@/components/common/forms/input";
import DatasetSelection from "@/components/common/forms/DatasetSelection";
import { Function, Parameter } from "@/app/types";
import { parseString } from "@/utils/extractParameters";

interface ParameterDefenitionMenuProps {
  parameters: Parameter[];
  updateMax: (index: number, value: number) => void;
  updateMin: (index: number, value: number) => void;
  updateFixed: (index: number, value: boolean) => void;
  updateInitialValue: (index: number, value: number) => void;
  functionId: number;
}

const ParameterDefenitionMenu: FC<ParameterDefenitionMenuProps> = ({
  parameters,
  updateMax,
  updateMin,
  updateFixed,
  updateInitialValue,
  functionId,
}): ReactElement => {
  return (
    <div className="flex flex-col items-start w-full gap-y-8">
      {/*Header and Fit button*/}
      <div className="flex flex-row w-full justify-between items-center">
        <div className="flex flex-col items-start w-full">
          <h1 className="text-white font-semibold text-lg">Parameters</h1>
          <p className="text-zinc-500 text-base font-normal">
            Manipulate the parameters of function {functionId}
          </p>
        </div>

        {/*Fit button*/}
        <button className="flex flex-row whitespace-nowrap items-center cursor-pointer text-sm group justify-center text-white shadow-md shadow-orange-500/10 font-semibold hover:scale-[0.98] ease-in-out transition-all duration-150 bg-orange-500 gap-x-1.5 px-3 py-2 rounded-md">
          Save and fit
        </button>
      </div>

      <table className="min-w-full divide-y divide-zinc-500">
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
  );
};

interface ParameterResultsMenuProps {
  parameters: Parameter[];
  datasetNames: string[];
  selectedDatasets: string[];
  updateSelectedDatasets: (dataset: string[]) => void;
}

const ParameterResultsMenu: FC<ParameterResultsMenuProps> = ({
  parameters,
  datasetNames,
  selectedDatasets,
  updateSelectedDatasets,
}): ReactElement => {
  return (
    <div className="w-full flex flex-col gap-y-8 pt-10">
      <div className="flex flex-col items-start w-full">
        <h1 className="text-white font-semibold text-lg">Results</h1>
        <p className="text-zinc-500 text-base font-normal">
          Select a dataset to view a fitting result
        </p>
      </div>

      <div className="w-full">
        <label
          htmlFor="View results for"
          className="mb-2 block text-sm font-medium text-zinc-300"
        >
          View results for
        </label>
        <DatasetSelection
          datasetNames={datasetNames}
          selectedDatasets={selectedDatasets}
          updateSelectedDatasets={updateSelectedDatasets}
        />
      </div>

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

interface ParametersMenuProps {
  currentFunction: Function;
  selectedDatasets: string[];
  updateSelectedDatasets: (dataset: string[]) => void;
}

const ParametersMenu: FC<ParametersMenuProps> = ({
  currentFunction,
  selectedDatasets,
  updateSelectedDatasets,
}): ReactElement => {
  
  // State to store the expansion state of the menu
  const [isExpanded, setIsExpanded] = useState(false);

  // State to store the parameters
  const [parameters, setParameters] = useState<Parameter[]>([]);

  // Find the parameters of the function whenever on mount
  useEffect(() => {
    const mainFunction = currentFunction.mainFunction;
    const subFunctions = currentFunction.subfunctions;

    const allowedVariableNames = ["x", "y", "z", "w"];

    // The parameters correspond to all the characters or small words in the main function and subfunctions that are not
    // part of the allowed variable names, are not numbers and are not mathemathical operators

    // Extract the parameters from the main function


   
  }, []);

  console.log("Parameters for ", currentFunction.name, parameters);

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
    <div
      key={currentFunction.id}
      className={clsx(
        " items-start flex flex-col cursor-pointer text-sm group justify-center text-zinc-300 font-semibold  transition-all duration-300 ease-in-out"
      )}
    >
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className={clsx(
          isExpanded
            ? "bg-zinc-500 bg-opacity-20"
            : "hover:bg-zinc-600 hover:bg-opacity-20",
          "w-full h-full flex flex-row items-center gap-x-1.5 transition-all ease-in-out duration-300 px-3 py-2"
        )}
      >
        {currentFunction.name}
        {isExpanded ? (
          <ChevronDownIcon className="h-5 w-5 transform rotate-180" />
        ) : (
          <ChevronDownIcon className="h-5 w-5" />
        )}
      </div>

      <Transition
        as="div"
        show={isExpanded}
        appear={true}
        enter="transition ease-in-out duration-300 transform origin-top"
        enterFrom="opacity-0 scale-y-0"
        enterTo="opacity-100 scale-y-100"
        leave="transition ease-in-out duration-300 transform origin-top hidden"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-0"
        className="h-fit w-full"
      >
        <div className="flex-col flex w-full px-24 py-8 items-center divide-y divide-zinc-600">
          <ParameterDefenitionMenu
            parameters={parameters}
            updateMax={updateMax}
            updateMin={updateMin}
            updateFixed={updateFixed}
            updateInitialValue={updateInitialValue}
            functionId={currentFunction.id}
          />
          <ParameterResultsMenu
            parameters={parameters}
            datasetNames={currentFunction.appliesToDatasets}
            updateSelectedDatasets={updateSelectedDatasets}
            selectedDatasets={selectedDatasets}
          />
        </div>
      </Transition>
    </div>
  );
};

export default ParametersMenu;
