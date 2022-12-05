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
import { Stat } from "./Stat"

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
            {<Stat icon={<SvgPowerCore />} label={"Size"} stat={powerCore.size} compareStat={compareTo?.size} nonNumeric />}
            {<Stat icon={<SvgPowerCore />} label={"Capacity"} stat={powerCore.capacity} compareStat={compareTo?.capacity} />}
            {<Stat icon={<SvgPowerCore />} label={"Recharge Rate"} stat={powerCore.recharge_rate} compareStat={compareTo?.recharge_rate} unit="/sec" />}
            {<Stat icon={<SvgPowerCore />} label={"Weapon Share"} stat={powerCore.weapon_share} compareStat={compareTo?.weapon_share} unit="%" />}
            {<Stat icon={<SvgPowerCore />} label={"Movement Share"} stat={powerCore.movement_share} compareStat={compareTo?.movement_share} unit="%" />}
            {<Stat icon={<SvgPowerCore />} label={"Utility Share"} stat={powerCore.utility_share} compareStat={compareTo?.utility_share} unit="%" />}
        </>
    )
}
