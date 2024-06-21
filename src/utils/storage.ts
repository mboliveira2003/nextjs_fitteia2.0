import { Dataset, Function, Parameter } from "@/app/types";

export const updateDatasets = (datasets: Dataset[]): void => {
  sessionStorage.setItem("datasets", JSON.stringify(datasets));
};

export const getDatasets = (): Dataset[] => {
  const datasets = sessionStorage.getItem("datasets");
  return datasets ? JSON.parse(datasets) : [];
};

export const clearDatasets = (): void => {
  sessionStorage.removeItem("datasets");
};

export const updateFunctions = (functions: Function[]): void => {
  sessionStorage.setItem("functions", JSON.stringify(functions));
};

export const getFunctions = (): Function[] => {
  const functions = sessionStorage.getItem("functions");
  return functions ? JSON.parse(functions) : [];
};

export const clearFunctions = (): void => {
  sessionStorage.removeItem("functions");
};

export const updateParameters = (
  parameters: Parameter[],
  selectedFunction: Function
): void => {
  selectedFunction.parameters = parameters;
  // Update the function in the functions array
  const functions = getFunctions();
  const index = functions.findIndex((f) => f.id === selectedFunction.id);
  functions[index] = selectedFunction;
  updateFunctions(functions);
};

export const updateIndepentVariable = (
  independentVariable: string,
  selectedFunction: Function
): void => {
  selectedFunction.independentVariable = independentVariable;
  // Update the function in the functions array
  const functions = getFunctions();
  const index = functions.findIndex((f) => f.id === selectedFunction.id);
  functions[index] = selectedFunction;
  updateFunctions(functions);
};

export const updateDependentVariable = (
  dependentVariable: string,
  selectedFunction: Function
): void => {
  selectedFunction.dependentVariable = dependentVariable;
  // Update the function in the functions array
  const functions = getFunctions();
  const index = functions.findIndex((f) => f.id === selectedFunction.id);
  functions[index] = selectedFunction;
  updateFunctions(functions);
};

export const updateProcessedFunction = (
  processedFunction: string,
  selectedFunction: Function
): void => {
  selectedFunction.processedFunction = processedFunction;
  // Update the function in the functions array
  const functions = getFunctions();
  const index = functions.findIndex((f) => f.id === selectedFunction.id);
  functions[index] = selectedFunction;
};

export const updateFitType = (fitType: boolean): void => {
  sessionStorage.setItem("fitType", JSON.stringify(fitType));
};

export const getFitType = (): boolean => {
  const fitType = sessionStorage.getItem("fitType");
  return fitType ? JSON.parse(fitType) : false;
};

export const clearFitType = (): void => {
  sessionStorage.removeItem("fitType");
};

export const updateSelectedDataset = (dataset: Dataset): void => {
  sessionStorage.setItem("selectedDataset", JSON.stringify(dataset));
};

export const getSelectedDataset = (): Dataset | null => {
  const selectedDataset = sessionStorage.getItem("selectedDataset");
  return selectedDataset ? JSON.parse(selectedDataset) : null;
};

export const clearSelectedDataset = (): void => {
  sessionStorage.removeItem("selectedDataset");
};
