import { Box, Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { useSupremacy } from "../../../containers"
import { getRarityDeets } from "../../../helpers"
import { fonts } from "../../../theme/theme"
import { NewMechStruct } from "../../../types"
import { RepairBlocks } from "../../Common/Mech/MechRepairBlocks"
import { NiceBoxThing } from "../../Common/Nice/NiceBoxThing"
import { MechBarStats } from "../../Hangar/WarMachinesHangar/Common/MechBarStats"
import { WeaponSlot } from "../Common/weaponSlot"

interface QueueableMechCardProps {
    lobbyMech: NewMechStruct
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
                border: `${ownerFaction.palette.primary} 2px dashed`,
                cursor: "pointer",
                backgroundColor: isSelected ? `${ownerFaction.palette.primary}50` : ownerFaction.palette.background,
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
                    color={ownerFaction.palette.primary}
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
