import { Box, MenuItem, Select, Stack, TextField, Typography } from "@mui/material"
import { ReactNode, useCallback, useEffect, useState } from "react"
import { ClipThing, FancyButton } from ".."
import { SvgSearch } from "../../assets"
import { useTheme } from "../../containers/theme"
import { useDebounce } from "../../hooks"
import { colors, fonts } from "../../theme/theme"
import { SortType } from "../../types/marketplace"

const sortOptions: SortType[] = [SortType.OldestFirst, SortType.NewestFirst, SortType.Alphabetical, SortType.AlphabeticalReverse]

export interface FilterSection {
    label: string
    options: {
        label: string
        color: string
    }[]
    initialSelected: string[]
    onSetFilter: React.Dispatch<React.SetStateAction<string[]>>
}

interface SortAndFiltersProps {
    initialSearch: string
    onSetSearch: React.Dispatch<React.SetStateAction<string>>
    initialSort: SortType
    onSetSort: React.Dispatch<React.SetStateAction<SortType>>
    filters?: FilterSection[]
}

export const SortAndFilters = ({ initialSearch, onSetSearch, initialSort, onSetSort, filters }: SortAndFiltersProps) => {
    const theme = useTheme()
    const [searchValue, setSearchValue] = useState(initialSearch)
    const [sortValue, setSortValue] = useState<SortType>(initialSort)

    const primaryColor = theme.factionTheme.primary
    const secondaryColor = theme.factionTheme.secondary
    const backgroundColor = theme.factionTheme.background

    return (
        <ClipThing
            clipSize="10px"
            border={{
                borderColor: theme.factionTheme.primary,
                borderThickness: ".3rem",
            }}
            corners={{
                topRight: true,
                bottomLeft: true,
                bottomRight: true,
            }}
            opacity={0.7}
            backgroundColor={theme.factionTheme.background}
            sx={{ height: "100%", minWidth: "30rem", maxWidth: "43rem" }}
        >
            <Stack sx={{ position: "relative", height: "100%", mt: "-.3rem", mx: "-.3rem" }}>
                <Section label="SEARCH" primaryColor={primaryColor} secondaryColor={secondaryColor}>
                    <Stack direction="row" spacing=".5rem">
                        <ClipThing
                            clipSize="5px"
                            clipSlantSize="2px"
                            opacity={0.9}
                            border={{
                                borderColor: primaryColor,
                                borderThickness: "1px",
                            }}
                            backgroundColor={backgroundColor}
                            sx={{ height: "100%", flex: 1 }}
                        >
                            <Stack sx={{ height: "100%" }}>
                                <TextField
                                    variant="outlined"
                                    hiddenLabel
                                    fullWidth
                                    placeholder="Enter keyword..."
                                    sx={{
                                        backgroundColor: "unset",
                                        ".MuiOutlinedInput-input": {
                                            px: "1.5rem",
                                            py: ".5rem",
                                            height: "unset",
                                            "::-webkit-outer-spin-button, ::-webkit-inner-spin-button": {
                                                "-webkit-appearance": "none",
                                            },
                                            borderRadius: 0.5,
                                            border: `${primaryColor}50 2px solid`,
                                            ":hover, :focus, :active": { backgroundColor: "#00000080", border: `${primaryColor}99 2px solid` },
                                        },
                                        ".MuiOutlinedInput-notchedOutline": { border: "unset" },
                                    }}
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                                        e.stopPropagation()
                                        switch (e.key) {
                                            case "Enter": {
                                                e.preventDefault()
                                                onSetSearch(searchValue)
                                                break
                                            }
                                        }
                                    }}
                                />
                            </Stack>
                        </ClipThing>

                        <Box sx={{ py: ".1rem" }}>
                            <FancyButton
                                excludeCaret
                                clipThingsProps={{
                                    clipSize: "5px",
                                    clipSlantSize: "2px",
                                    backgroundColor: primaryColor,
                                    opacity: 1,
                                    border: { isFancy: true, borderColor: primaryColor, borderThickness: "1px" },
                                    sx: { position: "relative", width: "4.5rem", height: "100%" },
                                }}
                                sx={{ py: ".6rem", color: secondaryColor, minWidth: 0, height: "100%" }}
                                onClick={() => onSetSearch(searchValue)}
                            >
                                <SvgSearch size="1.4rem" fill={secondaryColor} sx={{ pt: ".1rem" }} />
                            </FancyButton>
                        </Box>
                    </Stack>
                </Section>

                <Section label="SORT" primaryColor={primaryColor} secondaryColor={secondaryColor}>
                    <ClipThing
                        clipSize="5px"
                        clipSlantSize="2px"
                        opacity={0.9}
                        border={{
                            borderColor: primaryColor,
                            borderThickness: "1px",
                        }}
                        backgroundColor={backgroundColor}
                    >
                        <Stack sx={{ height: "100%" }}>
                            <Select
                                sx={{
                                    width: "100%",
                                    px: "1rem",
                                    py: ".5rem",
                                    borderRadius: 0.5,
                                    "&:hover": {
                                        backgroundColor: colors.darkNavy,
                                    },
                                    "& .MuiSelect-outlined": { px: ".8rem", pt: ".48rem", pb: 0 },
                                    ".MuiOutlinedInput-notchedOutline": {
                                        border: "none !important",
                                    },
                                }}
                                value={sortValue}
                                MenuProps={{
                                    variant: "menu",
                                    sx: {
                                        "&& .Mui-selected": {
                                            color: secondaryColor,
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
                                            key={x + i}
                                            value={x}
                                            onClick={() => {
                                                setSortValue(x)
                                                onSetSort(x)
                                            }}
                                            sx={{ "&:hover": { backgroundColor: "#FFFFFF20" } }}
                                        >
                                            <Typography textTransform="uppercase">{x}</Typography>
                                        </MenuItem>
                                    )
                                })}
                            </Select>
                        </Stack>
                    </ClipThing>
                </Section>

                {!!filters &&
                    filters.length > 0 &&
                    filters.map((f, i) => <FilterSection key={i} filter={f} primaryColor={primaryColor} secondaryColor={secondaryColor} />)}
            </Stack>
        </ClipThing>
    )
}

const Section = ({ label, primaryColor, secondaryColor, children }: { label: string; primaryColor: string; secondaryColor: string; children: ReactNode }) => {
    return (
        <Box>
            <ClipThing
                clipSize="10px"
                border={{
                    isFancy: true,
                    borderColor: primaryColor,
                    borderThickness: ".25rem",
                }}
                corners={{
                    topRight: true,
                }}
                opacity={0.8}
                backgroundColor={primaryColor}
            >
                <Stack sx={{ height: "100%", px: "1.4rem", pt: ".7rem", pb: ".6rem" }}>
                    <Typography variant="caption" sx={{ color: secondaryColor, fontFamily: fonts.nostromoBlack }}>
                        {label}
                    </Typography>
                </Stack>
            </ClipThing>

            <Box sx={{ px: "1.4rem", pt: "1.5rem", pb: "2.1rem" }}>{children}</Box>
        </Box>
    )
}

const FilterSection = ({ filter, primaryColor, secondaryColor }: { filter: FilterSection; primaryColor: string; secondaryColor: string }) => {
    const { label, options, initialSelected, onSetFilter } = filter
    const [selectedOptions, setSelectedOptions, selectedOptionsInstant] = useDebounce<string[]>(initialSelected, 900)

    useEffect(() => {
        onSetFilter(selectedOptions)
    }, [onSetFilter, selectedOptions])

    const onSelect = useCallback(
        (option: string) => {
            setSelectedOptions((prev) => (prev.includes(option) ? prev.filter((r) => r !== option) : prev.concat(option)))
        },
        [setSelectedOptions],
    )

    if (!options || options.length <= 0) return null

    return (
        <Section label={label} primaryColor={primaryColor} secondaryColor={secondaryColor}>
            <Stack direction="row" flexWrap="wrap">
                {options.map((o, i) => {
                    const { label, color } = o
                    const isSelected = selectedOptionsInstant.includes(label)
                    return (
                        <Box key={i} sx={{ p: ".4rem" }}>
                            <FancyButton
                                excludeCaret
                                clipThingsProps={{
                                    clipSize: "9px",
                                    backgroundColor: isSelected ? color : "#000000",
                                    opacity: isSelected ? 1 : 0.6,
                                    border: { borderColor: color, borderThickness: "1px" },
                                    sx: { position: "relative" },
                                }}
                                sx={{ px: "1rem", py: ".2rem", color: isSelected ? "#FFFFFF" : color }}
                                onClick={() => onSelect(label)}
                            >
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: isSelected ? "#FFFFFF" : color,
                                        fontFamily: fonts.nostromoBold,
                                    }}
                                >
                                    {label}
                                </Typography>
                            </FancyButton>
                        </Box>
                    )
                })}
            </Stack>
        </Section>
    )
}
