import { Box, Stack, Typography, useTheme } from "@mui/material"
import { useMemo } from "react"
import { SvgCommand } from "../../../assets"
import { useAuth, useGame, useSupremacy, useUI } from "../../../containers"
import { HeaderProps } from "../../../routes"
import { colors, fonts } from "../../../theme/theme"
import { NiceButton } from "../../Common/Nice/NiceButton"
import { ArenaSelector } from "./ArenaSelector/ArenaSelector"
import { UnauthPrompt } from "./Common/UnauthPrompt"
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

                <Box sx={{ flex: 1, overflow: "hidden" }}>
                    <Stack sx={{ height: "100%", px: ".6rem", overflowX: "hidden", overflowY: "auto" }}>
                        {/* The minimap or the stream will mount here */}
                        <Box ref={setSmallDisplayRef} sx={{ flexShrink: 0, mt: ".5rem" }} />

                        {!userID && <UnauthPrompt />}
                        <SupporterAbilities />
                        {/* <PlayerAbilities /> */}
                        {/* <QuickPlayerAbilities /> */}
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
                            backgroundColor: isAIDrivenMatch ? colors.orange : colors.red,
                            boxShadow: 5,
                        }}
                    >
                        <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBlack }}>
                            BATTLE ID #{battleIdentifier.toString().padStart(4, "0")}
                        </Typography>

                        <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBlack }}>
                            {isAIDrivenMatch ? "AI MATCH" : "PvP"}
                        </Typography>
                    </Stack>
                )}
            </Stack>
        )
    }, [battleIdentifier, content, isAIDrivenMatch])
}

const Header = ({ isOpen, isDrawerOpen, onClose }: HeaderProps) => {
    const theme = useTheme()

    return (
        <Stack
            spacing="1rem"
            direction={isDrawerOpen ? "row" : "row-reverse"}
            sx={{
                width: "100%",
                p: "1rem",
                alignItems: "center",
                opacity: isOpen ? 1 : 0.7,
                background: isOpen ? `linear-gradient(${theme.factionTheme.s700}70 26%, ${theme.factionTheme.s800})` : theme.factionTheme.u700,
                transition: "background-color .2s ease-out",
            }}
        >
            <NiceButton
                onClick={onClose}
                buttonColor={theme.factionTheme.primary}
                corners
                sx={{
                    p: ".8rem",
                    pb: ".6rem",
                }}
            >
                <SvgCommand size="2.6rem" />
            </NiceButton>

            <Typography sx={{ fontFamily: fonts.nostromoBlack, fontSize: "1.6rem" }}>Battle Commands</Typography>
        </Stack>
    )
}
BattleArena.Header = Header
