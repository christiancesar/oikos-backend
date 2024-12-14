export function phoneValidation(phone: string) {
  return /^[0-9]{11}$/.test(
    phone
      .trim()
      .split(" ")
      .join("")
      .split("-")
      .join("")
      .split("(")
      .join("")
      .split(")")
      .join(""),
  );
}
