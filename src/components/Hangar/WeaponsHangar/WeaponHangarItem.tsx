import { Box, Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { useLocation } from "react-router-dom"
import { FancyButton } from "../.."
import { useTheme } from "../../../containers/theme"
import { getRarityDeets } from "../../../helpers"
import { useGameServerCommandsFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { fonts } from "../../../theme/theme"
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
    const imageUrl = weaponDetails?.avatar_url || weapon.avatar_url
    const largeImageUrl = weaponDetails?.large_image_url || weapon.large_image_url

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
                        gridTemplateColumns: `8rem auto repeat(3, 20rem)`, // hard-coded to have 7 columns, adjust as required
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
                        <Typography variant="body2" sx={{ mb: ".2rem", color: rarityDeets.color, fontFamily: fonts.nostromoHeavy }}>
                            {rarityDeets.label}
                        </Typography>

                        <Typography sx={{ fontFamily: fonts.nostromoBlack }}>{weaponDetails?.label}</Typography>

                        <Typography variant="body2" sx={{ mb: ".2rem", color: primaryColor, fontFamily: fonts.nostromoHeavy }}>
                            {weaponDetails?.weapon_type}
                        </Typography>
                    </Stack>

                    <General title="DAMAGE">
                        <Typography variant="h6" sx={{ fontWeight: "fontWeightBold" }}>
                            {weaponDetails?.damage}
                        </Typography>
                    </General>

                    <General title="RADIUS">
                        <Typography variant="h6" sx={{ fontWeight: "fontWeightBold" }}>
                            {weaponDetails?.radius}
                        </Typography>
                    </General>

                    <General title="RATE OF FIRE">
                        <Typography variant="h6" sx={{ fontWeight: "fontWeightBold" }}>
                            {weaponDetails?.rate_of_fire}
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
