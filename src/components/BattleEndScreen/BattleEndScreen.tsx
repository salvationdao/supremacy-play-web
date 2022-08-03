import { Slide, Stack } from "@mui/material"
import { Box } from "@mui/system"
import { useEffect, useMemo } from "react"
import { SectionBottom, SectionMostFrequentAbilityExecutor, SectionWinner } from ".."
import { useGame, useMobile, useOverlayToggles } from "../../containers"
import { shadeColor } from "../../helpers"
import { colors, siteZIndex } from "../../theme/theme"

export const BOTTOM_BUTTONS_HEIGHT = 5 //rems

export const BattleEndScreen = () => {
    const { isMobile } = useMobile()
    const { map, battleEndDetail } = useGame()
    const { isEndBattleDetailOpen, toggleIsEndBattleDetailOpen, toggleIsEndBattleDetailEnabled } = useOverlayToggles()

    useEffect(() => {
        if (battleEndDetail) {
            toggleIsEndBattleDetailEnabled(true)
            toggleIsEndBattleDetailOpen(true)
        }
    }, [battleEndDetail, toggleIsEndBattleDetailEnabled, toggleIsEndBattleDetailOpen])

    // New game started, so close the panel
    useEffect(() => {
        if (map) toggleIsEndBattleDetailOpen(false)
    }, [map, toggleIsEndBattleDetailOpen])

    const primaryColor = useMemo(
        () => (battleEndDetail && battleEndDetail.winning_faction ? battleEndDetail.winning_faction.theme.primary : colors.neonBlue),
        [battleEndDetail],
    )

    const backgroundColor = useMemo(
        () => (battleEndDetail && battleEndDetail.winning_faction ? shadeColor(battleEndDetail.winning_faction.theme.primary, -96) : colors.darkNavyBlue),
        [battleEndDetail],
    )

    if (!battleEndDetail || !battleEndDetail.winning_faction) return null

    return (
        <Slide key={battleEndDetail.battle_id} in={isEndBattleDetailOpen || isMobile} direction="right">
            <Box
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
                    boxShadow: 20,
                    zIndex: siteZIndex.Popover,
                    maxWidth: isMobile ? "unset" : "48rem",
                    background: `linear-gradient(65deg, ${backgroundColor} 3%, ${backgroundColor}FF 50%, ${backgroundColor}EE)`,
                }}
            >
                <Stack
                    sx={{
                        height: `calc(100% - ${BOTTOM_BUTTONS_HEIGHT}rem)`,
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
                            {/* <SectionTopSups battleEndDetail={battleEndDetail} /> */}
                            <SectionMostFrequentAbilityExecutor battleEndDetail={battleEndDetail} />
                            {/* <SectionTopSupsFaction battleEndDetail={battleEndDetail} /> */}
                        </Stack>
                    </Box>
                </Stack>

                <SectionBottom battleEndDetail={battleEndDetail} />
            </Box>
        </Slide>
    )
}
