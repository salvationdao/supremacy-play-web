import { Box, CircularProgress, Divider, Stack, Typography } from "@mui/material"
import { useCallback, useState } from "react"
import { SvgView } from "../../../../../../../assets"
import { useTheme } from "../../../../../../../containers/theme"
import { getRarityDeets } from "../../../../../../../helpers"
import { useGameServerSubscriptionFaction } from "../../../../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../../../../keys"
import { colors, fonts } from "../../../../../../../theme/theme"
import { PowerCore } from "../../../../../../../types"
import { ClipThing } from "../../../../../../Common/ClipThing"
import { FancyButton } from "../../../../../../Common/FancyButton"

interface PowerCoreItemProps {
    id: string
    equipped?: PowerCore
    selected: boolean
    onSelect: (w: PowerCore) => void
}

export const PowerCoreItem = ({ id, equipped, selected, onSelect }: PowerCoreItemProps) => {
    const theme = useTheme()

    const [powerCoreDetails, setPowerCoreDetails] = useState<PowerCore>()

    useGameServerSubscriptionFaction<PowerCore>(
        {
            URI: `/power_core/${id}/details`,
            key: GameServerKeys.GetPowerCoreDetails,
        },
        (payload) => {
            if (!payload) return
            setPowerCoreDetails(payload)
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

    if (!powerCoreDetails) {
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
            onClick={() => onSelect(powerCoreDetails)}
        >
            {powerCoreDetails.equipped_on && (
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
                            src={powerCoreDetails.avatar_url || powerCoreDetails.image_url || powerCoreDetails.large_image_url}
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
                            color: getRarityDeets(powerCoreDetails.tier).color,
                            fontFamily: fonts.nostromoBlack,
                        }}
                    >
                        {powerCoreDetails.tier}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            textAlign: "center",
                        }}
                    >
                        {powerCoreDetails.label}
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
                <Stack>
                    {typeof powerCoreDetails.capacity !== "undefined" &&
                        renderStat("CAPACITY", {
                            oldStat: equipped?.capacity,
                            newStat: powerCoreDetails.capacity,
                        })}
                    {typeof powerCoreDetails.max_draw_rate !== "undefined" &&
                        renderStat("MAX DRAW RATE", {
                            oldStat: equipped?.max_draw_rate,
                            newStat: powerCoreDetails.max_draw_rate,
                        })}
                    {typeof powerCoreDetails.recharge_rate !== "undefined" &&
                        renderStat("RECHARGE RATE", {
                            oldStat: equipped?.recharge_rate,
                            newStat: powerCoreDetails.recharge_rate,
                        })}
                    {typeof powerCoreDetails.armour !== "undefined" &&
                        renderStat("ARMOUR", {
                            oldStat: equipped?.armour,
                            newStat: powerCoreDetails.armour,
                        })}
                    {typeof powerCoreDetails.max_hitpoints !== "undefined" &&
                        renderStat("MAX HITPOINTS", {
                            oldStat: equipped?.max_hitpoints,
                            newStat: powerCoreDetails.max_hitpoints,
                        })}
                </Stack>
            </Stack>
        </FancyButton>
    )
}
