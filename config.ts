import { redditRules } from "~rulesets/reddit";
import { linkedinRules } from "~rulesets/linkedin";

const config = {
  defaultInterval : 6 * 1000, // 6 seconds
  collapseConsole: false,
  silenceConsole: process.env.NODE_ENV === 'production',
  clearConsole: false,
  siteWatch : [{
    name: "reddit",
    url: "https://wwww.reddit.com/",
    urlRegexp : '.*(reddit.com).*',
    interval: null,
  }, {
    name: "linkedin",
    url:"https://www.linkedin.com/",
    urlRegexp : '.*(linkedin.com).*',
    interval: null,
  }],
  ruleSets : [
    linkedinRules,
    redditRules
  ]
}

export { config };