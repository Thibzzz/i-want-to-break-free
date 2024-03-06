import { useStorage } from "@plasmohq/storage/hook"
import { config } from "../config"
import "~style.css"

function IndexPopup() {
  const refreshRateSafetyBump = 350
  const [displayRules, setDisplayRules] = useStorage("rules", config.siteWatch)
  const updateRule = (index, key, newValue) => {
    const newRules = displayRules.map((site, i) => {
      if (i === index) {
        return {
          ...site,
          [key]: newValue
        }
      }
      return site
    })
    setDisplayRules(newRules)
  }

  // TODO : add proper design for popup, manager refresh rate from storage api and build a getter/setter for this rate that can restart the content script
  return (
    <div className="w-full h-full relative min-w-[600px]">
      <div className="m-4 bg-white p-4 rounded-lg shadow-lg">
        <h1 className="text-xl">IW2BF : rule engine </h1>
        <div className="overflow-x-auto">
          <table className="table table-xs">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Url</th>
                <th>Regexp</th>
                <th>Interval</th>
              </tr>
            </thead>
            {displayRules.map((site, index) => {
              // TODO : prevent focus locus on input when clicking on the table or using keyboard
              return (
                <tbody key={index}>
                  <tr>
                    <td>{site.name}</td>
                    <td>{site.url}</td>
                    <td>{site.urlRegexp}</td>
                    <td>
                      <input
                        type="number"
                        value={site.interval}
                        onChange={(e) =>
                          updateRule(index, "interval", e.target.value)
                        }
                      />
                    </td>
                  </tr>
                </tbody>
              )
            })}
          </table>
        </div>
      </div>
    </div>
  )
}

export default IndexPopup
