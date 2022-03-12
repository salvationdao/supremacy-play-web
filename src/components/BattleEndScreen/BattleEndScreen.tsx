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
import { sampleBattleEndDetail } from "../../samepleData"
import { colors } from "../../theme/theme"

const SPAWN_TEST_DATA = false

export const BOTTOM_BUTTONS_HEIGHT = 50

export const BattleEndScreen = () => {
    const { bribeStage, battleEndDetail, setBattleEndDetail } = useGame()
    const { isEndBattleDetailOpen, toggleIsEndBattleDetailOpen, toggleIsEndBattleDetailEnabled } = useOverlayToggles()

    useEffect(() => {
        if (battleEndDetail) {
            toggleIsEndBattleDetailEnabled(true)
            toggleIsEndBattleDetailOpen(true)
        }
    }, [battleEndDetail])

    useEffect(() => {
        if (SPAWN_TEST_DATA) {
            setBattleEndDetail(sampleBattleEndDetail)
            toggleIsEndBattleDetailEnabled(true)
            toggleIsEndBattleDetailOpen(true)
        }
    }, [])

    useEffect(() => {
        if (bribeStage?.phase !== "HOLD") toggleIsEndBattleDetailOpen(false)
    }, [bribeStage])

    const primaryColor =
        battleEndDetail && battleEndDetail.winning_faction
            ? battleEndDetail.winning_faction.theme.primary
            : colors.neonBlue
    const backgroundColor =
        battleEndDetail && battleEndDetail.winning_faction
            ? shadeColor(battleEndDetail.winning_faction.theme.primary, -96)
            : colors.darkNavyBlue

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
                    maxWidth: 616,
                    ...backgroundColorGradient,
                }}
            >
                <Box
                    sx={{
                        position: "relative",
                        height: "100%",
                        width: "100%",
                        pl: 4.3,
                        pr: 1,
                        pt: 3,
                        pb: 1.5,
                        ...backgroundColorGradient,
                    }}
                >
                    <Stack
                        spacing={4}
                        sx={{
                            height: `calc(100% - ${BOTTOM_BUTTONS_HEIGHT}px)`,
                            pr: 2.2,
                            pb: 4,
                            overflowY: "auto",
                            overflowX: "auto",
                            scrollbarWidth: "none",
                            "::-webkit-scrollbar": {
                                width: 4,
                                height: 4,
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
