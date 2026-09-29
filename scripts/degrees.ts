/*
Name: [Your name and group members]
Date: September 28, 2026
Program: Celsius and Fahrenheit converter.
The user chooses a direction and enters one number or a comma-separated list.
The program checks that every entry is a number.
It converts the numbers and displays the results or an error message.
*/

// Return an arrow function that converts one number or a list.
function getTemperatureConverter(from: string, to: string) {
  const convertOne = (value: number): number =>
    from === "C" && to === "F"
      ? value * 9 / 5 + 32
      : (value - 32) * 5 / 9;

  return (values: number | number[]): number | number[] =>
    Array.isArray(values) ? values.map(convertOne) : convertOne(values);
}

// Get the form elements.
const form = document.getElementById("temperature-form") as HTMLFormElement;
const direction = document.getElementById("direction") as HTMLSelectElement;
const valuesInput = document.getElementById("values") as HTMLInputElement;
const result = document.getElementById("result") as HTMLParagraphElement;
const error = document.getElementById("error") as HTMLParagraphElement;

// Convert when the user submits the form.
form.addEventListener("submit", (event): void => {
  event.preventDefault();
  result.textContent = "";
  error.textContent = "";

  const parts = valuesInput.value.split(",").map(part => part.trim());

  if (parts.some(part => part === "" || !Number.isFinite(Number(part)))) {
    error.textContent = "Enter a number or a list such as 0, 25, 100.";
    return;
  }

  const numbers = parts.map(Number);
  const values = numbers.length === 1 ? Number(parts[0]) : numbers;

  const from = direction.value === "C-F" ? "C" : "F";
  const to = direction.value === "C-F" ? "F" : "C";
  const converted = getTemperatureConverter(from, to)(values);

  const formatted = Array.isArray(converted)
    ? converted.map(value => Number(value.toFixed(4))).join(", ")
    : Number(converted.toFixed(4));

  result.textContent = `${formatted} °${to}`;
});