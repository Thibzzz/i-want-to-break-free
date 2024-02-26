import type {
  AriaRule,
  AriaTagRule,
  ClassRule,
  ContentRule,
  Rule,
  StyleRule,
  TagRule,
  NestedContentRule
} from "./../../domain"
import { Log, LogError } from "./../utils/logger"

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
  const safetyBump = 15
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
    while (parent && iteration <= safetyBump) {
      iteration++
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

/**
 * USECASE : you target a span with a bunch of text describing the annoyance (like "Post sponsorisé") and you want to remove the parent div containing this span by its classname.
 * @param rule Grab a bunch of elements by their tagname and filter their content's innerHTML, then iterate through their parents until you find the offending selector or iteration stops with a circuit breaker to avoid infinite loop. If you find the offending selector on a parent, remove this parent element from DOM.
 */
const removeElementsByNestedContent = (rule: NestedContentRule) => {
  const safetyBump = 15
  Log("IW2BF removeElementsByNestedContent : ", rule)
  const elements = document.getElementsByTagName(rule.tagName) ?? false
  Log("IW2BF removeElementsByNestedContent : ", elements)
  if (!elements) return
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i]
    Log("IW2BF removeElementsByNestedContent : ", element)
    const text = element.innerHTML ?? ""
    if (!text.includes(rule.content)) continue
    let parent = element.parentElement
    if (!parent) continue
    let iteration = 0
    while (parent && iteration <= safetyBump) {
      iteration++
      const classString = parent.getAttribute("class") ?? ""
      if (classString.includes(rule.offenderSelector)) {
        Log("IW2BF removeElementsByNestedContent : ", parent)
        return parent.remove()
      }
      parent = parent.parentElement
    }
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

const actionsMap = {
  tag: removeOffendingTag,
  styleTag: removeOffendingStyle,
  cssClass: removeOffendingClass,
  content: removeOffendingTagByContent,
  ariaLabel: removeOffendingTagByAriaLabel,
  tagLabel: removeOffendingTagsByAriaLabel,
  nestedContent: removeElementsByNestedContent
}

export default actionsMap