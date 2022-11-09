import { Box, Stack, Typography } from "@mui/material"
import { useMemo, useState } from "react"
import { SvgFilter, SvgSearch } from "../../../assets"
import { useAuth, useSupremacy } from "../../../containers"
import { useToggle } from "../../../hooks"
import { fonts } from "../../../theme/theme"
import { NavTabs } from "../../Common/NavTabs/NavTabs"
import { usePageTabs } from "../../Common/NavTabs/usePageTabs"
import { NiceButton } from "../../Common/Nice/NiceButton"
import { NiceSelect } from "../../Common/Nice/NiceSelect"
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

            <Stack spacing="1rem" direction="row" alignItems="center" sx={{ overflowX: "auto", overflowY: "hidden", width: "100%", mt: "3rem" }}>
                {/* Filter button */}
                <NiceButton
                    onClick={() => toggleShowFilters()}
                    border={{ color: faction.primary_color }}
                    sx={{ p: ".2rem 1rem", pt: ".4rem" }}
                    background={showFilters}
                >
                    <Typography variant="subtitle1" fontFamily={fonts.nostromoBold} color={showFilters ? faction.secondary_color : "#FFFFFF"}>
                        <SvgFilter inline size="1.5rem" /> FILTER
                    </Typography>
                </NiceButton>

                <Box flex={1} />

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

                {/* Sort */}
                <NiceSelect
                    label="Sort:"
                    primaryColor={faction.primary_color}
                    secondaryColor={faction.secondary_color}
                    options={[
                        { label: "test", value: "test" },
                        { label: "test2", value: "test2" },
                    ]}
                    selected="test"
                    onSelected={(value) => console.log(value)}
                    sx={{ minWidth: "22rem" }}
                />
            </Stack>
        </Stack>
    )
}
