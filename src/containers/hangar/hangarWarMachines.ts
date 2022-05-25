import BigNumber from "bignumber.js"
import { useCallback, useEffect, useState } from "react"
import { createContainer } from "unstated-next"
import { useAuth, useSnackbar } from ".."
import { supFormatter } from "../../helpers"
import { useGameServerCommandsFaction, useGameServerCommandsUser, useGameServerSubscriptionFaction } from "../../hooks/useGameServer"
import { usePassportCommandsUser } from "../../hooks/usePassport"
import { GameServerKeys } from "../../keys"
import { MechDetails } from "../../types"

export interface QueueFeed {
    queue_length: number
    queue_cost: string
    contract_reward: string
}

export const HangarWarMachineContainer = createContainer(() => {
    const { newSnackbarMessage } = useSnackbar()
    const { userID, user } = useAuth()
    const { send: sendFactionCommander } = useGameServerCommandsFaction("/faction_commander")
    const { send: sendUserCommander } = useGameServerCommandsUser("/user_commander")
    const { send: sendPassportUser } = usePassportCommandsUser("xxxxxxxxx")

    // Queuing cost, queue length win reward etc.
    const queueFeed = useGameServerSubscriptionFaction<QueueFeed>({
        URI: "/queue",
        key: GameServerKeys.SubQueueFeed,
    })
    const [actualQueueCost, setActualQueueCost] = useState(supFormatter(queueFeed?.queue_cost || "0", 2))

    // Deploying to queue
    const [deployMechDetails, setDeployMechDetails] = useState<MechDetails>()
    const [deployQueueError, setDeployQueueError] = useState<string>()

    // Leaving from queue
    const [leaveMechDetails, setLeaveMechDetails] = useState<MechDetails>()
    const [leaveQueueError, setLeaveQueueError] = useState<string>()

    // Right side mech viewer
    const [selectedMechDetails, setSelectedMechDetails] = useState<MechDetails>()

    // Mech history
    const [historyMechDetails, setHistoryMechDetails] = useState<MechDetails>()

    // Mech rental
    const [rentalMechDetails, setRentalMechDetails] = useState<MechDetails>()

    // If notification is turned on, add 10% to the queue cost
    useEffect(() => {
        const qc = new BigNumber(queueFeed?.queue_cost || "0").shiftedBy(-18)
        setActualQueueCost(qc.toFixed(3))
    }, [queueFeed?.queue_cost])

    const onDeployQueue = useCallback(
        async ({ hash }: { hash: string }) => {
            if (!userID) return

            try {
                // Deploy the mech into queue, with the notification settings
                const resp = await sendFactionCommander<{ success: boolean; code: string }>(GameServerKeys.JoinQueue, {
                    asset_hash: hash,
                })

                if (resp && resp.success) {
                    newSnackbarMessage("Successfully deployed war machine.", "success")
                    setDeployMechDetails(undefined)
                    setDeployQueueError("")
                }
            } catch (e) {
                setDeployQueueError(typeof e === "string" ? e : "Failed to deploy war machine.")
                console.error(e)
                return
            }
        },
        [newSnackbarMessage, sendFactionCommander, sendPassportUser, sendUserCommander, user.id, user.mobile_number, userID],
    )

    const onLeaveQueue = useCallback(
        async (hash: string) => {
            try {
                const resp = await sendFactionCommander(GameServerKeys.LeaveQueue, { asset_hash: hash })
                if (resp) {
                    newSnackbarMessage("Successfully removed war machine from queue.", "success")
                    setLeaveMechDetails(undefined)
                    setLeaveQueueError("")
                }
            } catch (e) {
                setLeaveQueueError(typeof e === "string" ? e : "Failed to leave queue.")
                console.error(e)
            }
        },
        [newSnackbarMessage, sendFactionCommander],
    )

    return {
        queueFeed,
        actualQueueCost,

        // Mech viewer
        selectedMechDetails,
        setSelectedMechDetails,

        // Deploying to queue
        onDeployQueue,
        deployMechDetails,
        setDeployMechDetails,
        deployQueueError,
        setDeployQueueError,

        // Leaving from queue
        onLeaveQueue,
        leaveMechDetails,
        setLeaveMechDetails,
        leaveQueueError,
        setLeaveQueueError,

        // Mech history
        historyMechDetails,
        setHistoryMechDetails,

        // Mech rental
        rentalMechDetails,
        setRentalMechDetails,
    }
})

export const HangarWarMachineProvider = HangarWarMachineContainer.Provider
export const useHangarWarMachine = HangarWarMachineContainer.useContainer
