type FunctionInput = {
  mainFunction: string;
  subfunctions: string[];
};

type ParsedOutput = {
  dependentVar: string;
  independentVar: string;
  parameters: string[];
};

function parseFunction(input: FunctionInput): ParsedOutput | string {
  const { mainFunction, subfunctions } = input;

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

  // Extract parameters
  const parameters = extractParameters(
    combinedFunction,
    independentVar,
    dependentVar
  );

  // Return the output
  return {
    dependentVar,
    independentVar,
    parameters,
  };
}

function checkMainFunction(mainFunction: string): [string, string] | string {
  // Check the format of the variable names
  // Alphanumeric characters and underscores are allowed
  const mainRegex = /^([a-zA-Z0-9_]+)\(([a-zA-Z0-9_]+)\)\s*=\s*.*$/;
  const match = mainFunction.match(mainRegex);
  if (!match) {
    return "Main function does not match the format y(x) = ...";
  }
  return [match[1], match[2]];
}

function checkSubfunctions(
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
      return "Subfunction does not match the format z(x) = ...";
    }
    const [_, subVar, subIndVar] = match;
    if (subIndVar !== independentVar) {
      return `Independent variable in subfunction "${sub}" must be the same as in the main function.`;
    }
    if (subVar === dependentVar) {
      return `Subfunction "${sub}" cannot use the same dependent variable as the main function.`;
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

function extractParameters(
  combinedFunction: string,
  independentVar: string,
  dependentVar: string
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

  for (const word of words) {
    if (
      // Ignore all C++ keywords, onefite lib functions, and the dependent and independent variables
      !ignoredCppWords.has(word) &&
      !libFunctions.has(word) &&
      word !== independentVar &&
      word !== dependentVar
    ) {
      uniqueVars.add(word);
    }
  }

  return Array.from(uniqueVars);
}