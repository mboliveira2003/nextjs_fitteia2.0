function extractChiSquared(fitResults: string): number | string {
  // Regular expression to match the line containing chi-squared value
  const chiSquaredRegex = /^tags\.txt, \d+, (\d+)/m;
  const match = fitResults.match(chiSquaredRegex);

  if (match && match[1]) {
    // Convert the matched chi-squared value to a number and return
    return parseFloat(match[1]);
  } else {
    console.log("Chi-squared value not found in fit results");
    return "-";
  }
}

export default extractChiSquared;
