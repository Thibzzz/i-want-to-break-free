import { config } from "./config"
import type { Rule, StyleRule, TagRule, ClassRule } from "./domain"


const Log = (...args: any[]) => {
  if (config.silenceConsole) return
  console.log(...args)
}
const LogError = (...args: any[]) => {
  if (config.silenceConsole) return
  console.error(...args)
}

Log("IW2BF Boot content script : ", config)

const { ruleSets, siteWatch } = config

const getBrowser = () => {
  const browserString = process.env.PLASMO_BROWSER;
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

const removeOffendingTag = (rule: TagRule) => {
  Log("IW2BF removeOffendingTag : ", rule)
  const elements = document.querySelectorAll(rule.offenderSelector) ?? false
  Log("IW2BF removeOffendingTag : ", elements)
  if (!elements) return
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i]
    Log("IW2BF removeOffendingTag : ", element)
    return element.remove()
  }
}

const selectElement = (rule: Rule) => {
  if (!rule.offenderSelector) return
  let el;
  if (rule.selectByClass) {
    el = document.getElementsByClassName(rule.offenderSelector)
    return el
  }
  if (rule.selectById) {
    el = document.getElementById(rule.offenderSelector)
    return el
  }
  el = document.querySelectorAll(rule.offenderSelector)
  return el ?? false
}

const removeOffendingStyle = (rule: StyleRule) => {
  Log("IW2BF removeOffendingStyle : ", rule)
  const [element] = selectElement(rule) ?? false
  Log("IW2BF removeOffendingStyle : ", element)
  if (!element) return
  const style = element.hasAttribute("style")
    ? element.getAttribute("style")
    : false
  Log("IW2BF removeOffendingStyle : ", style)
  if (!style) return
  const newStyle = style.replace(rule.offendingStyle, "")
  return element.setAttribute("style", newStyle)
}

const removeOffendingClass = (rule: ClassRule) => {
  Log("IW2BF removeOffendingClass : ", rule)
  let [el] = selectElement(rule) ?? false
  if (!el || !el.classList) return
  if (!el.classList.length) return
  Log("IW2BF removeOffendingClass : ", el)
  el.classList.remove(rule.offendingClass)
}

const newLog = (timeString: string) => {
  if (config.silenceConsole) return
  if(config.collapseConsole) return console.groupCollapsed(timeString)
  return console.group(timeString)
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
    switch (rule.type) {
      case "tag":
        try {
          removeOffendingTag(rule)
        } catch(e) {
          LogError("IW2BF Tag Error : ", e)
        }
        break
      case "styleTag":
        try {
          removeOffendingStyle(rule)
        } catch (e) {
          LogError("IW2BF Style Error : ", e)
        }
        break
      case "cssClass":
        try {
          removeOffendingClass(rule)
        } catch (e) {
          LogError("IW2BF Class Error : ", e)
        }
        break
      default:
        Log("IW2BF runRuleSetByName : default")
        throw new Error(`IW2BF runRuleSetByName : ${rule.type} not found`)
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
      }
      , watchInterval)
    } 
  }

  launchOnReadyStateComplete() {
    Log("IW2BF launching App")

    if (isChrome()) {
      Log("IW2BF isChrome")
      document.addEventListener("readystatechange", (event) => {
        Log("IW2BF watching page state :", document.readyState)
        let run = false;
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
      } catch(e) {
        LogError("IW2BF Error in FF Launcher : ", e)
      }
      
    }
  }
}

const app = new App()
try {
  app.launchOnReadyStateComplete()
} catch(e) {
  LogError("IW2BF Error : ", e)
}

export default app