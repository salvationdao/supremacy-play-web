import { Box, Fade, Stack, Tab, Tabs } from "@mui/material"
import { SyntheticEvent, useCallback, useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import { HangarBg } from "../assets"
import { ClipThing } from "../components"
import { MysteryCrateBanner } from "../components/Common/PageHeaderBanners/MysteryCrateBanner"
import { KeycardsHangar } from "../components/Hangar/KeycardsHangar/KeycardsHangar"
import { MysteryCratesHangar } from "../components/Hangar/MysteryCratesHangar/MysteryCratesHangar"
import { PlayerAbilitiesHangar } from "../components/Hangar/PlayerAbilitiesHangar/PlayerAbilitiesHangar"
import { WeaponsHangar } from "../components/Hangar/WeaponsHangar/WeaponsHangar"

import { WarMachinesHangar } from "../components/Hangar/WarMachinesHangar/WarMachinesHangar"
import { useTheme } from "../containers/theme"
import { ROUTES_MAP } from "../routes"
import { siteZIndex } from "../theme/theme"
import { SubmodelsHangar } from "../components/Hangar/SubmodelHangar/SubmodelsHangar"
import { DEV_ONLY } from "../constants"

export enum HANGAR_TABS {
    WarMachines = "war-machines",
    MysteryCrates = "mystery-crates",
    Keycards = "key-cards",
    Abilities = "abilities",
    Weapons = "weapons",
    Submodels = "submodels",
}

export const HangarPage = () => {
    const theme = useTheme()
    const history = useHistory()
    const { type } = useParams<{ type: HANGAR_TABS }>()
    const [currentValue, setCurrentValue] = useState<HANGAR_TABS>()

    // Make sure that the param route is correct, fix it if invalid
    useEffect(() => {
        if (Object.values(HANGAR_TABS).includes(type)) return setCurrentValue(type)
        history.replace(`${ROUTES_MAP.fleet.path.replace(":type", HANGAR_TABS.WarMachines)}`)
    }, [history, type])

    const handleChange = useCallback(
        (event: SyntheticEvent, newValue: HANGAR_TABS) => {
            setCurrentValue(newValue)
            history.push(`${ROUTES_MAP.fleet.path.replace(":type", newValue)}`)
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
            <Stack sx={{ mt: "1.5rem", mb: "2rem", height: "100%", width: "calc(100% - 3rem)", maxWidth: "193rem" }}>
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
                                <Tab label="WAR MACHINES" value={HANGAR_TABS.WarMachines} />

                                <Tab label="WEAPONS" value={HANGAR_TABS.Weapons} />

                                {DEV_ONLY && <Tab label="SUBMODELS" value={HANGAR_TABS.Submodels} />}

                                <Tab label="KEY CARDS" value={HANGAR_TABS.Keycards} />

                                <Tab label="MYSTERY CRATES" value={HANGAR_TABS.MysteryCrates} />

                                <Tab label="ABILITIES" value={HANGAR_TABS.Abilities} />
                            </Tabs>
                        </Box>
                    </ClipThing>

                    <MysteryCrateBanner />
                </Stack>

                <TabPanel currentValue={currentValue} value={HANGAR_TABS.WarMachines}>
                    <WarMachinesHangar />
                </TabPanel>

                <TabPanel currentValue={currentValue} value={HANGAR_TABS.Weapons}>
                    <WeaponsHangar />
                </TabPanel>

                {DEV_ONLY && (
                    <TabPanel currentValue={currentValue} value={HANGAR_TABS.Submodels}>
                        <SubmodelsHangar />
                    </TabPanel>
                )}

                <TabPanel currentValue={currentValue} value={HANGAR_TABS.Keycards}>
                    <KeycardsHangar />
                </TabPanel>

                <TabPanel currentValue={currentValue} value={HANGAR_TABS.MysteryCrates}>
                    <MysteryCratesHangar />
                </TabPanel>

                <TabPanel currentValue={currentValue} value={HANGAR_TABS.Abilities}>
                    <PlayerAbilitiesHangar />
                </TabPanel>
            </Stack>
        </Stack>
    )
}

interface TabPanelProps {
    children?: React.ReactNode
    value: HANGAR_TABS
    currentValue: HANGAR_TABS
}

const TabPanel = (props: TabPanelProps) => {
    const { children, currentValue, value } = props

    if (currentValue === value) {
        return (
            <Fade in unmountOnExit>
                <Box id={`hangar-tabpanel-${value}`} sx={{ flex: 1 }}>
                    {children}
                </Box>
            </Fade>
        )
    }

    return null
}
