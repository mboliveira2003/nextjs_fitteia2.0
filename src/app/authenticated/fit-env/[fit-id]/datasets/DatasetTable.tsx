"use client";

import { ChevronDownIcon} from "@heroicons/react/20/solid";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import React, { FC, useState } from "react";

import Input from "@/components/common/forms/input";
import {
  ChevronUpIcon,
  PlusCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { PencilIcon, ArrowsUpDownIcon } from "@heroicons/react/20/solid";
import { Transition } from "@headlessui/react";

import { AuxiliarIndependentVariable, Datapoint, Dataset } from "@/app/types";

/*Main Table Components*/
interface DatasetTableHeaderProps {
  datapoints: Datapoint[];
  updateDatapoints: (newDatapoints: Datapoint[]) => void;
  variableNames: {
    dependentVariableName: string;
    independentVariableName: string;
  };
  updateVariableNames: (
    dependentVariableName: string,
    independentVariableName: string
  ) => void;
}

const DatasetTableHeader: FC<DatasetTableHeaderProps> = ({
  datapoints,
  updateDatapoints,
  variableNames,
  updateVariableNames,
}) => {
  // States to store if the user is editing the variable names
  const [editingDependentVariable, setEditingDependentVariable] =
    useState(false);
  const [editingInDependentVariable, setEditingInDependentVariable] =
    useState(false);

  return (
    <thead>
      <tr className="">
        <th
          scope="col"
          className="py-3.5 pl-4 pr-12 text-left text-sm font-semibold sm:pl-0"
        ></th>

        {/*Independent Variable*/}
        <th
          scope="col"
          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold  sm:pl-0"
        >
          <div className="flex flex-row items-center w-fit gap-x-2">
            {/*If the user is editing the variable name returns an input, otherwise displays the variable name*/}
            {editingInDependentVariable ? (
              <Input
                type="text"
                name="independent-variable"
                id="independent-variable"
                value={variableNames.independentVariableName}
                onChange={(e) => {
                  updateVariableNames(
                    variableNames.dependentVariableName,
                    e.target.value
                  );
                }}
              />
            ) : (
              <div className="block w-fit rounded-md bg-transparent border-0 text-zinc-200 transition-all duration-200 text-sm leading-6">
                {variableNames.independentVariableName}
              </div>
            )}

            {/*Toggles the editing state of the variable*/}
            {editingInDependentVariable ? (
              <p
                onClick={() =>
                  setEditingInDependentVariable(!editingInDependentVariable)
                }
                className="text-xs text-zinc-500 hover:text-zinc-400 transition-all ease-in-out duration-300 cursor-pointer"
              >
                Save
              </p>
            ) : (
              <PencilIcon
                onClick={() =>
                  setEditingInDependentVariable(!editingInDependentVariable)
                }
                className="h-4 w-4   text-zinc-500 hover:text-zinc-400 transition-all ease-in-out duration-300 cursor-pointer"
              />
            )}

            {/*Sorts the datapoints by the independent variable*/}
            <ArrowsUpDownIcon
              onClick={() => {
                const sortedDatapoints = [...datapoints].sort(
                  (a, b) =>
                    (a.independentVariable ? a.independentVariable : 0) -
                    (b.independentVariable ? b.independentVariable : 0)
                );
                updateDatapoints(sortedDatapoints);
              }}
              className="h-4 w-4 shrink-0 text-zinc-500 hover:text-zinc-400 transition-all ease-in-out duration-300 cursor-pointer"
            />
          </div>
        </th>

        {/*Independent Variable Error*/}
        <th
          scope="col"
          className="px-3 py-3.5 text-left text-sm font-semibold "
        >
          <div className=" w-full flex flex-row items-center gap-x-2 rounded-md  border-0 bg-transparent text-zinc-200 transition-all duration-200 placeholder:text-zinc-400 focus:ring-inset focus:ring-zinc-600 sm:text-sm sm:leading-6">
            {variableNames.independentVariableName + " Error"}
            <ExclamationTriangleIcon title="Errors in the independent variable are propagated to the errors of the dependent variable via numerical derivatives. Make sure this numerical derivative makes sense in the context of your dataset. If your dataset has less than 4 datapoints or exhibits discontinuities, the numerical derivative may not allow for an accurate propagation of errors." className="h-4 w-4 text-orange-400 cursor-pointer mt-1 transition-all ease-out duration-200" />
          </div>
        </th>

        {/*Dependent Variable*/}
        <th
          scope="col"
          className="px-3 py-3.5 text-left text-sm font-semibold "
        >
          <div className="flex flex-row items-center w-fit gap-x-2">
            {/*If the user is editing the variable name returns an input, otherwise displays the variable name*/}
            {editingDependentVariable ? (
              <Input
                type="text"
                name="dependent-variable"
                id="dependent-variable"
                value={variableNames.dependentVariableName}
                onChange={(e) => {
                  updateVariableNames(
                    e.target.value,
                    variableNames.independentVariableName
                  );
                }}
              />
            ) : (
              <div className="block w-fit rounded-md bg-transparent border-0 text-zinc-200 transition-all duration-200 text-sm leading-6">
                {variableNames.dependentVariableName}
              </div>
            )}

            {/*Toggles the editing state of the variable*/}
            {editingDependentVariable ? (
              <p
                onClick={() =>
                  setEditingDependentVariable(!editingDependentVariable)
                }
                className="text-xs text-zinc-500 hover:text-zinc-400 transition-all ease-in-out duration-300 cursor-pointer"
              >
                Save
              </p>
            ) : (
              <PencilIcon
                onClick={() =>
                  setEditingDependentVariable(!editingDependentVariable)
                }
                className="h-4 w-4   text-zinc-500 hover:text-zinc-400 transition-all ease-in-out duration-300 cursor-pointer"
              />
            )}

            {/*Sorts the datapoints by the dependent variable*/}
            <ArrowsUpDownIcon
              onClick={() => {
                const sortedDatapoints = [...datapoints].sort(
                  (a, b) =>
                    (a.dependentVariable ? a.dependentVariable : 0) -
                    (b.dependentVariable ? b.dependentVariable : 0)
                );
                updateDatapoints(sortedDatapoints);
              }}
              className="h-4 w-4 shrink-0 text-zinc-500 hover:text-zinc-400 transition-all ease-in-out duration-300 cursor-pointer"
            />
          </div>
        </th>

        {/*Dependent Variable Error*/}
        <th
          scope="col"
          className="px-3 py-3.5 text-left text-sm font-semibold "
        >
          <div className="block w-full rounded-md border-0 bg-transparent text-zinc-200 transition-all duration-200 placeholder:text-zinc-400 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
            {variableNames.dependentVariableName + " Error"}
          </div>
        </th>
        <th
          scope="col"
          className="px-3 py-3.5 text-left text-sm font-semibold "
        ></th>
      </tr>
    </thead>
  );
};

interface DatasetTableBodyProps {
  datapoints: Datapoint[];
  updateDatapoints: (newDatapoints: Datapoint[]) => void;
}

const DatasetTableBody: FC<DatasetTableBodyProps> = ({
  datapoints,
  updateDatapoints,
}) => {
  const removePointByIndex = (index: number) => {
    if (datapoints.length === 1) {
      return;
    }

    const newDatapoints = [...datapoints];
    newDatapoints.splice(index, 1);
    updateDatapoints(newDatapoints);
  };

  return (
    <tbody className="divide-y divide-zinc-500 text-zinc-400 ">
      {datapoints.map((point, index) => (
        <tr
          key={index}
          className="animate-in fade-in slide-in-from-top-4 duration-300 "
        >
          <td className="whitespace-nowrap py-4 pl-4 pr-12 text-sm font-semibold text-zinc-300 sm:pl-0">
            Datapoint {index + 1}
          </td>
          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium sm:pl-0">
            <Input
              type="number"
              name={"point-" + index + "-independent-variable"}
              id={"point-" + index + "-independent-variable"}
              value={Number(point.independentVariable)}
              onChange={(e) => {
                const newDatapoints = [...datapoints];
                newDatapoints[index].independentVariable = parseFloat(
                  e.target.value
                );
                updateDatapoints(newDatapoints);
              }}
            />
          </td>
          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
            <Input
              type="number"
              name={"point-" + index + "-independent-variable-error"}
              id={"point-" + index + "-independent-variable-error"}
              value={Number(point.independentVariableError)}
              onChange={(e) => {
                const newDatapoints = [...datapoints];
                newDatapoints[index].independentVariableError = parseFloat(
                  e.target.value
                );
                updateDatapoints(newDatapoints);
              }}
            />
          </td>
          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
            <Input
              type="number"
              name={"point-" + index + "-dependent-variable"}
              id={"point-" + index + "-dependent-variable"}
              value={Number(point.dependentVariable)}
              onChange={(e) => {
                const newDatapoints = [...datapoints];
                newDatapoints[index].dependentVariable = parseFloat(
                  e.target.value
                );
                updateDatapoints(newDatapoints);
              }}
            />
          </td>
          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
            <Input
              type="number"
              name={"point-" + index + "-dependent-variable-error"}
              id={"point-" + index + "-dependent-variable-error"}
              value={Number(point.dependentVariableError)}
              onChange={(e) => {
                const newDatapoints = [...datapoints];
                newDatapoints[index].dependentVariableError = parseFloat(
                  e.target.value
                );
                updateDatapoints(newDatapoints);
              }}
            />
          </td>
          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
            <XMarkIcon
              onClick={() => removePointByIndex(index)}
              className={clsx(
                datapoints.length > 1 && "hover:text-zinc-400 cursor-pointer",
                "h-5 w-5 text-zinc-500 transition-all ease-in-out duration-200"
              )}
            />
          </td>
        </tr>
      ))}
    </tbody>
  );
};

interface AddDatapointButtonProps {
  datapoints: Datapoint[];
  updateDatapoints: (newDatapoints: Datapoint[]) => void;
}

const AddDatapoingButton: FC<AddDatapointButtonProps> = ({
  datapoints,
  updateDatapoints,
}) => {
  return (
    <div className="flex flex-row items-center justify-center w-full">
      <button
        onClick={() => {
          updateDatapoints([
            ...datapoints,
            {
              independentVariable: 1,
              independentVariableError: 0,
              dependentVariable: 1,
              dependentVariableError: 0.1,
            },
          ] as Datapoint[]);
        }}
        className="flex flex-row items-center py-2 border-t border-b bg-zinc-600 bg-opacity-20 hover:bg-zinc-500 hover:bg-opacity-20 cursor-pointer text-sm group justify-center text-zinc-400 hover:text-zinc-300 transition-all ease-in-out duration-300 font-semibold gap-x-1.5 border-zinc-500 w-full"
      >
        <PlusCircleIcon className="h-5 w-5" />
        Add Datapoint
      </button>
    </div>
  );
};

/*Advanced Options Components*/
interface DisplayAdvancedOptionsButtonProps {
  showAdvancedOptions: boolean;
  setShowAdvancedOptions: (showAdvancedOptions: boolean) => void;
}

const DisplayAdvancedOptionsButton: FC<DisplayAdvancedOptionsButtonProps> = ({
  showAdvancedOptions,
  setShowAdvancedOptions,
}) => {
  return (
    <button
      onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
      className={clsx(
        showAdvancedOptions ? "text-zinc-400" : "text-zinc-500",
        "flex flex-row items-center cursor-pointer text-sm group justify-center hover:text-zinc-400 transition-all ease-in-out duration-300 font-semibold gap-x-1.5 rounded-md"
      )}
    >
      Advanced Options
      {showAdvancedOptions ? (
        <ChevronUpIcon className="h-5 w-5" />
      ) : (
        <ChevronDownIcon className="h-5 w-5" />
      )}
    </button>
  );
};

interface AuxiliarIndependentVariableTableProps {
  auxiliarIndependentVariablesArray: number[];
  auxiliarIndependentVariablesName: string;
  updateAuxiliarIndependentVariables: (
    auxiliarIndependentVariables: number[]
  ) => void;
  updateAuxiliarIndependentVariablesName: (name: string) => void;
  datasetName: string;
}

const AuxiliarIndependentVariableTable: FC<
  AuxiliarIndependentVariableTableProps
> = ({
  auxiliarIndependentVariablesArray,
  auxiliarIndependentVariablesName,
  updateAuxiliarIndependentVariables,
  updateAuxiliarIndependentVariablesName,
  datasetName,
}) => {
  const removeAuxiliarVariableByIndex = (index: number) => {
    if (auxiliarIndependentVariablesArray.length === 1) {
      return;
    }

    const newVariables = [...auxiliarIndependentVariablesArray];
    newVariables.splice(index, 1);
    updateAuxiliarIndependentVariables(newVariables);
  };

  return (
    <div className="w-full flex flex-col  gap-y-8 items-start pt-8">
      <div className="w-full animate-in slide-in-from-top-4 fade-in">
        <label
          htmlFor="Main Function"
          className="mb-2 block text-sm font-medium text-zinc-300"
        >
          Auxiliary Array Name
        </label>

        <Input
          type="text"
          name={`${datasetName}-auxiliar-variables-name`}
          id={`${datasetName}-auxiliar-variables-name`}
          value={auxiliarIndependentVariablesName}
          onChange={(e) =>
            updateAuxiliarIndependentVariablesName(e.target.value)
          }
          extraPadding={true}
        />
      </div>

      <table className=" divide-y divide-zinc-500 min-w-full">
        {/*Table Header*/}
        <thead>
          <tr className="">
            <th
              scope="col"
              className="py-3.5 pl-4 pr-12 text-left text-sm font-semibold sm:pl-0"
            >
              Auxiliary Variables
            </th>
            <th
              scope="col"
              className="pl-3 pr-5 py-3.5 text-left text-sm font-semibold "
            >
              Value
            </th>
          </tr>
        </thead>

        {/*Table Body*/}
        <tbody className="divide-y divide-zinc-500 text-zinc-400 ">
          {auxiliarIndependentVariablesArray.map((variable, index) => (
            <tr
              key={index}
              className="animate-in fade-in slide-in-from-top-4 duration-300 "
            >
              <td className="whitespace-nowrap py-4 pl-4 pr-12 text-sm font-semibold text-zinc-400 sm:pl-0">
                Index {index + 1} ({auxiliarIndependentVariablesName}
                {auxiliarIndependentVariablesArray.length > 1 &&
                  "_" + String(index + 1)}
                )
              </td>

              {/*Value of the variable*/}
              <td className="whitespace-nowrap pl-3 pr-5 py-4 text-sm text-gray-500">
                <Input
                  type="number"
                  name={"independent-variable-" + index + "-value"}
                  id={"independent-variable-" + index + "-value"}
                  value={variable}
                  onChange={(e) => {
                    const newVariables = [...auxiliarIndependentVariablesArray];
                    newVariables[index] = parseFloat(e.target.value);
                    updateAuxiliarIndependentVariables(newVariables);
                  }}
                />
              </td>

              {/*Button to remove a variable*/}
              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                <XMarkIcon
                  onClick={() => removeAuxiliarVariableByIndex(index)}
                  className={clsx(
                    auxiliarIndependentVariablesArray.length > 1 &&
                      "hover:text-zinc-400  cursor-pointer",
                    "h-5 w-5 text-zinc-500  transition-all ease-in-out duration-200"
                  )}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

interface AddIndependentVariableButtonProps {
  auxiliarIndependentVariablesArray: number[];
  updateAuxiliarIndependentVariables: (
    auxiliarIndependentVariables: number[]
  ) => void;
}

const AddIndependentVariableButton: FC<AddIndependentVariableButtonProps> = ({
  auxiliarIndependentVariablesArray,
  updateAuxiliarIndependentVariables,
}) => {
  return (
    <div className="flex flex-row items-center justify-center w-full">
      <button
        onClick={() =>
          updateAuxiliarIndependentVariables([
            ...auxiliarIndependentVariablesArray,
            0,
          ])
        }
        className="flex flex-row items-center py-2 border-t border-b bg-zinc-600 bg-opacity-20 hover:bg-zinc-500 hover:bg-opacity-20 cursor-pointer text-sm group justify-center text-zinc-400 hover:text-zinc-300 transition-all ease-in-out duration-300 font-semibold gap-x-1.5 border-zinc-500 w-full"
      >
        <PlusCircleIcon className="h-5 w-5" />
        Add New Value
      </button>
    </div>
  );
};

/*Main Component*/
interface DatasetTableProps {
  dataset: Dataset;
  updateDataset: (id: number, newDataset: Dataset) => void;
  removeDataset: (id: number) => void;
}

const DatasetTable: FC<DatasetTableProps> = ({
  dataset,
  updateDataset,
  removeDataset,
}) => {
  // State to store if the dataset main table is expanded
  const [isExpanded, setIsExpanded] = useState(false);

  // State to store if the advanced options are displayed
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  // Function to update the datapoints of the dataset
  const updateDatapoints = (newDatapoints: Datapoint[]) => {
    updateDataset(dataset.id, { ...dataset, datapoints: newDatapoints });
  };

  // Function to update the variable names of the dataset
  const updateVariableNames = (
    dependentVariableName: string,
    independentVariableName: string
  ) => {
    updateDataset(dataset.id, {
      ...dataset,
      dependentVariableName: dependentVariableName,
      independentVariableName: independentVariableName,
    });
  };

  // Function to update the auxiliar independent variables of the dataset
  const updateAuxiliarIndependentVariablesArray = (
    newAuxiliarIndependentVariables: number[]
  ) => {
    updateDataset(dataset.id, {
      ...dataset,
      auxiliarIndependentVariablesArray: newAuxiliarIndependentVariables,
    });
  };

  // Function to update the name of the auxiliar independent variables array
  const updateAuxiliarIndependentVariablesName = (name: string) => {
    updateDataset(dataset.id, {
      ...dataset,
      auxiliarIndependentVariablesArrayName: name,
    });
  };

  return (
    <div
      key={dataset.id}
      className={clsx(
        " items-center flex flex-col text-sm group justify-center text-zinc-300 font-semibold  transition-all duration-300 ease-in-out"
      )}
    >
      {/*Toggles the display of the dataset table*/}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className={clsx(
          isExpanded
            ? "bg-zinc-500 bg-opacity-20"
            : "hover:bg-zinc-600 hover:bg-opacity-20",
          "w-full h-fit flex flex-row items-center justify-between cursor-pointer gap-x-1.5 transition-all ease-in-out duration-300 px-3 py-2"
        )}
      >
        <div className="flex flex-row gap-x-1.5 items-center">
          {dataset.name}
          {isExpanded ? (
            <ChevronDownIcon className="h-5 w-5 transform rotate-180" />
          ) : (
            <ChevronDownIcon className="h-5 w-5" />
          )}
        </div>
        {/*Button to remove the dataset*/}
        <XMarkIcon
          onClick={() => removeDataset(dataset.id)}
          className="h-5 w-5 text-zinc-500 hover:text-zinc-300 transition-all ease-in-out duration-300 cursor-pointer"
        />
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
        className="h-fit w-fit"
      >
        <div className="flex-col w-full flex h-fit px-3 gap-y-10 py-4 transition-transform transform ease-in-out overflow-hidden tansition-all duration-500">
          {/*Dataset Main Table*/}
          <div className="flex flex-col items-center px-28">
            <table className="min-w-full divide-y divide-zinc-500">
              <DatasetTableHeader
                datapoints={dataset.datapoints}
                updateDatapoints={updateDatapoints}
                variableNames={{
                  dependentVariableName: dataset.dependentVariableName,
                  independentVariableName: dataset.independentVariableName,
                }}
                updateVariableNames={updateVariableNames}
              />
              <DatasetTableBody
                datapoints={dataset.datapoints}
                updateDatapoints={updateDatapoints}
              />
            </table>
            <AddDatapoingButton
              datapoints={dataset.datapoints}
              updateDatapoints={updateDatapoints}
            />
          </div>

          <div className="flex flex-col items-start px-28 pb-6">
            {/*Display Advanced Options Toggle*/}
            <DisplayAdvancedOptionsButton
              showAdvancedOptions={showAdvancedOptions}
              setShowAdvancedOptions={setShowAdvancedOptions}
            />

            {/*Auxiliar Variables Table*/}
            <div
              className={clsx(
                showAdvancedOptions ? "block" : "hidden",
                "flex flex-col items-center w-full"
              )}
            >
              <AuxiliarIndependentVariableTable
                auxiliarIndependentVariablesArray={
                  dataset.auxiliarIndependentVariablesArray
                }
                auxiliarIndependentVariablesName={
                  dataset.auxiliarIndependentVariablesArrayName
                }
                updateAuxiliarIndependentVariables={
                  updateAuxiliarIndependentVariablesArray
                }
                updateAuxiliarIndependentVariablesName={
                  updateAuxiliarIndependentVariablesName
                }
                datasetName={dataset.name}
              />
              <AddIndependentVariableButton
                auxiliarIndependentVariablesArray={
                  dataset.auxiliarIndependentVariablesArray
                }
                updateAuxiliarIndependentVariables={
                  updateAuxiliarIndependentVariablesArray
                }
              />
            </div>
          </div>
        </div>
      </Transition>
    </div>
  );
};

export default DatasetTable;
