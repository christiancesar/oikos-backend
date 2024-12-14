export function cpfValidation(cpf: string) {
  return /^[0-9]{11}$/.test(cpf.trim().split(".").join("").split("-").join(""));
}
