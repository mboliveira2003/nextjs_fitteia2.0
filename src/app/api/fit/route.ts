import { NextRequest, NextResponse } from "next/server";
import { FitRequest, Parameter } from "@/app/types";
import calculatePropagatedErrors from "@/utils/propagateError";
import { Dataset, Function } from "@/app/types";

interface RequestBody {
  selectedDatasets: Dataset[];
  selectedFunction: Function;
  isFitGlobal: boolean;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body: RequestBody = await req.json();
    const { selectedDatasets, selectedFunction, isFitGlobal } = body;

    if (
      !selectedDatasets ||
      selectedDatasets.length === 0 ||
      !selectedFunction ||
      isFitGlobal === undefined
    ) {
      return NextResponse.json(
        { error: "Request body is missing required parameters" },
        { status: 400 }
      );
    }

    const parameters = selectedFunction.parameters;
    const processedFunction = selectedFunction.processedFunction;
    const independentVariable = selectedFunction.independentVariable;
    const dependentVariable = selectedFunction.dependentVariable;

    if (
      !parameters ||
      !processedFunction ||
      !independentVariable ||
      !dependentVariable
    ) {
      return NextResponse.json(
        { error: "Selected function is missing required parameters" },
        { status: 400 }
      );
    }

    // Verify if any of the selectedDatasets has a datapoint with any atribute equal to null and return the name of the datasets found
    const datasetsWithNullDatapoints = selectedDatasets
      .filter((dataset) =>
        dataset.datapoints.some((datapoint) =>
          Object.values(datapoint).some((value) => value === null)
        )
      )
      .map((dataset) => dataset.name);

    // Return an error message containing the names of the datasets with null datapoints
    if (datasetsWithNullDatapoints.length > 0) {
      return NextResponse.json(
        {
          error: `The following datasets have datapoints with null values: ${datasetsWithNullDatapoints.join(
            ", "
          )}`,
        },
        { status: 400 }
      );
    }

    // Verify if any of the selectedDatasets has a datapoint with a dependentVariableError equal to 0 and return the name of the datasets found
    // This has to be done in order to avoid division by zero
    const datasetsWithZeroError = selectedDatasets
      .filter((dataset) =>
        dataset.datapoints.some(
          (datapoint) => datapoint.dependentVariableError === 0
        )
      )
      .map((dataset) => dataset.name);

    // Return an error message containing the names of the datasets with zero errors
    if (datasetsWithZeroError.length > 0) {
      return NextResponse.json(
        {
          error: `The following datasets have datapoints with zero error on the dependent variable: ${datasetsWithZeroError.join(
            ", "
          )}`,
        },
        { status: 400 }
      );
    }

    let fitRequest: FitRequest;

    if (selectedDatasets.length === 1) {
      fitRequest = constructSingleDatasetFitRequest(
        selectedDatasets[0],
        parameters,
        processedFunction,
        independentVariable,
        dependentVariable,
        isFitGlobal
      );

    } else {
      fitRequest = constructMultiDatasetFitRequest(
        selectedDatasets,
        parameters,
        processedFunction,
        independentVariable,
        dependentVariable,
        isFitGlobal
      );
    }

    console.log("Fetching response for:", fitRequest);

    const form = new FormData();
    const jsonBlob = new Blob([JSON.stringify(fitRequest)], {
      type: "application/json",
    });
    form.append("download", "json");
    form.append("username", "mboliveira");
    form.append("file", jsonBlob, "data.json");

    const response = await fetch(
      "http://onefite-t.vps.tecnico.ulisboa.pt:8142/fit",
      {
        method: "POST",
        body: form as any,
      }
    );

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    const jsonResponse = await response.json();

    console.log("Obtained response:", jsonResponse);

    if (
      !jsonResponse["fit-curves"] ||
      !jsonResponse["par-tables"] ||
      !jsonResponse["fit-results"]
    ) {
      throw new Error(
        "Failed to compile the fitting function, make sure it is written in c++ syntax."
      );
    }

    return NextResponse.json(jsonResponse, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "" + error }, { status: 500 });
  }
}

function constructSingleDatasetFitRequest(
  selectedDataset: Dataset,
  parameters: Parameter[],
  processedFunction: string,
  independentVariable: string,
  dependentVariable: string,
  isFitGlobal: boolean
): FitRequest {
  const independentVariableValues = selectedDataset.datapoints.map(
    (datapoint) => datapoint.independentVariable
  );
  const minIndependentVariable = Math.min(...independentVariableValues);
  const maxIndependentVariable = Math.max(...independentVariableValues);
  const independentVariableMargin =
    0.15 * (maxIndependentVariable - minIndependentVariable);

  const dependentVariableValues = selectedDataset.datapoints.map(
    (datapoint) => datapoint.dependentVariable
  );
  const minDependentVariable = Math.min(...dependentVariableValues);
  const maxDependentVariable = Math.max(...dependentVariableValues);
  const dependentVariableMargin =
    0.15 * (maxDependentVariable - minDependentVariable);

  // Calculates derivatives using central differences and propagates errors
  /*
  const propagatedDatapoints = calculatePropagatedErrors(
    selectedDataset.datapoints
  );
  const dataString = propagatedDatapoints
    .map(
      (datapoint) =>
        `${datapoint.independentVariable} ${datapoint.dependentVariable} ${datapoint.propagatedDependentVariableError}`
    )
    .join("\n");
  */

  // Makes use of fitteia built-in error propagation, which calculates derivatives using a "filter method"
  // This makes the derivative less prone to noise
  const dataString = selectedDataset.datapoints
    .map(
      (datapoint) =>
        `${datapoint.independentVariable} ${datapoint.dependentVariable} ${datapoint.dependentVariableError} ${datapoint.independentVariableError}`
    )
    .join("\n");

  const fitRequest: FitRequest = {
    AscaleX: "yes",
    AscaleY: "yes",
    Funcx0: "auto",
    Funcy0: "auto",
    SelectedDataSet: "tags.txt",
    Tags: ["tags.txt"],
    T: selectedDataset.auxiliarIndependentVariablesArrayName, 
    Num: 500,
    Dados: `# DATA ${selectedDataset.auxiliarIndependentVariablesArrayName} = ${selectedDataset.auxiliarIndependentVariablesArray.join(" ")}\n# TAG = tags.txt\n${dataString}`,
    FitType: isFitGlobal ? "Global" : "Individual",
    Function: independentVariable + " = " + processedFunction,
    Parameters: parameters.map((param) => param.name).join(","),
    X: independentVariable,
    Xmax: (maxIndependentVariable + independentVariableMargin).toString(),
    Xmin: (minIndependentVariable - independentVariableMargin).toString(),
    Y: dependentVariable,
    Ymax: (maxDependentVariable + dependentVariableMargin).toString(),
    Ymin: (minDependentVariable - dependentVariableMargin).toString(),
  };

  console.log(parameters)

  parameters.forEach((param, index) => {
    fitRequest[`F${index}`] = param.fixed ? "Fixed" : "Free";
    fitRequest[`Pmax${index}`] = param.Max.toString();
    fitRequest[`Pmin${index}`] = param.Min.toString();
    fitRequest[`Pval${index}`] = param.initialValue.toString();
  });

  return fitRequest;
}

function constructMultiDatasetFitRequest(
  selectedDatasets: Dataset[],
  parameters: Parameter[],
  processedFunction: string,
  independentVariable: string,
  dependentVariable: string,
  isFitGlobal: boolean
): FitRequest {
  // Extract all the independent variable values for all datasets
  const independentVariableValuesArray = selectedDatasets.map((dataset) =>
    dataset.datapoints.map((datapoint) => datapoint.independentVariable)
  );

  // Construct arrays with their maxima, minima and the margin to add in the x direction
  const minIndependentVariableArray = independentVariableValuesArray.map(
    (values) => Math.min(...values)
  );
  const maxIndependentVariableArray = independentVariableValuesArray.map(
    (values) => Math.max(...values)
  );
  const independentVariableMarginArray = maxIndependentVariableArray.map(
    (max, index) => 0.15 * (max - minIndependentVariableArray[index])
  );

  // Calculate the maximum and minimum values for the x-axis with padding
  const xMaxArray = maxIndependentVariableArray.map(
    (max, index) => max + independentVariableMarginArray[index]
  );
  const xMinArray = minIndependentVariableArray.map(
    (min, index) => min - independentVariableMarginArray[index]
  );

  // Extract all the dependent variable values for all datasets
  const dependentVariableValuesArray = selectedDatasets.map((dataset) =>
    dataset.datapoints.map((datapoint) => datapoint.dependentVariable)
  );

  // Construct arrays with their maxima, minima and the margin to add in the y direction
  const minDependentVariableArray = dependentVariableValuesArray.map((values) =>
    Math.min(...values)
  );
  const maxDependentVariableArray = dependentVariableValuesArray.map((values) =>
    Math.max(...values)
  );
  const dependentVariableMarginArray = maxDependentVariableArray.map(
    (max, index) => 0.15 * (max - minDependentVariableArray[index])
  );

  // Calculate the maximum and minimum values for the y-axis with padding
  const yMaxArray = maxDependentVariableArray.map(
    (max, index) => max + dependentVariableMarginArray[index]
  );
  const yMinArray = minDependentVariableArray.map(
    (min, index) => min - dependentVariableMarginArray[index]
  );

  // Check wether all the selected datasets have the same auxiliary variable
  const auxiliarIndependentVariablesArrayName = selectedDatasets[0].auxiliarIndependentVariablesArrayName;
  const allAuxiliarIndependentVariablesArrayNameEqual = selectedDatasets.every(
    (dataset) => dataset.auxiliarIndependentVariablesArrayName === auxiliarIndependentVariablesArrayName
  );

  let dados = "";
  selectedDatasets.forEach((dataset, index) => {
    // Calculates derivatives using central differences and propagates errors
    /*
    const propagatedDatapoints = calculatePropagatedErrors(dataset.datapoints);

    const dataString = propagatedDatapoints
      .map(
        (datapoint) =>
          `${datapoint.independentVariable} ${datapoint.dependentVariable} ${datapoint.propagatedDependentVariableError}`
      )
      .join("\n");
    */

    // Makes use of fitteia built-in error propagation, which calculates derivatives using a "filter method"
    // This makes the derivative less prone to noise
    const dataString = dataset.datapoints
      .map(
        (datapoint) =>
          `${datapoint.independentVariable} ${datapoint.dependentVariable} ${datapoint.dependentVariableError} ${datapoint.independentVariableError}`
      )
      .join("\n");

    dados += `# DATA ${ allAuxiliarIndependentVariablesArrayNameEqual ? auxiliarIndependentVariablesArrayName : "dummy"} = ${allAuxiliarIndependentVariablesArrayNameEqual ? selectedDatasets[index].auxiliarIndependentVariablesArray.join(" "): "1"}\n# TAG = ${index + 1}\n${dataString}\n\n`;
  });

  const fitRequest: FitRequest = {
    AscaleX: "yes",
    AscaleY: "yes",
    Funcx0: "auto",
    Funcy0: "auto",
    SelectedDataSet: "1",
    Tags: selectedDatasets.map((_, index) => `${index + 1}`),
    T: allAuxiliarIndependentVariablesArrayNameEqual ? auxiliarIndependentVariablesArrayName : "dummy",
    Num: 500,
    Dados: dados,
    FitType: isFitGlobal ? "Global" : "Individual",
    Function: independentVariable + " = " + processedFunction,
    Parameters: parameters.map((param) => param.name).join(","),
    X: independentVariable,
    // For each entry in the
    Xmax: xMaxArray.join("\\,"),
    Xmin: xMinArray.join("\\,"),
    Y: dependentVariable,
    Ymax: yMaxArray.join("\\,"),
    Ymin: yMinArray.join("\\,"),
  };

  parameters.forEach((param, index) => {
    fitRequest[`F${index}`] = param.fixed ? "Fixed" : "Free";
    fitRequest[`Pmax${index}`] = param.Max.toString();
    fitRequest[`Pmin${index}`] = param.Min.toString();
    fitRequest[`Pval${index}`] = param.initialValue.toString();
  });

  return fitRequest;
}
