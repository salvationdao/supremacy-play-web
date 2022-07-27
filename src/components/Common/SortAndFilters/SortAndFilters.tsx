import { Box, Collapse, Stack, TextField } from "@mui/material"
import { ReactNode, useState } from "react"
import { ClipThing, FancyButton } from "../.."
import { SvgSearch } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { ChipFilter, ChipFilterSection } from "./ChipFilterSection"
import { DropdownOptions, DropdownOptionsSection } from "./DropdownOptionsSection"
import { RangeFilter, RangeFilterSection } from "./RangeFilterSection"
import { Section } from "./Section"
import { SliderRangeFilter, SliderRangeFilterSection } from "./SliderRangeFilterSection"

interface SortAndFiltersProps {
    initialSearch?: string
    onSetSearch?: React.Dispatch<React.SetStateAction<string>>
    dropdownOptions?: DropdownOptions[]
    chipFilters?: ChipFilter[]
    rangeFilters?: RangeFilter[]
    sliderRangeFilters?: SliderRangeFilter[]
    changePage: (page: number) => void
    primaryColor?: string
    children?: ReactNode
    isExpanded?: boolean
}

export const SortAndFilters = ({
    initialSearch,
    onSetSearch,
    dropdownOptions,
    chipFilters,
    rangeFilters,
    sliderRangeFilters,
    changePage,
    primaryColor: pColor,
    children,
    isExpanded = true,
}: SortAndFiltersProps) => {
    const theme = useTheme()
    const [searchValue, setSearchValue] = useState(initialSearch || "")

    const primaryColor = pColor || theme.factionTheme.primary
    const secondaryColor = theme.factionTheme.secondary
    const backgroundColor = theme.factionTheme.background

    return (
        <Collapse in={isExpanded} orientation="horizontal">
            <ClipThing
                clipSize="10px"
                border={{
                    borderColor: primaryColor,
                    borderThickness: ".3rem",
                }}
                corners={{
                    topRight: true,
                    bottomLeft: true,
                    bottomRight: true,
                }}
                opacity={0.7}
                backgroundColor={backgroundColor}
                sx={{ height: "100%", width: "38rem", mr: "1rem" }}
            >
                <Stack sx={{ height: "100%" }}>
                    <Box
                        sx={{
                            flex: 1,
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
                                background: primaryColor,
                                borderRadius: 3,
                            },
                        }}
                    >
                        <Stack sx={{ position: "relative", height: 0, mt: "-.3rem", mx: "-.3rem" }}>
                            {onSetSearch && (
                                <Section label="SEARCH" primaryColor={primaryColor} secondaryColor={secondaryColor} initialExpanded={true}>
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
                                                                changePage(1)
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
                                                onClick={() => {
                                                    onSetSearch(searchValue)
                                                    changePage(1)
                                                }}
                                            >
                                                <SvgSearch size="1.4rem" fill={secondaryColor} sx={{ pt: ".1rem" }} />
                                            </FancyButton>
                                        </Box>
                                    </Stack>
                                </Section>
                            )}

                            {!!dropdownOptions &&
                                dropdownOptions.length > 0 &&
                                dropdownOptions.map((d, i) => (
                                    <DropdownOptionsSection
                                        key={i}
                                        dropdownOptions={d}
                                        primaryColor={primaryColor}
                                        secondaryColor={secondaryColor}
                                        backgroundColor={backgroundColor}
                                        changePage={changePage}
                                    />
                                ))}

                            {!!chipFilters &&
                                chipFilters.length > 0 &&
                                chipFilters.map((f, i) => <ChipFilterSection key={i} filter={f} primaryColor={primaryColor} secondaryColor={secondaryColor} />)}

                            {!!rangeFilters &&
                                rangeFilters.length > 0 &&
                                rangeFilters.map((f, i) => (
                                    <RangeFilterSection key={i} filter={f} primaryColor={primaryColor} secondaryColor={secondaryColor} />
                                ))}

                            {!!sliderRangeFilters &&
                                sliderRangeFilters.length > 0 &&
                                sliderRangeFilters.map((f, i) => (
                                    <SliderRangeFilterSection key={i} filter={f} primaryColor={primaryColor} secondaryColor={secondaryColor} />
                                ))}
                        </Stack>
                    </Box>

                    {children}
                </Stack>
            </ClipThing>
        </Collapse>
    )
}
