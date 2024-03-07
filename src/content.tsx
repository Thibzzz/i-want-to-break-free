import { Storage } from "@plasmohq/storage"
import { actionsMap } from "./actions/actionsMap"
import { config } from "./config"
import type { RuleParams } from "./domain"
import { Log, LogError, newLog } from "./utils/logger"

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
  const [ruleSet] = ruleSets.filter((a) => a.name === name) ?? []
  if (!ruleSet.rules)
    throw new Error(`IW2BF runRuleSetByName : ${name} not found`)

  ruleSet.rules.forEach((rule) => {
    try {
      actionsMap[rule.type](rule)
    } catch (e) {
      newLog(timeString)
      LogError(`IW2BF ${rule.type} : `, e)
      console.groupEnd()
    }
  })
}

// TODO : test this function
export { runRuleSetByName }

class App {
  private runners: NodeJS.Timer[]
  private watcher: any
  private storage: Storage
  constructor() {
    this.runners = []
    this.storage = new Storage()
    // TODO : test this stuff and the cleaning of the runners, especially for overflows that can't lock the browser
    this.watcher = this.storage.watch({
      rules: (c) => {
        console.log(c.newValue)
        this.runners.map((runner) => clearInterval(runner))
        this.runners = []
        this.init()
        console.log(
          "IW2BF : rules updated => relaunch init",
          this.runners,
          c.newValue
        )
      }
    })
  }
  async init() {
    const rules: RuleParams[] = (await this.storage.get("rules")) ?? siteWatch
    const currentHost: string = location.hostname ?? "localhost"
    Log(`IW2BF : ${currentHost}}`, rules)

    for (let i = 0; i < rules.length; i++) {
      const test = currentHost.match(rules[i].urlRegexp)
      if (!test) continue
      Log("IW2BF has matched with : ", rules[i].url)
      const watchInterval = rules[i]?.interval ?? config.defaultInterval
      runRuleSetByName(rules[i].name)
      const ruleRunner = setInterval(() => {
        if (config.clearConsole) console.clear()
        runRuleSetByName(rules[i].name)
      }, watchInterval)
      this.runners.push(ruleRunner)
    }
  }

  async launchOnReadyStateComplete() {
    Log("IW2BF launching App")

    if (isChrome()) {
      Log("IW2BF isChrome")
    }
    if (isFirefox()) {
      Log("IW2BF isFirefox")
    }
    try {
      await this.init()
    } catch (e) {
      LogError("IW2BF Error in Launcher : ", e)
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
