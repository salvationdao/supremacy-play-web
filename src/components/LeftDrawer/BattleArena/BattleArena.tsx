import { Box, Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { useSupremacy, useUI } from "../../../containers"
import { colors, fonts } from "../../../theme/theme"
import { BattleAbility } from "./BattleAbility/BattleAbility"
import { PlayerAbilities } from "./PlayerAbilities/PlayerAbilities"
import { QuickPlayerAbilities } from "./QuickPlayerAbilities/QuickPlayerAbilities"
import { ClipThing } from "../../Common/ClipThing"
import { shadeColor } from "../../../helpers"
import { ConnectButton } from "../../Bar/ProfileCard/ConnectButton"

export const BattleArena = () => {
    const { setSmallDisplayRef } = useUI()
    const { battleIdentifier } = useSupremacy()

    const content = useMemo(() => {
        return (
            <>
                {/* The minimap or the stream will mount here */}
                <Box ref={setSmallDisplayRef} sx={{ flexShrink: 0 }} />

                <Box
                    sx={{
                        flex: 1,
                        overflowY: "auto",
                        overflowX: "hidden",
                        my: ".5rem",
                        mr: ".5rem",
                        pr: ".5rem",
                        pl: "1rem",
                        direction: "ltr",
                        scrollbarWidth: "none",
                        "::-webkit-scrollbar": {
                            width: "1rem",
                        },
                        "::-webkit-scrollbar-track": {
                            background: "#FFFFFF15",
                        },
                        "::-webkit-scrollbar-thumb": {
                            background: (theme) => theme.factionTheme.primary,
                        },
                    }}
                >
                    <Box sx={{ direction: "ltr", height: 0 }}>
                        <Stack>
                            <Box sx={{ py: "1rem" }}>
                                <ClipThing
                                    clipSize="6px"
                                    border={{
                                        borderColor: `${colors.darkNeonBlue}`,
                                        borderThickness: ".3rem",
                                    }}
                                    backgroundColor={shadeColor(colors.neonBlue, -75)}
                                    // opacity={0.7}
                                >
                                    <Stack
                                        spacing=".8rem"
                                        alignItems="center"
                                        sx={{
                                            flex: 1,
                                            minWidth: "32.5rem",
                                            p: "1rem",
                                        }}
                                    >
                                        <Typography fontFamily={fonts.nostromoBold} variant="body2" textAlign={"center"}>
                                            log in for full access to the battle arena- claim and use abilities, visit the marketplace and deploy mechs
                                        </Typography>
                                        <ConnectButton />
                                    </Stack>
                                </ClipThing>
                            </Box>
                            <BattleAbility />
                            <PlayerAbilities />
                            <QuickPlayerAbilities />
                        </Stack>
                    </Box>
                </Box>
            </>
        )
    }, [setSmallDisplayRef])

    return useMemo(() => {
        return (
            <Stack sx={{ position: "relative", height: "100%", backgroundColor: (theme) => theme.factionTheme.background }}>
                {content}

                {battleIdentifier && (
                    <Box sx={{ p: ".4rem 1rem", borderTop: (theme) => `${theme.factionTheme.primary}30 1px solid` }}>
                        <Typography sx={{ fontFamily: fonts.nostromoBlack }}>BATTLE ID #{battleIdentifier.toString().padStart(4, "0")}</Typography>
                    </Box>
                )}
            </Stack>
        )
    }, [battleIdentifier, content])
}
