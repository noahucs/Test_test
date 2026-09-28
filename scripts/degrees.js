/*
Name: [Your name and group members]
Date: September 28, 2026
Program: Temperature converter for the measurement website.
The user enters one number or a comma-separated list, chooses a conversion
direction, and sees the converted result or an input error.
*/

// Return a function that converts one number or an array of numbers.
function getConverter(fromUnit, toUnit) {
  let convertOne;

  if (fromUnit === "C" && toUnit === "F") {
    convertOne = value => value * 9 / 5 + 32;
  } else if (fromUnit === "F" && toUnit === "C") {
    convertOne = value => (value - 32) * 5 / 9;
  } else {
    throw new Error("Unsupported units.");
  }

  return values => Array.isArray(values)
    ? values.map(convertOne)
    : convertOne(values);
}

// Read one number or a comma-separated list.
function readValues(text) {
  const parts = text.split(",").map(part => part.trim());

  if (parts.some(part => part === "" || !Number.isFinite(Number(part)))) {
    throw new Error("Enter a number or a list such as 0, 25, 100.");
  }

  const numbers = parts.map(part => Number(part));
  return numbers.length === 1 ? numbers[0] : numbers;
}

// Convert when the form is submitted.
document.getElementById("temperature-form").addEventListener("submit", event => {
  event.preventDefault();

  const result = document.getElementById("result");
  const resultBox = document.getElementById("result-box");
  const error = document.getElementById("error");

  result.textContent = "";
  error.textContent = "";
  resultBox.classList.add("hidden");

  try {
    const direction = document.getElementById("direction").value.split("-");
    const input = readValues(document.getElementById("values").value);
    const converted = getConverter(direction[0], direction[1])(input);
    const format = value => Number(value.toFixed(4));

    const originalValues = Array.isArray(input) ? input : [input];
    const convertedValues = Array.isArray(converted) ? converted : [converted];

    result.textContent = originalValues
      .map((value, index) =>
        `${value} °${direction[0]} = ${format(convertedValues[index])} °${direction[1]}`
      )
      .join("\n");

    resultBox.classList.remove("hidden");
  } catch (problem) {
    error.textContent = problem.message;
  }
});