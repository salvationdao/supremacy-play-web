import { Box, Slide, Stack } from "@mui/material"
import { Theme } from "@mui/material/styles"
import { useTheme } from "@mui/styles"
import { useState } from "react"
import { BattleAbilityItem, ClipThing, FactionAbilities, ResizeBox } from ".."
import { BribeStageResponse, useDimension, useGame, useGameServerAuth } from "../../containers"
import { parseString } from "../../helpers"
import { Dimension } from "../../types"

export const VotingSystem = () => {
    const { bribeStage } = useGame()
    return <VotingSystemInner bribeStage={bribeStage} />
}

const VotingSystemInner = ({ bribeStage }: { bribeStage?: BribeStageResponse }) => {
    const { user } = useGameServerAuth()
    const initialSize = { width: 390, height: 360, minWidth: 350 }
    const [containerWidth, setContainerWidth] = useState<number>(
        parseString(localStorage.getItem("votingSystemWidth"), initialSize.width),
    )
    const [containerHeight, setContainerHeight] = useState<number>(initialSize.height)
    const theme = useTheme<Theme>()
    const {
        streamDimensions: { height },
    } = useDimension()

    const isBattleStarted = bribeStage && bribeStage.phase !== "HOLD"

    if (!user || !user.faction) return null

    const onResizeStop = (data: Dimension) => {
        const size = data || { width: containerWidth, height: containerHeight }
        setContainerWidth(size.width)
        setContainerHeight(size.height)
        localStorage.setItem("votingSystemWidth", size.width.toString())
    }

    return (
        <Stack
            sx={{
                position: "absolute",
                top: "1rem",
                left: "1rem",
                zIndex: 14,
                filter: "drop-shadow(0 3px 3px #00000050)",
            }}
        >
            <Slide in={isBattleStarted} direction="right">
                <Box sx={{ position: "relative" }}>
                    <ResizeBox
                        color={theme.factionTheme.primary}
                        onResizeStop={onResizeStop}
                        initialDimensions={[containerWidth, containerHeight]}
                        minConstraints={[initialSize.minWidth, initialSize.height]}
                        maxConstraints={[500, initialSize.height]}
                        resizeHandles={["e"]}
                        handle={() => (
                            <Box
                                sx={{
                                    pointerEvents: "all",
                                    position: "absolute",
                                    top: 0,
                                    right: 0,
                                    cursor: "ew-resize",
                                    zIndex: 50,
                                    width: "10px",
                                    height: containerHeight,
                                }}
                            />
                        )}
                    />

                    <ClipThing
                        border={{
                            isFancy: true,
                            borderThickness: ".3rem",
                            borderColor: theme.factionTheme.primary,
                        }}
                        clipSize="10px"
                        innerSx={{ width: containerWidth, height: containerHeight, transition: "all .2s" }}
                    >
                        <Box
                            sx={{
                                backgroundColor: theme.factionTheme.background,
                                pl: ".72rem",
                                pr: "1.6rem",
                                pt: "1.44rem",
                                pb: "1.6rem",
                            }}
                        >
                            <Box
                                sx={{
                                    flex: 1,
                                    // 100vh, 160px gap bottom, 10px gap above, 56px for the title
                                    maxHeight: `calc(${height}px - 140px - 10px)`,
                                    overflowY: "auto",
                                    overflowX: "hidden",
                                    pl: ".88rem",
                                    py: ".16rem",
                                    direction: "rtl",
                                    scrollbarWidth: "none",
                                    "::-webkit-scrollbar": {
                                        width: ".4rem",
                                    },
                                    "::-webkit-scrollbar-track": {
                                        background: "#FFFFFF15",
                                        borderRadius: 3,
                                    },
                                    "::-webkit-scrollbar-thumb": {
                                        background: theme.factionTheme.primary,
                                        borderRadius: 3,
                                    },
                                }}
                            >
                                <Stack spacing="2rem" sx={{ direction: "ltr" }}>
                                    <BattleAbilityItem />
                                    <FactionAbilities />
                                </Stack>
                            </Box>
                        </Box>
                    </ClipThing>
                </Box>
            </Slide>
        </Stack>
    )
}
