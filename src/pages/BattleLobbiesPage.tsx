import { Box, Fade, Stack, Tab, Tabs } from "@mui/material"
import { SyntheticEvent, useCallback, useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import { HangarBg } from "../assets"
import { ClipThing } from "../components"
import { MysteryCrateBanner } from "../components/Common/BannersPromotions/MysteryCrateBanner"
import { BattleLobbies, LobbyStatusEnum } from "../components/Lobbies/BattleLobbies/BattleLobbies"
import { useTheme } from "../containers/theme"
import { ROUTES_MAP } from "../routes"
import { siteZIndex } from "../theme/theme"

export enum BATTLE_LOBBY_TABS {
    Ready = "ready",
    Pending = "pending",
}

export const BattleLobbiesPage = () => {
    const theme = useTheme()
    const primaryColor = theme.factionTheme.primary
    const secondaryColor = theme.factionTheme.secondary
    const backgroundColor = theme.factionTheme.background

    const history = useHistory()
    const { status } = useParams<{ status: BATTLE_LOBBY_TABS }>()
    const [currentValue, setCurrentValue] = useState<BATTLE_LOBBY_TABS>()

    // Make sure that the param route is correct, fix it if invalid
    useEffect(() => {
        if (Object.values(BATTLE_LOBBY_TABS).includes(status)) return setCurrentValue(status)
        history.replace(`${ROUTES_MAP.battle_lobbies.path.replace(":status", BATTLE_LOBBY_TABS.Pending)}`)
    }, [history, status])

    const handleChange = useCallback(
        (event: SyntheticEvent, newValue: BATTLE_LOBBY_TABS) => {
            setCurrentValue(newValue)
            history.push(`${ROUTES_MAP.battle_lobbies.path.replace(":status", newValue)}`)
        },
        [history],
    )

    if (!currentValue) return null

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
                <Stack direction="row" alignItems="center" sx={{ mb: "1.1rem", gap: "1.2rem" }}>
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
                                <Tab label="PENDING" value={BATTLE_LOBBY_TABS.Pending} />

                                <Tab label="READY" value={BATTLE_LOBBY_TABS.Ready} />
                            </Tabs>
                        </Box>
                    </ClipThing>

                    <MysteryCrateBanner />
                </Stack>

                <TabPanel currentValue={currentValue} value={BATTLE_LOBBY_TABS.Pending}>
                    <BattleLobbies lobbyStatus={LobbyStatusEnum.Pending} />
                </TabPanel>

                <TabPanel currentValue={currentValue} value={BATTLE_LOBBY_TABS.Ready}>
                    <BattleLobbies lobbyStatus={LobbyStatusEnum.Ready} />
                </TabPanel>
            </Stack>
        </Stack>
    )
}

interface TabPanelProps {
    children?: React.ReactNode
    value: BATTLE_LOBBY_TABS
    currentValue: BATTLE_LOBBY_TABS
}

const TabPanel = (props: TabPanelProps) => {
    const { children, currentValue, value } = props

    if (currentValue === value) {
        return (
            <Fade in unmountOnExit>
                <Box id={`battle-lobbies-tabpanel-${value}`} sx={{ flex: 1 }}>
                    {children}
                </Box>
            </Fade>
        )
    }

    return null
}
