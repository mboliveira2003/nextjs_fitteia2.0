import { NextRequest, NextResponse } from "next/server";
import { FitRequest } from "@/app/types";
import calculatePropagatedErrors from "@/utils/propagateError";
import { Dataset, Function } from "@/app/types";

interface RequestBody {
  selectedDataset: Dataset;
  selectedFunction: Function;
  isFitGlobal: boolean;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Parse the JSON body of the request
    const body: RequestBody = await req.json();

    const { selectedDataset, selectedFunction, isFitGlobal } = body;

    // Verify if all object are present in the request body
    if (!selectedDataset || !selectedFunction || isFitGlobal === undefined) { 
      return NextResponse.json(
        { error: "Request body is missing required parameters" },
        { status: 400 }
      );
    }

    // Extract all the necessary parameters from the selected function
    const parameters = selectedFunction.parameters;
    const processedFunction = selectedFunction.processedFunction;
    const independentVariable = selectedFunction.independentVariable;
    const dependentVariable = selectedFunction.dependentVariable;

    // Verify if all the parameters are present in selected function
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

    // Find the minimum and maximum values of the independent variable
    const independentVariableValues = selectedDataset.datapoints.map(
      (datapoint) => datapoint.independentVariable
    );
    const minIndependentVariable = Math.min(...independentVariableValues);
    const maxIndependentVariable = Math.max(...independentVariableValues);
    const independentVariableMargin =
      0.15 * (maxIndependentVariable - minIndependentVariable);

    // Find the Minimum and maximum values of the dependent variable
    const dependentVariableValues = selectedDataset.datapoints.map(
      (datapoint) => datapoint.dependentVariable
    );
    const minDependentVariable = Math.min(...dependentVariableValues);
    const maxDependentVariable = Math.max(...dependentVariableValues);
    const dependentVariableMargin =
      0.15 * (maxDependentVariable - minDependentVariable);

    // Calculate the propagated errors
    const propagatedDatapoints = calculatePropagatedErrors(
      selectedDataset.datapoints
    );

    // Construct the data string to send to the server
    const dataString = propagatedDatapoints
      .map(
        (datapoint) =>
          ` ${datapoint.independentVariable} ${datapoint.dependentVariable} ${datapoint.propagatedDependentVariableError} `
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
      Dados: "# DATA dum = 1\n# TAG = tags.txt\n" + dataString,
      FitType: isFitGlobal ? "Global" : "Individual",
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

    const response = await fetch("http://localhost:8142/fit", {
      method: "POST",
      body: form as any, // Type assertion needed here due to FormData type incompatibility
    });

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    const jsonResponse = await response.json();

    if (!jsonResponse["fit-curves"] || !jsonResponse["par-tables"] || !jsonResponse["fit-results"]) {
      throw new Error("Failed to compile the fitting function, make sure it is written in c++ syntax.");
    }

    return NextResponse.json(jsonResponse, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "" + error },
      { status: 500 }
    );
  }
}
