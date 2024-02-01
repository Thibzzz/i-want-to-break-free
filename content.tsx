import { config } from "./config"
import type { ClassRule, ContentRule, Rule, StyleRule, TagRule, AriaRule, AriaTagRule } from "./domain"

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

const removeOffendingTagByAriaLabel = (rule: AriaRule) => {
  Log("IW2BF removeOffendingTagByAriaLabel : ", rule)
  const selector = `[aria-label="${rule.offenderSelector}"]`
  const elements = document.querySelectorAll(selector) ?? false
  Log("IW2BF removeOffendingTagByAriaLabel : ", elements)
  if (!elements) return
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i]
    Log("IW2BF removeOffendingTagByAriaLabel : ", element)
    return element.remove()
  }
}

/**
 * 
 * @param rule Grab html node elements that contain aria-label then move up their parent elements recursively until you find the offending selector in their class string, if it's the case, remove this parent element and continue.
 * @returns 
 */
const removeOffendingTagsByAriaLabel = (rule: AriaTagRule) => {
  const safetyBump = 15;
  Log("IW2BF removeOffendingTagsByAriaLabel : ", rule)
  const selector = `[aria-label="${rule.ariaLabel}"]`
  const elements = document.querySelectorAll(selector) ?? false
  Log("IW2BF removeOffendingTagsByAriaLabel : ", elements)
  if (!elements) return
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i]
    Log("IW2BF removeOffendingTagsByAriaLabel : ", element)
    let parent = element.parentElement
    if (!parent) continue
    let iteration = 0
    while (parent || iteration <= safetyBump) {
      iteration++;
      const classString = parent.getAttribute("class") ?? ""
      if (classString.includes(rule.offenderSelector)) {
        Log("IW2BF removeOffendingTagsByAriaLabel : ", parent)
        return parent.remove()
      }
      parent = parent.parentElement
    }
  }
  
}

const removeOffendingTagByContent = (rule: ContentRule) => {
  Log("IW2BF removeOffendingTagByContent : ", rule)
  const elements = document.querySelectorAll(rule.offenderSelector) ?? false
  Log("IW2BF removeOffendingTagByContent : ", elements)
  if (!elements) return
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i]
    Log("IW2BF removeOffendingTagByContent : ", element)
    const text = element.textContent ?? ""
    if (!text.includes(rule.content)) continue
    return element.remove()
  }
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
  let el
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
  if (config.collapseConsole) return console.groupCollapsed(timeString)
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
  const actionsMap = {
    tag: removeOffendingTag,
    styleTag: removeOffendingStyle,
    cssClass: removeOffendingClass,
    content: removeOffendingTagByContent,
    ariaLabel: removeOffendingTagByAriaLabel,
    tagLabel: removeOffendingTagsByAriaLabel
  }
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
