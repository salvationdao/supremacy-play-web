import { Stack, Typography } from "@mui/material"
import { Box } from "@mui/system"
import moment from "moment"
import { useEffect } from "react"
import { SectionFactions, SectionWinner } from ".."
import { useGame, useMobile, useOverlayToggles } from "../../containers"
import { useTheme } from "../../containers/theme"
import { LEFT_DRAWER_MAP } from "../../routes"
import { fonts, siteZIndex } from "../../theme/theme"
import { SectionMechRewards } from "./Sections/SectionMechRewards"

export const BattleEndScreen = () => {
    const theme = useTheme()
    const { isMobile } = useMobile()
    const { map, battleEndDetail } = useGame()
    const { setLeftDrawerActiveTabID } = useOverlayToggles()

    useEffect(() => {
        if (battleEndDetail) {
            setLeftDrawerActiveTabID(LEFT_DRAWER_MAP.previous_battle?.id)
        }
    }, [battleEndDetail, setLeftDrawerActiveTabID])

    // New game started, so close the panel
    useEffect(() => {
        if (map) {
            setLeftDrawerActiveTabID(LEFT_DRAWER_MAP.battle_arena?.id)
        }
    }, [map, setLeftDrawerActiveTabID])

    const primaryColor = theme.factionTheme.primary
    const backgroundColor = theme.factionTheme.background

    if (!battleEndDetail) return null

    const { battle_identifier, started_at, ended_at } = battleEndDetail

    return (
        <Stack
            sx={{
                position: isMobile ? "unset" : "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                pl: "2.9rem",
                pr: ".8rem",
                pt: "2.4rem",
                pb: "1.2rem",
                height: "100%",
                width: "100%",
                boxShadow: 20,
                zIndex: siteZIndex.Popover,
                maxWidth: isMobile ? "unset" : "48rem",
                background: `linear-gradient(65deg, ${backgroundColor} 3%, ${backgroundColor}FF 50%, ${backgroundColor}EE)`,
            }}
        >
            <Box sx={{ mb: "1.6rem" }}>
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
                    pr: "1.76rem",
                    pb: "3.2rem",
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
                    <Stack spacing="3.2rem">
                        <SectionWinner battleEndDetail={battleEndDetail} />
                        <SectionFactions battleEndDetail={battleEndDetail} />
                        <SectionMechRewards battleEndDetail={battleEndDetail} />
                    </Stack>
                </Box>
            </Stack>
        </Stack>
    )
}
