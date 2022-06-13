import { MenuItem, Select, Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { useTheme } from "../../../containers/theme"
import { colors } from "../../../theme/theme"
import { ItemType } from "../../../types/marketplace"
import { ClipThing } from "../../Common/ClipThing"
import { QuestionSection } from "./QuestionSection"
import { AssetToSellStruct, itemTypes } from "./SellItem"

export const ItemTypeSelect = ({
    itemType,
    setItemType,
    setAssetToSell,
}: {
    itemType?: ItemType
    setItemType: React.Dispatch<React.SetStateAction<ItemType | undefined>>
    setAssetToSell: React.Dispatch<React.SetStateAction<AssetToSellStruct | undefined>>
}) => {
    const theme = useTheme()

    const itemTypeLabel = useMemo(() => itemTypes.find((i) => i.value === itemType)?.label, [itemType])

    const primaryColor = theme.factionTheme.primary
    const secondaryColor = theme.factionTheme.secondary
    const backgroundColor = theme.factionTheme.background

    return (
        <QuestionSection
            primaryColor={primaryColor}
            question="What are you selling?"
            description="You can choose to sell your war machines, keycards, and mystery crates."
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
                        value={itemType || ""}
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
                                    {itemTypeLabel || "CHOOSE AN ITEM TYPE"}
                                </Typography>
                            )
                        }}
                    >
                        <MenuItem disabled value="">
                            <Typography textTransform="uppercase" variant="h6">
                                CHOOSE AN ITEM TYPE
                            </Typography>
                        </MenuItem>
                        {itemTypes.map((x, i) => {
                            return (
                                <MenuItem
                                    key={x.value + i}
                                    value={x.value}
                                    onClick={() => {
                                        setItemType((prev) => {
                                            if (prev === x.value) return prev
                                            setAssetToSell(undefined)
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
