export type NewsletterConsentStatus = "subscribed" | "unsubscribed";

/** Only a verified, separate opt-in flow may restore an opted-out address. */
export function allowEmailOnlySignupSync(status: NewsletterConsentStatus) {
  return status === "subscribed";
}

/** Provider contact updates can suppress consent, but cannot grant it. */
export function consentAfterProviderUpdate(
  current: NewsletterConsentStatus,
  providerUnsubscribed: boolean,
): NewsletterConsentStatus {
  return providerUnsubscribed ? "unsubscribed" : current;
}
