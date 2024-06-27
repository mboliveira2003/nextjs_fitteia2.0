type FunctionInput = {
  mainFunction: string;
  subfunctions: string[];
  auxiliaryVariable: string;
};

type ParsedOutput = {
  dependentVar: string;
  independentVar: string;
  processedFunction: string;
  parameters: string[];
};

function parseFunction(input: FunctionInput): ParsedOutput | string {
  const { mainFunction, subfunctions, auxiliaryVariable } = input;

  // Check main function
  const mainCheck = checkMainFunction(mainFunction);

  // If an error message is returned, display it
  if (typeof mainCheck === "string") {
    return mainCheck;
  }
  // Extract the dependent and independent variables
  const [dependentVar, independentVar] = mainCheck;

  // Check subfunctions
  const subCheck = checkSubfunctions(
    mainFunction,
    subfunctions,
    independentVar,
    dependentVar
  );
  // If an error message is returned, display it
  if (typeof subCheck === "string") {
    return subCheck;
  }

  // Combine functions
  const combinedFunction = combineFunctions(mainFunction, subfunctions);

  // Process the combined function
  const processedFunction = processCombinedFunction(
    combinedFunction,
    dependentVar,
    independentVar
  );

  // Extract parameters
  const parameters = extractParameters(
    combinedFunction,
    independentVar,
    dependentVar,
    auxiliaryVariable
  );

  // Return the output
  return {
    dependentVar,
    independentVar,
    processedFunction,
    parameters,
  };
}

function checkMainFunction(mainFunction: string): [string, string] | string {
  // Check the format of the variable names
  // Alphanumeric characters and underscores are allowed
  const mainRegex = /^([a-zA-Z0-9_]+)\(([a-zA-Z0-9_]+)\)\s*=\s*.*$/;
  const match = mainFunction.match(mainRegex);
  if (!match) {
    return "The main function does not match the format y(x) = ...";
  }
  return [match[1], match[2]];
}

function checkSubfunctions(
  mainFunction: string,
  subfunctions: string[],
  independentVar: string,
  dependentVar: string
): true | string {
  // Check the format of the variable names
  // Alphanumeric characters and underscores are allowed
  const subRegex = /^([a-zA-Z0-9_]+)\(([a-zA-Z0-9_]+)\)\s*=\s*.*$/;
  for (const sub of subfunctions) {
    const match = sub.match(subRegex);
    if (!match) {
      return `The subfunction "${sub}" does not match the format z(x) = ...`;
    }

    const [_, subVar, subIndVar] = match;

    // If the subVar is not part of the main function, we can simply ignore it
    const regex = new RegExp(`\\b${subVar}\\b`, "g");
    if (!regex.test(mainFunction)) {
      return true;
    }

    if (subIndVar !== independentVar) {
      return `The independent variable in subfunction "${sub}" must be the same as in the main function.`;
    }
    if (subVar === dependentVar) {
      return `The subfunction "${sub}" cannot use the same dependent variable as the main function.`;
    }
  }
  return true;
}

function combineFunctions(
  mainFunction: string,
  subfunctions: string[]
): string {
  let combinedFunction = mainFunction;

  for (const sub of subfunctions) {
    // Extract the dependent variable and the function expression
    const [_, subVar, __, subExpression] =
      sub.match(/^([a-zA-Z0-9_]+)\(([a-zA-Z0-9_]+)\)\s*=\s*(.*)$/) || [];
    // Remove whitespaces of the expression
    const subExpressionWrapped = `(${subExpression.trim()})`;
    // Regex expression to find all occurences of the dependent variable
    const regex = new RegExp(`\\b${subVar}\\b`, "g");
    // Remove all occurences of the dependent variable in the main function with the expression
    combinedFunction = combinedFunction.replace(regex, subExpressionWrapped);
  }
  return combinedFunction;
}

function processCombinedFunction(
  combinedFunction: string,
  dependentVar: string,
  independentVar: string
): string {
  // Create a regex to remove the introductory part of the combined function
  const combinedFunctionRegex = new RegExp(
    `^${dependentVar}\\(${independentVar}\\)\\s*=\\s*`
  );
  const combinedFunctionMatch = combinedFunction.match(combinedFunctionRegex);

  // If there was no match, return an error message
  if (!combinedFunctionMatch) {
    return "Combined function does not match the format y(x) = ...";
  }

  // Rturn the processed function
  const processedFunction = combinedFunction.slice(
    combinedFunctionMatch[0].length
  );

  return processedFunction;
}

function extractParameters(
  combinedFunction: string,
  independentVar: string,
  dependentVar: string,
  auxiliaryVariable: string
): string[] {
  const ignoredCppWords = new Set([
    "if",
    "else",
    "while",
    "return",
    "function",
    "const",
    "let",
    "var",
    "int",
    "float",
    "double",
    "char",
    "for",
    "do",
    "switch",
    "case",
    "default",
    "break",
    "continue",
    "void",
    "static",
    "struct",
    "union",
    "class",
    "public",
    "private",
    "protected",
    "virtual",
    "inline",
    "volatile",
    "typedef",
    "sizeof",
    "goto",
    "enum",
    "namespace",
    "using",
    "template",
    "try",
    "catch",
    "throw",
    "delete",
    "new",
    "operator",
    "friend",
    "this",
    "true",
    "false",
    "nullptr",
    "extern",
    "register",
    "asm",
    "typedef",
    "typename",
    "long",
    "short",
    "signed",
    "unsigned",
    "mutable",
    "explicit",
    "typename",
    "dynamic_cast",
    "static_cast",
    "reinterpret_cast",
    "const_cast",

    // C++ Math Functions
    "abs",
    "fabs",
    "fmod",
    "remainder",
    "remquo",
    "fma",
    "fmax",
    "fmin",
    "fdim",
    "exp",
    "exp2",
    "expm1",
    "log",
    "log10",
    "log1p",
    "log2",
    "pow",
    "sqrt",
    "cbrt",
    "hypot",
    "sin",
    "cos",
    "tan",
    "asin",
    "acos",
    "atan",
    "atan2",
    "sinh",
    "cosh",
    "tanh",
    "asinh",
    "acosh",
    "atanh",
    "erf",
    "erfc",
    "tgamma",
    "lgamma",
    "ceil",
    "floor",
    "trunc",
    "round",
    "lround",
    "llround",
    "nearbyint",
    "rint",
    "lrint",
    "llrint",
    "frexp",
    "ldexp",
    "modf",
    "scalbn",
    "scalbln",
    "ilogb",
    "logb",
    "nextafter",
    "nexttoward",
    "copysign",
    "nan",
    "fpclassify",
    "isfinite",
    "isinf",
    "isnan",
    "isnormal",
    "signbit",
    "real",
    "imag",
    "arg",
    "norm",
    "conj",
    "proj",
    "polar",
    "std::complex",
    "legendre",
    "hermite",
    "chebyshev",
    "j0",
    "j1",
    "jn",
    "y0",
    "y1",
    "yn",
    "std",
    "accumulate",
    "inner_product",
    "partial_sum",
    "adjacent_difference",

    // Common Built-in Functions
    "memcpy",
    "memset",
    "strlen",
    "strcpy",
    "strncpy",
    "strcmp",
    "strncmp",
    "strcat",
    "strncat",
    "printf",
    "scanf",
    "malloc",
    "free",
    "exit",
    "atexit",
    "rand",
    "srand",
    "time",
    "clock",
    "atoi",
    "atof",
    "itoa",
    "utoa",
    "sprintf",
    "sscanf",
    "fopen",
    "fclose",
    "fread",

    // Common Math Constants
    "Pi",
    "pi",
    "M_PI",
    "M_E",
    "M_LOG2E",
    "M_LOG10E",
    "M_LN2",
    "M_LN10",
    "M_PI_2",
    "M_PI_4",
    "M_1_PI",
    "M_2_PI",
    "M_2_SQRTPI",
    "M_SQRT2",
    "M_SQRT1_2",
    "M_EULER",
    "M_TAU",
    "M_PHI",
    "M_GAMMA",
    "M_LN2",
    "M_LN10",
    "M_SQRT3",
    "M_SQRT5",
  ]);
  const libFunctions = new Set([
    "BPP",
    "Bcirc",
    "Bcoil",
    "CED_poli",
    "CROSSR1",
    "CROSSRELAX",
    "CompElliptic1",
    "ECD_poli",
    "EllipticE",
    "EllipticF",
    "GAULOR",
    "GAUSS",
    "GAUSS1",
    "GLmix",
    "HavNeg",
    "JacobiCN",
    "JacobiDN",
    "JacobiSN",
    "LORTZN",
    "ODFN",
    "ODFSmA",
    "OPF",
    "R1CRsp1",
    "R1ISsbm",
    "R1OSabhf",
    "R1Torrey",
    "RMTDnum",
    "RNordio",
    "RNordio_ang",
    "RNordio_poli",
    "ROUSE",
    "ROUSE123",
    "RotVold",
    "RotWoessner",
    "SDFreed",
    "SDN11_2_DllDp2",
    "SDN11_2_DllDp2_poli",
    "SDvilfSmB",
    "Torrey",
    "Torrey1",
    "iT1ISpara",
    "iT1inISpara",
    "iT1isSmallS",
    "iT1osSmallS",
    "jhf",
    "mnpR1HSc",
    "mnpR1Hsze",
    "mnpR1Hszn",
  ]);

  const uniqueVars = new Set<string>();

  // Regex to match words that are valid variable names
  const words = combinedFunction.match(/\b[a-zA-Z_][a-zA-Z0-9_]*\b/g) || [];

  // Regular expression to match the auxiliaryVariable and any following underscore and number
  const auxVarRegex = new RegExp(`^${auxiliaryVariable}(?:_\\d+)?$`);

  for (const word of words) {
    if (
      !ignoredCppWords.has(word) &&
      !libFunctions.has(word) &&
      word !== independentVar &&
      word !== dependentVar &&
      !auxVarRegex.test(word) // Use the regex to test for auxiliaryVariable patterns
    ) {
      uniqueVars.add(word);
    }
  }

  return Array.from(uniqueVars);
}

export default parseFunction;
export type { FunctionInput, ParsedOutput };
