import { Dataset, Function } from "@/app/types";

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


