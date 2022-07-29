import { useEffect } from "react"
import { useGameServerCommandsUser } from "../hooks/useGameServer"
import { GameServerKeys } from "../keys"

export const BillingHistoryPage = () => {
    const { send } = useGameServerCommandsUser("/user_commander")

    useEffect(() => {
        ;(async () => {
            try {
                const resp = await send(GameServerKeys.BillingHistoryList, {
                    page: 0,
                    page_size: 10,
                })
                console.log("Hmm", resp)
            } catch (err) {
                console.error(err)
            }
        })()
    }, [send])

    return <div>Test Cakes</div>
}
