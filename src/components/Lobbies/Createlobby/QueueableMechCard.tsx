import { Box, Stack, Typography } from "@mui/material"
import { LobbyMech } from "../../../types"
import { useSupremacy } from "../../../containers"
import React, { useMemo } from "react"
import { getRarityDeets } from "../../../helpers"
import { NiceBoxThing } from "../../Common/Nice/NiceBoxThing"
import { RepairBlocks } from "../../Hangar/WarMachinesHangar/Common/MechRepairBlocks"
import { MechBarStats } from "../../Hangar/WarMachinesHangar/Common/MechBarStats"
import { WeaponSlot } from "../Common/weaponSlot"
import { fonts } from "../../../theme/theme"

interface QueueableMechCardProps {
    lobbyMech: LobbyMech
    onSelect: () => void
    isSelected: boolean
}

export const QueueableMechCard = ({ lobbyMech, onSelect, isSelected }: QueueableMechCardProps) => {
    const { getFaction } = useSupremacy()
    const { name, label, owner, tier, avatar_url, repair_blocks, damaged_blocks, weapon_slots } = lobbyMech

    const ownerFaction = useMemo(() => getFaction(owner.faction_id), [getFaction, owner.faction_id])
    const rarityDeets = useMemo(() => getRarityDeets(tier), [tier])

    return (
        <Stack
            direction="row"
            sx={{
                p: "1rem",
                width: "100%",
                height: "100%",
                border: `${ownerFaction.primary_color} 2px dashed`,
                cursor: "pointer",
                backgroundColor: isSelected ? `${ownerFaction.primary_color}50` : ownerFaction.background_color,
            }}
            spacing=".5rem"
            onClick={onSelect}
        >
            <Stack direction="column" flex={1} spacing="2rem">
                <Stack direction="row" spacing="1.5rem">
                    {/* Mech image */}
                    <NiceBoxThing
                        border={{ color: `${rarityDeets.color}80`, thickness: "very-lean" }}
                        caret={{ position: "bottom-right", size: "small" }}
                        sx={{ height: "6rem", width: "6rem", boxShadow: 0.4 }}
                    >
                        <Box
                            component="img"
                            src={avatar_url}
                            sx={{
                                height: "100%",
                                width: "100%",
                                objectFit: "cover",
                                objectPosition: "center",
                            }}
                        />
                    </NiceBoxThing>

                    <Stack direction="column" flex={1}>
                        <Typography>{name || label}</Typography>
                        <Typography
                            variant="caption"
                            sx={{
                                fontFamily: fonts.nostromoHeavy,
                                color: rarityDeets.color,
                            }}
                        >
                            {rarityDeets.label}
                        </Typography>
                        <RepairBlocks
                            defaultBlocks={repair_blocks}
                            remainDamagedBlocks={damaged_blocks}
                            sx={{
                                width: "fit-content",
                            }}
                        />
                    </Stack>
                </Stack>
                <MechBarStats
                    mech={lobbyMech}
                    color={ownerFaction.primary_color}
                    fontSize="1.3rem"
                    width="100%"
                    spacing=".5rem"
                    barHeight="1rem"
                    compact
                    outerSx={{ flex: 1 }}
                />
            </Stack>
            <Stack direction="column" spacing={1}>
                {weapon_slots && weapon_slots.map((ws) => <WeaponSlot key={ws.slot_number} weaponSlot={ws} tooltipPlacement="right-end" size="4.5rem" />)}
            </Stack>
        </Stack>
    )
}
