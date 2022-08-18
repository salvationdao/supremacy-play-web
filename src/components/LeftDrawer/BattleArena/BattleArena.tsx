import { Box, Stack } from "@mui/material"
import { useMemo } from "react"
import { useDimension, useGame } from "../../../containers"
import { MiniMap, TOP_BAR_HEIGHT } from "../../BigDisplay/MiniMap/MiniMap"
import { Stream } from "../../BigDisplay/Stream/Stream"
import { LEFT_DRAWER_WIDTH } from "../LeftDrawer"
import { BattleAbility } from "./BattleAbility/BattleAbility"
import { PlayerAbilities } from "./PlayerAbilities/PlayerAbilities"
import { QuickPlayerAbilities } from "./QuickPlayerAbilities/QuickPlayerAbilities"

export const BattleArena = () => {
    const { isStreamBigDisplay } = useGame()
    const { remToPxRatio } = useDimension()

    return useMemo(
        () => (
            <Stack sx={{ position: "relative", height: "100%", backgroundColor: (theme) => theme.factionTheme.background }}>
                <Box sx={{ flexShrink: 0 }}>
                    {isStreamBigDisplay ? (
                        <MiniMap />
                    ) : (
                        <Box sx={{ width: "100%", height: (LEFT_DRAWER_WIDTH * remToPxRatio) / (16 / 9) + TOP_BAR_HEIGHT * remToPxRatio }}>
                            <Stream />
                        </Box>
                    )}
                </Box>

                <Box
                    sx={{
                        flex: 1,
                        overflowY: "auto",
                        overflowX: "hidden",
                        my: "1rem",
                        mr: ".8rem",
                        pr: ".8rem",
                        pl: "1.6rem",
                        py: "1.4rem",
                        direction: "ltr",
                        scrollbarWidth: "none",
                        "::-webkit-scrollbar": {
                            width: ".4rem",
                        },
                        "::-webkit-scrollbar-track": {
                            background: "#FFFFFF15",
                            borderRadius: 3,
                        },
                        "::-webkit-scrollbar-thumb": {
                            background: (theme) => theme.factionTheme.primary,
                            borderRadius: 3,
                        },
                    }}
                >
                    <Box sx={{ direction: "ltr", height: 0 }}>
                        <Stack spacing="2rem">
                            <BattleAbility />
                            <PlayerAbilities />
                            <QuickPlayerAbilities />
                        </Stack>
                    </Box>
                </Box>
            </Stack>
        ),
        [isStreamBigDisplay, remToPxRatio],
    )
}
