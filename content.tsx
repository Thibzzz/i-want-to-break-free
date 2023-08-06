import { config } from "./config"
import type { Rule, StyleRule, TagRule, ClassRule } from "./domain"

console.log("IW2BF Boot content script : ", config)

const { ruleSets, siteWatch } = config

const removeOffendingTag = (rule: TagRule) => {
  console.log("IW2BF removeOffendingTag : ", rule)
  const elements = document.querySelectorAll(rule.offenderSelector)
  console.log("IW2BF removeOffendingTag : ", elements)
  if (!elements) return
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i]
    console.log("IW2BF removeOffendingTag : ", element)
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
  return el
}

const removeOffendingStyle = (rule: StyleRule) => {
  console.log("IW2BF removeOffendingStyle : ", rule)
  const [element] = selectElement(rule);
  console.log("IW2BF removeOffendingStyle : ", element)
  if (!element) return
  const style = element.hasAttribute("style")
    ? element.getAttribute("style")
    : false
  console.log("IW2BF removeOffendingStyle : ", style)
  if (!style) return
  const newStyle = style.replace(rule.offendingStyle, "")
  return element.setAttribute("style", newStyle)
}

const removeOffendingClass = (rule: ClassRule) => {
  console.log("IW2BF removeOffendingClass : ", rule)
  let el = selectElement(rule) ?? false
  if (!el || !el.classList) return
  console.log("IW2BF removeOffendingClass : ", el)
  el.classList.remove(rule.offendingClass)
}
const newLog = (timeString) => {
  if(config.collapseConsole) return console.groupCollapsed(timeString)
  console.group(timeString)
}

const runRuleSetByName = (name: string) => {
  let timeString = setTimeString()
  newLog(timeString)
  console.log("IW2BF runRuleSetByName : ", name)
  const [ruleSet] = ruleSets.filter((a) => a.name === name) ?? []
  if (!ruleSet.rules)
    throw new Error(`IW2BF runRuleSetByName : ${name} not found`)
  console.log("IW2BF runRuleSetByName : ", ruleSet)
  ruleSet.rules.forEach((rule) => {
    switch (rule.type) {
      case "tag":
        removeOffendingTag(rule)
        break
      case "styleTag":
        removeOffendingStyle(rule)
        break
      case "cssClass":
        removeOffendingClass(rule)
        break
      default:
        console.log("IW2BF runRuleSetByName : default")
        throw new Error(`IW2BF runRuleSetByName : ${rule.type} not found`)
    }
  })
  console.groupEnd()
  
}

const setTimeString = () => {
  let timeString = `IW2BF-${new Date().getTime()}`
  return timeString
}

class App {

  init() {
    const currentHost: string = location.hostname ?? "localhost"
    console.log(`IW2BF : ${currentHost}}`)

    for (const site in siteWatch) {
      const test = currentHost.match(siteWatch[site].urlRegexp)
      if (!test) continue
      console.log("IW2BF has matched with : ", siteWatch[site].urlRegexp)
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
    console.log("IW2BF launching App")

    document.addEventListener("readystatechange", (event) => {
      console.log("IW2BF watching page state :", event)
      let run = false;
      if (document.readyState === "complete") run = true
      if (!run) return
      this.init()
    })
  }
}

const app = new App()
try {
  app.launchOnReadyStateComplete()
} catch(e) {
  console.error("IW2BF Error : ", e)
}

export default app
