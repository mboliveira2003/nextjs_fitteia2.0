import { Datapoint } from "@/app/types";

interface ParsedCsvContent {
  dataPoints: Datapoint[];
  independentVariableName: string;
  dependentVariableName: string;
}

const parseCsvContent = (content: string): ParsedCsvContent => {

  // Split the content into lines, ignoring empty lines
  const lines = content.split('\n').map(line => line.trim()).filter(line => line !== '');

  // If the file is empty throw an error
  if (lines.length === 0) {
    throw new Error("The file is empty or only contains empty lines.");
  }

  let headerDetected = false;
  const headers = lines[0].split(',');
  
  // Attempt to detect header by checking if all elements are non-numeric words
  if (headers.length === 4 && headers.every(header => isNaN(parseFloat(header)))) {
    headerDetected = true;
  }

  const independentVariableName = headerDetected ? headers[0] : "X Label";
  const dependentVariableName = headerDetected ? headers[2] : "Y Label";

  // Start processing from line 1 if header is detected, otherwise start from line 0
  const dataStartIndex = headerDetected ? 1 : 0;

  const dataPoints = lines.slice(dataStartIndex).map((line, index) => {
    const values = line.split(',');

    if (values.length !== 4) {
      throw new Error(`Line ${index + 2} (actual content: "${line}") does not contain exactly four entries.`);
    }

    const numericValues = values.map(value => {
      const number = parseFloat(value);
      if (isNaN(number)) {
        throw new Error(`Non-numeric value found on line ${index + 1 + dataStartIndex} (actual content: "${line}").`);
      }
      return number;
    });

    return {
      independentVariable: numericValues[0],
      independentVariableError: numericValues[1],
      dependentVariable: numericValues[2],
      dependentVariableError: numericValues[3],
    };
  });

  return {
    dataPoints,
    independentVariableName,
    dependentVariableName
  };
};

export default parseCsvContent;