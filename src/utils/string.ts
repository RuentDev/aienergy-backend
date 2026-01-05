export function capsAllFirstCharWithSpace(str: string) {
  if (!str) return ""; // Handle empty strings
  return str.split("%20").join(" ");
}
