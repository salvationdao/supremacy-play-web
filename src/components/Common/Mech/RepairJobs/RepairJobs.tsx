import { Stack, Typography } from "@mui/material"
import { useCallback } from "react"
import { useTheme } from "../../../../containers/theme"
import { useGameServerSubscriptionSecured } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { colors, fonts } from "../../../../theme/theme"
import { LobbyMech } from "../../../../types"
import { RepairOffer, RepairStatus } from "../../../../types/jobs"
import { MechRepairBlocks } from "../MechRepairBlocks"
import { NiceModal } from "../../Nice/NiceModal"
import { ExistingRepairJobCard } from "./ExistingRepairJobCard"
import { HireContractorsCard } from "./HireContractorsCard"
import { SelfRepairCard } from "./SelfRepairCard"

export const RepairModal = ({
    defaultOpenSelfRepair,
    mech,
    repairMechModalOpen,
    setRepairMechModalOpen,
}: {
    defaultOpenSelfRepair?: boolean // Immediately opens the self repair game modal
    mech: LobbyMech
    repairMechModalOpen: boolean
    setRepairMechModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const theme = useTheme()

    const repairStatus = useGameServerSubscriptionSecured<RepairStatus>({
        URI: `/mech/${mech.id}/repair_case`,
        key: GameServerKeys.SubMechRepairStatus,
        ready: !!mech.id,
    })

    const repairOffer = useGameServerSubscriptionSecured<RepairOffer>({
        URI: `/mech/${mech.id}/active_repair_offer`,
        key: GameServerKeys.GetMechRepairJob,
    })

    const remainDamagedBlocks = repairStatus ? repairStatus.blocks_required_repair - repairStatus.blocks_repaired : 0

    const onClose = useCallback(() => {
        setRepairMechModalOpen(false)
    }, [setRepairMechModalOpen])

    if (!mech) return null

    return (
        <NiceModal
            open={repairMechModalOpen}
            onClose={onClose}
            onBackdropClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
            }}
            sx={{ width: "75rem" }}
        >
            <Stack
                spacing="1.6rem"
                sx={{
                    p: "1.8rem 2.5rem",
                    maxHeight: "calc(100vh - 5rem)",
                    overflow: "hidden",
                }}
            >
                <Stack>
                    <Typography variant="h5" sx={{ color: theme.factionTheme.primary, fontFamily: fonts.nostromoHeavy }}>
                        DAMAGED MECH
                    </Typography>

                    <Typography sx={{ mb: ".2rem", color: colors.red, fontFamily: fonts.nostromoBlack }}>{remainDamagedBlocks} x DAMAGED BLOCKS</Typography>

                    <MechRepairBlocks mechID={mech?.id} defaultBlocks={mech?.repair_blocks} />
                </Stack>

                <SelfRepairCard defaultOpenSelfRepair={defaultOpenSelfRepair} repairStatus={repairStatus} remainDamagedBlocks={remainDamagedBlocks} />

                {repairOffer && !repairOffer.closed_at ? (
                    <ExistingRepairJobCard repairOffer={repairOffer} remainDamagedBlocks={remainDamagedBlocks} />
                ) : (
                    <HireContractorsCard mechs={[mech]} remainDamagedBlocks={remainDamagedBlocks} />
                )}
            </Stack>
        </NiceModal>
    )
}
