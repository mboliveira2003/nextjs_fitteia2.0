function parseString(input: string): string[] {
  // Define the array of known variables
  const knownVariables = ["x", "y", "z", "w", "t"];
  // Define the regex pattern to match words and exclude digits
  const wordPattern = /[a-zA-Z]+/g;

  // Extract all words from the input string
  const words = input.match(wordPattern) || [];

  // Filter out known variables and words that are mathematical operators
  const filteredWords = words.filter(
    (word) => !knownVariables.includes(word) && isNaN(Number(word))
  );

  return filteredWords;
}

export { parseString };
