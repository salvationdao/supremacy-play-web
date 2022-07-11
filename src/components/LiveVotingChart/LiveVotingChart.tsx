import { Box, Fade, Stack } from "@mui/material"
import { useEffect, useMemo, useRef, useState } from "react"
import { MoveableResizable } from ".."
import { useGame, useMobile, useOverlayToggles, useSupremacy } from "../../containers"
import { parseString } from "../../helpers"
import { useToggle } from "../../hooks"
import { BattleStats } from "../BattleStats/BattleStats"
import { MoveableResizableConfig, useMoveableResizable } from "../Common/MoveableResizable/MoveableResizableContainer"
import { LiveGraph } from "./LiveGraph"

const DefaultMaxLiveVotingDataLength = 100

export const LiveVotingChart = () => {
    const { isMobile } = useMobile()
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
                "The chart shows you the SUPS being spent into the battle arena in real time. All SUPS spent are accumulated into the SPOILS OF WAR, which are distributed back to the players in future battles based on the multipliers that they have earned. Contribute to the battle or be part of the winning Faction to increase your earnings.",
        }),
        [toggleIsLiveChartOpen],
    )

    if (!isLiveChartOpen) return null

    return (
        <Fade in={isLiveChartOpen && show}>
            <Box sx={{ ...(isMobile ? { backgroundColor: "#FFFFFF12", boxShadow: 2, border: "#FFFFFF20 1px solid" } : {}) }}>
                <MoveableResizable config={config}>
                    <LiveVotingChartInner />
                </MoveableResizable>
            </Box>
        </Fade>
    )
}

const LiveVotingChartInner = () => {
    const { isMobile } = useMobile()
    const { battleIdentifier } = useSupremacy()
    const [maxLiveVotingDataLength, setMaxLiveVotingDataLength] = useState(
        parseString(localStorage.getItem("liveVotingDataMax"), DefaultMaxLiveVotingDataLength),
    )
    const { curWidth, curHeight } = useMoveableResizable()
    const ref = useRef<HTMLDivElement>()

    useEffect(() => {
        if (isMobile && ref.current?.parentElement) {
            setMaxLiveVotingDataLength(ref.current.parentElement.offsetWidth / 5)
        } else {
            setMaxLiveVotingDataLength(curWidth / 5)
        }
    }, [curWidth, isMobile])

    return useMemo(() => {
        const parentDiv = ref.current?.parentElement
        const insideWidth = isMobile ? parentDiv?.offsetWidth || 300 : curWidth
        const insideHeight = isMobile ? 120 : curHeight

        return (
            <Stack ref={ref} sx={{ height: "100%", pt: "1.2rem" }}>
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
                            maxWidthPx={insideWidth}
                            maxHeightPx={insideHeight}
                            maxLiveVotingDataLength={maxLiveVotingDataLength}
                        />
                    </Box>
                </Box>

                <Box sx={{ px: "1.5rem", pt: ".3rem", pb: ".5rem" }}>
                    <BattleStats />
                </Box>
            </Stack>
        )
    }, [battleIdentifier, curHeight, curWidth, isMobile, maxLiveVotingDataLength])
}
