import { NextRequest, NextResponse } from "next/server";
import {
  getDatasets,
  getFunctions,
  getParameters,
  getFitType,
  getIndependentVariable,
  getDependentVariable,
  getProcessedFunction,
  getSelectedDataset,
} from "../../../utils/storage";
import { FitRequest } from "@/app/types";
import calculatePropagatedErrors from "@/utils/propagateError";

// The request should accept an index as an argument 
// to determine the dataset to use
// The index should be passed as a query parameter

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Fetch all necessary data
    const selectedDataset = getSelectedDataset();
    const functions = getFunctions();
    const fitType = getFitType();
    const parameters = getParameters();
    const independentVariable = getIndependentVariable();
    const dependentVariable = getDependentVariable();
    const processedFunction = getProcessedFunction();

    if (!selectedDataset) {
      return NextResponse.json(
        { error: "No dataset selected" },
        { status: 400 }
      );
    }

    // Find the minimum and maximum values of the independent variable
    const independentVariableValues = selectedDataset.datapoints.map(
      (datapoint) => datapoint.independentVariable
    );
    const minIndependentVariable = Math.min(...independentVariableValues);
    const maxIndependentVariable = Math.max(...independentVariableValues);
    const independentVariableMargin = 0.15 * (maxIndependentVariable - minIndependentVariable);

    // Find the Minimum and maximum values of the dependent variable

    const dependentVariableValues = selectedDataset.datapoints.map(
      (datapoint) => datapoint.dependentVariable
    );
    const minDependentVariable = Math.min(...dependentVariableValues);
    const maxDependentVariable = Math.max(...dependentVariableValues);
    const dependentVariableMargin = 0.15 * (maxDependentVariable - minDependentVariable);

    // Calculate the propagated errors
    const propagatedDatapoints = calculatePropagatedErrors(
      selectedDataset.datapoints
    );

    // Construct the data string to send to the server
    const dataString = propagatedDatapoints
      .map(
        (datapoint) =>
          `${datapoint.independentVariable} ${datapoint.dependentVariable} ${datapoint.propagatedDependentVariableError}`
      )
      .join("\n");


    // Construct the jsonObject to send to the server

    const FitRequest: FitRequest = {
      AscaleX: "yes",
      AscaleY: "yes",
      Funcx0: "auto",
      Funcy0: "auto",
      SelectedDataSet: "tags.txt",
      Tags: ["tags.txt"],
      Num: 500,
      Dados:
        "# DATA dum = 1\n# TAG = tags.txt\n" + dataString,
      FitType: fitType ? "Global" : "Individual",
      Function: processedFunction,
      Parameters: parameters.map((param) => param.name).join(","),
      X: independentVariable,
      Xmax: (maxIndependentVariable + independentVariableMargin).toString(),
      Xmin: (minIndependentVariable - independentVariableMargin).toString(),
      Y: dependentVariable,
      Ymax: (maxDependentVariable + dependentVariableMargin).toString(),
      Ymin: (minDependentVariable - dependentVariableMargin).toString(),
    };

    Object.keys(parameters).forEach((_, index) => {
      FitRequest[`F${index}`] = parameters[index].fixed ? "Fixed" : "Free";
      FitRequest[`Pmax${index}`] = parameters[index].Max.toString();
      FitRequest[`Pmin${index}`] = parameters[index].Min.toString();
      FitRequest[`Pval${index}`] = parameters[index].initialValue.toString();
    });

    const form = new FormData();
    const jsonBlob = new Blob([JSON.stringify(FitRequest)], {
      type: "application/json",
    });

    form.append("download", "json");
    form.append("username", "mboliveira");
    form.append("file", jsonBlob, "data.json");

    const response = await fetch(
      "http://localhost:8142/fit",
      {
        method: "POST",
        body: form as any, // Type assertion needed here due to FormData type incompatibility
      }
    );

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    const jsonResponse = await response.json();

    return NextResponse.json(jsonResponse, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send request" },
      { status: 500 }
    );
  }
}
