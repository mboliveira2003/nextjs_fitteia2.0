function extractChiSquared(fitResults: string): number[] {

  // Split the fitResults string into lines
  const lines = fitResults.trim().split('\n');
  
  // Ignore the header and process each line
  const chi2Values = lines.slice(1).map(line => {
    const columns = line.split(',').map(column => column.trim());

    // Extract the third column, wich has the chi-squared value
    return parseFloat(columns[2]); 
  });

  // If any of the values of the chi squared is NaN, return an empty array
  if (chi2Values.some(value => isNaN(value))) {
    console.log('Error extracting chi-squared values')
    return [];
  }
  return chi2Values;
}

export default extractChiSquared;
