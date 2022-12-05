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

    useGameServerSubscriptionSecuredUser<BrowserNotification>(
        {
            URI: "/browser_alert",
            key: GameServerKeys.SubBrowserNotifications,
        },
        (payload) => {
            if (!payload) return

            if (payload.title === "MECH_IN_BATTLE") {
                sendBrowserNotification.current({
                    title: "Your mechs are in battle!",
                    text: `You have ${payload.data.mech_alerts.length} in battle arena ${payload.data.arena_name}.`,
                    onClick: () => history.push(`/?arenaName=${payload.data.arena_name}`),
                })
            }
        },
    )

    return null
})
