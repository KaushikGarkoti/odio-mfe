import { parse, format } from "date-fns";

export const dateFormat = (inputDate) => {
  const formatConfig = JSON.parse(localStorage.getItem("TIME_FORMAT"));
  const { format: inputFormat } = formatConfig;

  const parsedDate = parse(inputDate, inputFormat, new Date());

  if (parsedDate == "Invalid Date") {
    return "Invalid Date";
  }

  return format(parsedDate, "dd-MM-yyyy");
};

export const positionFormat = (date) => {
  const format = JSON.parse(localStorage.getItem("TIME_FORMAT")).value;
  const padZero = (num) => num.toString().padStart(2, "0");

  const normalizedDate = date.replace(/[/.\s]/g, "-");

  const [day, month, year] = normalizedDate.split("-").map(Number);

  switch (format) {
    case "DD-MM-YYYY":
      return `${padZero(day)}-${padZero(month)}-${year}`
    
      case "MM-DD-YYYY":
      return `${padZero(month)}-${padZero(day)}-${year}`;

    case "YYYY-MM-DD":
      return `${year}-${padZero(month)}-${padZero(day)}`;

    default:
      throw new Error("Unsupported format");
  }
}