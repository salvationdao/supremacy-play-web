import { Stack } from "@mui/material"
import { useMemo } from "react"
import { useAuth, useSupremacy } from "../../../containers"
import { NavTabs } from "../../Common/NavTabs/NavTabs"
import { usePageTabs } from "../../Common/NavTabs/usePageTabs"

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
            sx={{
                p: "4rem 5rem",
                position: "relative",
                height: "100%",
                backgroundColor: faction.background_color,
                background: `url()`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
            }}
        >
            <NavTabs activeTabID={activeTabID} setActiveTabID={setActiveTabID} tabs={tabs} prevTab={prevTab} nextTab={nextTab} />
        </Stack>
    )
}
