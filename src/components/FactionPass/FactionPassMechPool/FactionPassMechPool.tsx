import { Stack } from "@mui/material"
import { useMemo } from "react"
import { useAuth, useSupremacy } from "../../../containers"
import { usePageTabs } from "../../../hooks/usePageTabs"
import { NavTabs } from "../../Common/NavTabs/NavTabs"

export const FactionPassMechPool = () => {
    const { factionID } = useAuth()
    const { getFaction } = useSupremacy()
    const { tabs, activeTabID, setActiveTabID, prevTab, nextTab } = usePageTabs()

    const faction = useMemo(() => {
        return getFaction(factionID)
    }, [factionID, getFaction])

    if (tabs.length <= 0) {
        return null
    }

    return (
        <Stack
            alignItems="center"
            justifyContent="center"
            sx={{
                padding: "2rem",
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
