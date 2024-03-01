const preprocessLatex = (latex) => {
  const commands = [
    'sqrt',
    'frac',
    'div',
    'times',
    'cdot',
    'pm',
    'mp',
    'leq',
    'geq',
    'neq',
    'infty',
  ];

  return commands.reduce((processedLatex, command) => {
    let regex = new RegExp('\\\\' + command + '\\b', 'g');
    return processedLatex.replace(regex, '');
  }, latex);
}

const validateEquationInput = (equation, solveFor, parameters) => {
  const processedEquation = preprocessLatex(equation);

  if (/[a-zA-Z]{2,}/.test(processedEquation)) {
    alert("Adjacent letters must be separated by an operator");
    return false;
  }

  if (!processedEquation.includes(solveFor)) {
    alert("The solveFor value must exist within the equation");
    return false;
  }

  if (!/^[a-zA-Z]{1}$/.test(solveFor)) {
    alert("The solveFor value should be a single letter");
    return false;
  }

  if (solveFor in parameters) {
    alert("The solveFor value cannot be a parameter");
    return false;
  }

  return Object.keys(parameters).every((key) => {
    if (!/^[a-zA-Z]{1}$/.test(key) || !processedEquation.includes(key)) {
      alert(
        `The parameter ${key} must be a single letter and exist within the equation`
      );
      return false;
    }
    return true;
  });
};

export default validateEquationInput;
