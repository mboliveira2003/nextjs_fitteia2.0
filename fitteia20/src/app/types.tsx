type Datapoint = {
  independentVariable: number;
  independentVariableError: number;
  dependentVariable: number;
  dependentVariableError: number;
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
  auxiliarDependentVariables: AuxiliarIndependentVariable[];
}

type Function = {
  id: number;
  name: string;
  mainFunction: string;
  subfunctions: string[];
};

type Parameter = {
  name: string;
  fixed: boolean;
  initialValue: number;
  error: number;
  Min: number;
  Max: number;
};

export type {
  Dataset,
  Datapoint,
  AuxiliarIndependentVariable,
  Function,
  Parameter,
};
