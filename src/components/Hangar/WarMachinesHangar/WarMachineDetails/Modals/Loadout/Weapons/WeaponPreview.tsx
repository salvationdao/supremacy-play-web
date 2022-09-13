import { Box, Stack, Switch, Typography } from "@mui/material"
import { useCallback, useMemo, useState } from "react"
import { useTheme } from "../../../../../../../containers/theme"
import { getRarityDeets } from "../../../../../../../helpers"
import { colors, fonts } from "../../../../../../../theme/theme"
import { Weapon } from "../../../../../../../types"
import { FancyButton } from "../../../../../../Common/FancyButton"
import { FeatherFade } from "../../../MechViewer"
import { OnConfirmWeaponSelection } from "../MechLoadoutWeaponModal"

interface WeaponPreviewProps {
    onConfirm: OnConfirmWeaponSelection
    weapon?: Weapon
    equipped?: Weapon
    skinInheritable: boolean
}

export const WeaponPreview = ({ onConfirm, weapon, equipped, skinInheritable }: WeaponPreviewProps) => {
    const theme = useTheme()
    const [inheritSkin, setInheritSkin] = useState(false)

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
                    {stats.oldStat ? `${Math.round((difference * 100 * 100) / stats.oldStat) / 100}%` : difference}
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
                    oldStat: equipped?.damage,
                    newStat: weapon.damage,
                }),
            typeof weapon.damage_falloff !== "undefined" &&
                renderStatChange("DAMAGE FALLOFF", {
                    oldStat: equipped?.damage_falloff,
                    newStat: weapon.damage_falloff,
                }),
            typeof weapon.radius !== "undefined" &&
                renderStatChange("RADIUS", {
                    oldStat: equipped?.radius,
                    newStat: weapon.radius,
                }),
            typeof weapon.radius_damage_falloff !== "undefined" &&
                renderStatChange("RADIAL DAMAGE FALLOFF", {
                    oldStat: equipped?.radius_damage_falloff,
                    newStat: weapon.radius_damage_falloff,
                }),
            typeof weapon.spread !== "undefined" &&
                renderStatChange("SPREAD", {
                    oldStat: equipped?.spread,
                    newStat: weapon.spread,
                    negated: true,
                }),
            typeof weapon.rate_of_fire !== "undefined" &&
                renderStatChange("RATE OF FIRE", {
                    oldStat: equipped?.rate_of_fire,
                    newStat: weapon.rate_of_fire,
                }),
            typeof weapon.projectile_speed !== "undefined" &&
                renderStatChange("PROJECTILE SPEED", {
                    oldStat: equipped?.projectile_speed,
                    newStat: weapon.projectile_speed,
                }),
            typeof weapon.energy_cost !== "undefined" &&
                renderStatChange("ENERGY COST", {
                    oldStat: equipped?.energy_cost,
                    newStat: weapon.energy_cost,
                    negated: true,
                }),
            typeof weapon.max_ammo !== "undefined" &&
                renderStatChange("MAX AMMO", {
                    oldStat: equipped?.max_ammo,
                    newStat: weapon.max_ammo,
                }),
        ]

        return stats.filter((s) => !!s)
    }, [
        equipped?.damage,
        equipped?.damage_falloff,
        equipped?.energy_cost,
        equipped?.max_ammo,
        equipped?.projectile_speed,
        equipped?.radius,
        equipped?.radius_damage_falloff,
        equipped?.rate_of_fire,
        equipped?.spread,
        renderStatChange,
        weapon,
    ])

    if (weapon) {
        const skin = weapon.weapon_skin
        const videoUrls = [skin?.animation_url || weapon?.animation_url, skin?.card_animation_url || weapon?.card_animation_url]
        const videoUrlsFilters = videoUrls ? videoUrls.filter((videoUrl) => !!videoUrl) : []
        const imageUrl = skin?.avatar_url || weapon?.avatar_url || skin?.image_url || weapon?.image_url || skin?.large_image_url || weapon?.large_image_url

        return (
            <Stack p="1rem 2rem" height="100%">
                <Box
                    sx={{
                        position: "relative",
                    }}
                >
                    <FeatherFade color={theme.factionTheme.background} />
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
                    <Box
                        sx={{
                            zIndex: 100,
                            position: "absolute",
                            left: 0,
                            bottom: 0,
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
                    </Box>
                </Box>
                <Stack
                    sx={{
                        zIndex: 100,
                        flex: 1,
                        overflowY: "auto",
                        overflowX: "hidden",
                        direction: "ltr",
                        mt: "1rem",

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
                    {weapon.equipped_on && (
                        <Typography
                            sx={{
                                color: colors.red,
                            }}
                        >
                            Currently equipped on another mech.
                        </Typography>
                    )}
                    {statChanges.length > 0 ? (
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
                    )}
                </Stack>
                <Stack
                    direction="row"
                    spacing="1rem"
                    sx={{
                        zIndex: 100,
                        pt: "1rem",
                    }}
                >
                    <Box ml="auto" />
                    {skinInheritable && (
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Switch
                                size="small"
                                checked={inheritSkin}
                                onChange={(e, c) => setInheritSkin(c)}
                                sx={{
                                    transform: "scale(.7)",
                                    ".Mui-checked": { color: theme.factionTheme.primary },
                                    ".Mui-checked+.MuiSwitch-track": { backgroundColor: `${theme.factionTheme.primary}50` },
                                }}
                            />
                            <Typography variant="body2" sx={{ lineHeight: 1, fontWeight: "fontWeightBold" }}>
                                Inherit Skin
                            </Typography>
                        </Stack>
                    )}
                    <FancyButton
                        clipThingsProps={{
                            backgroundColor: colors.green,
                        }}
                        onClick={() => onConfirm(weapon, inheritSkin)}
                    >
                        Equip To Mech
                    </FancyButton>
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
                Select a weapon to view its details.
            </Typography>
        </Stack>
    )
}
