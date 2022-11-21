import { Box, Fade, Stack, Typography, useTheme } from "@mui/material"
import { useMemo } from "react"
import { SvgCommand } from "../../../assets"
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

const Header = ({ isOpen, isDrawerOpen, onClose }: HeaderProps) => {
    const theme = useTheme()

    const button = (
        <NiceButton
            onClick={onClose}
            buttonColor={theme.factionTheme.primary}
            corners
            sx={{
                p: ".8rem",
                pb: ".6rem",
            }}
        >
            <SvgCommand size="3rem" />
        </NiceButton>
    )

    return (
        <Stack
            spacing="1rem"
            direction="row"
            sx={{
                width: "100%",
                p: "1rem",
                alignItems: "center",
                backgroundColor: isOpen ? theme.factionTheme.s600 : theme.factionTheme.s800,
                transition: "background-color .2s ease-out",
            }}
        >
            {button}
            <Typography
                sx={{
                    fontFamily: fonts.nostromoBlack,
                    fontSize: "1.6rem",
                }}
            >
                Battle Commands
            </Typography>
            {!isDrawerOpen && <Box flex={1} />}
            <Fade in={!isDrawerOpen} unmountOnExit>
                <Box>
                    <NiceTooltip text="Battle Commands & Arena Selection" placement="right">
                        {button}
                    </NiceTooltip>
                </Box>
            </Fade>
        </Stack>
    )
}
BattleArena.Header = Header
