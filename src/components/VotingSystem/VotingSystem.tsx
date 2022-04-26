import { Box, Slide, Stack, Tab, Tabs } from "@mui/material"
import { Theme } from "@mui/material/styles"
import { TabProps } from "@mui/material/Tab"
import { useTheme } from "@mui/styles"
import { useCallback, useMemo, useState } from "react"
import { ClipThing, FactionAbilities, ResizeBox } from ".."
import { BribeStageResponse, useDimension, useGame, useGameServerAuth } from "../../containers"
import { parseString } from "../../helpers"
import { colors } from "../../theme/theme"
import { Dimension } from "../../types"
import { BattleAbilityItem } from "./BattleAbilityItem"

export const VotingSystem = () => {
    const { bribeStage } = useGame()

    return <VotingSystemInner bribeStage={bribeStage} />
}

const VotingSystemInner = ({ bribeStage }: { bribeStage?: BribeStageResponse }) => {
    const { user } = useGameServerAuth()
    const initialSize = { width: 390, height: 360, minWidth: 370 }
    const [containerWidth, setContainerWidth] = useState<number>(parseString(localStorage.getItem("votingSystemWidth"), initialSize.width))
    const [containerHeight, setContainerHeight] = useState<number>(initialSize.height)
    const theme = useTheme<Theme>()
    const {
        pxToRemRatio,
        streamDimensions: { height },
    } = useDimension()
    const [currentTab, setCurrentTab] = useState(0)

    const isBattleStarted = useMemo(() => bribeStage && bribeStage.phase !== "HOLD", [bribeStage])

    const adjustment = useMemo(() => Math.min(pxToRemRatio, 9) / 9, [pxToRemRatio])

    const onResizeStop = useCallback(
        (data: Dimension) => {
            const size = data || { width: containerWidth, height: containerHeight }
            setContainerWidth(size.width)
            setContainerHeight(size.height)
            localStorage.setItem("votingSystemWidth", size.width.toString())
        },
        [containerWidth, containerHeight],
    )

    if (!user || !user.faction) return null

    return (
        <Stack
            id="tutorial-vote"
            sx={{
                position: "absolute",
                top: "1rem",
                left: "1rem",
                zIndex: 14,
                filter: "drop-shadow(0 3px 3px #00000050)",
            }}
        >
            <Slide in={true} direction="right">
                <Box sx={{ position: "relative" }}>
                    <ResizeBox
                        color={theme.factionTheme.primary}
                        onResizeStop={onResizeStop}
                        adjustment={adjustment}
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

                    <Tabs
                        defaultValue={0}
                        value={currentTab}
                        onChange={(_, value) => setCurrentTab(value)}
                        TabIndicatorProps={{
                            hidden: true,
                        }}
                        sx={{
                            minHeight: 0,
                        }}
                    >
                        <TabButton label="Battle Abilities" backgroundColor={theme.factionTheme.background} borderColor={theme.factionTheme.primary} />
                        <TabButton label="Player Abilities" backgroundColor={theme.factionTheme.background} borderColor={theme.factionTheme.primary} />
                    </Tabs>
                    <ClipThing
                        sx={{
                            zIndex: -1,
                            position: "relative",
                            top: "-1px",
                        }}
                        border={{
                            borderThickness: ".15rem",
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
                            <TabPanel value={currentTab} index={0}>
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
                            </TabPanel>
                            <TabPanel value={currentTab} index={1}>
                                testing
                            </TabPanel>
                        </Box>
                    </ClipThing>
                </Box>
            </Slide>
        </Stack>
    )
}

interface TabButtonProps extends TabProps {
    backgroundColor: string
    borderColor: string
}

const TabButton = ({ backgroundColor, borderColor, ...props }: TabButtonProps) => {
    return (
        <Tab
            sx={{
                color: colors.grey,
                "&.MuiButtonBase-root": {
                    minHeight: 0,
                    padding: ".5rem 1rem",
                    border: `1px solid ${borderColor}`,
                    backgroundColor,
                },
                "&.Mui-selected": {
                    color: borderColor,
                    borderBottom: `1px solid ${backgroundColor}`,
                },
                "&.Mui-focusVisible": {
                    backgroundColor: "orangered",
                },
            }}
            {...props}
        />
    )
}

interface TabPanelProps {
    children?: React.ReactNode
    index: number
    value: number
}

const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props

    return (
        <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
            {value === index && children}
        </div>
    )
}
