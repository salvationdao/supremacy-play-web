import { Box, Collapse, Drawer, Stack, TextField } from "@mui/material"
import React, { ReactNode, useMemo, useState } from "react"
import { ClipThing, FancyButton } from "../../.."
import { SvgSearch } from "../../../../assets"
import { useTheme } from "../../../../containers/theme"
import { ChipFilter, ChipFilterSection } from "./ChipFilterSection"
import { DropdownOptions, DropdownOptionsSection } from "./DropdownOptionsSection"
import { RangeFilter, RangeFilterSection } from "./RangeFilterSection"
import { Section } from "./Section"
import { SliderRangeFilter, SliderRangeFilterSection } from "./SliderRangeFilterSection"

interface SortAndFiltersProps {
    initialSearch?: string
    onSetSearch?: React.Dispatch<React.SetStateAction<string>>
    changePage?: (page: number) => void
    primaryColor?: string
    children?: ReactNode
    isExpanded?: boolean
    width?: string | number
    drawer?: {
        container?: Element | (() => Element | null) | null
        onClose: () => void
    }
    // Sections
    dropdownOptions?: DropdownOptions[]
    chipFilters?: ChipFilter[]
    rangeFilters?: RangeFilter[]
    sliderRangeFilters?: SliderRangeFilter[]
}

const propsAreEqual = (prevProps: SortAndFiltersProps, nextProps: SortAndFiltersProps) => {
    return (
        prevProps.initialSearch === nextProps.initialSearch &&
        prevProps.isExpanded === nextProps.isExpanded &&
        prevProps.primaryColor === nextProps.primaryColor &&
        prevProps.children === nextProps.children
    )
}

export const SortAndFilters = React.memo(function SortAndFilters({
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
    width = "38rem",
    drawer,
}: SortAndFiltersProps) {
    const theme = useTheme()
    const [searchValue, setSearchValue] = useState(initialSearch || "")

    const primaryColor = pColor || theme.factionTheme.primary
    const secondaryColor = theme.factionTheme.text
    const backgroundColor = theme.factionTheme.u800

    const content = useMemo(
        () => (
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
                sx={{ height: "100%", width, mr: drawer ? 0 : "1rem", opacity: isExpanded ? 1 : 0, transition: "all .2s" }}
            >
                <Stack sx={{ height: "100%" }}>
                    <Box
                        sx={{
                            flex: 1,
                            overflowY: "auto",
                            overflowX: "hidden",
                            direction: "ltr",
                        }}
                    >
                        <Stack sx={{ position: "relative", height: 0, mt: "-.3rem", mx: "-.3rem" }}>
                            {onSetSearch && changePage && (
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
                                                                WebkitAppearance: "none",
                                                            },
                                                            borderRadius: 0.5,
                                                            border: `${primaryColor}50 2px solid`,
                                                            ":hover, :focus, :active": {
                                                                backgroundColor: "#00000080",
                                                                border: `${primaryColor}99 2px solid`,
                                                            },
                                                        },
                                                        ".MuiOutlinedInput-notchedOutline": { border: "unset" },
                                                    }}
                                                    value={searchValue}
                                                    onChange={(e) => {
                                                        e.stopPropagation()
                                                        e.preventDefault()
                                                        setSearchValue(e.target.value)
                                                    }}
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
        ),
        [
            backgroundColor,
            changePage,
            children,
            chipFilters,
            drawer,
            dropdownOptions,
            isExpanded,
            onSetSearch,
            primaryColor,
            rangeFilters,
            searchValue,
            secondaryColor,
            sliderRangeFilters,
            width,
        ],
    )

    return (
        <>
            {drawer ? (
                <Drawer
                    container={drawer.container}
                    anchor="left"
                    open={isExpanded}
                    onClose={() => drawer.onClose()}
                    PaperProps={{
                        sx: {
                            background: "none",
                        },
                    }}
                >
                    {content}
                </Drawer>
            ) : (
                <Collapse in={isExpanded} orientation="horizontal">
                    {content}
                </Collapse>
            )}
        </>
    )
},
propsAreEqual)
