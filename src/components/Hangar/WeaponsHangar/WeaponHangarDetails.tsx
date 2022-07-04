import { Box, Stack, Typography, useTheme } from "@mui/material"
import { useEffect, useState } from "react"
import { SvgStats } from "../../../assets"
import { useGameServerCommandsFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { fonts } from "../../../theme/theme"
import { Weapon } from "../../../types"
import { ClipThing } from "../../Common/ClipThing"
import { MediaPreview } from "../../Common/MediaPreview/MediaPreview"
import { WeaponButtons } from "./WeaponHangarButtons"
import { WeaponBarStats } from "./WeaponHangarStats"

export const WeaponHangarDetails = ({ weaponID }: { weaponID: string }) => {
    return <WeaponHangarDetailsInner weaponID={weaponID} />
}

interface WeaponHangarDetailsInnerProps {
    weaponID: string
}

export const WeaponHangarDetailsInner = ({ weaponID }: WeaponHangarDetailsInnerProps) => {
    const theme = useTheme()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const [weaponDetails, setWeaponDetails] = useState<Weapon>()

    useEffect(() => {
        ;(async () => {
            try {
                const resp = await send<Weapon>(GameServerKeys.GetWeaponDetails, {
                    weapon_id: weaponID,
                })

                if (!resp) return
                setWeaponDetails(resp)
            } catch (e) {
                console.error(e)
            }
        })()
    }, [weaponID, send])

    const primaryColor = theme.factionTheme.primary
    const backgroundColor = theme.factionTheme.background

    if (!weaponDetails) return null

    return (
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
                sx={{ flexShrink: 0, height: "100%", width: "42rem" }}
            >
                <Stack sx={{ height: "100%" }}>
                    <ClipThing clipSize="10px" corners={{ topRight: true }} opacity={0.7} sx={{ flexShrink: 0 }}>
                        <Box sx={{ height: "12.5rem", position: "relative", borderBottom: `${primaryColor}50 1.5px solid` }}>
                            <MediaPreview imageUrl={weaponDetails.avatar_url} objectFit="cover" objectPosition="50% 40%" />

                            {/* TODO weapon status */}
                            <Box sx={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0, background: `linear-gradient(#FFFFFF00 60%, #00000050)` }} />
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
                            scrollbarWidth: "none",
                            "::-webkit-scrollbar": {
                                width: ".4rem",
                            },
                            "::-webkit-scrollbar-track": {
                                background: "#FFFFFF15",
                                borderRadius: 3,
                            },
                            "::-webkit-scrollbar-thumb": {
                                background: (theme) => theme.factionTheme.primary,
                                borderRadius: 3,
                            },
                        }}
                    >
                        <Box sx={{ direction: "ltr", height: 0 }}>
                            <Stack spacing="1.6rem" sx={{ p: "1rem 1rem" }}>
                                {/* Mech avatar, label, name etc */}
                                <Stack spacing=".5rem">
                                    <Typography sx={{ fontFamily: fonts.nostromoBlack }}>{weaponDetails.label}</Typography>
                                </Stack>

                                {/* Bar stats */}
                                <Stack spacing=".5rem">
                                    <Stack direction="row" spacing=".8rem" alignItems="center">
                                        <SvgStats fill={primaryColor} size="1.6rem" />
                                        <Typography sx={{ color: primaryColor, fontFamily: fonts.nostromoBlack }}>WEAPON STATS</Typography>
                                    </Stack>
                                    <WeaponBarStats
                                        weapon={weaponDetails}
                                        weaponDetails={weaponDetails}
                                        color={primaryColor}
                                        fontSize="1.2rem"
                                        width="100%"
                                        spacing="1.2rem"
                                        barHeight=".9rem"
                                    />
                                </Stack>
                            </Stack>
                        </Box>
                    </Box>

                    {/* Status and buttons */}
                    <WeaponButtons weapon={weaponDetails} marketLocked={weaponDetails.locked_to_marketplace} />
                </Stack>
            </ClipThing>

            {/* Right side */}
            <ClipThing
                clipSize="10px"
                border={{
                    borderColor: primaryColor,
                    borderThickness: ".3rem",
                }}
                opacity={0.7}
                backgroundColor={backgroundColor}
                sx={{ height: "100%", flex: 1 }}
            >
                <Stack sx={{ height: "100%" }}>
                    <WeaponViewer weapon={weaponDetails} />
                </Stack>
            </ClipThing>
        </Stack>
    )
}

const WeaponViewer = ({ weapon }: { weapon: Weapon }) => {
    const theme = useTheme()
    const imageUrl = weapon?.large_image_url
    const animationUrl = weapon?.animation_url
    const cardAnimationUrl = weapon?.card_animation_url

    return (
        <Box
            sx={{
                position: "relative",
                height: "100%",
                width: "100%",
                overflow: "hidden",
                border: `${theme.factionTheme.primary}90 .3rem solid`,
                borderLeft: "none",
                boxShadow: 2,
            }}
        >
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    boxShadow: `inset 0 0 50px 60px ${theme.factionTheme.background}90`,
                    zIndex: 4,
                }}
            />

            <MediaPreview
                imageUrl={imageUrl}
                videoUrls={[animationUrl, cardAnimationUrl]}
                objectFit="cover !important"
                objectPosition="50% 8%"
                sx={{
                    position: "absolute",
                    zIndex: 3,
                }}
            />
        </Box>
    )
}
