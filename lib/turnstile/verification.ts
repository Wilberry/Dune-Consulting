export type TurnstileSiteverifyResponse = {
  success?: boolean;
  hostname?: string;
  action?: string;
  "error-codes"?: string[];
};

export function isTurnstileResponseValid(
  result: TurnstileSiteverifyResponse,
  expectedAction: string,
  expectedHostname: string | null,
) {
  if (!result.success) return false;
  if (result.action !== expectedAction) return false;
  if (expectedHostname && result.hostname !== expectedHostname) return false;
  return true;
}
