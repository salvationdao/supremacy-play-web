import React from "react"
import { useHistory } from "react-router-dom"
import { useGlobalNotifications } from "../../containers"
import { useGameServerSubscriptionSecuredUser } from "../../hooks/useGameServer"
import { GameServerKeys } from "../../keys"

type BrowserNotification =
    | {
          title: "MECH_IN_BATTLE"
          data: {
              arena_id: string
              arena_name: string
              mech_alerts: {
                  id: string
                  name: string
              }[]
          }[]
      }
    | {
          title: "TEXT"
          data: {
              message: string
          }
      }

export const GlobalBrowserNotifications = React.memo(function GlobalBrowserNotifications() {
    const { sendBrowserNotification } = useGlobalNotifications()
    const history = useHistory()

    useGameServerSubscriptionSecuredUser<BrowserNotification>(
        {
            URI: "/browser_alert",
            key: GameServerKeys.SubBrowserNotifications,
        },
        (payload) => {
            if (!payload) return

            if (payload.title === "MECH_IN_BATTLE") {
                payload.data.forEach((d) => {
                    sendBrowserNotification.current({
                        title: "Your mechs are in battle!",
                        text: `Your deployed ${d.mech_alerts.length}x mech has entered battle in arena ${d.arena_name}.`,
                        onClick: () => history.push(`/?arenaName=${d.arena_name}`),
                    })
                })
            }
        },
    )

    return null
})
