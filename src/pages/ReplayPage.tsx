import { Box, Fade, Stack, Tab, Tabs } from "@mui/material"
import { SyntheticEvent, useCallback, useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import { HangarBg } from "../assets"
import { ClipThing } from "../components"
import { MysteryCrateBanner } from "../components/Common/BannersPromotions/MysteryCrateBanner"
import { BattlesReplays } from "../components/Replays/BattlesReplays/BattlesReplays"
import { useTheme } from "../containers/theme"
import { ROUTES_MAP } from "../routes"
import { siteZIndex } from "../theme/theme"

export enum REPLAY_TABS {
    BATTLES = "battles",
    CLIPS = "clips",
}

export const ReplayPage = () => {
    const theme = useTheme()
    const history = useHistory()
    const { type } = useParams<{ type: REPLAY_TABS }>()
    const [currentValue, setCurrentValue] = useState<REPLAY_TABS>()

    // Make sure that the param route is correct, fix it if invalid
    useEffect(() => {
        if (Object.values(REPLAY_TABS).includes(type)) return setCurrentValue(type)
        history.replace(`${ROUTES_MAP.replays.path.replace(":type", REPLAY_TABS.BATTLES)}`)
    }, [history, type])

    const handleChange = useCallback(
        (event: SyntheticEvent, newValue: REPLAY_TABS) => {
            setCurrentValue(newValue)
            history.push(`${ROUTES_MAP.replays.path.replace(":type", newValue)}`)
        },
        [history],
    )

    if (!currentValue) return null

    const primaryColor = theme.factionTheme.primary
    const secondaryColor = theme.factionTheme.secondary
    const backgroundColor = theme.factionTheme.background

    return (
        <Stack
            alignItems="center"
            sx={{
                height: "100%",
                zIndex: siteZIndex.RoutePage,
                backgroundImage: `url(${HangarBg})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
                boxShadow: `inset 0 0 50px 60px #00000090`,
            }}
        >
            <Stack sx={{ mt: "1.5rem", mb: "2rem", height: "100%", width: "calc(100% - 3rem)", maxWidth: "145rem" }}>
                <Stack direction="row" alignItems="center" flexWrap="wrap" sx={{ mb: "1.1rem", gap: "1.2rem" }}>
                    <ClipThing
                        clipSize="10px"
                        border={{
                            borderColor: primaryColor,
                            borderThickness: ".3rem",
                        }}
                        corners={{ topRight: true, bottomRight: true }}
                        backgroundColor={backgroundColor}
                        sx={{ maxWidth: "fit-content" }}
                    >
                        <Box sx={{ height: "100%" }}>
                            <Tabs
                                value={currentValue}
                                onChange={handleChange}
                                variant="scrollable"
                                scrollButtons="auto"
                                sx={{
                                    flexShrink: 0,
                                    color: primaryColor,
                                    minHeight: 0,
                                    ".MuiTab-root": { minHeight: 0, fontSize: "1.3rem", height: "6rem", width: "10rem" },
                                    ".Mui-selected": {
                                        color: `${secondaryColor} !important`,
                                        background: `linear-gradient(${primaryColor} 26%, ${primaryColor}BB)`,
                                    },
                                    ".MuiTabs-indicator": { display: "none" },
                                    ".MuiTabScrollButton-root": { display: "none" },
                                }}
                            >
                                <Tab label="BATTLES" value={REPLAY_TABS.BATTLES} />
                            </Tabs>
                        </Box>
                    </ClipThing>

                    <MysteryCrateBanner />
                </Stack>

                <TabPanel currentValue={currentValue} value={REPLAY_TABS.BATTLES}>
                    <BattlesReplays />
                </TabPanel>
            </Stack>
        </Stack>
    )
}

interface TabPanelProps {
    children?: React.ReactNode
    value: REPLAY_TABS
    currentValue: REPLAY_TABS
}

const TabPanel = (props: TabPanelProps) => {
    const { children, currentValue, value } = props

    if (currentValue === value) {
        return (
            <Fade in>
                <Box id={`replays-tabpanel-${value}`} sx={{ flex: 1 }}>
                    {children}
                </Box>
            </Fade>
        )
    }

    return null
}
