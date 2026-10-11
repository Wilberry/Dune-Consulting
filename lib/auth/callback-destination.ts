/** Do not redirect auth codes to arbitrary or scheme-relative URLs. */
export function callbackDestination(next: string | null):
  "/dashboard" | "/admin/update-password" {
  return next === "/dashboard" ? "/dashboard" : "/admin/update-password";
}
