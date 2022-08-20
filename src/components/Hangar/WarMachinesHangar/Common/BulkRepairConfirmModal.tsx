import { Box, IconButton, Modal, Stack, Typography } from "@mui/material"
import { useCallback } from "react"
import { SvgClose } from "../../../../assets"
import { useTheme } from "../../../../containers/theme"
import { colors, fonts, siteZIndex } from "../../../../theme/theme"
import { MechBasic, MechStatus, MechStatusEnum } from "../../../../types"
import { RepairOffer, RepairStatus } from "../../../../types/jobs"
import { ClipThing } from "../../../Common/ClipThing"
import { HireContractorsCard } from "../WarMachineDetails/Modals/RepairModal/HireContractorsCard"
import { RepairBlocks } from "./MechRepairBlocks"

export const BulkRepairConfirmModal = ({
    setBulkRepairConfirmModalOpen,
    selectedMechs,
    childrenMechStatus,
    childrenRepairStatus,
    childrenRepairOffer,
}: {
    setBulkRepairConfirmModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    selectedMechs: MechBasic[]
    childrenMechStatus: React.MutableRefObject<{
        [mechID: string]: MechStatus
    }>
    childrenRepairStatus: React.MutableRefObject<{
        [mechID: string]: RepairStatus
    }>
    childrenRepairOffer: React.MutableRefObject<{
        [mechID: string]: RepairOffer
    }>
}) => {
    const theme = useTheme()

    const validMechs = selectedMechs.filter((s) => childrenMechStatus.current[s.id]?.status === MechStatusEnum.Damaged && !childrenRepairOffer.current[s.id])

    const remainDamagedBlocks = validMechs.reduce((acc, mech) => {
        const repairStatus = childrenRepairStatus.current[mech.id]
        return (acc += repairStatus ? repairStatus.blocks_required_repair - repairStatus.blocks_repaired : 0)
    }, 0)

    const onClose = useCallback(() => {
        setBulkRepairConfirmModalOpen(false)
    }, [setBulkRepairConfirmModalOpen])

    return (
        <Modal
            open
            onClose={onClose}
            sx={{ zIndex: siteZIndex.Modal }}
            onBackdropClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
            }}
        >
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
                onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
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
                                BULK REPAIR
                            </Typography>

                            <Typography sx={{ mb: ".2rem", color: colors.red, fontFamily: fonts.nostromoBlack }}>
                                {remainDamagedBlocks} x DAMAGED BLOCKS
                            </Typography>

                            <RepairBlocks defaultBlocks={remainDamagedBlocks} remainDamagedBlocks={remainDamagedBlocks} hideNumber />
                        </Stack>

                        <HireContractorsCard mechs={validMechs} remainDamagedBlocks={remainDamagedBlocks} onClose={onClose} />
                    </Stack>

                    <IconButton size="small" onClick={onClose} sx={{ position: "absolute", top: ".5rem", right: ".5rem" }}>
                        <SvgClose size="2.6rem" sx={{ opacity: 0.1, ":hover": { opacity: 0.6 } }} />
                    </IconButton>
                </ClipThing>
            </Box>
        </Modal>
    )
}
