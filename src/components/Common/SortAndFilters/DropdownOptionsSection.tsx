import { MenuItem, Select, Stack, Typography } from "@mui/material"
import { useState } from "react"
import { ClipThing } from "../.."
import { colors } from "../../../theme/theme"
import { Section } from "./Section"

export interface DropdownOptions {
    label: string
    options: {
        label: string
        value: string
    }[]
    initialSelected: string
    onSetSelected: (value: string) => void
}

export const DropdownOptionsSection = ({
    dropdownOptions,
    primaryColor,
    secondaryColor,
    backgroundColor,
    changePage,
}: {
    dropdownOptions: DropdownOptions
    primaryColor: string
    secondaryColor: string
    backgroundColor: string
    changePage: (page: number) => void
}) => {
    const { label, options, initialSelected, onSetSelected } = dropdownOptions
    const [selected, setSelected] = useState<string>(initialSelected)

    return (
        <Section label={label} primaryColor={primaryColor} secondaryColor={secondaryColor}>
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
                                backgroundColor: primaryColor,
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
                        value={selected}
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
                        {options.map((x, i) => {
                            return (
                                <MenuItem
                                    key={x.value + i}
                                    value={x.value}
                                    onClick={() => {
                                        setSelected(x.value)
                                        onSetSelected(x.value)
                                        changePage(1)
                                    }}
                                    sx={{ "&:hover": { backgroundColor: "#FFFFFF20" } }}
                                >
                                    <Typography textTransform="uppercase">{x.label}</Typography>
                                </MenuItem>
                            )
                        })}
                    </Select>
                </Stack>
            </ClipThing>
        </Section>
    )
}
