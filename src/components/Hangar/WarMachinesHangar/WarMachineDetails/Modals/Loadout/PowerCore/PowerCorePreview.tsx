import { Box, Stack, Typography } from "@mui/material"
import { useCallback, useMemo } from "react"
import { useTheme } from "../../../../../../../containers/theme"
import { getRarityDeets } from "../../../../../../../helpers"
import { colors, fonts } from "../../../../../../../theme/theme"
import { PowerCore } from "../../../../../../../types"
import { ClipThing } from "../../../../../../Common/ClipThing"
import { FeatherFade } from "../../../MechViewer/MechViewer"

interface PowerCorePreviewProps {
    powerCore?: PowerCore
    compareTo?: PowerCore
    disableCompare?: boolean
}

export const PowerCorePreview = ({ powerCore, compareTo, disableCompare }: PowerCorePreviewProps) => {
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
        if (!powerCore) return []

        const stats = [
            typeof powerCore.capacity !== "undefined" &&
                renderStatChange("DAMAGE", {
                    oldStat: compareTo?.capacity,
                    newStat: powerCore.capacity,
                }),
            typeof powerCore.max_draw_rate !== "undefined" &&
                renderStatChange("DAMAGE FALLOFF", {
                    oldStat: compareTo?.max_draw_rate,
                    newStat: powerCore.max_draw_rate,
                }),
            typeof powerCore.recharge_rate !== "undefined" &&
                renderStatChange("RADIUS", {
                    oldStat: compareTo?.recharge_rate,
                    newStat: powerCore.recharge_rate,
                }),
            typeof powerCore.armour !== "undefined" &&
                renderStatChange("RADIAL DAMAGE FALLOFF", {
                    oldStat: compareTo?.armour,
                    newStat: powerCore.armour,
                }),
            typeof powerCore.max_hitpoints !== "undefined" &&
                renderStatChange("SPREAD", {
                    oldStat: compareTo?.max_hitpoints,
                    newStat: powerCore.max_hitpoints,
                    negated: true,
                }),
        ]

        return stats.filter((s) => !!s)
    }, [powerCore, renderStatChange, compareTo?.capacity, compareTo?.max_draw_rate, compareTo?.recharge_rate, compareTo?.armour, compareTo?.max_hitpoints])

    if (powerCore) {
        const videoUrls = [powerCore?.animation_url, powerCore?.card_animation_url]
        const videoUrlsFilters = videoUrls ? videoUrls.filter((videoUrl) => !!videoUrl) : []
        const imageUrl = powerCore?.avatar_url || powerCore?.image_url || powerCore?.large_image_url

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
                            color: getRarityDeets(powerCore.tier).color,
                            fontFamily: fonts.nostromoBlack,
                        }}
                    >
                        {powerCore.tier}
                    </Typography>
                    <Typography
                        variant="h4"
                        sx={{
                            fontFamily: fonts.nostromoBlack,
                        }}
                    >
                        {powerCore.label}
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
                        powerCore.equipped_on && (
                            <Typography
                                sx={{
                                    color: colors.yellow,
                                }}
                            >
                                Currently equipped on another mech.
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
