import { Box, CircularProgress, Stack, Typography } from "@mui/material"
import { useMemo, useState } from "react"
import { SvgPowerCore } from "../../../../../../assets"
import { useTheme } from "../../../../../../containers/theme"
import { getRarityDeets } from "../../../../../../helpers"
import { useGameServerSubscriptionFaction } from "../../../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../../../keys"
import { fonts } from "../../../../../../theme/theme"
import { PowerCore } from "../../../../../../types"
import { NiceBoxThing } from "../../../../../Common/Nice/NiceBoxThing"

export interface PowerCoreTooltipProps {
    id: string
    compareTo?: PowerCore
}

export const PowerCoreTooltip = ({ id, compareTo }: PowerCoreTooltipProps) => {
    const theme = useTheme()
    const [powerCore, setPowerCore] = useState<PowerCore>()

    useGameServerSubscriptionFaction<PowerCore>(
        {
            URI: `/power_core/${id}/details`,
            key: GameServerKeys.GetPowerCoreDetails,
        },
        (payload) => {
            if (!payload) return
            setPowerCore(payload)
        },
    )

    const content = useMemo(() => {
        if (!powerCore) {
            return (
                <Stack
                    sx={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <CircularProgress size="2rem" />
                </Stack>
            )
        }

        const rarity = getRarityDeets(powerCore.tier)
        return (
            <>
                <Stack
                    sx={{
                        p: "2rem",
                        background: `linear-gradient(to right, ${theme.factionTheme.background}, ${rarity.color}22)`,
                    }}
                >
                    <Typography
                        sx={{
                            fontFamily: fonts.nostromoBold,
                            fontSize: "1.6rem",
                        }}
                    >
                        {powerCore.label}
                    </Typography>
                    <Stack
                        direction="row"
                        sx={{
                            justifyContent: "space-between",
                        }}
                    >
                        <Typography>{powerCore.label}</Typography>
                        <Typography
                            sx={{
                                color: rarity.color,
                            }}
                        >
                            {rarity.label}
                        </Typography>
                    </Stack>
                </Stack>
                <Box
                    component="img"
                    src={powerCore.image_url || powerCore.avatar_url}
                    sx={{
                        width: "100%",
                        height: "100%",
                        maxHeight: 140,
                        p: "2rem",
                        objectFit: "contain",
                        borderBottom: `1px solid ${rarity.color}`,
                    }}
                />
                <Stack p="2rem">
                    <PowerCoreStats powerCore={powerCore} compareTo={compareTo} />
                </Stack>
            </>
        )
    }, [compareTo, powerCore, theme.factionTheme.background])

    return (
        <NiceBoxThing
            border={{
                color: powerCore ? getRarityDeets(powerCore.tier).color : theme.factionTheme.primary,
                thickness: "very-lean",
            }}
            background={{
                colors: [theme.factionTheme.background],
            }}
            sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: 250,
                width: 280,
            }}
        >
            {content}
        </NiceBoxThing>
    )
}

interface PowerCoreStatsProps {
    powerCore: PowerCore
    compareTo?: PowerCore
}

const PowerCoreStats = ({ powerCore, compareTo }: PowerCoreStatsProps) => {
    return (
        <>
            <Stack direction="row">
                <SvgPowerCore />
                <Typography ml=".5rem" textTransform="uppercase">
                    Size
                </Typography>
                <Typography ml="auto" fontWeight="fontWeightBold">
                    {powerCore.size}
                </Typography>
            </Stack>
            <Stack direction="row">
                <SvgPowerCore />
                <Typography ml=".5rem" textTransform="uppercase">
                    Capacity
                </Typography>
                <Typography ml="auto" fontWeight="fontWeightBold">
                    {powerCore.capacity}
                </Typography>
            </Stack>
            <Stack direction="row">
                <SvgPowerCore />
                <Typography ml=".5rem" textTransform="uppercase">
                    Recharge Rate
                </Typography>
                <Typography ml="auto" fontWeight="fontWeightBold">
                    {powerCore.recharge_rate}/sec
                </Typography>
            </Stack>
            <Stack direction="row">
                <SvgPowerCore />
                <Typography ml=".5rem" textTransform="uppercase">
                    Weapon Share
                </Typography>
                <Typography ml="auto" fontWeight="fontWeightBold">
                    {powerCore.weapon_share}%
                </Typography>
            </Stack>
            <Stack direction="row">
                <SvgPowerCore />
                <Typography ml=".5rem" textTransform="uppercase">
                    Movement Share
                </Typography>
                <Typography ml="auto" fontWeight="fontWeightBold">
                    {powerCore.movement_share}%
                </Typography>
            </Stack>
            <Stack direction="row">
                <SvgPowerCore />
                <Typography ml=".5rem" textTransform="uppercase">
                    Utility Share
                </Typography>
                <Typography ml="auto" fontWeight="fontWeightBold">
                    {powerCore.utility_share}%
                </Typography>
            </Stack>
        </>
    )
}
