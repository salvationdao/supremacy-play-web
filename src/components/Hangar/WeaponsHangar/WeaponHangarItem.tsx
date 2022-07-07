import { Box, Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { useLocation } from "react-router-dom"
import { FancyButton } from "../.."
import { useTheme } from "../../../containers/theme"
import { getRarityDeets, getWeaponDamageTypeColor, getWeaponTypeColor } from "../../../helpers"
import { useGameServerCommandsFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { Weapon } from "../../../types"
import { MediaPreview } from "../../Common/MediaPreview/MediaPreview"
import { General } from "../../Marketplace/Common/MarketItem/General"

export const WeaponHangarItem = ({ weapon, isGridView }: { weapon: Weapon; isGridView?: boolean }) => {
    const location = useLocation()
    const theme = useTheme()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const [weaponDetails, setWeaponDetails] = useState<Weapon>()

    const rarityDeets = useMemo(() => getRarityDeets(weaponDetails?.tier || ""), [weaponDetails])

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
    const backgroundColor = theme.factionTheme.background
    const imageUrl = weaponDetails?.weapon_skin?.avatar_url || weaponDetails?.avatar_url || weapon.avatar_url
    const largeImageUrl = weaponDetails?.weapon_skin?.large_image_url || weaponDetails?.large_image_url || weapon.large_image_url

    return (
        <Box sx={{ position: "relative", overflow: "visible", height: "100%" }}>
            <FancyButton
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
                        gridTemplateColumns: `8rem auto repeat(4, 20rem)`, // hard-coded to have 7 columns, adjust as required
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
                    <Box
                        sx={{
                            position: "relative",
                            height: isGridView ? "15rem" : "100%",
                            width: "100%",
                        }}
                    >
                        <MediaPreview imageUrl={imageUrl || largeImageUrl} objectFit={isGridView ? "cover" : "contain"} />
                    </Box>

                    <Stack>
                        <Typography
                            variant="body2"
                            sx={{ mb: ".2rem", color: getWeaponTypeColor(weaponDetails?.weapon_type), fontFamily: fonts.nostromoBlack }}
                        >
                            {weaponDetails?.weapon_type}
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
                            {weaponDetails?.label}
                        </Typography>
                    </Stack>

                    <General title="DAMAGE TYPE">
                        <Typography variant="h6" sx={{ color: getWeaponDamageTypeColor(weaponDetails?.default_damage_type), fontWeight: "fontWeightBold" }}>
                            {weaponDetails?.default_damage_type}
                        </Typography>
                    </General>

                    <General isGridView={isGridView} title="SUBMODEL">
                        {weaponDetails?.weapon_skin ? (
                            <Stack spacing=".5rem">
                                <Typography variant="h6" sx={{ lineHeight: 1, color: colors.chassisSkin, fontWeight: "fontWeightBold" }}>
                                    {weaponDetails?.weapon_skin.label}
                                </Typography>
                                <Typography sx={{ lineHeight: 1, color: rarityDeets.color, fontWeight: "fontWeightBold" }}>{rarityDeets.label}</Typography>
                            </Stack>
                        ) : (
                            <Typography variant="h6" sx={{ color: colors.darkGrey, fontWeight: "fontWeightBold" }}>
                                NOT EQUIPPED
                            </Typography>
                        )}
                    </General>

                    <General title="DAMAGE">
                        <Typography variant="h6" sx={{ color: colors.lightNeonBlue, fontWeight: "fontWeightBold" }}>
                            {weaponDetails?.damage}
                        </Typography>
                    </General>

                    <General title="ENERGY COST">
                        <Typography variant="h6" sx={{ color: colors.lightNeonBlue, fontWeight: "fontWeightBold" }}>
                            {weaponDetails?.energy_cost}
                        </Typography>
                    </General>
                </Box>

                <Box
                    sx={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        background: `url(${largeImageUrl})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "top",
                        backgroundSize: "cover",
                        opacity: 0.06,
                        zIndex: -2,
                    }}
                />

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
