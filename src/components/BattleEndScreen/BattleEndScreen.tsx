import { Stack, Typography } from "@mui/material"
import { Box } from "@mui/system"
import moment from "moment"
import { useEffect } from "react"
import { SectionFactions, SectionWinner } from ".."
import { useGame, useOverlayToggles } from "../../containers"
import { useTheme } from "../../containers/theme"
import { LEFT_DRAWER_MAP } from "../../routes"
import { colors, fonts, siteZIndex } from "../../theme/theme"
import { SectionMechRewards } from "./Sections/SectionMechRewards"

export const BattleEndScreen = () => {
    const theme = useTheme()
    const { map, battleEndDetail } = useGame()
    const { setLeftDrawerActiveTabID } = useOverlayToggles()

    // New game started, so close the panel
    useEffect(() => {
        if (map) setLeftDrawerActiveTabID(LEFT_DRAWER_MAP.battle_arena?.id)
    }, [map, setLeftDrawerActiveTabID])

    // Game ends, show the panel
    useEffect(() => {
        if (battleEndDetail) setLeftDrawerActiveTabID(LEFT_DRAWER_MAP.previous_battle?.id)
    }, [battleEndDetail, setLeftDrawerActiveTabID])

    const primaryColor = theme.factionTheme.primary
    const backgroundColor = theme.factionTheme.background

    if (!battleEndDetail) {
        return (
            <Stack spacing=".6rem" alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                <Typography sx={{ color: colors.grey, textAlign: "center" }}>Please wait for the current battle to finish.</Typography>
            </Stack>
        )
    }

    const { battle_identifier, started_at, ended_at } = battleEndDetail

    return (
        <Stack
            spacing="1rem"
            sx={{
                pl: "2.9rem",
                pr: "1.2rem",
                pt: "2.4rem",
                pb: "2.5rem",
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
