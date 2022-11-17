import { Fade, Stack, Typography } from "@mui/material"
import { Box } from "@mui/system"
import moment from "moment"
import { useEffect, useRef } from "react"
import { NiceTooltip, SectionFactions, SectionWinner } from "../.."
import { SvgLobbies } from "../../../assets"
import { useArena, useGame, useUI } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { HeaderProps, LeftRouteID, LeftRoutes } from "../../../routes"
import { colors, fonts, siteZIndex } from "../../../theme/theme"
import { BattleState } from "../../../types"
import { NiceButton } from "../../Common/Nice/NiceButton"
import { SectionMechRewards } from "./Sections/SectionMechRewards"

export const BattleEndScreen = () => {
    const { battleState, battleEndDetail } = useGame()
    const { currentArenaID } = useArena()
    const { hasModalsOpen, setLeftDrawerActiveTabID } = useUI()
    // When user first loads the web page and gets battle end, we want to prevent changing tabs
    const skippedFirstIteration = useRef(false)

    // When the arena is switched, we skip the first iteration again
    useEffect(() => {
        skippedFirstIteration.current = false
    }, [currentArenaID])

    // New game started, so close the panel
    useEffect(() => {
        if (hasModalsOpen()) return
        if (battleState === BattleState.IntroState)
            setLeftDrawerActiveTabID((prev) => (prev ? LeftRoutes.find((route) => route.id === LeftRouteID.BattleArena)?.id : prev))
    }, [hasModalsOpen, battleState, setLeftDrawerActiveTabID])

    // Game ends, show the panel
    useEffect(() => {
        if (hasModalsOpen()) return

        if (battleEndDetail) {
            if (skippedFirstIteration.current) {
                setLeftDrawerActiveTabID((prev) => {
                    // Only change tabs if we are on the battle arena tab
                    if (prev === LeftRoutes.find((route) => route.id === LeftRouteID.BattleArena)?.id) {
                        return LeftRoutes.find((route) => route.id === LeftRouteID.PreviousBattle)?.id
                    }
                    return prev
                })
            } else {
                skippedFirstIteration.current = true
            }
        }
    }, [battleEndDetail, hasModalsOpen, setLeftDrawerActiveTabID])

    if (!battleEndDetail) {
        return (
            <Stack spacing=".6rem" alignItems="center" justifyContent="center" sx={{ px: "6rem", height: "100%" }}>
                <Typography variant="body2" sx={{ color: colors.grey, textAlign: "center", fontFamily: fonts.nostromoBold }}>
                    Please wait for the current battle to finish.
                </Typography>
            </Stack>
        )
    }

    const { battle_identifier, started_at, ended_at } = battleEndDetail

    return (
        <Stack
            spacing="1rem"
            sx={{
                pl: "2rem",
                pr: "1rem",
                py: "1.8rem",
                height: "100%",
                width: "100%",
                boxShadow: 20,
                zIndex: siteZIndex.Popover,
            }}
        >
            <Box>
                <Typography variant="h5" sx={{ fontFamily: fonts.nostromoBlack }}>
                    BATTLE ID #{battle_identifier.toString().padStart(4, "0")}
                </Typography>
                <Typography variant="h6">
                    FROM {moment(started_at).format("h:mm A")} to {moment(ended_at).format("h:mm A")}
                </Typography>
            </Box>

            <Stack
                sx={{
                    flex: 1,
                    pr: "1rem",
                    overflowY: "auto",
                    overflowX: "auto",
                }}
            >
                <Stack spacing="3.2rem" sx={{ py: "1rem" }}>
                    <SectionWinner battleEndDetail={battleEndDetail} />
                    <SectionFactions battleEndDetail={battleEndDetail} />
                    <SectionMechRewards battleEndDetail={battleEndDetail} />
                </Stack>
            </Stack>
        </Stack>
    )
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
            <SvgLobbies size="3rem" />
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
                backgroundColor: isOpen ? `#1B0313` : `#1c1424`,
                transition: "background-color .2s ease-out",
            }}
        >
            {button}
            <Typography
                sx={{
                    fontFamily: fonts.nostromoBlack,
                    fontSize: "1.8rem",
                }}
            >
                Previous Battle
            </Typography>
            {!isDrawerOpen && <Box flex={1} />}
            <Fade in={!isDrawerOpen} unmountOnExit>
                <Box>
                    <NiceTooltip text="Previous Battle" placement="right">
                        {button}
                    </NiceTooltip>
                </Box>
            </Fade>
        </Stack>
    )
}
BattleEndScreen.Header = Header
