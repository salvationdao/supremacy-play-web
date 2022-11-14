import { Box, Checkbox, Stack, Typography } from "@mui/material"
import React, { useMemo } from "react"
import { SvgMechDeaths, SvgMechKills, SvgMechLosses, SvgMechWins, SvgUserDiamond } from "../../../assets"
import { useSupremacy } from "../../../containers"
import { getMechStatusDeets, getRarityDeets } from "../../../helpers"
import { TruncateTextLines } from "../../../theme/styles"
import { colors, fonts } from "../../../theme/theme"
import { LobbyMech } from "../../../types"
import { RepairBlocks } from "../../Hangar/WarMachinesHangar/Common/MechRepairBlocks"
import { NiceBoxThing } from "../Nice/NiceBoxThing"

interface MechCardProps {
    mech: LobbyMech
    isGridView: boolean
    isSelected?: boolean
    toggleSelected?: (mech: LobbyMech) => void
}

export const MechCard = React.memo(function MechCard({ mech, isSelected, toggleSelected, isGridView }: MechCardProps) {
    const { getFaction } = useSupremacy()
    const { name, label } = mech

    const ownerFaction = useMemo(() => getFaction(mech.owner.faction_id), [getFaction, mech.owner.faction_id])
    const rarityDeets = useMemo(() => getRarityDeets(mech.tier), [mech.tier])
    const statusDeets = useMemo(() => getMechStatusDeets(mech.status), [mech.status])

    // List view
    if (!isGridView) {
        return (
            <NiceBoxThing
                border={{
                    color: isSelected ? `${colors.neonBlue}80` : "#FFFFFF38",
                    thickness: isSelected ? "lean" : "very-lean",
                }}
                background={{ color: ["#FFFFFF10", "#FFFFFF20"] }}
                sx={{
                    overflow: "hidden",
                }}
            >
                <Box
                    sx={{
                        p: "1rem 1.5rem",
                        display: "grid",
                        gridTemplateRows: "8rem",
                        gridTemplateColumns: "8rem 1fr 1fr 10rem 15rem repeat(5, 5rem)",
                        gap: "3rem",
                        alignItems: "center",
                        overflowY: "hidden",
                        overflowX: "auto",
                    }}
                >
                    {/* Mech image */}
                    <NiceBoxThing
                        border={{ color: `${rarityDeets.color}80`, thickness: "very-lean" }}
                        caret={{ position: "bottom-right", size: "small" }}
                        sx={{ height: "100%", width: "100%", boxShadow: 0.4 }}
                    >
                        <Box
                            component="img"
                            src={mech.avatar_url}
                            sx={{
                                height: "100%",
                                width: "100%",
                                objectFit: "cover",
                                objectPosition: "center",
                            }}
                        />
                    </NiceBoxThing>

                    {/* Mech name */}
                    <Typography sx={{ fontFamily: fonts.nostromoBlack, ...TruncateTextLines(1) }}>{name || label}</Typography>

                    {/* Owner name */}
                    <Typography
                        variant="h6"
                        sx={{
                            color: ownerFaction.primary_color,
                            fontWeight: "bold",
                            mt: ".3rem !important",
                            ...TruncateTextLines(1),
                        }}
                    >
                        {mech.owner.username}#{mech.owner.gid}
                    </Typography>

                    {/* Mech status */}
                    <Typography
                        sx={{
                            width: "fit-content",
                            p: ".1rem 1.6rem",
                            fontWeight: "bold",
                            color: statusDeets.color,
                            backgroundColor: `${statusDeets.color}30`,
                            boxShadow: 0.4,
                        }}
                    >
                        {statusDeets.label}
                    </Typography>

                    {/* Repair blocks */}
                    <RepairBlocks
                        defaultBlocks={mech.repair_blocks}
                        remainDamagedBlocks={mech.damaged_blocks}
                        sx={{
                            width: "fit-content",
                        }}
                    />

                    {/* KDWL stats */}
                    <Typography>
                        <SvgMechKills inline size="1.8rem" /> {mech.stats.total_kills}
                    </Typography>
                    <Typography>
                        <SvgMechDeaths inline size="1.8rem" /> {mech.stats.total_deaths}
                    </Typography>
                    <Typography>
                        <SvgMechWins inline size="1.8rem" /> {mech.stats.total_wins}
                    </Typography>
                    <Typography>
                        <SvgMechLosses inline size="1.8rem" /> {mech.stats.total_losses}
                    </Typography>

                    {/* Checkbox */}
                    {toggleSelected && (
                        <Checkbox
                            checked={isSelected}
                            onClick={() => toggleSelected(mech)}
                            sx={{
                                "&.Mui-checked > .MuiSvgIcon-root": { fill: `${colors.neonBlue} !important` },
                                ".Mui-checked+.MuiSwitch-track": { backgroundColor: `${colors.neonBlue}50 !important` },
                            }}
                        />
                    )}
                </Box>
            </NiceBoxThing>
        )
    }

    // Grid view
    return (
        <NiceBoxThing
            border={{
                color: isSelected ? `${colors.neonBlue}80` : "#FFFFFF38",
                thickness: isSelected ? "lean" : "very-lean",
            }}
            background={{ color: ["#FFFFFF10", "#FFFFFF20"] }}
            sx={{ p: "1rem 1.5rem" }}
        >
            <Stack spacing="1.2rem">
                {/* Mech name and checkbox */}
                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing=".5rem">
                    <Typography sx={{ fontFamily: fonts.nostromoBlack, ...TruncateTextLines(1) }}>{name || label}</Typography>
                    {toggleSelected && (
                        <Checkbox
                            checked={isSelected}
                            onClick={() => toggleSelected(mech)}
                            sx={{
                                "&.Mui-checked > .MuiSvgIcon-root": { fill: `${colors.neonBlue} !important` },
                                ".Mui-checked+.MuiSwitch-track": { backgroundColor: `${colors.neonBlue}50 !important` },
                            }}
                        />
                    )}
                </Stack>

                {/* Owner name */}
                <Typography
                    variant="h6"
                    sx={{
                        color: ownerFaction.primary_color,
                        fontWeight: "bold",
                        mt: ".3rem !important",
                        ...TruncateTextLines(1),
                    }}
                >
                    <SvgUserDiamond size="2.5rem" inline fill={ownerFaction.primary_color} /> {mech.owner.username}#{mech.owner.gid}
                </Typography>

                {/* Mech image */}
                <NiceBoxThing border={{ color: `${rarityDeets.color}80` }} caret={{ position: "bottom-right" }} sx={{ boxShadow: 0.4 }}>
                    <Box
                        component="img"
                        src={mech.avatar_url}
                        sx={{
                            height: "20rem",
                            width: "100%",
                            objectFit: "cover",
                            objectPosition: "center",
                        }}
                    />
                </NiceBoxThing>

                {/* Mech KDWL stats */}
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing=".8rem"
                    sx={{
                        "&>*": { flex: 1, p: ".2rem 1rem", pt: ".5rem", lineHeight: 1, backgroundColor: "#FFFFFF16", boxShadow: 0.4 },
                    }}
                >
                    <Typography>
                        <SvgMechKills inline size="1.8rem" /> {mech.stats.total_kills}
                    </Typography>
                    <Typography>
                        <SvgMechDeaths inline size="1.8rem" /> {mech.stats.total_deaths}
                    </Typography>
                    <Typography>
                        <SvgMechWins inline size="1.8rem" /> {mech.stats.total_wins}
                    </Typography>
                    <Typography>
                        <SvgMechLosses inline size="1.8rem" /> {mech.stats.total_losses}
                    </Typography>
                </Stack>

                {/* Mech status and repair blocks */}
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography
                        sx={{
                            p: ".1rem 1.6rem",
                            fontWeight: "bold",
                            color: statusDeets.color,
                            backgroundColor: `${statusDeets.color}30`,
                            boxShadow: 0.4,
                        }}
                    >
                        {statusDeets.label}
                    </Typography>

                    <RepairBlocks
                        defaultBlocks={mech.repair_blocks}
                        remainDamagedBlocks={mech.damaged_blocks}
                        sx={{
                            width: "fit-content",
                        }}
                    />
                </Stack>
            </Stack>
        </NiceBoxThing>
    )
})
