import { Box, Button, Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { Link } from "react-router-dom"
import { SvgLoadoutSkin } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { getAssetItemDeets, getRarityDeets } from "../../../helpers"
import { colors, fonts } from "../../../theme/theme"
import { FancyButton } from "../../Common/Deprecated/FancyButton"
import { MediaPreview } from "../../Common/MediaPreview/MediaPreview"
import { NiceTooltip } from "../../Common/Nice/NiceTooltip"
import { ArrayItem } from "./CrateRewardsModal"
import { truncateTextLines } from "../../../helpers"

interface CrateRewardItemsProps {
    item?: ArrayItem
    largerVersion?: boolean
}

export const CrateRewardItemsLarge = ({ item, largerVersion }: CrateRewardItemsProps) => {
    const theme = useTheme()
    const rarityDeets = useMemo(() => getRarityDeets(item?.skin?.tier || item?.rarity || ""), [item?.rarity, item?.skin?.tier])
    const assetItemDeets = useMemo(() => getAssetItemDeets(item?.type), [item?.type])

    const imageUrl =
        item?.skin?.avatar_url || item?.skin?.image_url || item?.skin?.large_image_url || item?.avatarUrl || item?.imageUrl || item?.largeImageUrl || ""
    const animationUrl = item?.skin?.animation_url || item?.animationUrl
    const cardAnimationUrl = item?.skin?.card_animation_url || item?.cardAnimationUrl

    return (
        <Box sx={{ filter: `drop-shadow(0 0 9px ${assetItemDeets.color || theme.factionTheme.primary})` }}>
            <FancyButton
                clipThingsProps={{
                    clipSize: "6px",
                    clipSlantSize: "0px",
                    corners: { topLeft: true, topRight: true, bottomLeft: true, bottomRight: true },
                    border: {
                        borderColor: assetItemDeets.color || theme.factionTheme.primary,
                        borderThickness: ".2rem",
                    },
                    opacity: 0.8,
                    backgroundColor: colors.black2,
                    sx: { height: "100%", pointerEvents: assetItemDeets.subRoute ? "all" : "none" },
                }}
                sx={{ p: 0, color: "#FFFFFF" }}
                to={`/${assetItemDeets.subRoute}/${item?.id}`}
            >
                <Stack sx={{ m: "1rem", textAlign: "start", width: largerVersion ? "30rem" : "25rem" }}>
                    <Box sx={{ position: "relative", width: "100%", height: largerVersion ? "30rem" : "22rem", mb: "1rem" }}>
                        <MediaPreview imageUrl={imageUrl} videoUrls={[animationUrl, cardAnimationUrl]} objectFit="cover" />

                        <NiceTooltip color={assetItemDeets.color} placement="right" text={assetItemDeets.label}>
                            <Box sx={{ position: "absolute", top: ".1rem", left: ".1rem" }}>
                                {assetItemDeets.icon && <assetItemDeets.icon size="2rem" fill={assetItemDeets.color} />}
                            </Box>
                        </NiceTooltip>
                    </Box>

                    {rarityDeets && (item?.skin || item?.type === "mech_skin" || item?.type === "weapon_skin") && (
                        <Typography
                            variant="body2"
                            sx={{
                                color: rarityDeets.color,
                                fontFamily: fonts.nostromoBlack,
                            }}
                        >
                            {rarityDeets.label}
                        </Typography>
                    )}

                    {item?.skin && (
                        <Stack direction="row" spacing=".3rem" alignItems="center" sx={{ mb: ".4rem" }}>
                            <SvgLoadoutSkin size="1.8rem" fill={colors.chassisSkin} />
                            <Typography
                                variant="body2"
                                sx={{
                                    color: colors.chassisSkin,
                                    fontFamily: fonts.nostromoBlack,
                                }}
                            >
                                {item.skin.label}
                            </Typography>
                        </Stack>
                    )}

                    <Typography sx={{ fontFamily: fonts.nostromoHeavy }}>{item?.label}</Typography>
                </Stack>
            </FancyButton>
        </Box>
    )
}

export const CrateRewardItemsSmall = ({ item }: CrateRewardItemsProps) => {
    const theme = useTheme()
    const rarityDeets = useMemo(() => getRarityDeets(item?.skin?.tier || item?.rarity || ""), [item?.rarity, item?.skin?.tier])
    const assetItemDeets = useMemo(() => getAssetItemDeets(item?.type), [item?.type])

    const imageUrl =
        item?.skin?.avatar_url || item?.skin?.image_url || item?.skin?.large_image_url || item?.avatarUrl || item?.imageUrl || item?.largeImageUrl || ""
    const animationUrl = item?.skin?.animation_url || item?.animationUrl
    const cardAnimationUrl = item?.skin?.card_animation_url || item?.cardAnimationUrl

    return (
        <Button sx={{ color: "#FFFFFF", justifyContent: "flex-start", pointerEvents: assetItemDeets.subRoute ? "all" : "none" }}>
            <Link to={`/${assetItemDeets.subRoute}/${item?.id}`}>
                <Stack direction="row" alignItems="center" spacing="1rem" sx={{ textAlign: "start" }}>
                    <Box
                        sx={{
                            position: "relative",
                            width: "6rem",
                            height: "6rem",
                            flexShrink: 0,
                            border: `${assetItemDeets.color || theme.factionTheme.primary} 1px solid`,
                        }}
                    >
                        <MediaPreview imageUrl={imageUrl} videoUrls={[animationUrl, cardAnimationUrl]} showBorder />

                        <NiceTooltip color={assetItemDeets.color} placement="right" text={assetItemDeets.label}>
                            <Box sx={{ position: "absolute", top: ".1rem", left: ".1rem" }}>
                                {assetItemDeets.icon && <assetItemDeets.icon size="1.4rem" fill={assetItemDeets.color} />}
                            </Box>
                        </NiceTooltip>
                    </Box>

                    <Stack sx={{ maxWidth: "28rem" }}>
                        {rarityDeets && (item?.skin || item?.type === "mech_skin" || item?.type === "weapon_skin") && (
                            <Typography
                                variant="caption"
                                sx={{
                                    textAlign: "start",
                                    color: rarityDeets.color,
                                    fontFamily: fonts.nostromoBlack,
                                    ...truncateTextLines(2),
                                }}
                            >
                                {rarityDeets.label}
                            </Typography>
                        )}

                        {item?.skin && (
                            <Stack direction="row" spacing=".3rem" alignItems="center" sx={{ mb: ".4rem" }}>
                                <SvgLoadoutSkin size="1.8rem" fill={colors.chassisSkin} />
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: colors.chassisSkin,
                                        fontFamily: fonts.nostromoBlack,
                                    }}
                                >
                                    {item.skin.label}
                                </Typography>
                            </Stack>
                        )}

                        <Typography variant="body2" sx={{ fontFamily: fonts.nostromoHeavy, textAlign: "start" }}>
                            {item?.label}
                        </Typography>
                    </Stack>
                </Stack>
            </Link>
        </Button>
    )
}
