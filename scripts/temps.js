/*
Name: [Your name and group members]
Date: September 28, 2026
Program: Temperature converter for the unit conversion website.
The user selects Celsius to Fahrenheit or Fahrenheit to Celsius and enters one
number or a comma-separated list of numbers. The page checks each input and
passes a number or array to a conversion function selected by its units.
The converted result is displayed with its unit, or an error message explains
what the user needs to correct. The same form works on narrow and wide screens.
*/

// Return an arrow function for the requested pair of units.
function createTemperatureConverter(fromUnit, toUnit) {
  let convertOne;

  if (fromUnit === "C" && toUnit === "F") {
    convertOne = value => (value * 9 / 5) + 32;
  } else if (fromUnit === "F" && toUnit === "C") {
    convertOne = value => (value - 32) * 5 / 9;
  } else {
    throw new Error("Unsupported temperature units.");
  }

  return values => Array.isArray(values)
    ? values.map(convertOne)
    : convertOne(values);
}

// Read and validate one number or a list separated by commas or new lines.
function readTemperatures(text, mode) {
  if (mode === "single") {
    const value = Number(text.trim());
    if (text.trim() === "" || !Number.isFinite(value)) {
      throw new Error("Enter one valid number, such as 25 or -10.");
    }
    return value;
  }

  const parts = text.split(/[,\n]/).map(part => part.trim());
  if (parts.length === 0 || parts.some(part => part === "" || !Number.isFinite(Number(part)))) {
    throw new Error("Enter numbers separated by commas or new lines, such as 0, 25, 100.");
  }
  return parts.map(part => Number(part));
}

// Connect the form to the converter and display the result.
const form = document.getElementById("temperature-form");
const direction = document.getElementById("direction");
const valuesInput = document.getElementById("values");
const inputHint = document.getElementById("input-hint");
const valuesLabel = document.getElementById("values-label");
const errorMessage = document.getElementById("error-message");
const resultPanel = document.getElementById("result-panel");
const result = document.getElementById("result");

document.querySelectorAll('input[name="mode"]').forEach(radio => {
  radio.addEventListener("change", () => {
    const isList = document.querySelector('input[name="mode"]:checked').value === "list";
    valuesLabel.textContent = isList ? "Temperatures" : "Temperature";
    valuesInput.placeholder = isList ? "Example: 0, 25, 100" : "Example: 25";
    inputHint.textContent = isList
      ? "Separate numbers with commas or new lines, such as 0, 25, 100."
      : "Enter one number, such as 25 or -10.";
    errorMessage.classList.add("hidden");
    resultPanel.classList.add("hidden");
  });
});

form.addEventListener("submit", event => {
  event.preventDefault();
  errorMessage.classList.add("hidden");
  resultPanel.classList.add("hidden");

  try {
    const mode = document.querySelector('input[name="mode"]:checked').value;
    const [fromUnit, toUnit] = direction.value.split("-");
    const values = readTemperatures(valuesInput.value, mode);
    const converted = createTemperatureConverter(fromUnit, toUnit)(values);
    const format = value => Number(value.toFixed(4));

    result.textContent = Array.isArray(converted)
      ? values.map((value, index) => `${value} °${fromUnit} = ${format(converted[index])} °${toUnit}`).join("\n")
      : `${values} °${fromUnit} = ${format(converted)} °${toUnit}`;
    resultPanel.classList.remove("hidden");
  } catch (error) {
    errorMessage.textContent = error.message;
    errorMessage.classList.remove("hidden");
  }
});