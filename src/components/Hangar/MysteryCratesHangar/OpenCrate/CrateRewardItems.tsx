import { Box, Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { useTheme } from "../../../../containers/theme"
import { getAssetItemDeets, getRarityDeets } from "../../../../helpers"
import { colors, fonts } from "../../../../theme/theme"
import { AssetItemType } from "../../../../types"
import { ClipThing } from "../../../Common/ClipThing"
import { MediaPreview } from "../../../Common/MediaPreview/MediaPreview"
import { TooltipHelper } from "../../../Common/TooltipHelper"
import { ArrayItem } from "./CrateRewardsModal"

interface CrateRewardItemsProps {
    item: ArrayItem | undefined
}

export const CrateRewardItemsLarge = ({ item }: CrateRewardItemsProps) => {
    const theme = useTheme()
    const rarityDeets = useMemo(() => getRarityDeets(item?.rarity || ""), [item?.rarity])
    const assetItemDeets = useMemo(() => getAssetItemDeets(item?.type), [item?.type])

    return (
        <ClipThing
            clipSize="6px"
            border={{
                borderColor: assetItemDeets.color || theme.factionTheme.primary,
                borderThickness: ".2rem",
            }}
            opacity={0.8}
            backgroundColor={colors.black3}
            sx={{ height: "100%" }}
        >
            <Stack sx={{ m: "1rem", width: "25rem" }}>
                <Box sx={{ position: "relative", width: "100%", height: "22rem", mb: "1rem" }}>
                    <MediaPreview
                        imageUrl={item?.avatarUrl || item?.imageUrl || item?.largeImageUrl || ""}
                        videoUrls={[item?.animationUrl, item?.cardAnimationUrl]}
                        objectFit="cover"
                        imageTransform={item?.type === AssetItemType.Weapon || item?.type === AssetItemType.WeaponSkin ? "rotate(-30deg) scale(.95)" : ""}
                    />

                    <TooltipHelper placement="right" text={assetItemDeets.label}>
                        <Box sx={{ position: "absolute", top: ".1rem", left: ".1rem" }}>
                            {assetItemDeets.icon && <assetItemDeets.icon size="2rem" fill={assetItemDeets.color} />}
                        </Box>
                    </TooltipHelper>
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

                <Typography sx={{ fontFamily: fonts.nostromoBlack }}>{item?.label}</Typography>
            </Stack>
        </ClipThing>
    )
}

export const CrateRewardItemsSmall = ({ item }: CrateRewardItemsProps) => {
    const theme = useTheme()
    const rarityDeets = useMemo(() => getRarityDeets(item?.rarity || ""), [item?.rarity])
    const assetItemDeets = useMemo(() => getAssetItemDeets(item?.type), [item?.type])

    return (
        <Stack direction="row" alignItems="center" spacing="1rem">
            <Box
                sx={{
                    position: "relative",
                    width: "6rem",
                    height: "6rem",
                    flexShrink: 0,
                    border: `${assetItemDeets.color || theme.factionTheme.primary} 1px solid`,
                }}
            >
                <MediaPreview
                    imageUrl={item?.avatarUrl || item?.imageUrl || item?.largeImageUrl || ""}
                    videoUrls={[item?.animationUrl, item?.cardAnimationUrl]}
                    showBorder
                    imageTransform={item?.type === AssetItemType.Weapon || item?.type === AssetItemType.WeaponSkin ? "rotate(-30deg) scale(.95)" : ""}
                />

                <TooltipHelper placement="right" text={assetItemDeets.label}>
                    <Box sx={{ position: "absolute", top: ".1rem", left: ".1rem" }}>
                        {assetItemDeets.icon && <assetItemDeets.icon size="1.4rem" fill={assetItemDeets.color} />}
                    </Box>
                </TooltipHelper>
            </Box>

            <Stack sx={{ py: ".6rem", maxWidth: "28rem" }}>
                {rarityDeets && (item?.type === "mech_skin" || item?.type === "weapon_skin") && (
                    <Typography
                        variant="caption"
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

                <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBlack, textAlign: "start" }}>
                    {item?.label}
                </Typography>
            </Stack>
        </Stack>
    )
}
