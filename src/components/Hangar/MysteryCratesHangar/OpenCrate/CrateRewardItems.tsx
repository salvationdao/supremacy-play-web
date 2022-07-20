import { Box, Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { useTheme } from "../../../../containers/theme"
import { getRarityDeets } from "../../../../helpers"
import { colors, fonts } from "../../../../theme/theme"
import { ClipThing } from "../../../Common/ClipThing"
import { MediaPreview } from "../../../Common/MediaPreview/MediaPreview"
import { ArrayItem } from "./CrateRewardsModal"

interface CrateRewardItemsProps {
    item: ArrayItem | undefined
}

export const CrateRewardItemsLarge = ({ item }: CrateRewardItemsProps) => {
    const theme = useTheme()
    const rarityDeets = useMemo(() => getRarityDeets(item?.rarity || ""), [item?.rarity])

    return (
        <ClipThing
            clipSize="6px"
            border={{
                borderColor: theme.factionTheme.primary,
                borderThickness: ".2rem",
            }}
            opacity={0.8}
            backgroundColor={colors.black3}
            sx={{ height: "100%" }}
        >
            <Stack sx={{ m: "1rem", width: "25rem" }}>
                <Box sx={{ width: "100%", height: "22rem", mb: "1rem" }}>
                    <MediaPreview imageUrl={item?.imageUrl || item?.avatarUrl || ""} videoUrls={[item?.animationUrl]} objectFit="cover" />
                </Box>

                {rarityDeets && (item?.type === "mech_skin" || item?.type === "weapon_skin") && (
                    <Typography
                        variant="body2"
                        sx={{
                            color: rarityDeets.color,
                            fontFamily: fonts.nostromoHeavy,
                        }}
                    >
                        {rarityDeets.label}
                    </Typography>
                )}

                <Typography sx={{ fontFamily: fonts.nostromoBlack }}>
                    {item?.label} {item?.type === "mech_skin" || item?.type === "weapon_skin" ? "Submodel" : ""}
                </Typography>
            </Stack>
        </ClipThing>
    )
}

export const CrateRewardItemsSmall = ({ item }: CrateRewardItemsProps) => {
    const rarityDeets = useMemo(() => getRarityDeets(item?.rarity || ""), [item?.rarity])

    return (
        <Stack direction="row" spacing="1rem">
            <Box sx={{ width: "6rem", height: "6rem", flexShrink: 0 }}>
                <MediaPreview imageUrl={item?.avatarUrl || item?.avatarUrl || item?.imageUrl || ""} videoUrls={[item?.animationUrl]} showBorder />
            </Box>

            <Stack sx={{ py: ".6rem", maxWidth: "28rem" }}>
                {rarityDeets && (item?.type === "mech_skin" || item?.type === "weapon_skin") && (
                    <Typography
                        variant="body2"
                        sx={{
                            textAlign: "start",
                            color: rarityDeets.color,
                            fontFamily: fonts.nostromoHeavy,
                            display: "-webkit-box",
                            overflow: "hidden",
                            overflowWrap: "anywhere",
                            textOverflow: "ellipsis",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                        }}
                    >
                        {rarityDeets.label}
                    </Typography>
                )}

                <Typography sx={{ fontFamily: fonts.nostromoBlack, textAlign: "start" }}>
                    {item?.label} {item?.type === "mech_skin" || item?.type === "weapon_skin" ? "Submodel" : ""}
                </Typography>
            </Stack>
        </Stack>
    )
}
