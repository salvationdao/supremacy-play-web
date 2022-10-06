import { colors, fonts } from "../../../theme/theme"
import { Box, Stack, Typography } from "@mui/material"
import { EmptyWarMachinesPNG } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { getRarityDeets } from "../../../helpers"
import { LobbyMech } from "../../../types"
import { MechThumbnail } from "../../Hangar/WarMachinesHangar/Common/MechThumbnail"
import React from "react"
import { MechBarStats } from "../../Hangar/WarMachinesHangar/Common/MechBarStats"
import { WeaponSlot } from "./weaponSlot"
import { MechRepairBlocks } from "../../Hangar/WarMachinesHangar/Common/MechRepairBlocks"

interface MechSlotProps {
    lobbyMech: LobbyMech | null
}

export const MechSlot = ({ lobbyMech }: MechSlotProps) => {
    const { factionTheme } = useTheme()

    if (!lobbyMech) {
        return (
            <Stack
                direction="column"
                alignItems="center"
                justifyContent="center"
                sx={{
                    flex: 1,
                    padding: "1rem",
                    borderRadius: 0,
                    backgroundColor: `${colors.offWhite}20`,
                }}
            >
                <Box
                    sx={{
                        width: "80%",
                        height: "16rem",
                        opacity: 0.7,
                        filter: "grayscale(100%)",
                        background: `url(${EmptyWarMachinesPNG})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "bottom center",
                        backgroundSize: "contain",
                    }}
                />
                <Typography
                    display="block"
                    sx={{
                        mt: "1rem",
                        color: `${colors.offWhite}30`,
                    }}
                >
                    DEPLOYED MECH
                </Typography>
            </Stack>
        )
    }

    const rarity = getRarityDeets(lobbyMech.tier)
    return (
        <Stack
            direction="column"
            flex={1}
            spacing={0.6}
            sx={{
                padding: "1rem",
                alignItems: "start",
                textAlign: "initial",
                borderRadius: 0,
                backgroundColor: `${colors.offWhite}20`,
            }}
        >
            <Stack direction="row" spacing="1rem" mb=".5rem">
                <Box
                    sx={{
                        position: "relative",
                        height: "70px",
                        width: "70px",
                    }}
                >
                    <Stack sx={{ height: "100%", mt: ".2rem", ml: ".5rem" }}>
                        <MechThumbnail mech={lobbyMech} smallSize omitClip />
                    </Stack>
                    <Box
                        sx={{
                            position: "absolute",
                            left: "50%",
                            bottom: 0,
                            width: "100%",
                            transform: "translate(-50%, 0)",
                            backgroundColor: `${factionTheme.background}dd`,
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: "1.2rem",
                                fontFamily: fonts.nostromoMedium,
                                textTransform: "uppercase",
                                textAlign: "center",
                                color: rarity.color,
                            }}
                        >
                            {rarity.label}
                        </Typography>
                    </Box>
                </Box>
                <Stack flex={1} spacing={0.6}>
                    <Typography
                        variant="h6"
                        sx={{
                            display: "-webkit-box",
                            overflow: "hidden",
                            overflowWrap: "anywhere",
                            textOverflow: "ellipsis",
                            WebkitLineClamp: 1, // change to max number of lines
                            WebkitBoxOrient: "vertical",
                            textTransform: "uppercase",
                            fontWeight: "fontWeightBold",
                            color: `#ffffff`,
                            letterSpacing: 1.1,
                        }}
                    >
                        {lobbyMech.name || lobbyMech.label}
                    </Typography>

                    <MechRepairBlocks mechID={lobbyMech.id} defaultBlocks={lobbyMech.repair_blocks} />

                    <Stack direction="row" spacing={1}>
                        {lobbyMech.weapon_slots &&
                            lobbyMech.weapon_slots.map((ws) => <WeaponSlot key={ws.slot_number} weaponSlot={ws} tooltipPlacement="top-end" />)}
                    </Stack>
                </Stack>
            </Stack>
            <MechBarStats
                mech={lobbyMech}
                color={factionTheme.primary}
                fontSize="1.3rem"
                width="100%"
                spacing=".45rem"
                barHeight=".8rem"
                compact
                outerSx={{ flex: 1, width: "100%" }}
            />
        </Stack>
    )
}
