import settings from "@/content/copy/site-settings.json";

/**
 * Facts that may render. Phone is null until Eric answers — never render it.
 */
export const site = {
  name: settings.name,
  legalName: settings.legalName,
  wordmark: settings.wordmark,
  email: settings.email,
  address: settings.address,
  phone: settings.phone,
} as const;
