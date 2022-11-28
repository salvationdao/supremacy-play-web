import { Fade, Stack } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { UseFormReturn } from "react-hook-form"
import { useGameServerSubscriptionSecuredUser } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { NewMechStruct } from "../../../types"
import { PlayerQueueStatus } from "../../../types/battle_queue"
import { MechSelector } from "../../Common/Mech/MechSelector"
import { CreateLobbyFormFields } from "./CreateLobbyFormModal"

export const DeployMechs = ({ formMethods }: { formMethods: UseFormReturn<CreateLobbyFormFields, unknown> }) => {
    const [selectedMechs, setSelectedMechs] = useState<NewMechStruct[]>(formMethods.getValues("selected_mechs"))
    const maxMechDeploys = formMethods.watch("max_deploy_number")

    const [playerQueueStatus, setPlayerQueueStatus] = useState<PlayerQueueStatus>({
        queue_limit: 10,
        total_queued: 0,
    })

    useGameServerSubscriptionSecuredUser<PlayerQueueStatus>(
        {
            URI: "/queue_status",
            key: GameServerKeys.PlayerQueueStatus,
        },
        (payload) => {
            setPlayerQueueStatus(payload)
        },
    )

    const queueLimit = useMemo(() => {
        // Get player remaining queue limit
        let playerQueueLimit = playerQueueStatus.queue_limit - playerQueueStatus.total_queued
        if (playerQueueLimit <= 0) playerQueueLimit = 0

        // Get player maximum queue limit in lobby
        const lobbyQueueLimit = maxMechDeploys

        return Math.min(playerQueueLimit, lobbyQueueLimit)
    }, [maxMechDeploys, playerQueueStatus.queue_limit, playerQueueStatus.total_queued])

    useEffect(() => {
        formMethods.setValue("selected_mechs", selectedMechs)
    }, [formMethods, selectedMechs])

    return (
        <Fade in>
            <Stack height="100%">
                <MechSelector selectedMechs={selectedMechs} setSelectedMechs={setSelectedMechs} limit={queueLimit} onlyDeployableMechs sx={{ flex: 1 }} />
            </Stack>
        </Fade>
    )
}
