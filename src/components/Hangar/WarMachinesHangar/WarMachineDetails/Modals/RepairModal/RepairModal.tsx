import { Box, IconButton, Modal, Stack, Typography } from "@mui/material"
import { useCallback } from "react"
import { ClipThing } from "../../../../.."
import { SvgClose } from "../../../../../../assets"
import { useTheme } from "../../../../../../containers/theme"
import { useGameServerSubscription } from "../../../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../../../keys"
import { colors, fonts, siteZIndex } from "../../../../../../theme/theme"
import { MechDetails } from "../../../../../../types"
import { RepairOffer, RepairStatus } from "../../../../../../types/jobs"
import { MechRepairBlocks } from "../../../Common/MechRepairBlocks"
import { ExistingRepairJobCard } from "./ExistingRepairJobCard"
import { HireContractorsCard } from "./HireContractorsCard"
import { SelfRepairCard } from "./SelfRepairCard"

export const RepairModal = ({
    selectedMechDetails,
    repairMechModalOpen,
    setRepairMechModalOpen,
}: {
    selectedMechDetails: MechDetails
    repairMechModalOpen: boolean
    setRepairMechModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const theme = useTheme()

    const repairStatus = useGameServerSubscription<RepairStatus>({
        URI: `/public/mech/${selectedMechDetails.id}/repair_case`,
        key: GameServerKeys.SubMechRepairStatus,
    })

    const repairJob = useGameServerSubscription<RepairOffer>({
        URI: `/public/mech/${selectedMechDetails.id}/active_repair_offer`,
        key: GameServerKeys.GetMechRepairJob,
    })

    const remainDamagedBlocks = repairStatus ? repairStatus.blocks_required_repair - repairStatus.blocks_repaired : 0

    const onClose = useCallback(() => {
        setRepairMechModalOpen(false)
    }, [setRepairMechModalOpen])

    if (!selectedMechDetails) return null

    return (
        <Modal open={repairMechModalOpen} onClose={onClose} sx={{ zIndex: siteZIndex.Modal }}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "50rem",
                    boxShadow: 6,
                    outline: "none",
                }}
            >
                <ClipThing
                    clipSize="8px"
                    border={{
                        borderColor: theme.factionTheme.primary,
                        borderThickness: ".3rem",
                    }}
                    corners={{
                        topLeft: true,
                        topRight: true,
                        bottomLeft: true,
                        bottomRight: true,
                    }}
                    sx={{ position: "relative" }}
                    backgroundColor={theme.factionTheme.background}
                >
                    <Stack
                        spacing="1.6rem"
                        sx={{
                            position: "relative",
                            px: "2.5rem",
                            py: "2.4rem",
                            maxHeight: "calc(100vh - 5rem)",
                            overflow: "hidden",
                        }}
                    >
                        <Stack>
                            <Typography variant="h5" sx={{ color: theme.factionTheme.primary, fontFamily: fonts.nostromoHeavy }}>
                                DAMAGED MECH
                            </Typography>

                            <Typography sx={{ mb: ".2rem", color: colors.red, fontFamily: fonts.nostromoBlack }}>
                                {remainDamagedBlocks} x DAMAGED BLOCKS
                            </Typography>

                            <MechRepairBlocks mechID={selectedMechDetails?.id} defaultBlocks={selectedMechDetails?.model.repair_blocks} hideNumber />
                        </Stack>

                        <SelfRepairCard />

                        {repairJob && !repairJob.closed_at ? (
                            <ExistingRepairJobCard repairJob={repairJob} />
                        ) : (
                            <HireContractorsCard mechDetails={selectedMechDetails} remainDamagedBlocks={remainDamagedBlocks} />
                        )}
                    </Stack>

                    <IconButton size="small" onClick={onClose} sx={{ position: "absolute", top: ".5rem", right: ".5rem" }}>
                        <SvgClose size="2.6rem" sx={{ opacity: 0.1, ":hover": { opacity: 0.6 } }} />
                    </IconButton>
                </ClipThing>
            </Box>
        </Modal>
    )
}
