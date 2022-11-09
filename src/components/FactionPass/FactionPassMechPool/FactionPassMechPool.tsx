import { Box, Stack, Typography } from "@mui/material"
import { useMemo, useState } from "react"
import { SvgFilter, SvgGridView, SvgListView, SvgSearch } from "../../../assets"
import { useAuth, useSupremacy } from "../../../containers"
import { parseString } from "../../../helpers"
import { usePagination, useToggle } from "../../../hooks"
import { fonts } from "../../../theme/theme"
import { SortTypeLabel } from "../../../types/marketplace"
import { NavTabs } from "../../Common/NavTabs/NavTabs"
import { usePageTabs } from "../../Common/NavTabs/usePageTabs"
import { NiceButton } from "../../Common/Nice/NiceButton"
import { NiceButtonGroup } from "../../Common/Nice/NiceButtonGroup"
import { NiceSelect } from "../../Common/Nice/NiceSelect"
import { NiceTextField } from "../../Common/Nice/NiceTextField"

const sortOptions = [
    { label: SortTypeLabel.MechQueueAsc, value: SortTypeLabel.MechQueueAsc },
    { label: SortTypeLabel.MechQueueDesc, value: SortTypeLabel.MechQueueDesc },
    { label: SortTypeLabel.Alphabetical, value: SortTypeLabel.Alphabetical },
    { label: SortTypeLabel.AlphabeticalReverse, value: SortTypeLabel.AlphabeticalReverse },
    { label: SortTypeLabel.RarestAsc, value: SortTypeLabel.RarestAsc },
    { label: SortTypeLabel.RarestDesc, value: SortTypeLabel.RarestDesc },
]

const pageSizeOptions = [
    { label: "10", value: 10 },
    { label: "20", value: 20 },
    { label: "40", value: 40 },
]

const layoutOptions = [
    { label: "", value: true, svg: <SvgGridView size="1.5rem" /> },
    { label: "", value: false, svg: <SvgListView size="1.5rem" /> },
]

export const FactionPassMechPool = () => {
    const { factionID } = useAuth()
    const { getFaction } = useSupremacy()
    const { tabs, activeTabID, setActiveTabID, prevTab, nextTab } = usePageTabs()

    // Filter, search, pagination
    const [showFilters, toggleShowFilters] = useToggle()
    const [search, setSearch] = useState("")
    const [sort, setSort] = useState<string>(SortTypeLabel.MechQueueAsc)
    const [isGridView, toggleIsGridView] = useToggle(true)
    const { page, changePage, totalItems, setTotalItems, totalPages, pageSize, changePageSize } = usePagination({
        pageSize: 10,
        page: 1,
    })

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

                {/* Page size options */}
                <NiceButtonGroup
                    primaryColor={faction.primary_color}
                    secondaryColor={faction.secondary_color}
                    options={pageSizeOptions}
                    selected={pageSize}
                    onSelected={(value) => changePageSize(parseString(value, 1))}
                />

                {/* Page layout options */}
                <NiceButtonGroup
                    primaryColor={faction.primary_color}
                    secondaryColor={faction.secondary_color}
                    options={layoutOptions}
                    selected={isGridView}
                    onSelected={(value) => toggleIsGridView(value)}
                />

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
                    options={sortOptions}
                    selected={sort}
                    onSelected={(value) => setSort(`${value}`)}
                    sx={{ minWidth: "26rem" }}
                />
            </Stack>
        </Stack>
    )
}
