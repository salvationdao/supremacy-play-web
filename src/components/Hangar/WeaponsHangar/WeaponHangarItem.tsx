import { Box, Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { useLocation } from "react-router-dom"
import { FancyButton } from "../.."
import { SvgDropdownArrow, SvgSkin } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { getRarityDeets, getWeaponDamageTypeColor, getWeaponTypeColor, shadeColor } from "../../../helpers"
import { useGameServerCommandsFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { Weapon } from "../../../types"
import { MediaPreview } from "../../Common/MediaPreview/MediaPreview"
import { General } from "../../Marketplace/Common/MarketItem/General"
import { WeaponBarStats } from "./Common/WeaponBarStats"

export const WeaponHangarItem = ({ weapon, isGridView }: { weapon: Weapon; isGridView?: boolean }) => {
    const location = useLocation()
    const theme = useTheme()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const [weaponDetails, setWeaponDetails] = useState<Weapon>()

    useEffect(() => {
        ;(async () => {
            try {
                const resp = await send<Weapon>(GameServerKeys.GetWeaponDetails, {
                    weapon_id: weapon.id,
                })
                if (!resp) return
                setWeaponDetails(resp)
            } catch (e) {
                console.error(e)
            }
        })()
    }, [weapon.id, send])

    const primaryColor = theme.factionTheme.primary
    const secondaryColor = theme.factionTheme.secondary
    const backgroundColor = theme.factionTheme.background

    return (
        <Box sx={{ position: "relative", overflow: "visible", height: "100%" }}>
            <FancyButton
                disableRipple
                clipThingsProps={{
                    clipSize: "7px",
                    clipSlantSize: "0px",
                    corners: {
                        topLeft: true,
                        topRight: true,
                        bottomLeft: true,
                        bottomRight: true,
                    },
                    backgroundColor: backgroundColor,
                    opacity: 0.9,
                    border: { isFancy: !isGridView, borderColor: primaryColor, borderThickness: ".25rem" },
                    sx: { position: "relative", height: "100%" },
                }}
                sx={{ color: primaryColor, textAlign: "start", height: "100%" }}
                to={`/weapon/${weapon.id}${location.hash}`}
            >
                <Box
                    sx={{
                        position: "relative",
                        height: "100%",
                        p: isGridView ? ".5rem .6rem" : ".1rem .3rem",
                        display: isGridView ? "block" : "grid",
                        gridTemplateRows: "7rem",
                        gridTemplateColumns: `minmax(38rem, auto) 20rem 32rem`,
                        gap: "1.4rem",
                        ...(isGridView
                            ? {
                                  "&>*:not(:last-child)": {
                                      mb: ".8rem",
                                  },
                              }
                            : {}),
                    }}
                >
                    <WeaponCommonArea
                        isGridView={isGridView}
                        weapon={weapon}
                        weaponDetails={weaponDetails}
                        primaryColor={primaryColor}
                        secondaryColor={secondaryColor}
                    />

                    <General title="DAMAGE TYPE" isGridView={isGridView}>
                        <Typography variant="h6" sx={{ color: getWeaponDamageTypeColor(weaponDetails?.default_damage_type), fontWeight: "fontWeightBold" }}>
                            {weaponDetails?.default_damage_type}
                        </Typography>
                    </General>

                    {weaponDetails && <WeaponBarStats fontSize="1.5rem" weapon={weaponDetails} color={primaryColor} iconVersion />}
                </Box>

                <Box
                    sx={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        background: `linear-gradient(to top, #FFFFFF08, ${backgroundColor}90)`,
                        zIndex: -1,
                    }}
                />
            </FancyButton>
        </Box>
    )
}

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
    weapon?: Weapon
    weaponDetails?: Weapon
    isExpanded?: boolean
    toggleIsExpanded?: (value?: boolean) => void
}) => {
    const rarityDeets = useMemo(() => getRarityDeets(weaponDetails?.weapon_skin?.tier || ""), [weaponDetails])
    const backgroundColor = useMemo(() => shadeColor(primaryColor, -90), [primaryColor])

    const weap = weaponDetails || weapon
    const avatarUrl = weaponDetails?.weapon_skin?.avatar_url || weaponDetails?.avatar_url || weapon?.avatar_url || ""
    const imageUrl = weaponDetails?.weapon_skin?.image_url || weaponDetails?.image_url || weapon?.image_url || ""

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
                <MediaPreview imageUrl={imageUrl || avatarUrl} objectFit={isGridView ? "cover" : "contain"} imageTransform="rotate(-30deg) scale(.95)" />
            </Box>
            <Stack
                spacing={isGridView ? ".1rem" : ".2rem"}
                sx={{
                    flex: 1,
                    pr: toggleIsExpanded ? "3rem" : "unset",
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
                <Typography
                    variant="body2"
                    sx={{
                        color: getWeaponTypeColor(weaponDetails?.weapon_type),
                        fontFamily: fonts.nostromoBold,
                        display: "-webkit-box",
                        overflow: "hidden",
                        overflowWrap: "anywhere",
                        textOverflow: "ellipsis",
                        WebkitLineClamp: 1, // change to max number of lines
                        WebkitBoxOrient: "vertical",
                    }}
                >
                    {weap?.weapon_type}
                </Typography>

                <Typography
                    sx={{
                        fontFamily: fonts.nostromoBlack,
                        display: "-webkit-box",
                        overflow: "hidden",
                        overflowWrap: "anywhere",
                        textOverflow: "ellipsis",
                        WebkitLineClamp: 1, // change to max number of lines
                        WebkitBoxOrient: "vertical",
                    }}
                >
                    {weap?.label}
                </Typography>

                <Stack direction="row" alignItems="center" spacing=".5rem">
                    <SvgSkin fill={weap?.weapon_skin ? colors.chassisSkin : `${colors.darkGrey}80`} size="1.5rem" />

                    {weap?.weapon_skin && (
                        <Typography
                            variant="caption"
                            sx={{
                                fontFamily: fonts.nostromoBold,
                                display: "-webkit-box",
                                overflow: "hidden",
                                overflowWrap: "anywhere",
                                textOverflow: "ellipsis",
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: "vertical",
                            }}
                        >
                            <span style={{ color: colors.chassisSkin, fontFamily: "inherit" }}>{weap?.weapon_skin.label}</span>{" "}
                            <span style={{ color: rarityDeets.color, fontFamily: "inherit" }}>[{rarityDeets.label}]</span>
                        </Typography>
                    )}
                </Stack>

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
                                    <Typography variant="h6" sx={{ color: getWeaponDamageTypeColor(weap?.default_damage_type), fontWeight: "fontWeightBold" }}>
                                        {weap?.default_damage_type}
                                    </Typography>
                                </General>

                                {weap && (
                                    <Stack justifyContent="center" sx={{ width: "40rem" }}>
                                        <WeaponBarStats fontSize="1.4rem" weapon={weap} color={primaryColor} iconVersion />
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
