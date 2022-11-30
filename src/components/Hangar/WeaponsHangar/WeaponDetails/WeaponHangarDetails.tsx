import { Box, CircularProgress, Stack, Typography, useTheme } from "@mui/material"
import { useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import { HangarBg, SvgLoadoutSkin, SvgStats } from "../../../../assets"
import { getRarityDeets, getWeaponDamageTypeColor, getWeaponTypeColor } from "../../../../helpers"
import { useGameServerSubscriptionFaction } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { fonts, siteZIndex } from "../../../../theme/theme"
import { Weapon } from "../../../../types"
import { ClipThing } from "../../../Common/Deprecated/ClipThing"
import { MediaPreview } from "../../../Common/MediaPreview/MediaPreview"
import { WeaponBarStats } from "../Common/WeaponBarStats"
import { WeaponButtons } from "./WeaponHangarButtons"
import { WeaponLoadout } from "./WeaponLoadout"
import { WeaponViewer } from "./WeaponViewer"

export const WeaponHangarDetails = () => {
    const theme = useTheme()
    const { weaponID } = useParams<{ weaponID: string }>()
    const [weaponDetails, setWeaponDetails] = useState<Weapon>()

    const rarityDeets = useMemo(() => getRarityDeets(weaponDetails?.weapon_skin?.tier || weaponDetails?.tier || ""), [weaponDetails])

    useGameServerSubscriptionFaction<Weapon>(
        {
            URI: `/weapon/${weaponID}/details`,
            key: GameServerKeys.GetWeaponDetails,
        },
        (payload) => {
            if (!payload) return
            setWeaponDetails(payload)
        },
    )

    const primaryColor = theme.factionTheme.primary
    const backgroundColor = theme.factionTheme.background
    const avatarUrl = weaponDetails?.weapon_skin?.avatar_url || weaponDetails?.avatar_url
    const imageUrl = weaponDetails?.weapon_skin?.image_url || weaponDetails?.image_url

    return (
        <Box
            alignItems="center"
            sx={{
                height: "100%",
                p: "1rem",
                zIndex: siteZIndex.RoutePage,
                backgroundImage: `url(${HangarBg})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
            }}
        >
            <Stack direction="row" spacing="1rem" sx={{ height: "100%" }}>
                {/* Left side */}
                <ClipThing
                    clipSize="10px"
                    border={{
                        borderColor: primaryColor,
                        borderThickness: ".3rem",
                    }}
                    corners={{
                        topRight: true,
                        bottomLeft: true,
                        bottomRight: true,
                    }}
                    opacity={0.7}
                    backgroundColor={backgroundColor}
                    sx={{ flexShrink: 0, height: "100%", width: "38rem" }}
                >
                    <Stack sx={{ height: "100%" }}>
                        <ClipThing clipSize="10px" corners={{ topRight: true }} opacity={0.7} sx={{ flexShrink: 0 }}>
                            <Box sx={{ position: "relative", borderBottom: `${primaryColor}60 1.5px solid` }}>
                                <MediaPreview imageUrl={imageUrl || avatarUrl} objectFit="cover" sx={{ height: "32rem" }} />

                                <Box
                                    sx={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0, background: `linear-gradient(#FFFFFF00 60%, #00000050)` }}
                                />
                            </Box>
                        </ClipThing>

                        <Box
                            sx={{
                                flex: 1,
                                overflowY: "auto",
                                overflowX: "hidden",
                                ml: "1.9rem",
                                pr: "1.4rem",
                                mt: ".4rem",
                                mb: ".8rem",
                                direction: "ltr",
                            }}
                        >
                            {weaponDetails ? (
                                <Stack spacing="1.6rem" sx={{ p: "1rem 1rem" }}>
                                    {/* Weapon avatar, label, name etc */}
                                    <Stack spacing=".5rem">
                                        <Stack spacing=".5rem" direction="row" alignItems="center">
                                            <SvgLoadoutSkin fill={rarityDeets.color} />
                                            <Typography variant="body2" sx={{ color: rarityDeets.color, fontFamily: fonts.nostromoHeavy }}>
                                                {rarityDeets.label}
                                            </Typography>
                                        </Stack>

                                        <Typography sx={{ fontFamily: fonts.nostromoBlack }}>{weaponDetails.label}</Typography>
                                    </Stack>

                                    {/* General info */}
                                    <Stack spacing=".2rem">
                                        <Typography sx={{ color: primaryColor, fontFamily: fonts.nostromoBlack }}>WEAPON TYPE</Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{ color: getWeaponTypeColor(weaponDetails?.weapon_type), fontFamily: fonts.nostromoBlack }}
                                        >
                                            {weaponDetails.weapon_type}
                                        </Typography>
                                    </Stack>

                                    <Stack spacing=".2rem">
                                        <Typography sx={{ color: primaryColor, fontFamily: fonts.nostromoBlack }}>DAMAGE TYPE</Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{ color: getWeaponDamageTypeColor(weaponDetails?.default_damage_type), fontFamily: fonts.nostromoBlack }}
                                        >
                                            {weaponDetails.default_damage_type}
                                        </Typography>
                                    </Stack>

                                    {/* Bar stats */}
                                    <Stack spacing=".5rem">
                                        <Stack direction="row" spacing=".8rem" alignItems="center">
                                            <SvgStats fill={primaryColor} size="1.6rem" />
                                            <Typography sx={{ color: primaryColor, fontFamily: fonts.nostromoBlack }}>WEAPON STATS</Typography>
                                        </Stack>

                                        <WeaponBarStats
                                            weapon={weaponDetails}
                                            color={primaryColor}
                                            fontSize="1.2rem"
                                            width="100%"
                                            spacing="1.2rem"
                                            barHeight=".9rem"
                                        />
                                    </Stack>
                                </Stack>
                            ) : (
                                <Stack alignItems="center" justifyContent="center" sx={{ height: "20rem" }}>
                                    <CircularProgress />
                                </Stack>
                            )}
                        </Box>

                        {/* Status and buttons */}
                        {weaponDetails && <WeaponButtons weaponDetails={weaponDetails} />}
                    </Stack>
                </ClipThing>

                {/* Right side */}
                <ClipThing
                    clipSize="10px"
                    border={{
                        borderColor: primaryColor,
                        borderThickness: ".3rem",
                    }}
                    backgroundColor={backgroundColor}
                    sx={{ height: "100%", flex: 1 }}
                >
                    {weaponDetails ? (
                        <>
                            <WeaponLoadout weaponDetails={weaponDetails} />
                            <WeaponViewer weaponDetails={weaponDetails} />
                        </>
                    ) : (
                        <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                            <CircularProgress />
                        </Stack>
                    )}
                </ClipThing>
            </Stack>
        </Box>
    )
}
