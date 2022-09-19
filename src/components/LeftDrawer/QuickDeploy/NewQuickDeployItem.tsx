// new quick deploy item
import { MechBasicWithQueueStatus } from "../../../types"
import React, { useMemo } from "react"
import { getRarityDeets } from "../../../helpers"
import { Box, Stack, Typography } from "@mui/material"
import { MechThumbnail } from "../../Hangar/WarMachinesHangar/Common/MechThumbnail"
import { fonts } from "../../../theme/theme"
import { MechName } from "../../Hangar/WarMachinesHangar/WarMachineDetails/MechName"
import { MechRepairBlocks } from "../../Hangar/WarMachinesHangar/Common/MechRepairBlocks"
import { QuickDeployMechStatus } from "./QuickDeployMechStatus"

interface QuickDeployItemProps {
    mech: MechBasicWithQueueStatus
    isSelected?: boolean
    toggleIsSelected?: () => void
}

const propsAreMechEqual = (prevProps: QuickDeployItemProps, nextProps: QuickDeployItemProps) => {
    return (
        prevProps.isSelected === nextProps.isSelected &&
        prevProps.mech.id === nextProps.mech.id &&
        prevProps.mech.status === prevProps.mech.status &&
        prevProps.mech.name === prevProps.mech.name &&
        prevProps.mech.label === prevProps.mech.label
    )
}

export const NewQuickDeployItem = React.memo(function QuickDeployItem({ isSelected, toggleIsSelected, mech }: QuickDeployItemProps) {
    const rarityDeets = useMemo(() => getRarityDeets(mech.tier || ""), [mech])

    return (
        <Stack
            direction="row"
            spacing="1.2rem"
            alignItems="center"
            onClick={() => toggleIsSelected && toggleIsSelected()}
            sx={{
                position: "relative",
                py: ".8rem",
                pl: ".5rem",
                pr: ".7rem",
                backgroundColor: isSelected ? "#FFFFFF20" : "unset",
                borderRadius: 0.8,
                cursor: "pointer",
            }}
        >
            {/* Mech image and deploy button */}
            <Stack sx={{ height: "8rem" }}>
                <MechThumbnail mech={mech} smallSize />
            </Stack>

            {/* Right side */}
            <Stack spacing="1.2rem" direction="row" alignItems="flex-start" sx={{ py: ".2rem", flex: 1 }}>
                <Stack sx={{ flex: 1 }}>
                    <Stack spacing="1.2rem" direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ py: ".2rem", flex: 1 }}>
                        <Box>
                            <Typography
                                variant="caption"
                                sx={{
                                    fontFamily: fonts.nostromoHeavy,
                                    color: rarityDeets.color,
                                }}
                            >
                                {rarityDeets.label}
                            </Typography>

                            <MechName allowEdit mech={mech} />
                        </Box>

                        <QuickDeployMechStatus mech={mech} />
                    </Stack>

                    <Typography
                        variant="body2"
                        sx={{
                            fontFamily: fonts.nostromoBlack,
                            fontWeight: "fontWeightBold",
                            display: "-webkit-box",
                            overflow: "hidden",
                            overflowWrap: "anywhere",
                            textOverflow: "ellipsis",
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: "vertical",
                        }}
                    >
                        {mech.label}
                    </Typography>

                    <MechRepairBlocks mechID={mech.id} defaultBlocks={mech.repair_blocks} />
                </Stack>
            </Stack>
        </Stack>
    )
}, propsAreMechEqual)
