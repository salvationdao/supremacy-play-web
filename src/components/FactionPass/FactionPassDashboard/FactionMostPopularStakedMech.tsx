import { useGameServerSubscriptionFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { Box, Stack, Typography } from "@mui/material"
import React, { useMemo, useState } from "react"
import { NewMechStruct } from "../../../types"
import { colors, fonts } from "../../../theme/theme"
import { NiceBoxThing } from "../../Common/Nice/NiceBoxThing"
import { MediaPreview } from "../../Common/MediaPreview/MediaPreview"
import { useSupremacy } from "../../../containers"
import { RepairBlocks } from "../../Common/Mech/MechRepairBlocks"
import { MechIdleStatus } from "../../Common/Mech/MechIdleStatus"
import { getRarityDeets, numFormatter } from "../../../helpers"
import {
    SvgLoadoutArmour,
    SvgLoadoutPowerCoreCapacity,
    SvgLoadoutPowerCoreRegen,
    SvgLoadoutSpeed,
    SvgMechDeaths,
    SvgMechKills,
    SvgMechLosses,
    SvgMechWins,
    SvgPowerCore,
    SvgSkin,
    SvgUtilities,
    SvgWeapons,
} from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { NiceTooltip } from "../../Common/Nice/NiceTooltip"
import { MechLoadoutItem } from "../../Hangar/WarMachinesHangar/Common/MechLoadoutItem"

export const FactionMostPopularStakedMech = () => {
    const { getFaction } = useSupremacy()

    const [mostPopularMech, setMostPopularMech] = useState<NewMechStruct>()
    useGameServerSubscriptionFaction<NewMechStruct>(
        {
            URI: "/mvp_staked_mech",
            key: GameServerKeys.SubFactionMostPopularStakedMech,
        },
        (payload) => {
            if (!payload) return
            setMostPopularMech(payload)
        },
    )

    const content = useMemo(() => {
        if (!mostPopularMech) return null
        const ownerFaction = getFaction(mostPopularMech.owner.faction_id)
        const rarity = getRarityDeets(mostPopularMech.tier)

        console.log(mostPopularMech.weapon_slots)
        console.log(mostPopularMech.utilities)
        console.log(mostPopularMech.power_core)
        console.log(mostPopularMech.skin_image_url)
        return (
            <>
                {/* Mech image */}
                <NiceBoxThing
                    border={{ color: `#FFFFFF20`, thickness: "very-lean" }}
                    background={{ colors: [ownerFaction.palette.background] }}
                    sx={{ position: "relative", boxShadow: 0.4, flex: 1 }}
                >
                    <MediaPreview imageUrl={mostPopularMech.avatar_url || ""} objectFit="cover" sx={{ height: "22.5rem" }} allowModal />
                </NiceBoxThing>

                <Typography>{mostPopularMech.name || mostPopularMech.label}</Typography>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography>{mostPopularMech.label}</Typography>
                    <Typography color={rarity.color}>{mostPopularMech.tier}</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    {/* Repair blocks */}
                    <RepairBlocks
                        defaultBlocks={mostPopularMech.repair_blocks}
                        remainDamagedBlocks={mostPopularMech.damaged_blocks}
                        sx={{
                            width: "fit-content",
                        }}
                    />

                    {/* Mech status */}
                    <MechIdleStatus mech={mostPopularMech} />
                </Stack>

                {/* Mech Status*/}
                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing=".25rem">
                    <MechStatus label={"Health"} icon={<SvgLoadoutArmour />} value={mostPopularMech.max_hitpoints} />
                    <MechStatus label={"Speed"} icon={<SvgLoadoutSpeed />} value={mostPopularMech.speed} />
                    <MechStatus label={"Power Core Recharge Rate"} icon={<SvgLoadoutPowerCoreRegen />} value={mostPopularMech.power_core?.recharge_rate || 0} />
                    <MechStatus label={"Power Core Capacity"} icon={<SvgLoadoutPowerCoreCapacity />} value={mostPopularMech.power_core?.capacity || 0} />
                </Stack>

                {/* Mech battle stat*/}
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <NiceTooltip placement="top-start" text="Total kills">
                        <Typography whiteSpace="nowrap">
                            <SvgMechKills inline size="1.6rem" /> {numFormatter(mostPopularMech.stats.total_kills)}
                        </Typography>
                    </NiceTooltip>
                    <NiceTooltip placement="top-start" text="Total deaths">
                        <Typography whiteSpace="nowrap">
                            <SvgMechDeaths inline size="1.6rem" /> {numFormatter(mostPopularMech.stats.total_deaths)}
                        </Typography>
                    </NiceTooltip>

                    <NiceTooltip placement="top-start" text="Total wins">
                        <Typography whiteSpace="nowrap">
                            <SvgMechWins inline size="1.6rem" /> {numFormatter(mostPopularMech.stats.total_wins)}
                        </Typography>
                    </NiceTooltip>

                    <NiceTooltip placement="top-start" text="Total losses">
                        <Typography whiteSpace="nowrap">
                            <SvgMechLosses inline size="1.6rem" /> {numFormatter(mostPopularMech.stats.total_losses)}
                        </Typography>
                    </NiceTooltip>
                </Stack>

                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Stack spacing=".5rem">
                        <SvgWeapons fill={colors.weapons} size="2.5rem" />
                        <Stack direction="row" alignItems="center" justifyContent="center" spacing=".25rem">
                            {mostPopularMech.weapon_slots &&
                                mostPopularMech.weapon_slots.map((ws, i) => (
                                    <Box
                                        key={i}
                                        sx={{
                                            width: "1rem",
                                            height: ".3rem",
                                            backgroundColor: ws.weapon ? colors.weapons : `${colors.offWhite}20`,
                                        }}
                                    />
                                ))}
                        </Stack>
                    </Stack>

                    <Stack spacing=".5rem">
                        <SvgUtilities fill={colors.utilities} size="2.5rem" />
                        <Stack direction="row" alignItems="center" justifyContent="center" spacing=".25rem">
                            {mostPopularMech.utilities &&
                                mostPopularMech.utilities.map((us, i) => (
                                    <Box
                                        key={i}
                                        sx={{
                                            width: "1rem",
                                            height: ".3rem",
                                            backgroundColor: us.utility ? colors.utilities : `${colors.offWhite}20`,
                                        }}
                                    />
                                ))}
                        </Stack>
                    </Stack>

                    <Stack spacing=".5rem">
                        <SvgPowerCore fill={colors.powerCore} size="2.5rem" />
                        <Stack direction="row" alignItems="center" justifyContent="center" spacing=".25rem">
                            <Box
                                sx={{
                                    width: "1rem",
                                    height: ".3rem",
                                    backgroundColor: mostPopularMech.power_core ? colors.powerCore : `${colors.offWhite}20`,
                                }}
                            />
                        </Stack>
                    </Stack>

                    <Stack spacing=".5rem">
                        <SvgSkin fill={colors.chassisSkin} size="2.5rem" />
                        <Stack direction="row" alignItems="center" justifyContent="center" spacing=".25rem">
                            <Box
                                sx={{
                                    width: "1rem",
                                    height: ".3rem",
                                    backgroundColor: mostPopularMech.chassis_skin_id ? colors.chassisSkin : `${colors.offWhite}20`,
                                }}
                            />
                        </Stack>
                    </Stack>
                </Stack>
            </>
        )
    }, [getFaction, mostPopularMech])

    return (
        <Stack
            sx={{
                p: "1.5rem",
                backgroundColor: `${colors.offWhite}20`,
                width: "100%",
                height: "fit-content",
            }}
        >
            <Typography variant="h5" fontFamily={fonts.rajdhaniBold} sx={{ opacity: 0.8 }}>
                MOST POPULAR MECH
            </Typography>

            {content}
        </Stack>
    )
}

interface MechStatusProps {
    label: string
    icon: JSX.Element
    value: number
}
const MechStatus = ({ label, icon, value }: MechStatusProps) => {
    const { factionTheme } = useTheme()
    return (
        <NiceTooltip placement="top" text={label}>
            <Stack direction="row" alignItems="center" flex={1} spacing=".3rem" sx={{ px: ".5rem", py: ".25rem", backgroundColor: factionTheme.background }}>
                {icon}
                <Typography>{value}</Typography>
            </Stack>
        </NiceTooltip>
    )
}
