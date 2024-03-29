import { Box, Button, Checkbox, Divider, IconButton, MenuItem, Select, Stack, Typography } from "@mui/material"
import React, { ReactNode } from "react"
import { SvgFilter, SvgGridView, SvgListView, SvgRefresh } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { colors, fonts } from "../../../theme/theme"

interface TotalAndPageSizeOptionsProps {
    countItems?: number
    totalItems?: number
    pageSize?: number
    pageSizeOptions?: number[]
    changePageSize?: (value: number) => void
    changePage?: (value: number) => void
    isGridView?: boolean
    toggleIsGridView?: (value: boolean) => void
    manualRefresh?: () => void
    primaryColor?: string
    isFiltersExpanded?: boolean
    toggleIsFiltersExpanded?: (value?: boolean) => void
    sortOptions?: {
        label: string
        value: string
    }[]
    selectedSort?: string
    onSetSort?: React.Dispatch<React.SetStateAction<string>>
    hidePageSizeOptions?: boolean
    selectedCount?: number
    onSelectAll?: () => void
    onUnselectedAll?: () => void
    children?: ReactNode
}

// Pick and include the props you need
export const TotalAndPageSizeOptions = React.memo(function TotalAndPageSizeOptions({
    // Count of items on current page
    countItems,

    // Total items there is
    totalItems,

    // Pagination
    pageSize,
    pageSizeOptions = [5, 10, 20],
    changePageSize,
    changePage,
    hidePageSizeOptions,

    // Toggle for grid view or not
    isGridView,
    toggleIsGridView,

    // Manual refresh button
    manualRefresh,

    // Toggle between showing or hiding the left filter panel
    isFiltersExpanded,
    toggleIsFiltersExpanded,

    // For bulk selecting items
    selectedCount,
    onSelectAll,
    onUnselectedAll,

    // Sorting
    sortOptions,
    selectedSort,
    onSetSort,

    // Styles
    primaryColor: pColor,
    children,
}: TotalAndPageSizeOptionsProps) {
    const theme = useTheme()

    const primaryColor = pColor || theme.factionTheme.primary
    const secondaryColor = pColor || theme.factionTheme.text

    return (
        <Stack
            direction="row"
            alignItems="center"
            spacing="1rem"
            sx={{
                pl: "1.5rem",
                pr: ".5rem",
                py: ".3rem",
                height: "4.5rem",
                backgroundColor: "#00000070",
                borderBottom: `${primaryColor}70 1.5px solid`,
                span: { fontFamily: fonts.nostromoBold },
                strong: { fontFamily: fonts.nostromoBlack },
            }}
        >
            {toggleIsFiltersExpanded && (
                <Button
                    variant="contained"
                    onClick={() => toggleIsFiltersExpanded()}
                    sx={{
                        minWidth: 0,
                        borderRadius: 1,
                        backgroundColor: isFiltersExpanded ? primaryColor : "transparent !important",
                        border: `${primaryColor}90 1px solid`,
                        color: secondaryColor,
                        ":hover": { backgroundColor: primaryColor },
                    }}
                >
                    <SvgFilter size="1.2rem" fill={isFiltersExpanded ? secondaryColor : primaryColor} />
                </Button>
            )}

            {/* Showing total items and count */}
            {totalItems && (
                <Typography variant="caption" sx={{ lineHeight: 1 }}>
                    <strong>DISPLAYING:</strong> {countItems || 0} OF {totalItems}
                </Typography>
            )}

            {children && (
                <>
                    <Divider orientation="vertical" sx={{ height: "unset", alignSelf: "stretch", my: ".4rem !important" }} />
                    {children}
                </>
            )}

            <Stack
                direction="row"
                spacing="1rem"
                alignItems="center"
                divider={<Divider orientation="vertical" sx={{ height: "unset", alignSelf: "stretch", my: ".4rem !important" }} />}
                sx={{
                    ml: "auto !important",
                    "& .MuiIconButton-root": {
                        minWidth: "3rem",
                        borderRadius: 0.8,
                        fontFamily: fonts.nostromoBold,
                        ".Mui-selected": {
                            color: (theme) => theme.factionTheme.text,
                            backgroundColor: `${primaryColor} !important`,
                        },
                    },
                }}
            >
                {/* For bulk selecting items */}
                {countItems && onSelectAll && onUnselectedAll && (
                    <Stack spacing="1rem" direction="row" alignItems="center">
                        <Checkbox
                            checked={(selectedCount || 0) >= countItems}
                            indeterminate={!!(selectedCount && selectedCount > 0 && selectedCount < countItems)}
                            onClick={(selectedCount || 0) >= countItems ? onUnselectedAll : onSelectAll}
                        />

                        <Typography variant="caption" sx={{ pt: ".4rem" }}>
                            {selectedCount}
                        </Typography>
                    </Stack>
                )}

                {/* Toggle grid view */}
                {toggleIsGridView && (
                    <Stack direction="row" spacing=".6rem" alignItems="center">
                        <IconButton size="small" onClick={() => toggleIsGridView(false)}>
                            <SvgListView size="1.2rem" sx={{ opacity: isGridView ? 0.3 : 1 }} />
                        </IconButton>
                        <IconButton size="small" onClick={() => toggleIsGridView(true)}>
                            <SvgGridView size="1.2rem" sx={{ opacity: isGridView ? 1 : 0.3 }} />
                        </IconButton>
                    </Stack>
                )}

                {/* Change page size */}
                {!hidePageSizeOptions && changePage && changePageSize && (
                    <Stack direction="row" spacing=".6rem" alignItems="center">
                        {pageSizeOptions.map((size, i) => {
                            return (
                                <IconButton
                                    key={i}
                                    sx={{
                                        color: (theme) => (pageSize === size ? `${theme.factionTheme.text} !important` : "#FFFFFF60 !important"),
                                        backgroundColor: pageSize === size ? `${primaryColor} !important` : "unset",
                                    }}
                                    size="small"
                                    onClick={() => {
                                        changePageSize(size)
                                        changePage(1)
                                    }}
                                >
                                    <Typography variant="caption" sx={{ color: "inherit" }}>
                                        {size}
                                    </Typography>
                                </IconButton>
                            )
                        })}
                    </Stack>
                )}

                {/* Sorting */}
                {sortOptions && selectedSort && onSetSort && (
                    <Stack direction="row" alignItems="center" spacing=".6rem">
                        <Typography variant="caption" sx={{ lineHeight: 1 }}>
                            SORT:
                        </Typography>

                        <Select
                            sx={{
                                width: "100%",
                                backgroundColor: `${theme.factionTheme.primary}50`,
                                borderRadius: 0.5,
                                "&:hover": {
                                    backgroundColor: primaryColor,
                                    ".MuiTypography-root": { color: (theme) => theme.factionTheme.text },
                                },
                                ".MuiTypography-root": {
                                    px: ".1rem",
                                    py: ".2rem",
                                },
                                "& .MuiSelect-outlined": { px: ".8rem", pt: ".2rem", pb: 0 },
                                ".MuiOutlinedInput-notchedOutline": {
                                    border: "none !important",
                                },
                            }}
                            value={selectedSort}
                            MenuProps={{
                                variant: "menu",
                                sx: {
                                    "&& .Mui-selected": {
                                        ".MuiTypography-root": {
                                            color: (theme) => theme.factionTheme.text,
                                        },
                                        backgroundColor: primaryColor,
                                    },
                                },
                                PaperProps: {
                                    sx: {
                                        backgroundColor: colors.darkNavy,
                                        borderRadius: 0.5,
                                    },
                                },
                            }}
                        >
                            {sortOptions.map((x, i) => {
                                return (
                                    <MenuItem
                                        key={x.value + i}
                                        value={x.value}
                                        onClick={() => {
                                            onSetSort(x.value)
                                            changePage && changePage(1)
                                        }}
                                        sx={{ "&:hover": { backgroundColor: "#FFFFFF20" } }}
                                    >
                                        <Typography>{x.label}</Typography>
                                    </MenuItem>
                                )
                            })}
                        </Select>
                    </Stack>
                )}

                {manualRefresh && (
                    <Box>
                        <IconButton size="small" onClick={manualRefresh}>
                            <SvgRefresh size="1.2rem" />
                        </IconButton>
                    </Box>
                )}
            </Stack>
        </Stack>
    )
})
