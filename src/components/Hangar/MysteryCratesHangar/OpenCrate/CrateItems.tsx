import { Box, Stack, Typography } from "@mui/material"
import { useTheme } from "../../../../containers/theme"
import { colors, fonts } from "../../../../theme/theme"
import { ClipThing } from "../../../Common/ClipThing"
import { useEffect, useState } from "react"
import { getRarityDeets } from "../../../../helpers"
import { MediaPreview } from "../../../Common/MediaPreview/MediaPreview"
import { ArrayItem } from "./CrateRewards"

interface CrateItemProps {
    item: ArrayItem | undefined
}

export const CrateItemLarge = ({ item }: CrateItemProps) => {
    const [rarityDeets, setRarityDeets] = useState<{
        label: string
        color: string
    }>()

    const theme = useTheme()

    useEffect(() => {
        setRarityDeets(item?.rarity ? getRarityDeets(item?.rarity) : undefined)
    }, [setRarityDeets, getRarityDeets, item])

    return (
        <ClipThing
            clipSize="6px"
            border={{
                borderColor: theme.factionTheme.primary,
                isFancy: true,
                borderThickness: ".2rem",
            }}
            opacity={0.8}
            backgroundColor={colors.black3}
            sx={{ height: "100%" }}
        >
            <Stack alignItems={"center"} spacing="1rem" sx={{ flex: 1, m: "1rem", height: "100%" }}>
                <Box sx={{ height: "30rem", position: "relative" }}>
                    <MediaPreview imageUrl={item?.imageUrl || ""} videoUrls={[item?.animationUrl]} />
                    {rarityDeets && (item?.type === "mech_skin" || item?.type === "weapon_skin") && (
                        <Typography
                            variant="body2"
                            sx={{
                                color: rarityDeets.color,
                                fontFamily: fonts.nostromoHeavy,
                                display: "-webkit-box",
                                overflow: "hidden",
                                overflowWrap: "anywhere",
                                textOverflow: "ellipsis",
                                WebkitBoxOrient: "vertical",
                                position: "absolute",
                                bottom: ".6rem",
                                left: "50%",
                                transform: "translateX(-50%)",
                                backgroundColor: "#00000050",
                                px: ".8rem",
                                py: ".3rem",
                            }}
                        >
                            {rarityDeets.label}
                        </Typography>
                    )}
                </Box>

                <Stack sx={{ padding: "1rem", alignItems: "space-between" }}>
                    <Typography variant="h5" sx={{ fontFamily: fonts.nostromoBlack }}>
                        {item?.label} {item?.type === "mech_skin" || item?.type === "weapon_skin" ? "Submodel" : ""}
                    </Typography>
                </Stack>
            </Stack>
        </ClipThing>
    )
}

export const CrateItemSmall = ({ item }: CrateItemProps) => {
    const [rarityDeets, setRarityDeets] = useState<{
        label: string
        color: string
    }>()

    useEffect(() => {
        setRarityDeets(item?.rarity ? getRarityDeets(item?.rarity) : undefined)
    }, [setRarityDeets, getRarityDeets, item?.rarity])

    if (!item?.avatarUrl) return null
    return (
        <Stack direction={"row"} sx={{ alignItems: "center" }}>
            <Box sx={{ width: "7rem", height: "7rem", flexShrink: 0 }}>
                <MediaPreview imageUrl={item?.avatarUrl || ""} videoUrls={[item?.animationUrl]} />
            </Box>

            <Stack>
                <Typography variant="h5" sx={{ fontFamily: fonts.nostromoBlack, textAlign: "left" }}>
                    {item?.label} {item?.type === "mech_skin" || item?.type === "weapon_skin" ? "Submodel" : ""}
                </Typography>
                {rarityDeets && (item?.type === "mech_skin" || item?.type === "weapon_skin") && (
                    <Typography
                        variant="body2"
                        sx={{
                            color: rarityDeets.color,
                            fontFamily: fonts.nostromoBlack,
                            display: "-webkit-box",
                            overflow: "hidden",
                            overflowWrap: "anywhere",
                            textOverflow: "ellipsis",
                            WebkitBoxOrient: "vertical",
                            textAlign: "left",
                        }}
                    >
                        {rarityDeets.label}
                    </Typography>
                )}
            </Stack>
        </Stack>
    )
}
