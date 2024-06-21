"use client";

import { ChevronDownIcon } from "@heroicons/react/20/solid";
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
          <div className="block w-full rounded-md  border-0 bg-transparent text-zinc-200 transition-all duration-200 placeholder:text-zinc-400 focus:ring-inset focus:ring-zinc-600 sm:text-sm sm:leading-6">
            {variableNames.independentVariableName + " Error"}
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
              className="h-5 w-5 text-zinc-500 hover:text-zinc-400 transition-all ease-in-out duration-300 cursor-pointer"
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
              independentVariable: 0,
              independentVariableError: 0,
              dependentVariable: 0,
              dependentVariableError: 0,
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
  auxiliarIndependentVariables: AuxiliarIndependentVariable[];
  updateAuxiliarIndependentVariables: (
    auxiliarIndependentVariables: AuxiliarIndependentVariable[]
  ) => void;
}

const AuxiliarIndependentVariableTable: FC<
  AuxiliarIndependentVariableTableProps
> = ({ auxiliarIndependentVariables, updateAuxiliarIndependentVariables }) => {
  const removeAuxiliarVariableByIndex = (index: number) => {
    if (auxiliarIndependentVariables.length === 1) {
      return;
    }

    const newVariables = [...auxiliarIndependentVariables];
    newVariables.splice(index, 1);
    updateAuxiliarIndependentVariables(newVariables);
  };

  return (
    <table className="min-w-full divide-y divide-zinc-500">
      {/*Table Header*/}
      <thead>
        <tr className="">
          <th
            scope="col"
            className="py-3.5 pl-4 pr-12 text-left text-sm font-semibold sm:pl-0"
          ></th>
          <th
            scope="col"
            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold  sm:pl-0"
          >
            Label
          </th>
          <th
            scope="col"
            className="px-3 py-3.5 text-left text-sm font-semibold "
          >
            Value
          </th>
        </tr>
      </thead>

      {/*Table Body*/}
      <tbody className="divide-y divide-zinc-500 text-zinc-400 ">
        {auxiliarIndependentVariables.map((variable, index) => (
          <tr
            key={index}
            className="animate-in fade-in slide-in-from-top-4 duration-300 "
          >
            <td className="whitespace-nowrap py-4 pl-4 pr-12 text-sm font-semibold text-zinc-300 sm:pl-0">
              Independent Variable {index + 2}
            </td>

            {/*Label of the variable*/}
            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium sm:pl-0">
              <Input
                type="text"
                name={"independent-variable-" + index + "-label"}
                id={"independent-variable-" + index + "-label"}
                value={variable.name}
                onChange={(e) => {
                  const newVariables = [...auxiliarIndependentVariables];
                  newVariables[index].name = e.target.value;
                  updateAuxiliarIndependentVariables(newVariables);
                }}
              />
            </td>

            {/*Value of the variable*/}
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              <Input
                type="number"
                name={"independent-variable-" + index + "-value"}
                id={"independent-variable-" + index + "-value"}
                value={variable.value}
                onChange={(e) => {
                  const newVariables = [...auxiliarIndependentVariables];
                  newVariables[index].value = parseFloat(e.target.value);
                  updateAuxiliarIndependentVariables(newVariables);
                }}
              />
            </td>

            {/*Button to remove a variable*/}
            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
              <XMarkIcon
                onClick={() => removeAuxiliarVariableByIndex(index)}
                className="h-5 w-5 text-zinc-500 hover:text-zinc-400 transition-all ease-in-out duration-300 cursor-pointer"
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

interface AddIndependentVariableButtonProps {
  auxiliarIndependentVariables: AuxiliarIndependentVariable[];
  updateAuxiliarIndependentVariables: (
    auxiliarIndependentVariables: AuxiliarIndependentVariable[]
  ) => void;
}

const AddIndependentVariableButton: FC<AddIndependentVariableButtonProps> = ({
  auxiliarIndependentVariables,
  updateAuxiliarIndependentVariables,
}) => {
  return (
    <div className="flex flex-row items-center justify-center w-full">
      <button
        onClick={() =>
          updateAuxiliarIndependentVariables([
            ...auxiliarIndependentVariables,
            {
              name: "Auxiliar Variable",
              value: 0,
            },
          ] as AuxiliarIndependentVariable[])
        }
        className="flex flex-row items-center py-2 border-t border-b bg-zinc-600 bg-opacity-20 hover:bg-zinc-500 hover:bg-opacity-20 cursor-pointer text-sm group justify-center text-zinc-400 hover:text-zinc-300 transition-all ease-in-out duration-300 font-semibold gap-x-1.5 border-zinc-500 w-full"
      >
        <PlusCircleIcon className="h-5 w-5" />
        Add Independent Variable
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
  const updateAuxiliarIndependentVariables = (
    newAuxiliarIndependentVariables: AuxiliarIndependentVariable[]
  ) => {
    updateDataset(dataset.id, {
      ...dataset,
      auxiliarDependentVariables: newAuxiliarIndependentVariables,
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

          <div className="flex flex-col items-start px-28 pb-5">
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
                auxiliarIndependentVariables={
                  dataset.auxiliarDependentVariables
                }
                updateAuxiliarIndependentVariables={
                  updateAuxiliarIndependentVariables
                }
              />
              <AddIndependentVariableButton
                auxiliarIndependentVariables={
                  dataset.auxiliarDependentVariables
                }
                updateAuxiliarIndependentVariables={
                  updateAuxiliarIndependentVariables
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
