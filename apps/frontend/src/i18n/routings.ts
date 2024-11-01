import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en-US", "th-TH"],
  defaultLocale: "en-US",
  localePrefix: {
    mode: "always",
    prefixes: {
      "en-US": "/en",
      "th-TH": "/th",
    },
  },
});
