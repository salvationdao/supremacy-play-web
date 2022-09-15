import { Typography } from "@mui/material"
import BigNumber from "bignumber.js"
import { useCallback, useState } from "react"
import { useGlobalNotifications } from "../../../../containers"
import { supFormatter } from "../../../../helpers"
import { useGameServerCommandsFaction } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { MechBasic, MechStatus } from "../../../../types"
import { ConfirmModal } from "../../../Common/ConfirmModal"
import { QueueFeed } from "../WarMachineDetails/Modals/DeployModal"

interface BulkDeployConfirmModalProps {
    setBulkDeployConfirmModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    selectedMechs: MechBasic[]
    setSelectedMechs: React.Dispatch<React.SetStateAction<MechBasic[]>>
    childrenMechStatus: React.MutableRefObject<{
        [mechID: string]: MechStatus
    }>
    onBulkDeploy: (amount: number) => void
}

export const BulkDeployConfirmModal = ({
    setBulkDeployConfirmModalOpen,
    selectedMechs,
    setSelectedMechs,
    childrenMechStatus,
    onBulkDeploy,
}: BulkDeployConfirmModalProps) => {
    const { newSnackbarMessage } = useGlobalNotifications()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string>()

    const validMechs = selectedMechs.filter((s) => childrenMechStatus.current[s.id]?.can_deploy)

    const deploySelected = useCallback(async () => {
        if (validMechs.length == 0) return

        try {
            setIsLoading(true)

            const resp = await send<{ success: boolean; code: string }>(GameServerKeys.JoinQueue, {
                mech_ids: validMechs.map((vm) => vm.id),
            })

            if (resp && resp.success) {
                newSnackbarMessage("Successfully deployed war machines.", "success")
                setSelectedMechs([])
                setError(undefined)
                setBulkDeployConfirmModalOpen(false)
                onBulkDeploy(validMechs.length)
            }
        } catch (e) {
            setError(typeof e === "string" ? e : "Failed to deploy war machines.")
            console.error(e)
            return
        } finally {
            setIsLoading(false)
        }
    }, [newSnackbarMessage, onBulkDeploy, send, setBulkDeployConfirmModalOpen, setSelectedMechs, validMechs])

    return (
        <ConfirmModal
            title="CONFIRMATION"
            disableConfirm={validMechs.length <= 0}
            onConfirm={deploySelected}
            onClose={() => setBulkDeployConfirmModalOpen(false)}
            isLoading={isLoading}
            error={error}
        >
            <Typography variant="h6">
                In your selection, <span>{validMechs.length}</span>/{selectedMechs.length} mechs are battle-ready. <br />
                The fee to deploy is <span>{supFormatter(new BigNumber(0 || 250 * Math.pow(10, 18)).multipliedBy(validMechs.length).toString(), 0)}</span> SUPS.
            </Typography>
        </ConfirmModal>
    )
}
