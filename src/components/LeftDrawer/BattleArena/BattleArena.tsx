import { Box, Stack, Typography, useTheme } from "@mui/material"
import { useMemo } from "react"
import { SvgLobbies } from "../../../assets"
import { useAuth, useGame, useSupremacy, useUI } from "../../../containers"
import { HeaderProps } from "../../../routes"
import { colors, fonts } from "../../../theme/theme"
import { NiceButton } from "../../Common/Nice/NiceButton"
import { NiceTooltip } from "../../Common/Nice/NiceTooltip"
import { ArenaSelector } from "./ArenaSelector/ArenaSelector"
import { UnauthPrompt } from "./Common/UnauthPrompt"
import { PlayerAbilities } from "./PlayerAbilities/PlayerAbilities"
import { QuickPlayerAbilities } from "./QuickPlayerAbilities/QuickPlayerAbilities"
import { SupporterAbilities } from "./SupporterAbilities/SupporterAbilities"

export const BattleArena = () => {
    const { isAIDrivenMatch } = useGame()
    const { setSmallDisplayRef } = useUI()
    const { battleIdentifier } = useSupremacy()
    const { userID } = useAuth()

    const content = useMemo(() => {
        return (
            <>
                <ArenaSelector />

                {/* The minimap or the stream will mount here */}
                <Box ref={setSmallDisplayRef} sx={{ flexShrink: 0, mt: ".5rem" }} />

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
                    }}
                >
                    <Stack>
                        {!userID && <UnauthPrompt />}
                        <SupporterAbilities />
                        <PlayerAbilities />
                        <QuickPlayerAbilities />
                    </Stack>
                </Box>
            </>
        )
    }, [setSmallDisplayRef, userID])

    return useMemo(() => {
        return (
            <Stack sx={{ position: "relative", height: "100%" }}>
                {content}

                {battleIdentifier && (
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{
                            p: ".4rem 1rem",
                            backgroundColor: isAIDrivenMatch ? colors.green : colors.red,
                        }}
                    >
                        <Typography sx={{ fontFamily: fonts.nostromoBlack }}>BATTLE ID #{battleIdentifier.toString().padStart(4, "0")}</Typography>
                        <Typography sx={{ fontFamily: fonts.nostromoBlack }}>{isAIDrivenMatch ? "AI MATCH" : "PvP"}</Typography>
                    </Stack>
                )}
            </Stack>
        )
    }, [battleIdentifier, content, isAIDrivenMatch])
}

const Header = ({ isOpen, onClose }: HeaderProps) => {
    const theme = useTheme()

    return (
        <Stack
            spacing="1rem"
            direction="row"
            sx={{
                width: "100%",
                p: "1rem",
                alignItems: "center",
                backgroundColor: isOpen ? `#1B0313` : `#1c1424`,
                transition: "background-color .2s ease-out",
            }}
        >
            <NiceTooltip text="My Lobbies" placement="left">
                <NiceButton
                    onClick={onClose}
                    buttonColor={theme.factionTheme.primary}
                    corners
                    sx={{
                        p: ".8rem",
                        pb: ".6rem",
                    }}
                >
                    <SvgLobbies size="3rem" />
                </NiceButton>
            </NiceTooltip>
            <Typography
                sx={{
                    fontFamily: fonts.nostromoBlack,
                    fontSize: "1.8rem",
                }}
            >
                Battle Commands
            </Typography>
        </Stack>
    )
}
BattleArena.Header = Header
