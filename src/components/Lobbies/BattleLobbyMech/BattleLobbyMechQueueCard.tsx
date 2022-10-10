import { LobbyMech } from "../../../types"
import React, { useMemo } from "react"
import { getRarityDeets } from "../../../helpers"
import { Box, Stack, Typography } from "@mui/material"
import { MechThumbnail } from "../../Hangar/WarMachinesHangar/Common/MechThumbnail"
import { fonts } from "../../../theme/theme"
import { MechName } from "../../Hangar/WarMachinesHangar/WarMachineDetails/MechName"
import { MechRepairBlocks } from "../../Hangar/WarMachinesHangar/Common/MechRepairBlocks"
import { MechQueueStatus } from "../MechQueueStatus"
import { MechBarStats } from "../../Hangar/WarMachinesHangar/Common/MechBarStats"
import { useTheme } from "../../../containers/theme"
import { WeaponSlot } from "../Common/weaponSlot"
import { CropMaxLengthText } from "../../../theme/styles"

interface QuickDeployItemProps {
    mech: LobbyMech
    isSelected?: boolean
    toggleIsSelected?: () => void
}

const propsAreMechEqual = (prevProps: QuickDeployItemProps, nextProps: QuickDeployItemProps) => {
    return prevProps.isSelected === nextProps.isSelected && prevProps.mech === nextProps.mech
}

export const BattleLobbyMechQueueCard = React.memo(function QuickDeployItem({ isSelected, toggleIsSelected, mech }: QuickDeployItemProps) {
    const { factionTheme } = useTheme()
    const rarityDeets = useMemo(() => getRarityDeets(mech.tier || ""), [mech])

    return (
        <Stack
            direction="row"
            spacing="1.2rem"
            onClick={() => toggleIsSelected && toggleIsSelected()}
            sx={{
                position: "relative",
                py: ".8rem",
                pl: ".5rem",
                pr: ".7rem",
                backgroundColor: isSelected ? "#FFFFFF20" : "unset",
                borderRadius: 0.6,
                cursor: "pointer",
                border: `${factionTheme.primary}45 2px solid`,
            }}
        >
            <Stack sx={{ height: "8rem", mt: ".2rem", ml: ".5rem" }}>
                <MechThumbnail mech={mech} smallSize />
            </Stack>

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

                        <MechQueueStatus mech={mech} />
                    </Stack>

                    <Typography
                        variant="body2"
                        sx={{
                            fontFamily: fonts.nostromoBlack,
                            fontWeight: "fontWeightBold",
                            ...CropMaxLengthText,
                        }}
                    >
                        {mech.label}
                    </Typography>

                    <MechRepairBlocks mechID={mech.id} defaultBlocks={mech.repair_blocks} />

                    <Stack direction="row" spacing={1} sx={{ pt: "1rem", width: "100%" }}>
                        <Stack direction="column" spacing={1}>
                            {mech.weapon_slots &&
                                mech.weapon_slots.map((ws) => <WeaponSlot key={ws.slot_number} weaponSlot={ws} tooltipPlacement="left-end" />)}
                        </Stack>
                        <MechBarStats
                            mech={mech}
                            color={factionTheme.primary}
                            fontSize="1.3rem"
                            width="100%"
                            spacing=".75rem"
                            barHeight=".8rem"
                            compact
                            outerSx={{ flex: 1 }}
                        />
                    </Stack>
                </Stack>
            </Stack>
        </Stack>
    )
}, propsAreMechEqual)
