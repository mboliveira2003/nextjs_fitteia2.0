import { Dataset, Function, Parameter } from "@/app/types";

type JsonObject = Record<string, any>;

let jsonObject: JsonObject = {};

export const setJsonObject = (part: JsonObject): void => {
  jsonObject = { ...jsonObject, ...part };
};

export const getJsonObject = (): JsonObject => {
  return jsonObject;
};

export const clearJsonObject = (): void => {
  jsonObject = {};
};

export const updateDatasets = (datasets: Dataset[]): void => {
    sessionStorage.setItem('datasets', JSON.stringify(datasets));
}

export const getDatasets = (): Dataset[] => {
    const datasets = sessionStorage.getItem('datasets');
    return datasets ? JSON.parse(datasets) : [];
}

export const clearDatasets = (): void => {
    sessionStorage.removeItem('datasets');
}

export const updateFunctions = (functions: Function[]): void => {
    sessionStorage.setItem('functions', JSON.stringify(functions));
}

export const getFunctions = (): Function[] => {
    const functions = sessionStorage.getItem('functions');
    return functions ? JSON.parse(functions) : [];
}

export const clearFunctions = (): void => {
    sessionStorage.removeItem('functions');
}

export const updateParameters = (parameters: Parameter[]): void => {
    sessionStorage.setItem('parameters', JSON.stringify(parameters));
}

export const getParameters = (): Parameter[] => {
    const parameters = sessionStorage.getItem('parameters');
    return parameters ? JSON.parse(parameters) : [];
}

export const clearParameters = (): void => {
    sessionStorage.removeItem('parameters');
}

export const updateFitType = (fitType: boolean): void => {
    sessionStorage.setItem('fitType', JSON.stringify(fitType));
}

export const getFitType = (): boolean => {
    const fitType = sessionStorage.getItem('fitType');
    return fitType ? JSON.parse(fitType) : false;
}

export const clearFitType = (): void => {
    sessionStorage.removeItem('fitType');
}

export const updateIndepentVariable = (independentVariable: string): void => {
    sessionStorage.setItem('independentVariable', JSON.stringify(independentVariable));
}

export const getIndependentVariable = (): string => {
    const independentVariable = sessionStorage.getItem('independentVariable');
    return independentVariable ? JSON.parse(independentVariable) : '';
}

export const clearIndependentVariable = (): void => {
    sessionStorage.removeItem('independentVariable');
}

export const updateDependentVariable = (dependentVariable: string): void => {
    sessionStorage.setItem('dependentVariable', JSON.stringify(dependentVariable));
}

export const getDependentVariable = (): string => {
    const dependentVariable = sessionStorage.getItem('dependentVariable');
    return dependentVariable ? JSON.parse(dependentVariable) : '';
}

export const clearDependentVariable = (): void => {
    sessionStorage.removeItem('dependentVariable');
}

export const updateProcessedFunction = (processedFunction: string): void => {
    sessionStorage.setItem('processedFunction', JSON.stringify(processedFunction));
}

export const getProcessedFunction = (): string => {
    const processedFunction = sessionStorage.getItem('processedFunction');
    return processedFunction ? JSON.parse(processedFunction) : '';
}

export const clearProcessedFunction = (): void => {
    sessionStorage.removeItem('processedFunction');
}

export const updateSelectedDataset = (dataset: Dataset): void => {
    sessionStorage.setItem('selectedDataset', JSON.stringify(dataset));
}

export const getSelectedDataset = (): Dataset | null => {
    const selectedDataset = sessionStorage.getItem('selectedDataset');
    return selectedDataset ? JSON.parse(selectedDataset) : null;
}

export const clearSelectedDataset = (): void => {
    sessionStorage.removeItem('selectedDataset');
}



