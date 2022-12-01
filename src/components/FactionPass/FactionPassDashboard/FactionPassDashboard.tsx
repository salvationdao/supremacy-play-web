import { Box, Stack } from "@mui/material"
import { useMemo } from "react"
import { useAuth, useSupremacy } from "../../../containers"
import { NavTabs } from "../../Common/NavTabs/NavTabs"
import { usePageTabs } from "../../Common/NavTabs/usePageTabs"
import { FactionStakedMechStatus } from "./FactionStakedMechStatus"
import { FactionMostPopularStakedMech } from "./FactionMostPopularStakedMech"

export const FactionPassDashboard = () => {
    const { factionID } = useAuth()
    const { getFaction } = useSupremacy()
    const { tabs, activeTabID, setActiveTabID, prevTab, nextTab } = usePageTabs()

    const faction = useMemo(() => {
        return getFaction(factionID)
    }, [factionID, getFaction])

    return (
        <Stack
            alignItems="center"
            spacing="1.5rem"
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
            <Stack direction="row" alignItems="stretch" spacing="1.5rem" sx={{ flex: 1, width: "100%", overflow: "hidden" }}>
                <Stack spacing="1.5rem">
                    <Box
                        sx={{
                            height: "32.5rem",
                            width: "32.5rem",
                            background: `url(${faction.logo_url})`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            backgroundSize: "contain",
                        }}
                    />
                    <FactionMostPopularStakedMech />
                </Stack>
                <FactionStakedMechStatus />
            </Stack>
        </Stack>
    )
}
