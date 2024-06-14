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

export type {
  Dataset,
  Datapoint,
  PropagatedDatapoint,
  AuxiliarIndependentVariable,
  Function,
  Parameter,
  FitRequest,
};
