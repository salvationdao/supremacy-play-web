import { Box, Divider, IconButton, MenuItem, Select, Stack, Typography } from "@mui/material"
import { SvgGridView, SvgListView, SvgRefresh } from "../../assets"
import { colors, fonts } from "../../theme/theme"

interface TotalAndPageSizeOptionsProps {
    countItems?: number
    totalItems: number
    pageSize: number
    pageSizeOptions?: number[]
    isGridView?: boolean
    setPageSize: (value: number) => void
    changePage: (value: number) => void
    toggleIsGridView?: (value: boolean) => void
    manualRefresh?: () => void
    sortOptions?: {
        label: string
        value: string
    }[]
    selectedSort?: string
    onSetSort?: React.Dispatch<React.SetStateAction<string>>
}

export const TotalAndPageSizeOptions = ({
    countItems,
    totalItems,
    pageSize,
    pageSizeOptions = [5, 10, 20],
    isGridView,
    setPageSize,
    changePage,
    toggleIsGridView,
    manualRefresh,
    sortOptions,
    selectedSort,
    onSetSort,
}: TotalAndPageSizeOptionsProps) => {
    return (
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
                pl: "1.5rem",
                pr: ".5rem",
                py: ".3rem",
                backgroundColor: "#00000070",
                borderBottom: (theme) => `${theme.factionTheme.primary}70 1.5px solid`,
                span: { fontFamily: fonts.nostromoBold },
                strong: { fontFamily: fonts.nostromoBlack },
            }}
        >
            <Typography variant="caption" sx={{ lineHeight: 1 }}>
                <strong>DISPLAYING:</strong> {countItems || 0} OF {totalItems}
            </Typography>

            <Stack
                direction="row"
                spacing="1rem"
                alignItems="center"
                divider={<Divider orientation="vertical" sx={{ height: "unset", alignSelf: "stretch", my: ".4rem !important" }} />}
                sx={{
                    "& .MuiIconButton-root": {
                        minWidth: "3rem",
                        borderRadius: 0.8,
                        fontFamily: fonts.nostromoBold,
                        ".Mui-selected": {
                            color: (theme) => theme.factionTheme.secondary,
                            backgroundColor: (theme) => `${theme.factionTheme.primary} !important`,
                        },
                    },
                }}
            >
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

                <Stack direction="row" spacing=".6rem" alignItems="center">
                    {pageSizeOptions.map((size, i) => {
                        return (
                            <IconButton
                                key={i}
                                sx={{
                                    color: (theme) => (pageSize === size ? `${theme.factionTheme.secondary} !important` : "#FFFFFF60 !important"),
                                    backgroundColor: (theme) => (pageSize === size ? `${theme.factionTheme.primary} !important` : "unset"),
                                }}
                                size="small"
                                onClick={() => {
                                    setPageSize(size)
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

                {sortOptions && selectedSort && onSetSort && (
                    <Stack direction="row" alignItems="center" spacing=".6rem">
                        <Typography variant="caption">SORT:</Typography>

                        <Select
                            sx={{
                                width: "100%",
                                borderRadius: 0.5,
                                "&:hover": {
                                    backgroundColor: (theme) => theme.factionTheme.primary,
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
                                            color: (theme) => theme.factionTheme.secondary,
                                        },
                                        backgroundColor: (theme) => theme.factionTheme.primary,
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
                                            changePage(1)
                                        }}
                                        sx={{ "&:hover": { backgroundColor: "#FFFFFF20" } }}
                                    >
                                        <Typography variant="body1" textTransform="uppercase">
                                            {x.label}
                                        </Typography>
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
}
