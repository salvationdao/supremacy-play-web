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
    const backgroundColor = theme.factionTheme.background
    const imageUrl = weaponDetails?.weapon_skin?.image_url || weaponDetails?.image_url || weapon.image_url
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
                        gridTemplateColumns: `8rem auto 20rem 30rem`, // hard-coded to have 7 columns, adjust as required
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
                        <MediaPreview imageUrl={imageUrl} objectFit={isGridView ? "cover" : "contain"} />
                    </Box>

                    <WeaponCommonArea isGridView={isGridView} weaponDetails={weaponDetails} />

                    <General title="DAMAGE TYPE">
                        <Typography variant="h6" sx={{ color: getWeaponDamageTypeColor(weaponDetails?.default_damage_type), fontWeight: "fontWeightBold" }}>
                            {weaponDetails?.default_damage_type}
                        </Typography>
                    </General>

                    <General isGridView={isGridView} title="STATS">
                        <WeaponBarStats fontSize="1.4rem" weapon={weapon} weaponDetails={weaponDetails} color={primaryColor} iconVersion />
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

export const WeaponCommonArea = ({ isGridView, weaponDetails }: { isGridView?: boolean; weaponDetails?: Weapon }) => {
    const rarityDeets = useMemo(() => getRarityDeets(weaponDetails?.weapon_skin?.tier || ""), [weaponDetails])

    return (
        <Stack spacing={isGridView ? ".1rem" : ".6rem"}>
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

            <Stack direction="row" spacing=".5rem">
                <Typography
                    sx={{
                        lineHeight: 1,
                        fontWeight: "fontWeightBold",
                        color: colors.offWhite,
                        display: "-webkit-box",
                        overflow: "hidden",
                        overflowWrap: "anywhere",
                        textOverflow: "ellipsis",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                    }}
                >
                    SUBMODEL:{" "}
                    {weaponDetails?.weapon_skin ? (
                        <>
                            <span style={{ color: colors.chassisSkin }}>{weaponDetails?.weapon_skin.label}</span>{" "}
                            <span style={{ color: rarityDeets.color }}>({rarityDeets.label})</span>
                        </>
                    ) : (
                        <span style={{ color: colors.darkGrey }}>NOT EQUIPPED</span>
                    )}
                </Typography>
            </Stack>
        </Stack>
    )
}
