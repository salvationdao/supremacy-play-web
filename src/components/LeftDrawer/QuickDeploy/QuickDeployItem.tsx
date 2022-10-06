// new quick deploy item
import { Faction, LobbyMech, MechBasicWithQueueStatus } from "../../../types"
import React, { useCallback, useMemo } from "react"
import { getRarityDeets } from "../../../helpers"
import { Box, Stack, Typography } from "@mui/material"
import { MechThumbnail } from "../../Hangar/WarMachinesHangar/Common/MechThumbnail"
import { fonts } from "../../../theme/theme"
import { MechName } from "../../Hangar/WarMachinesHangar/WarMachineDetails/MechName"
import { MechRepairBlocks } from "../../Hangar/WarMachinesHangar/Common/MechRepairBlocks"
import { QuickDeployMechStatus } from "./QuickDeployMechStatus"
import { useSupremacy } from "../../../containers"
import { scaleUpKeyframes } from "../../../theme/keyframes"
import { SvgWeapons } from "../../../assets"
import { TooltipHelper } from "../../Common/TooltipHelper"
import { MechWeaponSlot } from "../../../types/battle_queue"

interface QuickDeployItemProps {
    mech: LobbyMech
    isSelected?: boolean
    toggleIsSelected?: () => void
}

const propsAreMechEqual = (prevProps: QuickDeployItemProps, nextProps: QuickDeployItemProps) => {
    return prevProps.isSelected === nextProps.isSelected && prevProps.mech === nextProps.mech
}

export const QuickDeployItem = React.memo(function QuickDeployItem({ isSelected, toggleIsSelected, mech }: QuickDeployItemProps) {
    const { getFaction } = useSupremacy()
    const rarityDeets = useMemo(() => getRarityDeets(mech.tier || ""), [mech])

    const faction = useMemo(() => getFaction(mech.faction_id), [getFaction, mech.faction_id])
    return (
        <Stack
            direction="row"
            spacing="1.2rem"
            alignItems="center"
            onClick={() => toggleIsSelected && toggleIsSelected()}
            sx={{
                position: "relative",
                py: ".8rem",
                pl: ".5rem",
                pr: ".7rem",
                backgroundColor: isSelected ? "#FFFFFF20" : "unset",
                borderRadius: 0.8,
                cursor: "pointer",
            }}
        >
            {/* Mech image and deploy button */}
            <Stack sx={{ height: "8rem" }}>
                <MechThumbnail mech={mech} smallSize />
            </Stack>

            {/* Right side */}
            <Stack spacing="1.2rem" direction="row" alignItems="flex-start" sx={{ py: ".2rem", flex: 1 }}>
                <Stack sx={{ flex: 1 }}>
                    <Stack spacing="1.2rem" direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ py: ".2rem", flex: 1 }}>
                        <Box>
                            <Typography
                                variant="caption"
                                sx={{
                                    fontFamily: fonts.nostromoHeavy,
                                    color: rarityDeets.color,
                                }}
                            >
                                {rarityDeets.label}
                            </Typography>

                            <MechName allowEdit mech={mech} />
                        </Box>

                        <QuickDeployMechStatus mech={mech} />
                    </Stack>

                    <Typography
                        variant="body2"
                        sx={{
                            fontFamily: fonts.nostromoBlack,
                            fontWeight: "fontWeightBold",
                            display: "-webkit-box",
                            overflow: "hidden",
                            overflowWrap: "anywhere",
                            textOverflow: "ellipsis",
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: "vertical",
                        }}
                    >
                        {mech.label}
                    </Typography>

                    <MechRepairBlocks mechID={mech.id} defaultBlocks={mech.repair_blocks} />

                    <Stack direction="row" sx={{ pt: "1rem" }}>
                        <Stack direction="column" spacing={1}>
                            {mech.weapon_slots && mech.weapon_slots.map((ws) => <WeaponSlot key={ws.slot_number} weaponSlot={ws} faction={faction} />)}
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>
        </Stack>
    )
}, propsAreMechEqual)

interface WeaponSlotProps {
    weaponSlot: MechWeaponSlot
    faction: Faction
}
const WeaponSlot = ({ weaponSlot, faction }: WeaponSlotProps) => {
    const weapon = weaponSlot.weapon

    const weaponStat = useCallback((label: string, value: string | number) => {
        return (
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="body2" fontFamily={fonts.nostromoMedium}>
                    {label}:
                </Typography>
                <Typography variant="body2" fontFamily={fonts.nostromoLight}>
                    {value}
                </Typography>
            </Stack>
        )
    }, [])

    const content = useMemo(() => {
        if (!weapon) return <SvgWeapons />

        const weaponRarity = getRarityDeets(weapon?.tier || "")
        return (
            <TooltipHelper
                renderNode={
                    <Stack direction="column">
                        <Stack direction="row" alignItems="center">
                            <Box
                                key={weapon.avatar_url}
                                component="img"
                                src={weapon.avatar_url}
                                sx={{
                                    width: "6rem",
                                    height: "6rem",
                                    objectFit: "cover",
                                    borderRadius: 0.6,
                                    animation: `${scaleUpKeyframes} .5s ease-out`,
                                }}
                            />
                            <Stack direction="column" sx={{ ml: "1rem" }}>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        fontFamily: fonts.nostromoHeavy,
                                        color: weaponRarity.color,
                                    }}
                                >
                                    {weaponRarity.label}
                                </Typography>
                                <Typography fontFamily={fonts.nostromoBlack}>{weapon.label}</Typography>
                            </Stack>
                        </Stack>
                        {weaponStat("DAMAGE", weapon.damage)}
                    </Stack>
                }
                placement="left-start"
            >
                <Box
                    key={weapon.avatar_url}
                    component="img"
                    src={weapon.avatar_url}
                    sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: 0.6,
                        animation: `${scaleUpKeyframes} .5s ease-out`,
                    }}
                />
            </TooltipHelper>
        )
    }, [weapon])

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "3.5rem",
                width: "3.5rem",
                border: `${faction.primary_color}80 2px solid`,
                borderRadius: 0.6,
                backgroundColor: `${faction.background_color}`,
                "&:hover": {
                    border: `${faction.primary_color} 2px solid`,
                },
            }}
        >
            {content}
        </Box>
    )
}
