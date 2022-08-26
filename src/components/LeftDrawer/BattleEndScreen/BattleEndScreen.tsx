import { Stack, Typography } from "@mui/material"
import { Box } from "@mui/system"
import moment from "moment"
import { useEffect, useRef } from "react"
import { SectionFactions, SectionWinner } from "../.."
import { useGame, useUI } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { LEFT_DRAWER_MAP } from "../../../routes"
import { colors, fonts, siteZIndex } from "../../../theme/theme"
import { SectionMechRewards } from "./Sections/SectionMechRewards"

export const BattleEndScreen = () => {
    const theme = useTheme()
    const { map, battleEndDetail } = useGame()
    const { hasModalsOpen, setLeftDrawerActiveTabID } = useUI()
    // When user first loads the web page and gets battle end, we want to prevent changing tabs
    const skippedFirstIteration = useRef(false)

    // New game started, so close the panel
    useEffect(() => {
        if (hasModalsOpen()) return

        if (map) setLeftDrawerActiveTabID((prev) => (prev ? LEFT_DRAWER_MAP.battle_arena?.id : prev))
    }, [hasModalsOpen, map, setLeftDrawerActiveTabID])

    // Game ends, show the panel
    useEffect(() => {
        if (hasModalsOpen()) return

        if (battleEndDetail) {
            if (skippedFirstIteration.current) {
                setLeftDrawerActiveTabID(LEFT_DRAWER_MAP.previous_battle?.id)
            } else {
                skippedFirstIteration.current = true
            }
        }
    }, [battleEndDetail, hasModalsOpen, setLeftDrawerActiveTabID])

    const primaryColor = theme.factionTheme.primary
    const backgroundColor = theme.factionTheme.background

    if (!battleEndDetail) {
        return (
            <Stack spacing=".6rem" alignItems="center" justifyContent="center" sx={{ px: "6rem", height: "100%", backgroundColor }}>
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
                backgroundColor,
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

                    "::-webkit-scrollbar": {
                        width: ".4rem",
                        height: ".4rem",
                    },
                    "::-webkit-scrollbar-track": {
                        background: "#FFFFFF15",
                        borderRadius: 3,
                    },
                    "::-webkit-scrollbar-thumb": {
                        background: primaryColor,
                        borderRadius: 3,
                    },
                }}
            >
                <Box sx={{ height: 0 }}>
                    <Stack spacing="3.2rem" sx={{ py: "1rem" }}>
                        <SectionWinner battleEndDetail={battleEndDetail} />
                        <SectionFactions battleEndDetail={battleEndDetail} />
                        <SectionMechRewards battleEndDetail={battleEndDetail} />
                    </Stack>
                </Box>
            </Stack>
        </Stack>
    )
}
