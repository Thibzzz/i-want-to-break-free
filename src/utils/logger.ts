import { config } from "../config"

const newLog = (timeString: string) => {
  if (config.silenceConsole) return
  if (config.collapseConsole) return console.groupCollapsed(timeString)
  return console.group(timeString)
}

const Log = (...args: any[]) => {
  if (config.silenceConsole) return
  console.log(...args)
}
const LogError = (...args: any[]) => {
  if (config.silenceConsole) return
  console.error(...args)
}

export { Log, LogError, newLog }