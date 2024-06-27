type Datapoint = {
  independentVariable: number;
  independentVariableError: number;
  dependentVariable: number;
  dependentVariableError: number;
};

type PropagatedDatapoint = {
  independentVariable: number;
  dependentVariable: number;
  propagatedDependentVariableError: number;
};

type FittedDatapoint = {
  independentVariable: number;
  dependentVariable: number;
};

type AuxiliarIndependentVariable = {
  name: string;
  value: number;
};

interface Dataset {
  id: number;
  name: string;
  datapoints: Datapoint[];
  dependentVariableName: string;
  independentVariableName: string;
  auxiliarIndependentVariablesArrayName: string;
  auxiliarIndependentVariablesArray: number[];
}

type Function = {
  id: number;
  name: string;
  mainFunction: string;
  subfunctions: string[];
  processedFunction: string | null;
  independentVariable: string | null;
  dependentVariable: string | null;
  parameters: Parameter[] | null;
};

type Parameter = {
  name: string;
  fixed: boolean;
  initialValue: number;
  error: number;
  Min: number;
  Max: number;
};

type FitRequest = {
  AscaleX: string;
  AscaleY: string;
  Funcx0: string;
  Funcy0: string;
  SelectedDataSet: string;
  Tags: string[];
  Num: number;
  Dados: string;
  FitType: string;
  Function: string;
  Parameters: string;
  [key: string]: any;
  X: string;
  Xmax: string;
  Xmin: string;
  Y: string;
  Ymax: string;
  Ymin: string;
};

interface FitResponse {
  "fit-curves": string[];
  "fit-results": string;
  "par-tables": ParameterTable[][];
  FitType?: "Global" | "Individual";
}

interface ParameterTable {
  err: string;
  free: boolean;
  max: string;
  min: string;
  name: string;
  value: number;
}

export type {
  ParameterTable,
  FitResponse,
  FittedDatapoint,
  Dataset,
  Datapoint,
  PropagatedDatapoint,
  AuxiliarIndependentVariable,
  Function,
  Parameter,
  FitRequest,
};
