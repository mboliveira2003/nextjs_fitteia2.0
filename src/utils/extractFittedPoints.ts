import { FittedDatapoint } from "@/app/types";

function extractXYPairs(fitCurves: string): FittedDatapoint[] {
  // Split the multiline string into individual lines
  const lines = fitCurves.split("\n");
  const xyPairs: FittedDatapoint[] = [];

  // Iterate over each line
  for (const line of lines) {
    // Trim the line to remove leading/trailing whitespace
    const trimmedLine = line.trim();
    // Skip empty lines or lines that don't have the right format
    if (!trimmedLine || !trimmedLine.includes(" ")) continue;

    // Split the line by spaces to get individual components
    const components = trimmedLine.split(/\s+/);

    // Ensure there are at least two components (x and y values)
    if (components.length < 2) continue;

    // Parse x and y values as numbers
    const x = parseFloat(components[0]);
    const y = parseFloat(components[1]);

    // Check if parsing was successful
    if (isNaN(x) || isNaN(y)) continue;

    // Add the x and y pair to the array
    xyPairs.push({ independentVariable: x, dependentVariable: y });
  }

  return xyPairs;
}

export default extractXYPairs;