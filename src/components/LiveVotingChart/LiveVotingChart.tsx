import { Box, Fade, Stack } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { MoveableResizable } from ".."
import { useGame, useOverlayToggles, useSupremacy } from "../../containers"
import { parseString } from "../../helpers"
import { useToggle } from "../../hooks"
import { BattleStats } from "../BattleStats/BattleStats"
import { MoveableResizableConfig, useMoveableResizable } from "../Common/MoveableResizable/MoveableResizableContainer"
import { LiveGraph } from "./LiveGraph"

const DefaultMaxLiveVotingDataLength = 100

export const LiveVotingChart = () => {
    const { bribeStage } = useGame()
    const { isLiveChartOpen, toggleIsLiveChartOpen } = useOverlayToggles()

    // Temp hotfix ask james ****************************
    const [show, toggleShow] = useToggle(false)
    useEffect(() => {
        if (bribeStage && bribeStage.phase !== "HOLD") {
            toggleShow(true)
        } else {
            toggleShow(false)
        }
    }, [bribeStage, toggleShow])
    // End ****************************************

    const config: MoveableResizableConfig = useMemo(
        () => ({
            localStoragePrefix: "liveVoting",
            // Defaults
            defaultPosX: 0,
            defaultPosY: 490,
            defaultWidth: 320,
            defaultHeight: 120,
            // Position limits
            minPosX: 0,
            minPosY: 0,
            // Size limits
            minWidth: 300,
            minHeight: 120,
            maxHeight: 200,
            // Callbacks
            onHideCallback: () => toggleIsLiveChartOpen(false),
            // Others
            infoTooltipText:
                "The chart shows you the SUPS being spent into the battle arena in real time. All SUPS spent are accumulated into the SPOILS OF WAR, which are distributed back to the players in future battles based on the multipliers that they have earned. Contribute to the battle or be part of the winning Syndicate to increase your earnings.",
        }),
        [toggleIsLiveChartOpen],
    )

    if (!isLiveChartOpen) return null

    return (
        <Fade in={isLiveChartOpen && show}>
            <Box>
                <MoveableResizable config={config}>
                    <LiveVotingChartInner />
                </MoveableResizable>
            </Box>
        </Fade>
    )
}

const LiveVotingChartInner = () => {
    const { battleIdentifier } = useSupremacy()
    const [maxLiveVotingDataLength, setMaxLiveVotingDataLength] = useState(
        parseString(localStorage.getItem("liveVotingDataMax"), DefaultMaxLiveVotingDataLength),
    )
    const { curWidth, curHeight } = useMoveableResizable()

    useEffect(() => {
        setMaxLiveVotingDataLength(curWidth / 5)
    }, [curWidth])

    return (
        <Stack sx={{ height: "100%", pt: "1.2rem" }}>
            <Box
                sx={{
                    flex: 1,
                    position: "relative",
                    px: "1.3rem",
                    pb: ".4rem",
                }}
            >
                <Box
                    key={maxLiveVotingDataLength}
                    sx={{
                        position: "relative",
                        height: "100%",
                        px: ".56rem",
                        pt: "1.6rem",
                        background: "#000000E6",
                        border: (theme) => `${theme.factionTheme.primary}10 1px solid`,
                        borderRadius: 1,
                    }}
                >
                    <LiveGraph
                        battleIdentifier={battleIdentifier}
                        maxWidthPx={curWidth}
                        maxHeightPx={curHeight}
                        maxLiveVotingDataLength={maxLiveVotingDataLength}
                    />
                </Box>
            </Box>

            <Box sx={{ px: "1.5rem", pt: ".3rem", pb: ".5rem" }}>
                <BattleStats />
            </Box>
        </Stack>
    )
}
