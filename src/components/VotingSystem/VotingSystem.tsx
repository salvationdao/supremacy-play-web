import { Box, Fade, Stack, Tab } from "@mui/material"
import { TabProps } from "@mui/material/Tab"
import { useMemo } from "react"
import { BattleAbilityItem, FactionAbilities, MoveableResizable, MoveableResizableConfig } from ".."
import { BribeStageResponse, useGame } from "../../containers"
import { useTheme } from "../../containers/theme"
import { colors } from "../../theme/theme"

export const VotingSystem = () => {
    const { bribeStage } = useGame()
    return <VotingSystemInner bribeStage={bribeStage} />
}

const VotingSystemInner = ({ bribeStage }: { bribeStage?: BribeStageResponse }) => {
    const theme = useTheme()
    // const [currentTab, setCurrentTab] = useState(0)
    const isBattleStarted = useMemo(() => bribeStage && bribeStage.phase !== "HOLD", [bribeStage])

    const config: MoveableResizableConfig = useMemo(
        () => ({
            localStoragePrefix: "votingSystem",
            // Defaults
            defaultPosX: 10,
            defaultPosY: 10,
            defaultWidth: 390,
            defaultHeight: 360,
            // Size limits
            minWidth: 370,
            minHeight: 215,
            maxWidth: 500,
            maxHeight: 500,
            // Others
            CaptionArea: <Box sx={{ pl: ".3rem" }}></Box>,
            infoTooltipText: "Vote for game abilities and fight for your Syndicate!",
        }),
        [],
    )

    if (!bribeStage) return null

    return (
        <Fade in={isBattleStarted}>
            <Box>
                <MoveableResizable config={config}>
                    <Stack sx={{ position: "relative", height: "100%" }}>
                        {/* {DEV_ONLY && (
                            <Tabs
                                defaultValue={0}
                                value={currentTab}
                                onChange={(_, value) => setCurrentTab(value)}
                                TabIndicatorProps={{
                                    hidden: true,
                                }}
                                sx={{
                                    zIndex: 1,
                                    position: "relative",
                                    minHeight: 0,
                                }}
                            >
                                <TabButton label="Game Abilities" backgroundColor={theme.factionTheme.background} borderColor={theme.factionTheme.primary} />
                                <TabButton label="Player Abilities" backgroundColor={theme.factionTheme.background} borderColor={theme.factionTheme.primary} />
                            </Tabs>
                        )} */}
                        {/* <TabPanel value={currentTab} index={0}> */}
                        <Box
                            sx={{
                                height: "100%",
                                overflowY: "auto",
                                overflowX: "hidden",
                                ml: "1.9rem",
                                mr: ".5rem",
                                pr: "1.4rem",
                                mt: "1rem",
                                direction: "ltr",
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
                            <Stack spacing="2rem" sx={{ direction: "ltr", py: ".4rem" }}>
                                <BattleAbilityItem />
                                <FactionAbilities />
                            </Stack>
                        </Box>
                        {/* </TabPanel>
                            {DEV_ONLY && (
                                <TabPanel value={currentTab} index={1}>
                                    <PlayerAbilities />
                                </TabPanel>
                            )} */}
                    </Stack>
                </MoveableResizable>
            </Box>
        </Fade>
    )
}

interface TabButtonProps extends TabProps {
    backgroundColor: string
    borderColor: string
}

export const TabButton = ({ backgroundColor, borderColor, ...props }: TabButtonProps) => {
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

export const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props

    return (
        <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
            {value === index && children}
        </div>
    )
}
