import { Box, Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { SvgDropdownArrow, SvgSkin } from "../../../assets"
import { getRarityDeets, getWeaponDamageTypeColor, getWeaponTypeColor, shadeColor, truncateTextLines } from "../../../helpers"
import { colors, fonts } from "../../../theme/theme"
import { PlayerAsset, Weapon } from "../../../types"
import { MediaPreview } from "../../Common/MediaPreview/MediaPreview"
import { General } from "../../Marketplace/Common/MarketItem/General"
import { WeaponBarStats } from "./Common/WeaponBarStats"

export const WeaponCommonArea = ({
    primaryColor,
    secondaryColor,
    isGridView,
    weapon,
    weaponDetails,
    isExpanded,
    toggleIsExpanded,
}: {
    primaryColor: string
    secondaryColor: string
    isGridView?: boolean
    weapon?: PlayerAsset
    weaponDetails?: Weapon
    isExpanded?: boolean
    toggleIsExpanded?: (value?: boolean) => void
}) => {
    const rarityDeets = useMemo(() => getRarityDeets(weaponDetails?.weapon_skin?.tier || ""), [weaponDetails])
    const backgroundColor = useMemo(() => shadeColor(primaryColor, -90), [primaryColor])

    const weap = weaponDetails || weapon
    const avatarUrl = weaponDetails?.weapon_skin?.avatar_url || weaponDetails?.avatar_url || ""
    const imageUrl = weaponDetails?.weapon_skin?.image_url || weaponDetails?.image_url || ""

    return (
        <Stack direction={isGridView ? "column" : "row"} alignItems={isGridView ? "flex-start" : "center"} spacing="1.4rem" sx={{ position: "relative" }}>
            <Box
                sx={{
                    position: "relative",
                    height: isGridView ? "20rem" : "100%",
                    width: isGridView ? "100%" : "8rem",
                    flexShrink: 0,
                }}
            >
                <MediaPreview imageUrl={imageUrl || avatarUrl} objectFit={isGridView ? "cover" : "contain"} />
            </Box>
            <Stack
                spacing=".2rem"
                sx={{
                    flex: 1,
                    pr: !isGridView && toggleIsExpanded ? "3rem" : "unset",
                    ":hover": {
                        ".expandArrow": {
                            transform: "translateX(4px)",
                        },
                    },
                }}
                onClick={(e) => {
                    if (!toggleIsExpanded) return
                    e.preventDefault()
                    e.stopPropagation()
                    toggleIsExpanded()
                }}
            >
                <Stack direction="row" alignItems="center" spacing=".5rem">
                    {weaponDetails?.weapon_skin && (
                        <Typography
                            variant="body2"
                            sx={{
                                color: rarityDeets.color,
                                fontFamily: fonts.nostromoBold,
                                ...truncateTextLines(1),
                            }}
                        >
                            {rarityDeets.label}
                        </Typography>
                    )}

                    <SvgSkin fill={weaponDetails?.weapon_skin ? rarityDeets.color : `${colors.darkGrey}80`} size="1.7rem" />
                </Stack>

                <Typography
                    sx={{
                        fontFamily: fonts.nostromoBlack,
                        ...truncateTextLines(1),
                    }}
                >
                    {weap?.label}
                </Typography>

                <Typography
                    variant="body2"
                    sx={{
                        color: getWeaponTypeColor(weaponDetails?.weapon_type),
                        fontFamily: fonts.nostromoBold,
                        ...truncateTextLines(1),
                    }}
                >
                    {weaponDetails?.weapon_type}
                </Typography>

                {toggleIsExpanded && !isGridView && (
                    <Stack
                        direction="row"
                        sx={{
                            position: "absolute",
                            top: "-2rem",
                            left: "calc(100% - 2.5rem)",
                            bottom: "-1rem",
                        }}
                    >
                        <Stack
                            className="expandArrow"
                            alignItems="center"
                            justifyContent="center"
                            sx={{
                                px: ".6rem",
                                background: isExpanded ? `${primaryColor}CC` : `linear-gradient(to right, #FFFFFF00, ${primaryColor}50 80%, #FFFFFF00)`,
                                transition: "all .2s",
                            }}
                        >
                            <SvgDropdownArrow
                                size="1.3rem"
                                fill={isExpanded ? secondaryColor : "#FFFFFF95"}
                                sx={{ transform: isExpanded ? "rotate(90deg)" : "rotate(-90deg)" }}
                            />
                        </Stack>

                        <Box
                            sx={{
                                backgroundColor,
                                zIndex: 99,
                                width: isExpanded ? "100%" : 0,
                                minWidth: isExpanded ? "100%" : 0,
                                overflow: "hidden",
                                transition: "all .3s",
                                border: isExpanded ? `${primaryColor}CC 1px solid` : "unset",
                                borderLeft: "unset",
                            }}
                        >
                            <Stack direction="row" spacing="4rem" sx={{ p: "1.5rem 2.1rem", height: "100%" }}>
                                <General title="DAMAGE TYPE" isGridView={isGridView}>
                                    <Typography variant="h6" sx={{ color: getWeaponDamageTypeColor(weaponDetails?.default_damage_type), fontWeight: "bold" }}>
                                        {weaponDetails?.default_damage_type}
                                    </Typography>
                                </General>

                                {weaponDetails && (
                                    <Stack justifyContent="center" sx={{ width: "40rem" }}>
                                        <WeaponBarStats fontSize="1.4rem" weapon={weaponDetails} color={primaryColor} iconVersion />
                                    </Stack>
                                )}
                            </Stack>
                        </Box>
                    </Stack>
                )}
            </Stack>
        </Stack>
    )
}
