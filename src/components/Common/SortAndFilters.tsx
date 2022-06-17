import { Box, InputAdornment, MenuItem, Select, Stack, TextField, Typography } from "@mui/material"
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react"
import { ClipThing, FancyButton } from ".."
import { SvgSearch, SvgSupToken } from "../../assets"
import { useTheme } from "../../containers/theme"
import { useDebounce } from "../../hooks"
import { colors, fonts } from "../../theme/theme"
import { SortType } from "../../types/marketplace"

const sortOptions: SortType[] = [
    SortType.OldestFirst,
    SortType.NewestFirst,
    SortType.ExpiringFirst,
    SortType.ExpiringReverse,
    SortType.PriceLowest,
    SortType.PriceHighest,
    SortType.Alphabetical,
    SortType.AlphabeticalReverse,
]

export interface ChipFilter {
    label: string
    options: {
        label: string
        value: string
        color: string
        textColor?: string
    }[]
    initialSelected: string[]
    onSetSelected: React.Dispatch<React.SetStateAction<string[]>>
}

export interface RangeFilter {
    label: string
    initialValue: (number | undefined)[]
    onSetValue: React.Dispatch<React.SetStateAction<(number | undefined)[]>>
}

interface SortAndFiltersProps {
    initialSearch: string
    onSetSearch: React.Dispatch<React.SetStateAction<string>>
    initialSort: SortType
    onSetSort: React.Dispatch<React.SetStateAction<SortType>>
    chipFilters?: ChipFilter[]
    rangeFilters?: RangeFilter[]
}

export const SortAndFilters = ({ initialSearch, onSetSearch, initialSort, onSetSort, chipFilters, rangeFilters }: SortAndFiltersProps) => {
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
            sx={{ height: "100%", minWidth: "30rem", maxWidth: "38rem" }}
        >
            <Box
                sx={{
                    height: "100%",
                    overflowY: "auto",
                    overflowX: "hidden",
                    direction: "ltr",
                    scrollbarWidth: "none",
                    "::-webkit-scrollbar": {
                        width: ".4rem",
                    },
                    "::-webkit-scrollbar-track": {
                        background: "#FFFFFF15",
                        borderRadius: 3,
                    },
                    "::-webkit-scrollbar-thumb": {
                        background: (theme) => theme.factionTheme.primary,
                        borderRadius: 3,
                    },
                }}
            >
                <Stack sx={{ position: "relative", height: 0, mt: "-.3rem", mx: "-.3rem" }}>
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
                                        placeholder="Enter keywords..."
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

                    <Section label="SORT BY" primaryColor={primaryColor} secondaryColor={secondaryColor}>
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
                                        borderRadius: 0.5,
                                        "&:hover": {
                                            backgroundColor: colors.darkNavy,
                                        },
                                        ".MuiTypography-root": {
                                            px: "1rem",
                                            py: ".5rem",
                                        },
                                        "& .MuiSelect-outlined": { px: ".8rem", pt: ".2rem", pb: 0 },
                                        ".MuiOutlinedInput-notchedOutline": {
                                            border: "none !important",
                                        },
                                    }}
                                    value={sortValue}
                                    MenuProps={{
                                        variant: "menu",
                                        sx: {
                                            "&& .Mui-selected": {
                                                ".MuiTypography-root": {
                                                    color: secondaryColor,
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

                    {!!chipFilters &&
                        chipFilters.length > 0 &&
                        chipFilters.map((f, i) => <ChipFilterSection key={i} filter={f} primaryColor={primaryColor} secondaryColor={secondaryColor} />)}

                    {!!rangeFilters &&
                        rangeFilters.length > 0 &&
                        rangeFilters.map((f, i) => <RangeFilterSection key={i} filter={f} primaryColor={primaryColor} secondaryColor={secondaryColor} />)}
                </Stack>
            </Box>
        </ClipThing>
    )
}

const Section = ({
    label,
    primaryColor,
    secondaryColor,
    children,
    endComponent,
}: {
    label: string
    primaryColor: string
    secondaryColor: string
    children: ReactNode
    endComponent?: ReactNode
}) => {
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
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ height: "100%", px: "1.4rem", pt: ".7rem", pb: ".6rem" }}>
                    <Typography variant="caption" sx={{ color: secondaryColor, fontFamily: fonts.nostromoBlack }}>
                        {label}
                    </Typography>
                    {endComponent}
                </Stack>
            </ClipThing>

            <Box sx={{ px: "2rem", pt: "1.8rem", pb: "2.2rem" }}>{children}</Box>
        </Box>
    )
}

const ChipFilterSection = ({ filter, primaryColor, secondaryColor }: { filter: ChipFilter; primaryColor: string; secondaryColor: string }) => {
    const { label, options, initialSelected, onSetSelected } = filter
    const [selectedOptions, setSelectedOptions, selectedOptionsInstant, setSelectedOptionsInstant] = useDebounce<string[]>(initialSelected, 700)

    // Set the value on the parent
    useEffect(() => {
        onSetSelected(selectedOptions)
    }, [onSetSelected, selectedOptions])

    const onSelect = useCallback(
        (option: string) => {
            setSelectedOptions((prev) => (prev.includes(option) ? prev.filter((r) => r !== option) : prev.concat(option)))
        },
        [setSelectedOptions],
    )

    const resetButton = useMemo(() => {
        if (selectedOptions.length <= 0) return null

        return (
            <FancyButton
                clipThingsProps={{
                    clipSize: "7px",
                    opacity: 1,
                    sx: { position: "relative" },
                }}
                sx={{ px: "1.2rem", pt: ".0rem", pb: ".2rem", color: secondaryColor }}
                onClick={() => setSelectedOptionsInstant([])}
            >
                <Typography
                    sx={{
                        color: secondaryColor,
                        fontSize: "1.1rem",
                        fontWeight: "fontWeightBold",
                        opacity: 0.7,
                    }}
                >
                    RESET FILTER
                </Typography>
            </FancyButton>
        )
    }, [secondaryColor, selectedOptions.length, setSelectedOptionsInstant])

    if (!options || options.length <= 0) return null

    return (
        <Section label={label} primaryColor={primaryColor} secondaryColor={secondaryColor} endComponent={resetButton}>
            <Stack direction="row" flexWrap="wrap">
                {options.map((o, i) => {
                    const { label, value, color, textColor } = o
                    const isSelected = selectedOptionsInstant.includes(value)
                    return (
                        <Box key={i} sx={{ p: ".4rem" }}>
                            <FancyButton
                                clipThingsProps={{
                                    clipSize: "9px",
                                    backgroundColor: isSelected ? color : "#000000",
                                    opacity: isSelected ? 1 : 0.6,
                                    border: { borderColor: color, borderThickness: "1px" },
                                    sx: { position: "relative" },
                                }}
                                sx={{ px: "1rem", py: ".2rem", color: isSelected ? "#FFFFFF" : color }}
                                onClick={() => onSelect(value)}
                            >
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: isSelected ? textColor || "#FFFFFF" : color,
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

const RangeFilterSection = ({ filter, primaryColor, secondaryColor }: { filter: RangeFilter; primaryColor: string; secondaryColor: string }) => {
    const { label, initialValue, onSetValue } = filter
    const [value, setValue, valueInstant, setValueInstant] = useDebounce<(number | undefined)[]>(initialValue, 700)

    // Set the value on the parent
    useEffect(() => {
        onSetValue(value)
    }, [onSetValue, value])

    const handleChange = useCallback(
        (newValue: number, index: number) => {
            setValue((prev) => {
                const newArray = [...prev]
                newArray[index] = newValue ? newValue : undefined
                return newArray
            })
        },
        [setValue],
    )

    const resetButton = useMemo(() => {
        if (value[0] === undefined && value[1] === undefined) return null

        return (
            <FancyButton
                clipThingsProps={{
                    clipSize: "8px",
                    opacity: 1,
                    sx: { position: "relative" },
                }}
                sx={{ px: "1.2rem", pt: ".0rem", pb: ".2rem", color: secondaryColor }}
                onClick={() => setValueInstant([undefined, undefined])}
            >
                <Typography
                    variant="caption"
                    sx={{
                        color: secondaryColor,
                        fontSize: "1.1rem",
                        fontFamily: fonts.nostromoBlack,
                        opacity: 0.7,
                    }}
                >
                    RESET FILTER
                </Typography>
            </FancyButton>
        )
    }, [secondaryColor, setValueInstant, value])

    return (
        <Section label={label} primaryColor={primaryColor} secondaryColor={secondaryColor} endComponent={resetButton}>
            <Stack direction="row" spacing="1rem" alignItems="center" sx={{ px: ".4rem" }}>
                <NumberInput value={valueInstant[0]} setValue={(newValue: number) => handleChange(newValue, 0)} primaryColor={primaryColor} />
                <Typography>TO</Typography>
                <NumberInput value={valueInstant[1]} setValue={(newValue: number) => handleChange(newValue, 1)} primaryColor={primaryColor} />
            </Stack>
        </Section>
    )
}

const NumberInput = ({ value, setValue, primaryColor }: { value: number | undefined; setValue: (newValue: number) => void; primaryColor: string }) => {
    return (
        <TextField
            variant="outlined"
            hiddenLabel
            placeholder="ANY"
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SvgSupToken fill={colors.yellow} size="1.9rem" />
                    </InputAdornment>
                ),
            }}
            sx={{
                backgroundColor: "#00000090",
                ".MuiOutlinedInput-root": { borderRadius: 0.5, border: `${primaryColor}99 2px dashed` },
                ".MuiOutlinedInput-input": {
                    px: "1.5rem",
                    py: ".6rem",
                    fontSize: "1.7rem",
                    height: "unset",
                    "::-webkit-outer-spin-button, ::-webkit-inner-spin-button": {
                        "-webkit-appearance": "none",
                    },
                },
                ".MuiOutlinedInput-notchedOutline": { border: "unset" },
            }}
            type="number"
            value={value || ""}
            onChange={(e) => {
                const value = parseInt(e.target.value)
                setValue(value)
            }}
        />
    )
}
