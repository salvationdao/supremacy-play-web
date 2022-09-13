import { Box, Stack, Typography } from "@mui/material"
import { useCallback, useMemo } from "react"
import { useTheme } from "../../../../../../../containers/theme"
import { getRarityDeets } from "../../../../../../../helpers"
import { colors, fonts } from "../../../../../../../theme/theme"
import { Utility } from "../../../../../../../types"
import { FancyButton } from "../../../../../../Common/FancyButton"
import { FeatherFade } from "../../../MechViewer"
import { OnConfirmUtilitySelection } from "../MechLoadoutUtilityModal"

interface UtilityPreviewProps {
    onConfirm: OnConfirmUtilitySelection
    utility?: Utility
    equipped?: Utility
}

export const UtilityPreview = ({ onConfirm, utility, equipped }: UtilityPreviewProps) => {
    const theme = useTheme()

    const renderStatChange = useCallback((label: string, stats: { oldStat?: number; newStat: number; negated?: boolean }) => {
        const positiveColor = stats.negated ? colors.red : colors.green
        const negativeColor = stats.negated ? colors.green : colors.red
        const difference = stats.newStat - (stats.oldStat || 0)
        const color = difference > 0 ? positiveColor : difference === 0 ? "white" : negativeColor
        const symbol = difference > 0 ? "+" : ""

        if (difference === 0 || !stats.oldStat) return null

        const percentageDifference = Math.round((difference * 100 * 100) / stats.oldStat) / 100
        return (
            <Stack key={label} direction="row" spacing="1rem" alignItems="center">
                <Typography
                    variant="body2"
                    sx={{
                        color,
                    }}
                >
                    {symbol}
                    {percentageDifference}%
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
        if (!utility) return []

        const stats = [
            // Shield
            typeof utility.shield?.hitpoints !== "undefined" &&
                renderStatChange("HITPOINTS", {
                    oldStat: equipped?.shield?.hitpoints,
                    newStat: utility.shield?.hitpoints,
                }),
            typeof utility.shield?.recharge_rate !== "undefined" &&
                renderStatChange("RECHARGE RATE", {
                    oldStat: equipped?.shield?.recharge_rate,
                    newStat: utility.shield?.recharge_rate,
                }),
            typeof utility.shield?.recharge_energy_cost !== "undefined" &&
                renderStatChange("ENERGY COST", {
                    oldStat: equipped?.shield?.recharge_energy_cost,
                    newStat: utility.shield?.recharge_energy_cost,
                }),

            // AttackDrone
            typeof utility.attack_drone?.hitpoints !== "undefined" &&
                renderStatChange("HITPOINTS", {
                    oldStat: equipped?.attack_drone?.hitpoints,
                    newStat: utility.attack_drone?.hitpoints,
                }),
            typeof utility.attack_drone?.damage !== "undefined" &&
                renderStatChange("DAMAGE", {
                    oldStat: equipped?.attack_drone?.damage,
                    newStat: utility.attack_drone?.damage,
                }),
            typeof utility.attack_drone?.rate_of_fire !== "undefined" &&
                renderStatChange("RATE OF FIRE", {
                    oldStat: equipped?.attack_drone?.rate_of_fire,
                    newStat: utility.attack_drone?.rate_of_fire,
                }),
            typeof utility.attack_drone?.lifespan_seconds !== "undefined" &&
                renderStatChange("LIFESPAN (SECONDS)", {
                    oldStat: equipped?.attack_drone?.lifespan_seconds,
                    newStat: utility.attack_drone?.lifespan_seconds,
                }),
            typeof utility.attack_drone?.deploy_energy_cost !== "undefined" &&
                renderStatChange("ENERGY COST", {
                    oldStat: equipped?.attack_drone?.deploy_energy_cost,
                    newStat: utility.attack_drone?.deploy_energy_cost,
                }),

            // RepairDrone
            typeof utility.repair_drone?.repair_amount !== "undefined" &&
                renderStatChange("REPAIR AMOUNT", {
                    oldStat: equipped?.repair_drone?.repair_amount,
                    newStat: utility.repair_drone?.repair_amount,
                }),
            typeof utility.repair_drone?.lifespan_seconds !== "undefined" &&
                renderStatChange("LIFESPAN (SECONDS)", {
                    oldStat: equipped?.repair_drone?.lifespan_seconds,
                    newStat: utility.repair_drone?.lifespan_seconds,
                }),
            typeof utility.repair_drone?.deploy_energy_cost !== "undefined" &&
                renderStatChange("ENERGY COST", {
                    oldStat: equipped?.repair_drone?.deploy_energy_cost,
                    newStat: utility.repair_drone?.deploy_energy_cost,
                }),

            // Accelerator
            typeof utility.accelerator?.boosted_amount !== "undefined" &&
                renderStatChange("BOOST AMOUNT", {
                    oldStat: equipped?.accelerator?.boosted_amount,
                    newStat: utility.accelerator?.boosted_amount,
                }),
            typeof utility.accelerator?.boosted_seconds !== "undefined" &&
                renderStatChange("DURATION (SECONDS)", {
                    oldStat: equipped?.accelerator?.boosted_seconds,
                    newStat: utility.accelerator?.boosted_seconds,
                }),
            typeof utility.accelerator?.energy_cost !== "undefined" &&
                renderStatChange("ENERGY COST", {
                    oldStat: equipped?.accelerator?.energy_cost,
                    newStat: utility.accelerator?.energy_cost,
                }),

            // AntiMissile

            typeof utility.anti_missile?.rate_of_fire !== "undefined" &&
                renderStatChange("RATE OF FIRE", {
                    oldStat: equipped?.anti_missile?.rate_of_fire,
                    newStat: utility.anti_missile?.rate_of_fire,
                }),
            typeof utility.anti_missile?.fire_energy_cost !== "undefined" &&
                renderStatChange("ENERGY COST", {
                    oldStat: equipped?.anti_missile?.fire_energy_cost,
                    newStat: utility.anti_missile?.fire_energy_cost,
                }),
        ]

        return stats.filter((s) => !!s)
    }, [
        equipped?.accelerator?.boosted_amount,
        equipped?.accelerator?.boosted_seconds,
        equipped?.accelerator?.energy_cost,
        equipped?.anti_missile?.fire_energy_cost,
        equipped?.anti_missile?.rate_of_fire,
        equipped?.attack_drone?.damage,
        equipped?.attack_drone?.deploy_energy_cost,
        equipped?.attack_drone?.hitpoints,
        equipped?.attack_drone?.lifespan_seconds,
        equipped?.attack_drone?.rate_of_fire,
        equipped?.repair_drone?.deploy_energy_cost,
        equipped?.repair_drone?.lifespan_seconds,
        equipped?.repair_drone?.repair_amount,
        equipped?.shield?.hitpoints,
        equipped?.shield?.recharge_energy_cost,
        equipped?.shield?.recharge_rate,
        renderStatChange,
        utility,
    ])

    if (utility) {
        const videoUrls = [utility?.animation_url, utility?.card_animation_url]
        const videoUrlsFilters = videoUrls ? videoUrls.filter((videoUrl) => !!videoUrl) : []
        const imageUrl = utility?.avatar_url || utility?.image_url || utility?.large_image_url

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
                                color: getRarityDeets(utility.tier).color,
                                fontFamily: fonts.nostromoBlack,
                            }}
                        >
                            {utility.tier}
                        </Typography>
                        <Typography
                            variant="h4"
                            sx={{
                                fontFamily: fonts.nostromoBlack,
                            }}
                        >
                            {utility.label}
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
                    {utility.equipped_on && (
                        <Typography
                            sx={{
                                color: colors.red,
                            }}
                        >
                            Currently {utility.locked_to_mech ? "locked to" : "equipped on"} another mech.
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
                {!utility.locked_to_mech && (
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
                            onClick={() => onConfirm(utility)}
                        >
                            Equip To Mech
                        </FancyButton>
                    </Stack>
                )}
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
