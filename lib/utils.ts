export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function removeTextDashes(value: string) {
  return value.replace(/[-‐‑‒–—―]/g, " ").replace(/[ \t]+/g, " ");
}
