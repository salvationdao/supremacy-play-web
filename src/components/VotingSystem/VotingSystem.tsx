import { Box, Fade, Stack, Tab } from "@mui/material"
import { TabProps } from "@mui/material/Tab"
import { useMemo } from "react"
import { BattleAbilityItem, FactionAbilities, MoveableResizable } from ".."
import { DEV_ONLY } from "../../constants"
import { BribeStageResponse, useAuth, useGame } from "../../containers"
import { useTheme } from "../../containers/theme"
import { colors } from "../../theme/theme"
import { MoveableResizableConfig } from "../Common/MoveableResizable/MoveableResizableContainer"
import { PlayerAbilities } from "../PlayerAbilities/PlayerAbilities"

export const VotingSystem = () => {
    const { userID } = useAuth()
    const { bribeStage } = useGame()
    return <VotingSystemInner userID={userID} bribeStage={bribeStage} />
}

interface VotingSystemInnerProps {
    // useAuth
    userID?: string
    // useGame
    bribeStage?: BribeStageResponse
}

const VotingSystemInner = ({ userID, bribeStage }: VotingSystemInnerProps) => {
    const theme = useTheme()
    const { factionID } = useAuth()
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
            minWidth: 300,
            minHeight: 168,
            maxWidth: 500,
            maxHeight: 600,
            // Others
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
                                <BattleAbilityItem key={factionID} />
                                <FactionAbilities />
                                {DEV_ONLY && userID && <PlayerAbilities />}
                            </Stack>
                        </Box>
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
