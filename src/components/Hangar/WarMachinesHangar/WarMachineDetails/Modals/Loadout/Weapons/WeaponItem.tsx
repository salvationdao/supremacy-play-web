import { Box, CircularProgress, Divider, Stack, Typography } from "@mui/material"
import { useCallback, useState } from "react"
import { SvgView } from "../../../../../../../assets"
import { useTheme } from "../../../../../../../containers/theme"
import { getRarityDeets } from "../../../../../../../helpers"
import { useGameServerSubscriptionFaction } from "../../../../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../../../../keys"
import { colors, fonts } from "../../../../../../../theme/theme"
import { Weapon } from "../../../../../../../types"
import { ClipThing } from "../../../../../../Common/ClipThing"
import { FancyButton } from "../../../../../../Common/FancyButton"

interface WeaponItemProps {
    id: string
    equipped?: Weapon
    selected: boolean
    onSelect: (w: Weapon) => void
}

export const WeaponItem = ({ id, equipped, selected, onSelect }: WeaponItemProps) => {
    const theme = useTheme()

    const [weaponDetails, setWeaponDetails] = useState<Weapon>()

    useGameServerSubscriptionFaction<Weapon>(
        {
            URI: `/weapon/${id}/details`,
            key: GameServerKeys.GetWeaponDetails,
        },
        (payload) => {
            if (!payload) return
            setWeaponDetails(payload)
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

    if (!weaponDetails) {
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
            onClick={() => onSelect(weaponDetails)}
        >
            {weaponDetails.equipped_on && (
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
                            src={weaponDetails.avatar_url || weaponDetails.image_url || weaponDetails.large_image_url}
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
                            color: getRarityDeets(weaponDetails.tier).color,
                            fontFamily: fonts.nostromoBlack,
                        }}
                    >
                        {weaponDetails.tier}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            textAlign: "center",
                        }}
                    >
                        {weaponDetails.label}
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
                    {typeof weaponDetails.damage !== "undefined" &&
                        renderStat("DAMAGE", {
                            oldStat: equipped?.damage,
                            newStat: weaponDetails.damage,
                        })}
                    {typeof weaponDetails.damage_falloff !== "undefined" &&
                        renderStat("DAMAGE FALLOFF", {
                            oldStat: equipped?.damage_falloff,
                            newStat: weaponDetails.damage_falloff,
                        })}
                    {typeof weaponDetails.radius !== "undefined" &&
                        renderStat("RADIUS", {
                            oldStat: equipped?.radius,
                            newStat: weaponDetails.radius,
                        })}
                    {typeof weaponDetails.radius_damage_falloff !== "undefined" &&
                        renderStat("RADIAL DAMAGE FALLOFF", {
                            oldStat: equipped?.radius_damage_falloff,
                            newStat: weaponDetails.radius_damage_falloff,
                        })}
                    {typeof weaponDetails.spread !== "undefined" &&
                        renderStat("SPREAD", {
                            oldStat: equipped?.spread,
                            newStat: weaponDetails.spread,
                            negated: true,
                        })}
                    {typeof weaponDetails.rate_of_fire !== "undefined" &&
                        renderStat("RATE OF FIRE", {
                            oldStat: equipped?.rate_of_fire,
                            newStat: weaponDetails.rate_of_fire,
                        })}
                    {typeof weaponDetails.projectile_speed !== "undefined" &&
                        renderStat("PROJECTILE SPEED", {
                            oldStat: equipped?.projectile_speed,
                            newStat: weaponDetails.projectile_speed,
                        })}
                    {typeof weaponDetails.energy_cost !== "undefined" &&
                        renderStat("ENERGY COST", {
                            oldStat: equipped?.energy_cost,
                            newStat: weaponDetails.energy_cost,
                            negated: true,
                        })}
                    {typeof weaponDetails.max_ammo !== "undefined" &&
                        renderStat("MAX AMMO", {
                            oldStat: equipped?.max_ammo,
                            newStat: weaponDetails.max_ammo,
                        })}
                </Stack>
            </Stack>
        </FancyButton>
    )
}
