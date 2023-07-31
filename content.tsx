import { cp } from "fs"
import config from "./config"
import type { Rule, StyleRule, TagRule } from "./domain"

const { ruleSets, siteWatch } = config

console.log("IW2BF Boot content script : ", config)

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

const runRuleSetByName = (name: string) => {
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
      default:
        console.log("IW2BF runRuleSetByName : default")
        throw new Error(`IW2BF runRuleSetByName : ${rule.type} not found`)
    }
  })
}

function App() {
  
  document.addEventListener("readystatechange", (event) => {
    let run = false;
    if (document.readyState === "complete") run = true
    if (!run) return
    const timeString = `IW2BF-${new Date().getTime()}`
    console.group(timeString)
    const currentHost: string = location.hostname ?? "localhost"
    console.log(`IW2BF : ${currentHost}}`)

    for (const site in siteWatch) {
      const test = currentHost.match(siteWatch[site].urlRegexp)
      if (!test) continue
      console.log("IW2BF has matched with : ", siteWatch[site].urlRegexp)
      const watchInterval = siteWatch[site].interval ?? config.defaultInterval
      runRuleSetByName(siteWatch[site].name)
      setInterval(() => {
        runRuleSetByName(siteWatch[site].name)
      }
      , watchInterval)
    }
    console.groupEnd()
    if (config.collapseConsole) {
      console.groupCollapsed(timeString)
    }    
  })
}

export default App
