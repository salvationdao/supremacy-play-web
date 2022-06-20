import { MenuItem, Select, Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { useTheme } from "../../../containers/theme"
import { colors } from "../../../theme/theme"
import { ClipThing } from "../../Common/ClipThing"
import { QuestionSection } from "./QuestionSection"

export const listingDurations: {
    label: string
    value: number
}[] = [
    { label: "12 Hours", value: 12 },
    { label: "1 Day", value: 24 },
    { label: "3 Days", value: 72 },
    { label: "7 Days", value: 168 },
]

export const ListingDurationSelect = ({
    listingDuration,
    setListingDuration,
}: {
    listingDuration: number
    setListingDuration: React.Dispatch<React.SetStateAction<number>>
}) => {
    const theme = useTheme()

    const listingDurationLabel = useMemo(() => listingDurations.find((i) => i.value === listingDuration)?.label, [listingDuration])

    const primaryColor = theme.factionTheme.primary
    const secondaryColor = theme.factionTheme.secondary
    const backgroundColor = theme.factionTheme.background

    return (
        <QuestionSection primaryColor={primaryColor} question="Duration" description="You can choose how long you want this listing to be available.">
            <ClipThing
                clipSize="5px"
                clipSlantSize="2px"
                opacity={0.9}
                border={{
                    borderColor: primaryColor,
                    borderThickness: "1.5px",
                }}
                backgroundColor={backgroundColor}
                sx={{ flex: 1 }}
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
                                px: "2.4rem",
                                py: "1.1rem",
                            },
                            "& .MuiSelect-outlined": { p: 0 },
                            ".MuiOutlinedInput-notchedOutline": {
                                border: "none !important",
                            },
                        }}
                        displayEmpty
                        value={listingDuration}
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
                        renderValue={(x) => {
                            return (
                                <Typography textTransform="uppercase" variant="h6" sx={{ opacity: x ? 1 : 0.7 }}>
                                    {listingDurationLabel || "CHOOSE A LISTING DURATION"}
                                </Typography>
                            )
                        }}
                    >
                        <MenuItem disabled value="">
                            <Typography textTransform="uppercase" variant="h6">
                                CHOOSE A LISTING DURATION
                            </Typography>
                        </MenuItem>
                        {listingDurations.map((x, i) => {
                            return (
                                <MenuItem
                                    key={x.value + i}
                                    value={x.value}
                                    onClick={() => {
                                        setListingDuration(x.value)
                                    }}
                                    sx={{ "&:hover": { backgroundColor: "#FFFFFF20" } }}
                                >
                                    <Typography textTransform="uppercase" variant="h6">
                                        {x.label}
                                    </Typography>
                                </MenuItem>
                            )
                        })}
                    </Select>
                </Stack>
            </ClipThing>
        </QuestionSection>
    )
}
