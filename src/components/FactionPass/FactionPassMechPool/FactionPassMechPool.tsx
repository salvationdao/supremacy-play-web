import { InputAdornment, Stack, Typography } from "@mui/material"
import { useMemo, useState } from "react"
import { SvgFilter, SvgSearch } from "../../../assets"
import { useAuth, useSupremacy } from "../../../containers"
import { useToggle } from "../../../hooks"
import { fonts } from "../../../theme/theme"
import { NavTabs } from "../../Common/NavTabs/NavTabs"
import { usePageTabs } from "../../Common/NavTabs/usePageTabs"
import { NiceButton } from "../../Common/Nice/NiceButton"
import { NiceTextField } from "../../Common/Nice/NiceTextField"

export const FactionPassMechPool = () => {
    const { factionID } = useAuth()
    const { getFaction } = useSupremacy()
    const { tabs, activeTabID, setActiveTabID, prevTab, nextTab } = usePageTabs()

    // Filter, search, pagination
    const [showFilters, toggleShowFilters] = useToggle()
    const [search, setSearch] = useState("")

    const faction = useMemo(() => {
        return getFaction(factionID)
    }, [factionID, getFaction])

    if (tabs.length <= 0) {
        return null
    }

    return (
        <Stack
            alignItems="center"
            sx={{
                p: "4rem 5rem",
                mx: "auto",
                position: "relative",
                height: "100%",
                backgroundColor: faction.background_color,
                background: `url()`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
                maxWidth: "190rem",
            }}
        >
            <NavTabs activeTabID={activeTabID} setActiveTabID={setActiveTabID} tabs={tabs} prevTab={prevTab} nextTab={nextTab} />

            <Stack spacing="1rem" direction="row" alignItems="center" sx={{ overflowX: "auto", width: "100%", mt: "3rem" }}>
                {/* Filter button */}
                <NiceButton border={{ color: faction.primary_color }} sx={{ p: ".2rem 1rem", pt: ".4rem" }} background={showFilters}>
                    <Typography
                        variant="subtitle1"
                        fontFamily={fonts.nostromoBold}
                        onClick={() => toggleShowFilters()}
                        color={showFilters ? faction.secondary_color : "#FFFFFF"}
                    >
                        <SvgFilter inline size="1.5rem" /> FILTER
                    </Typography>
                </NiceButton>

                {/* Search bar */}
                <NiceTextField
                    primaryColor={faction.primary_color}
                    value={search}
                    onChange={(value) => setSearch(value)}
                    placeholder="Search..."
                    InputProps={{
                        endAdornment: <SvgSearch size="1.5rem" sx={{ opacity: 0.5 }} />,
                    }}
                />
            </Stack>
        </Stack>
    )
}
