import { Box, Fade, Stack, Tab, Tabs } from "@mui/material"
import { SyntheticEvent, useCallback, useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import { HangarBg } from "../assets"
import { ClipThing } from "../components"
import { DangerZone } from "../components/Admin/Dangerzone/DangerZone"
import { AdminLookup } from "../components/Admin/Lookup/AdminLookup"
import { MysteryCrateBanner } from "../components/Common/BannersPromotions/MysteryCrateBanner"
import { useAuth } from "../containers"
import { useTheme } from "../containers/theme"
import { ROUTES_MAP } from "../routes"
import { colors, siteZIndex } from "../theme/theme"
import { RoleType } from "../types"

export enum ADMIN_TABS {
    LOOKUP = "lookup",
    DANGERZONE = "dangerzone",
    // BANLIST = "ban-list",
}

export const AdminPage = () => {
    const theme = useTheme()
    const history = useHistory()
    const { type } = useParams<{ type: ADMIN_TABS }>()
    const { user } = useAuth()
    const [currentValue, setCurrentValue] = useState<ADMIN_TABS>()

    if (user.role_type === RoleType.player) {
        history.push("/")
    }

    useEffect(() => {
        if (Object.values(ADMIN_TABS).includes(type)) return setCurrentValue(type)
        history.replace(`${ROUTES_MAP.admin.path.replace(":type", ADMIN_TABS.LOOKUP)}`)
    }, [history, type])

    const handleChange = useCallback(
        (event: SyntheticEvent, newValue: ADMIN_TABS) => {
            history.push(`${ROUTES_MAP.admin.path.replace(":type", newValue)}`)
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
                                    ".MuiTab-root": { minHeight: 0, fontSize: "1.3rem", height: "6rem", width: "15rem" },
                                    ".Mui-selected": {
                                        color: `${secondaryColor} !important`,
                                        background: `linear-gradient(${primaryColor} 26%, ${primaryColor}BB)`,
                                    },
                                    ".MuiTabs-indicator": { display: "none" },
                                    ".MuiTabScrollButton-root": { display: "none" },
                                }}
                            >
                                <Tab label="LOOKUP" value={ADMIN_TABS.LOOKUP} />
                                <Tab
                                    label="DANGERZONE"
                                    value={ADMIN_TABS.DANGERZONE}
                                    sx={{ background: `linear-gradient(${colors.darkRed} 26%, ${colors.darkRed}BB)` }}
                                />
                                {/*TODO: Add ban list*/}
                                {/*<Tab label="BAN LIST" value={ADMIN_TABS.BANLIST} />*/}
                            </Tabs>
                        </Box>
                    </ClipThing>

                    <MysteryCrateBanner />
                </Stack>

                <TabPanel currentValue={currentValue} value={ADMIN_TABS.LOOKUP}>
                    <AdminLookup />
                </TabPanel>

                <TabPanel currentValue={currentValue} value={ADMIN_TABS.DANGERZONE}>
                    <DangerZone />
                </TabPanel>
            </Stack>
        </Stack>
    )
}

interface TabPanelProps {
    children?: React.ReactNode
    value: ADMIN_TABS
    currentValue: ADMIN_TABS
}

const TabPanel = (props: TabPanelProps) => {
    const { children, currentValue, value } = props

    if (currentValue === value) {
        return (
            <Fade in unmountOnExit>
                <Box id={`admin-tabpanel-${value}`} sx={{ flex: 1 }}>
                    {children}
                </Box>
            </Fade>
        )
    }

    return null
}
