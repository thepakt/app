export function toNanoDigits(src: string, digits: number): bigint {
  // Check sign
  let neg = false
  while (src.startsWith("-")) {
    neg = !neg
    src = src.slice(1)
  }

  // Split string
  if (src === ".") {
    throw Error("Invalid number")
  }
  let parts = src.split(".")
  if (parts.length > 2) {
    throw Error("Invalid number")
  }

  // Prepare parts
  let whole = parts[0]
  let frac = parts[1]
  if (!whole) {
    whole = "0"
  }
  if (!frac) {
    frac = "0"
  }
  if (frac.length > digits) {
    throw Error("Invalid number")
  }
  while (frac.length < digits) {
    frac += "0"
  }

  // Convert
  let r = BigInt(whole) * BigInt(10) ** BigInt(digits) + BigInt(frac)
  if (neg) {
    r = -r
  }
  return r
}
