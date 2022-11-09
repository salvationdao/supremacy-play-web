import { Box, Stack, Typography } from "@mui/material"
import { useCallback, useMemo } from "react"
import { useTheme } from "../../../../../../../containers/theme"
import { getRarityDeets } from "../../../../../../../helpers"
import { colors, fonts } from "../../../../../../../theme/theme"
import { BoostStatEnum, MechDetails, MechSkin } from "../../../../../../../types"
import { FancyButton } from "../../../../../../Common/Deprecated/FancyButton"
import { FeatherFade } from "../../../MechViewer/MechViewer"
import { OnConfirmMechSkinSelection } from "../MechLoadoutMechSkinModal"

interface MechSkinPreviewProps {
    onConfirm: OnConfirmMechSkinSelection
    mech: MechDetails
    submodel?: MechSkin
    equipped?: MechSkin
    isCompatible: boolean
}

export const MechSkinPreview = ({ onConfirm, mech, submodel, equipped }: MechSkinPreviewProps) => {
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
        if (!submodel) return []
        const newStats = calculateBoostedStats(mech, submodel)
        const oldStats = calculateBoostedStats(mech, equipped)

        const stats = [
            renderStatChange("MAX HITPOINTS", {
                oldStat: oldStats.boostedMaxHitpoints,
                newStat: newStats.boostedMaxHitpoints,
            }),
            renderStatChange("SHIELD RECHARGE RATE", {
                oldStat: oldStats.boostedShieldRechargeRate,
                newStat: newStats.boostedShieldRechargeRate,
            }),
            renderStatChange("SPEED", {
                oldStat: oldStats.boostedSpeed,
                newStat: newStats.boostedSpeed,
            }),
        ]

        return stats.filter((s) => !!s)
    }, [submodel, mech, equipped, renderStatChange])

    if (submodel) {
        const videoUrls = [
            submodel.swatch_images?.animation_url,
            submodel.swatch_images?.card_animation_url,
            submodel?.animation_url,
            submodel?.card_animation_url,
        ]
        const videoUrlsFilters = videoUrls ? videoUrls.filter((videoUrl) => !!videoUrl) : []
        const imageUrl =
            submodel.swatch_images?.avatar_url ||
            submodel.swatch_images?.image_url ||
            submodel.swatch_images?.large_image_url ||
            submodel?.avatar_url ||
            submodel?.image_url ||
            submodel?.large_image_url

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
                                color: getRarityDeets(submodel.tier).color,
                                fontFamily: fonts.nostromoBlack,
                            }}
                        >
                            {getRarityDeets(submodel.tier).label}
                        </Typography>
                        <Typography
                            variant="h4"
                            sx={{
                                fontFamily: fonts.nostromoBlack,
                            }}
                        >
                            {submodel.label}
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
                    }}
                >
                    {submodel.equipped_on && (
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
                    <FancyButton
                        clipThingsProps={{
                            backgroundColor: colors.green,
                        }}
                        onClick={() => onConfirm(submodel)}
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

// func (m *Mech) SetBoostedStats() error {
// 	if m.ChassisSkin == nil {
// 		return fmt.Errorf("missing mech skin object")
// 	}
// 	// get the % increase
// 	boostPercent := (float32(m.ChassisSkin.Level) / 100) + 1

// 	if m.BoostedStat == boiler.BoostStatMECH_SPEED {
// 		m.BoostedSpeed = int(boostPercent * float32(m.Speed)) // set the boosted stat
// 	} else {
// 		m.BoostedSpeed = m.Speed // set boosted speed to the speed, means we can always just use boosted stat instead of figuring out which one is better down the line
// 	}
// 	if m.BoostedStat == boiler.BoostStatMECH_HEALTH {
// 		m.BoostedMaxHitpoints = int(boostPercent * float32(m.MaxHitpoints))
// 	} else {
// 		m.BoostedMaxHitpoints = m.MaxHitpoints
// 	}
// 	if m.BoostedStat == boiler.BoostStatSHIELD_REGEN {
// 		m.BoostedShieldRechargeRate = int(boostPercent * float32(m.ShieldRechargeRate))
// 	} else {
// 		m.BoostedShieldRechargeRate = m.ShieldRechargeRate
// 	}

// 	return nil
// }

export const calculateBoostedStats = (mech: MechDetails, nextSkin?: MechSkin) => {
    const boostedStats = {
        boostedSpeed: mech.speed,
        boostedMaxHitpoints: mech.max_hitpoints,
        boostedShieldRechargeRate: mech.shield_recharge_rate,
    }

    if (!nextSkin) return boostedStats

    const boostPercent = nextSkin.level / 100 + 1
    switch (mech.boosted_stat) {
        case BoostStatEnum.MechSpeed:
            boostedStats.boostedSpeed = boostPercent * mech.speed
            break
        case BoostStatEnum.MechHealth:
            boostedStats.boostedMaxHitpoints = boostPercent * mech.max_hitpoints
            break
        case BoostStatEnum.ShieldRegen:
            boostedStats.boostedShieldRechargeRate = boostPercent * mech.shield_recharge_rate
            break
    }

    return boostedStats
}
