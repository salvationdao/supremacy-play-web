import { MenuItem, Select, Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { useTheme } from "../../../containers/theme"
import { colors } from "../../../theme/theme"
import { ClipThing } from "../../Common/ClipThing"
import { QuestionSection } from "./QuestionSection"

//these values are in terms of hours
export enum ListingDurationHoursEnum {
    "HalfDay" = 12,
    "OneDay" = 24,
    "ThreeDays" = 72,
    "OneWeek" = 168,
    "OneMonth" = 720,
}

export const listingDurations: {
    label: string
    value: number
}[] = [
    { label: "12 Hours", value: ListingDurationHoursEnum.HalfDay },
    { label: "1 Day", value: ListingDurationHoursEnum.OneDay },
    { label: "3 Days", value: ListingDurationHoursEnum.ThreeDays },
    { label: "7 Days", value: ListingDurationHoursEnum.OneWeek },
    { label: "30 Days", value: ListingDurationHoursEnum.OneMonth },
]

export const ListingDurationSelect = ({
    listingDurationHours,
    setListingDurationHours,
}: {
    listingDurationHours: ListingDurationHoursEnum
    setListingDurationHours: React.Dispatch<React.SetStateAction<ListingDurationHoursEnum>>
}) => {
    const theme = useTheme()

    const listingDurationLabel = useMemo(() => listingDurations.find((i) => i.value === listingDurationHours)?.label, [listingDurationHours])

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
                        value={listingDurationHours}
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
                                        setListingDurationHours(x.value)
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
