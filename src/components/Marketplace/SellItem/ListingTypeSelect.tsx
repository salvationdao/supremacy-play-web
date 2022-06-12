import { MenuItem, Select, Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { useTheme } from "../../../containers/theme"
import { colors } from "../../../theme/theme"
import { ItemType, ListingType } from "../../../types/marketplace"
import { ClipThing } from "../../Common/ClipThing"
import { QuestionSection } from "./QuestionSection"
import { listingTypes } from "./SellItem"

export const ListingTypeSelect = ({
    itemType,
    listingType,
    setListingType,
}: {
    itemType?: ItemType
    listingType?: ListingType
    setListingType: React.Dispatch<React.SetStateAction<ListingType | undefined>>
}) => {
    const theme = useTheme()

    const listingTypeLabel = useMemo(() => listingTypes.find((i) => i.value === listingType)?.label, [listingType])

    const primaryColor = theme.factionTheme.primary
    const secondaryColor = theme.factionTheme.secondary
    const backgroundColor = theme.factionTheme.background

    return (
        <QuestionSection
            disabled={!itemType}
            primaryColor={primaryColor}
            question="Listing Type"
            description="You can list your item as a buyout, auction, or dutch auction."
        >
            <ClipThing
                clipSize="5px"
                clipSlantSize="2px"
                opacity={0.9}
                border={{
                    borderColor: primaryColor,
                    borderThickness: "1.5px",
                }}
                backgroundColor={backgroundColor}
            >
                <Stack sx={{ height: "100%", width: "40rem" }}>
                    <Select
                        disabled={!itemType}
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
                        value={itemType || ""}
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
                        renderValue={(x) => {
                            return (
                                <Typography textTransform="uppercase" variant="h6" sx={{ opacity: x ? 1 : 0.7 }}>
                                    {listingTypeLabel || "CHOOSE A LISTING TYPE"}
                                </Typography>
                            )
                        }}
                    >
                        <MenuItem disabled value="">
                            <Typography textTransform="uppercase" variant="h6">
                                CHOOSE A LISTING TYPE
                            </Typography>
                        </MenuItem>
                        {listingTypes.map((x, i) => {
                            if (itemType === ItemType.Keycards && x.value !== ListingType.Buyout) return null
                            return (
                                <MenuItem
                                    key={x.value + i}
                                    value={x.value}
                                    onClick={() => {
                                        setListingType((prev) => {
                                            if (prev === x.value) return prev
                                            return x.value
                                        })
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
