import { config } from "./config"
import { Log, newLog, LogError } from "./src/utils/logger"
import actionsMap from "~src/actions/actionsMap"

Log("IW2BF Boot content script : ", config)

const { ruleSets, siteWatch } = config

const getBrowser = () => {
  const browserString = process.env.PLASMO_BROWSER
  Log("IW2BF getBrowser : ", browserString)
  return browserString
}

const isChrome = () => {
  const browserString = getBrowser()
  if (!browserString) return false
  return browserString === "chrome"
}

const isFirefox = () => {
  const browserString = getBrowser()
  if (!browserString) return false
  return browserString === "firefox"
}




const getTimeString = () => {
  const dateString = new Date().getTime()
  let timeString = `IW2BF-${dateString}`
  return timeString
}


const runRuleSetByName = (name: string) => {
  const timeString = getTimeString()
  newLog(timeString)
  Log("IW2BF runRuleSetByName : ", name)
  const [ruleSet] = ruleSets.filter((a) => a.name === name) ?? []
  if (!ruleSet.rules)
    throw new Error(`IW2BF runRuleSetByName : ${name} not found`)
  Log("IW2BF runRuleSetByName : ", ruleSet)
  
  ruleSet.rules.forEach((rule) => {
    try {
      actionsMap[rule.type](rule)
    } catch (e) {
      LogError(`IW2BF ${rule.type} : `, e)
    }
  })
  console.groupEnd()
}

class App {
  init() {
    const currentHost: string = location.hostname ?? "localhost"
    Log(`IW2BF : ${currentHost}}`)

    for (const site in siteWatch) {
      const test = currentHost.match(siteWatch[site].urlRegexp)
      if (!test) continue
      Log("IW2BF has matched with : ", siteWatch[site].urlRegexp)
      const watchInterval = siteWatch[site].interval ?? config.defaultInterval
      runRuleSetByName(siteWatch[site].name)
      setInterval(() => {
        if (config.clearConsole) console.clear()
        runRuleSetByName(siteWatch[site].name)
      }, watchInterval)
    }
  }

  launchOnReadyStateComplete() {
    Log("IW2BF launching App")

    if (isChrome()) {
      Log("IW2BF isChrome")
      document.addEventListener("readystatechange", (event) => {
        Log("IW2BF watching page state :", document.readyState)
        let run = false
        if (document.readyState === "complete") run = true
        if (!run) return
        try {
          this.init()
        } catch (e) {
          LogError("IW2BF Error in Chrome Launcher : ", e)
        }
      })
    }
    if (isFirefox()) {
      Log("IW2BF isFirefox")
      try {
        this.init()
      } catch (e) {
        LogError("IW2BF Error in FF Launcher : ", e)
      }
    }
  }
}

const app = new App()
try {
  app.launchOnReadyStateComplete()
} catch (e) {
  LogError("IW2BF Error : ", e)
}

export default app
