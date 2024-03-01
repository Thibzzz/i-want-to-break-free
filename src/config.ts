import { linkedinRules } from "./rulesets/linkedin"
import { redditRules } from "./rulesets/reddit"

const config = {
  defaultInterval: 6 * 1000, // 6 seconds
  collapseConsole: false,
  silenceConsole: process.env.NODE_ENV === "production",
  clearConsole: false,
  // you can set an interval key for each site
  siteWatch: [
    {
      name: "reddit",
      url: "https://wwww.reddit.com/",
      urlRegexp: ".*(reddit.com).*",
    },
    {
      name: "linkedin",
      url: "https://www.linkedin.com/",
      urlRegexp: ".*(linkedin.com).*",
    }
  ],
  ruleSets: [linkedinRules, redditRules]
}

export { config }
