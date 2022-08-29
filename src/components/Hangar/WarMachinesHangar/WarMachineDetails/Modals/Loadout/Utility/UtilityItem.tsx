import { Box, CircularProgress, Divider, Stack, Typography } from "@mui/material"
import { useCallback, useState } from "react"
import { SvgView } from "../../../../../../../assets"
import { useTheme } from "../../../../../../../containers/theme"
import { getRarityDeets } from "../../../../../../../helpers"
import { useGameServerSubscriptionFaction } from "../../../../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../../../../keys"
import { colors, fonts } from "../../../../../../../theme/theme"
import { Utility, UtilityType } from "../../../../../../../types"
import { ClipThing } from "../../../../../../Common/ClipThing"
import { FancyButton } from "../../../../../../Common/FancyButton"

interface UtilityItemProps {
    id: string
    equipped: Utility
    selected: boolean
    onSelect: (w: Utility) => void
}

export const UtilityItem = ({ id, equipped, selected, onSelect }: UtilityItemProps) => {
    const theme = useTheme()
    const [utilityDetails, setUtilityDetails] = useState<Utility>()

    useGameServerSubscriptionFaction<Utility>(
        {
            URI: `/utility/${id}/details`,
            key: GameServerKeys.GetUtilityDetails,
        },
        (payload) => {
            if (!payload) return
            setUtilityDetails(payload)
        },
    )

    const renderStat = useCallback((label: string, stats: { oldStat?: number; newStat: number; negated?: boolean }) => {
        const positiveColor = stats.negated ? colors.red : colors.green
        const negativeColor = stats.negated ? colors.green : colors.red
        const difference = stats.newStat - (stats.oldStat || 0)
        const color = difference > 0 ? positiveColor : difference === 0 ? "white" : negativeColor
        const symbol = difference > 0 ? "+" : ""

        return (
            <Stack direction="row" spacing="1rem" alignItems="center">
                <Typography
                    variant="caption"
                    sx={{
                        color: colors.lightGrey,
                        fontSize: "1rem",
                        fontFamily: fonts.nostromoBlack,
                    }}
                >
                    {label}
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        color,
                    }}
                >
                    {stats.newStat} {difference !== 0 && `(${symbol}${difference})`}
                </Typography>
            </Stack>
        )
    }, [])

    const renderUtilityStats = useCallback(() => {
        if (!utilityDetails) return

        switch (utilityDetails.type) {
            case UtilityType.Shield: {
                const oldUtility = equipped.shield
                const utility = utilityDetails.shield

                if (!utility) return
                return (
                    <Stack>
                        {typeof utility.hitpoints !== "undefined" &&
                            renderStat("HITPOINTS", {
                                oldStat: oldUtility?.hitpoints,
                                newStat: utility.hitpoints,
                            })}
                        {typeof utility.recharge_rate !== "undefined" &&
                            renderStat("RECHARGE RATE", {
                                oldStat: oldUtility?.recharge_rate,
                                newStat: utility.recharge_rate,
                            })}
                        {typeof utility.recharge_energy_cost !== "undefined" &&
                            renderStat("ENERGY COST", {
                                oldStat: oldUtility?.recharge_energy_cost,
                                newStat: utility.recharge_energy_cost,
                            })}
                    </Stack>
                )
            }
            case UtilityType.AttackDrone: {
                const oldUtility = equipped.attack_drone
                const utility = utilityDetails.attack_drone

                if (!utility) return
                return (
                    <Stack>
                        {typeof utility.hitpoints !== "undefined" &&
                            renderStat("HITPOINTS", {
                                oldStat: oldUtility?.hitpoints,
                                newStat: utility.hitpoints,
                            })}
                        {typeof utility.damage !== "undefined" &&
                            renderStat("DAMAGE", {
                                oldStat: oldUtility?.damage,
                                newStat: utility.damage,
                            })}
                        {typeof utility.rate_of_fire !== "undefined" &&
                            renderStat("RATE OF FIRE", {
                                oldStat: oldUtility?.rate_of_fire,
                                newStat: utility.rate_of_fire,
                            })}
                        {typeof utility.lifespan_seconds !== "undefined" &&
                            renderStat("LIFESPAN (SECONDS)", {
                                oldStat: oldUtility?.lifespan_seconds,
                                newStat: utility.lifespan_seconds,
                            })}
                        {typeof utility.deploy_energy_cost !== "undefined" &&
                            renderStat("ENERGY COST", {
                                oldStat: oldUtility?.deploy_energy_cost,
                                newStat: utility.deploy_energy_cost,
                            })}
                    </Stack>
                )
            }
            case UtilityType.RepairDrone: {
                const oldUtility = equipped.repair_drone
                const utility = utilityDetails.repair_drone

                if (!utility) return
                return (
                    <Stack>
                        {typeof utility.repair_amount !== "undefined" &&
                            renderStat("REPAIR AMOUNT", {
                                oldStat: oldUtility?.repair_amount,
                                newStat: utility.repair_amount,
                            })}
                        <Stack direction="row" spacing="1rem" alignItems="center">
                            <Typography
                                variant="caption"
                                sx={{
                                    color: colors.lightGrey,
                                    fontSize: "1rem",
                                    fontFamily: fonts.nostromoBlack,
                                }}
                            >
                                REPAIR TYPE
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: "white",
                                }}
                            >
                                {utility.repair_type}
                            </Typography>
                        </Stack>
                        {typeof utility.lifespan_seconds !== "undefined" &&
                            renderStat("LIFESPAN (SECONDS)", {
                                oldStat: oldUtility?.lifespan_seconds,
                                newStat: utility.lifespan_seconds,
                            })}
                        {typeof utility.deploy_energy_cost !== "undefined" &&
                            renderStat("ENERGY COST", {
                                oldStat: oldUtility?.deploy_energy_cost,
                                newStat: utility.deploy_energy_cost,
                            })}
                    </Stack>
                )
            }
            case UtilityType.Accelerator: {
                const oldUtility = equipped.accelerator
                const utility = utilityDetails.accelerator

                if (!utility) return
                return (
                    <Stack>
                        {typeof utility.boost_amount !== "undefined" &&
                            renderStat("BOOST AMOUNT", {
                                oldStat: oldUtility?.boost_amount,
                                newStat: utility.boost_amount,
                            })}
                        {typeof utility.boost_seconds !== "undefined" &&
                            renderStat("DURATION (SECONDS)", {
                                oldStat: oldUtility?.boost_seconds,
                                newStat: utility.boost_seconds,
                            })}
                        {typeof utility.energy_cost !== "undefined" &&
                            renderStat("ENERGY COST", {
                                oldStat: oldUtility?.energy_cost,
                                newStat: utility.energy_cost,
                            })}
                    </Stack>
                )
            }
            case UtilityType.AntiMissile: {
                const oldUtility = equipped.anti_missile
                const utility = utilityDetails.anti_missile

                if (!utility) return
                return (
                    <Stack>
                        {typeof utility.rate_of_fire !== "undefined" &&
                            renderStat("RATE OF FIRE", {
                                oldStat: oldUtility?.rate_of_fire,
                                newStat: utility.rate_of_fire,
                            })}
                        {typeof utility.fire_energy_cost !== "undefined" &&
                            renderStat("ENERGY COST", {
                                oldStat: oldUtility?.fire_energy_cost,
                                newStat: utility.fire_energy_cost,
                            })}
                    </Stack>
                )
            }
        }
    }, [equipped.accelerator, equipped.anti_missile, equipped.attack_drone, equipped.repair_drone, equipped.shield, renderStat, utilityDetails])

    if (!utilityDetails) {
        return (
            <ClipThing
                border={{
                    borderColor: theme.factionTheme.primary,
                }}
                backgroundColor={theme.factionTheme.background}
            >
                <Stack alignItems="center" justifyContent="center">
                    <CircularProgress />
                </Stack>
            </ClipThing>
        )
    }

    return (
        <FancyButton
            clipThingsProps={{
                border: {
                    borderColor: theme.factionTheme.primary,
                },
                backgroundColor: theme.factionTheme.background,
            }}
            sx={{
                position: "relative",
                padding: "1rem",
                backgroundColor: selected ? "#ffffff22" : "transparent",
            }}
            onClick={() => onSelect(utilityDetails)}
        >
            {utilityDetails.equipped_on && (
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "black",
                        opacity: 0.4,
                    }}
                >
                    <Typography
                        variant="h2"
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                        }}
                    >
                        IN USE
                    </Typography>
                </Box>
            )}
            {selected && (
                <SvgView
                    size="3rem"
                    sx={{
                        position: "absolute",
                        top: "2rem",
                        right: "2rem",
                        opacity: 0.5,
                    }}
                />
            )}
            <Stack direction="row" alignItems="stretch" padding="1rem">
                <Box sx={{ width: "10rem" }}>
                    <Box
                        sx={{
                            position: "relative",
                            height: "9rem",
                            width: "100%",
                        }}
                    >
                        <Box
                            component="img"
                            src={utilityDetails.avatar_url || utilityDetails.image_url || utilityDetails.large_image_url}
                            sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                            }}
                        />
                    </Box>

                    <Typography
                        variant="h6"
                        sx={{
                            color: getRarityDeets(utilityDetails.tier).color,
                            fontFamily: fonts.nostromoBlack,
                        }}
                    >
                        {utilityDetails.tier}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            textAlign: "center",
                        }}
                    >
                        {utilityDetails.label}
                    </Typography>
                </Box>
                <Divider
                    orientation="vertical"
                    sx={{
                        alignSelf: "stretch",
                        height: "auto",
                        mx: "1rem",
                        borderColor: "#494949",
                    }}
                />
                {renderUtilityStats()}
            </Stack>
        </FancyButton>
    )
}
