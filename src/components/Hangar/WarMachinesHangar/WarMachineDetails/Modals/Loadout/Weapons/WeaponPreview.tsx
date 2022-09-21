import { Box, Stack, Typography } from "@mui/material"
import { useCallback, useMemo } from "react"
import { useTheme } from "../../../../../../../containers/theme"
import { getRarityDeets } from "../../../../../../../helpers"
import { colors, fonts } from "../../../../../../../theme/theme"
import { Weapon } from "../../../../../../../types"
import { ClipThing } from "../../../../../../Common/ClipThing"
import { FeatherFade } from "../../../MechViewer"

interface WeaponPreviewProps {
    weapon?: Weapon
    compareTo?: Weapon
    disableCompare?: boolean
}

export const WeaponPreview = ({ weapon, compareTo, disableCompare }: WeaponPreviewProps) => {
    const theme = useTheme()

    const renderStatChange = useCallback((label: string, stats: { oldStat?: number; newStat: number; negated?: boolean }) => {
        const positiveColor = stats.negated ? colors.red : colors.green
        const negativeColor = stats.negated ? colors.green : colors.red
        const difference = stats.newStat - (stats.oldStat || 0)
        const color = difference > 0 ? positiveColor : difference === 0 ? "white" : negativeColor
        const symbol = difference > 0 ? "+" : ""

        if (difference === 0) return null

        return (
            <Stack key={label} direction="row" spacing=".8rem" alignItems="center">
                <Typography
                    variant="body2"
                    sx={{
                        color,
                    }}
                >
                    {symbol}
                    {stats.oldStat && stats.oldStat > 0 ? `${Math.round((difference * 100 * 100) / stats.oldStat) / 100}%` : difference}
                </Typography>
                <Typography
                    variant="caption"
                    sx={{
                        fontSize: "1rem",
                        fontFamily: fonts.nostromoBlack,
                    }}
                >
                    {label}
                </Typography>
            </Stack>
        )
    }, [])

    const statChanges = useMemo(() => {
        if (!weapon) return []

        const stats = [
            typeof weapon.damage !== "undefined" &&
                renderStatChange("DAMAGE", {
                    oldStat: compareTo?.damage,
                    newStat: weapon.damage,
                }),
            typeof weapon.damage_falloff !== "undefined" &&
                renderStatChange("DAMAGE FALLOFF", {
                    oldStat: compareTo?.damage_falloff,
                    newStat: weapon.damage_falloff,
                }),
            typeof weapon.radius !== "undefined" &&
                renderStatChange("RADIUS", {
                    oldStat: compareTo?.radius,
                    newStat: weapon.radius,
                }),
            typeof weapon.radius_damage_falloff !== "undefined" &&
                renderStatChange("RADIAL DAMAGE FALLOFF", {
                    oldStat: compareTo?.radius_damage_falloff,
                    newStat: weapon.radius_damage_falloff,
                }),
            typeof weapon.spread !== "undefined" &&
                renderStatChange("SPREAD", {
                    oldStat: compareTo?.spread,
                    newStat: weapon.spread,
                    negated: true,
                }),
            typeof weapon.rate_of_fire !== "undefined" &&
                renderStatChange("RATE OF FIRE", {
                    oldStat: compareTo?.rate_of_fire,
                    newStat: weapon.rate_of_fire,
                }),
            typeof weapon.projectile_speed !== "undefined" &&
                renderStatChange("PROJECTILE SPEED", {
                    oldStat: compareTo?.projectile_speed,
                    newStat: weapon.projectile_speed,
                }),
            typeof weapon.energy_cost !== "undefined" &&
                renderStatChange("ENERGY COST", {
                    oldStat: compareTo?.energy_cost,
                    newStat: weapon.energy_cost,
                    negated: true,
                }),
            typeof weapon.max_ammo !== "undefined" &&
                renderStatChange("MAX AMMO", {
                    oldStat: compareTo?.max_ammo,
                    newStat: weapon.max_ammo,
                }),
        ]

        return stats.filter((s) => !!s)
    }, [
        compareTo?.damage,
        compareTo?.damage_falloff,
        compareTo?.energy_cost,
        compareTo?.max_ammo,
        compareTo?.projectile_speed,
        compareTo?.radius,
        compareTo?.radius_damage_falloff,
        compareTo?.rate_of_fire,
        compareTo?.spread,
        renderStatChange,
        weapon,
    ])

    if (weapon) {
        const skin = weapon.weapon_skin
        const videoUrls = [skin?.animation_url || weapon?.animation_url, skin?.card_animation_url || weapon?.card_animation_url]
        const videoUrlsFilters = videoUrls ? videoUrls.filter((videoUrl) => !!videoUrl) : []
        const imageUrl = skin?.avatar_url || weapon?.avatar_url || skin?.image_url || weapon?.image_url || skin?.large_image_url || weapon?.large_image_url

        return (
            <Stack
                sx={{
                    width: "300px",
                }}
            >
                <ClipThing
                    sx={{
                        position: "relative",
                        height: "100px",
                        width: "100px",
                    }}
                    backgroundColor={theme.factionTheme.background}
                    border={{
                        borderColor: theme.factionTheme.primary,
                        borderThickness: ".2rem",
                    }}
                    corners={{
                        topLeft: true,
                        bottomRight: true,
                    }}
                >
                    <FeatherFade color={`${theme.factionTheme.background}aa`} featherBlur="10px" featherSize="10px" />
                    {(!videoUrlsFilters || videoUrlsFilters.length <= 0) && imageUrl ? (
                        <Box
                            component="img"
                            src={imageUrl}
                            sx={{
                                height: "100%",
                                width: "100%",
                                objectFit: "contain",
                                objectPosition: "center",
                            }}
                        />
                    ) : (
                        <Box
                            key={imageUrl}
                            component="video"
                            sx={{
                                height: "100%",
                                width: "100%",
                                objectFit: "contain",
                                objectPosition: "center",
                            }}
                            disablePictureInPicture
                            disableRemotePlayback
                            loop
                            muted
                            autoPlay
                            controls={false}
                            poster={`${imageUrl}`}
                        >
                            {videoUrlsFilters.map((videoUrl, i) => videoUrl && <source key={videoUrl + i} src={videoUrl} type="video/mp4" />)}
                        </Box>
                    )}
                </ClipThing>
                <Stack
                    sx={{
                        zIndex: 100,
                        flex: 1,
                        overflowY: "auto",
                        overflowX: "hidden",
                        direction: "ltr",
                        mt: "1rem",
                        scrollbarColor: `${theme.factionTheme.primary}55 ${"#FFFFFF15"}`,
                        scrollbarWidth: "thin",

                        "::-webkit-scrollbar": {
                            width: ".4rem",
                        },
                        "::-webkit-scrollbar-track": {
                            background: "#FFFFFF15",
                            borderRadius: 3,
                        },
                        "::-webkit-scrollbar-thumb": {
                            background: theme.factionTheme.primary,
                            borderRadius: 3,
                        },
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            color: getRarityDeets(weapon.tier).color,
                            fontFamily: fonts.nostromoBlack,
                        }}
                    >
                        {weapon.tier}
                    </Typography>
                    <Typography
                        variant="h4"
                        sx={{
                            fontFamily: fonts.nostromoBlack,
                        }}
                    >
                        {weapon.label}
                    </Typography>

                    {disableCompare ? (
                        <Typography
                            sx={{
                                color: colors.lightGrey,
                            }}
                        >
                            Currently equipped to this mech.
                        </Typography>
                    ) : (
                        weapon.equipped_on && (
                            <Typography
                                sx={{
                                    color: weapon.locked_to_mech ? colors.red : colors.yellow,
                                }}
                            >
                                Currently {weapon.locked_to_mech ? "locked to" : "equipped on"} another mech.
                            </Typography>
                        )
                    )}
                    {!disableCompare &&
                        (statChanges.length > 0 ? (
                            <Stack>
                                <Typography
                                    sx={{
                                        color: colors.lightGrey,
                                        textTransform: "uppercase",
                                    }}
                                >
                                    Stat Changes If Equipped:
                                </Typography>
                                {statChanges}
                            </Stack>
                        ) : (
                            <Typography
                                sx={{
                                    color: colors.lightGrey,
                                    textTransform: "uppercase",
                                }}
                            >
                                No Stat Changes If Equipped
                            </Typography>
                        ))}
                </Stack>
            </Stack>
        )
    }

    return (
        <Stack
            alignItems="center"
            justifyContent="center"
            sx={{
                height: "100%",
                width: "300px",
            }}
        >
            <Typography
                sx={{
                    px: "1.28rem",
                    pt: "1.28rem",
                    color: colors.grey,
                    fontFamily: fonts.nostromoBold,
                    textAlign: "center",
                }}
            >
                {disableCompare ? "No weapon equipped." : "Select a weapon to compare its details."}
            </Typography>
        </Stack>
    )
}
