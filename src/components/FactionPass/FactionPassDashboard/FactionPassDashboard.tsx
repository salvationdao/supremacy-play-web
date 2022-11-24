import { Box, Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { useAuth, useSupremacy } from "../../../containers"
import { NavTabs } from "../../Common/NavTabs/NavTabs"
import { usePageTabs } from "../../Common/NavTabs/usePageTabs"
import { colors } from "../../../theme/theme"
import { FactionPassStatus } from "./FactionPassStatus"
import { FactionPassMVPMech } from "./FactionPassMVPMech"

export const FactionPassDashboard = () => {
    const { factionID } = useAuth()
    const { getFaction } = useSupremacy()
    const { tabs, activeTabID, setActiveTabID, prevTab, nextTab } = usePageTabs()

    const faction = useMemo(() => {
        return getFaction(factionID)
    }, [factionID, getFaction])

    console.log(faction.logo_url)

    return (
        <Stack
            alignItems="center"
            sx={{
                p: "4rem 5rem",
                mx: "auto",
                position: "relative",
                height: "100%",
                maxWidth: "190rem",
                backgroundColor: faction.palette.background,
            }}
        >
            <NavTabs activeTabID={activeTabID} setActiveTabID={setActiveTabID} tabs={tabs} prevTab={prevTab} nextTab={nextTab} />
            <Stack direction="row" alignItems="stretch" spacing={1} sx={{ flex: 1, width: "100%", overflow: "hidden" }}>
                <Stack spacing={1}>
                    <Box
                        sx={{
                            height: "30rem",
                            width: "30rem",
                            background: `url(${faction.logo_url})`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            backgroundSize: "cover",
                        }}
                    />
                    <FactionPassMVPMech />
                </Stack>
                <FactionPassStatus />
            </Stack>
        </Stack>
    )
}
