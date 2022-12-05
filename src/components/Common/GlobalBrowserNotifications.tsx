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
          }
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

    useGameServerSubscriptionSecuredUser<BrowserNotification[]>(
        {
            URI: "/browser_alert",
            key: GameServerKeys.SubBrowserNotifications,
        },
        (payload) => {
            if (!payload || payload.length <= 0) return

            payload.forEach((n) => {
                if (n.title === "MECH_IN_BATTLE") {
                    sendBrowserNotification.current({
                        title: "Your mechs are in battle!",
                        text: `Your deployed ${n.data.mech_alerts.length}x mech has entered battle in arena ${n.data.arena_name}.`,
                        onClick: () => history.push(`/?arenaName=${n.data.arena_name}`),
                    })
                }
            })
        },
    )

    return null
})
