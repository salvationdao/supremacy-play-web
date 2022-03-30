import { Slide, Stack } from "@mui/material"
import { Box } from "@mui/system"
import { useEffect, useMemo } from "react"
import {
    SectionBottom,
    SectionMostFrequentAbilityExecutor,
    SectionMultipliers,
    SectionTopSups,
    SectionTopSupsFaction,
    SectionWinner,
} from ".."
import { useGame, useOverlayToggles } from "../../containers"
import { shadeColor } from "../../helpers"
import { colors } from "../../theme/theme"

export const BOTTOM_BUTTONS_HEIGHT = 5 //rems

export const BattleEndScreen = () => {
    const { map, battleEndDetail } = useGame()
    const { isEndBattleDetailOpen, toggleIsEndBattleDetailOpen, toggleIsEndBattleDetailEnabled } = useOverlayToggles()

    useEffect(() => {
        if (battleEndDetail) {
            toggleIsEndBattleDetailEnabled(true)
            toggleIsEndBattleDetailOpen(true)
        }
    }, [battleEndDetail])

    // New game started, so close the panel
    useEffect(() => {
        if (map) toggleIsEndBattleDetailOpen(false)
    }, [map])

    const primaryColor = useMemo(
        () =>
            battleEndDetail && battleEndDetail.winning_faction
                ? battleEndDetail.winning_faction.theme.primary
                : colors.neonBlue,
        [battleEndDetail],
    )

    const backgroundColor = useMemo(
        () =>
            battleEndDetail && battleEndDetail.winning_faction
                ? shadeColor(battleEndDetail.winning_faction.theme.primary, -96)
                : colors.darkNavyBlue,
        [battleEndDetail],
    )

    const backgroundColorGradient = useMemo(
        () => ({
            background: `linear-gradient(65deg, ${backgroundColor} 3%, ${backgroundColor}98 50%, ${backgroundColor}95)`,
        }),
        [backgroundColor],
    )

    if (!battleEndDetail || !battleEndDetail.winning_faction) return null

    return (
        <Slide key={battleEndDetail.battle_id} in={isEndBattleDetailOpen} direction="right">
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    boxShadow: 20,
                    zIndex: 999,
                    maxWidth: "45rem",
                    ...backgroundColorGradient,
                }}
            >
                <Box
                    sx={{
                        position: "relative",
                        height: "100%",
                        width: "100%",
                        pl: "3.44rem",
                        pr: ".8rem",
                        pt: "2.4rem",
                        pb: "1.2rem",
                        ...backgroundColorGradient,
                    }}
                >
                    <Stack
                        spacing="3.2rem"
                        sx={{
                            height: `calc(100% - ${BOTTOM_BUTTONS_HEIGHT}rem)`,
                            pr: "1.76rem",
                            pb: "3.2rem",
                            overflowY: "auto",
                            overflowX: "auto",
                            scrollbarWidth: "none",
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
                        <SectionMultipliers battleEndDetail={battleEndDetail} />
                        <SectionWinner battleEndDetail={battleEndDetail} />
                        <SectionTopSups battleEndDetail={battleEndDetail} />
                        <SectionMostFrequentAbilityExecutor battleEndDetail={battleEndDetail} />
                        <SectionTopSupsFaction battleEndDetail={battleEndDetail} />
                    </Stack>

                    <SectionBottom battleEndDetail={battleEndDetail} />

                    <Box
                        sx={{
                            position: "absolute",
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                            zIndex: -1,
                            ...backgroundColorGradient,
                        }}
                    />
                </Box>
            </Box>
        </Slide>
    )
}
