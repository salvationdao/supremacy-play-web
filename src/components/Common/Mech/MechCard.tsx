import { Box, Checkbox, Stack, Typography } from "@mui/material"
import React, { useMemo } from "react"
import { Link } from "react-router-dom"
import { SvgMechDeaths, SvgMechKills, SvgMechLosses, SvgMechWins, SvgUserDiamond } from "../../../assets"
import { useSupremacy } from "../../../containers"
import { numFormatter, truncateTextLines } from "../../../helpers"
import { colors, fonts } from "../../../theme/theme"
import { NewMechStruct } from "../../../types"
import { MediaPreview } from "../MediaPreview/MediaPreview"
import { NiceBoxThing } from "../Nice/NiceBoxThing"
import { NiceTooltip } from "../Nice/NiceTooltip"
import { MechIdleStatus } from "./MechIdleStatus"
import { RepairBlocks } from "./MechRepairBlocks"

interface MechCardProps {
    mech: NewMechStruct
    isGridView: boolean
    isSelected?: boolean
    toggleSelected?: (mech: NewMechStruct) => void
    hide?: {
        ownerName?: boolean
        kdwlStats?: boolean
    }
}

// CSS grid widths of each component in list view
const MECH_IMAGE_GRID_WIDTH = "8rem"
const MECH_NAME_GRID_WIDTH = "minmax(8rem, 1fr)"
const OWNER_NAME_GRID_WIDTH = "minmax(8rem, 1fr)"
const MECH_STATUS_GRID_WIDTH = "10rem"
const MECH_BLOCKS_GRID_WIDTH = "15rem"
const KDWL_GRID_WIDTH = "repeat(4, 5rem)"
const CHECKBOX_GRID_WIDTH = "5rem"

export const MechCard = React.memo(function MechCard({ mech, hide, isSelected, toggleSelected, isGridView }: MechCardProps) {
    const { getFaction } = useSupremacy()

    const ownerFaction = useMemo(() => getFaction(mech.owner.faction_id), [getFaction, mech.owner.faction_id])

    // CSS grid widths
    const cssGridWidths = useMemo(() => {
        const result: string[] = []
        result.push(MECH_IMAGE_GRID_WIDTH)
        result.push(MECH_NAME_GRID_WIDTH)
        if (!hide?.ownerName) result.push(OWNER_NAME_GRID_WIDTH)
        result.push(MECH_STATUS_GRID_WIDTH)
        result.push(MECH_BLOCKS_GRID_WIDTH)
        if (!hide?.kdwlStats) result.push(KDWL_GRID_WIDTH)
        result.push(CHECKBOX_GRID_WIDTH)
        return result.join(" ")
    }, [hide])

    // List view
    if (!isGridView) {
        return (
            <NiceBoxThing
                border={{
                    color: isSelected ? `${colors.neonBlue}80` : "#FFFFFF20",
                    thickness: isSelected ? "lean" : "very-lean",
                }}
                background={{ colors: ["#FFFFFF", "#FFFFFF"], opacity: 0.06 }}
                sx={{ width: "100%", height: "100%", overflow: "hidden" }}
            >
                <Box
                    sx={{
                        p: "1rem 1.5rem",
                        display: "grid",
                        gridTemplateRows: "8rem",
                        gridTemplateColumns: cssGridWidths,
                        gap: "3rem",
                        alignItems: "center",
                        overflowY: "hidden",
                        overflowX: "auto",
                    }}
                >
                    {/* Mech image */}
                    <NiceBoxThing
                        border={{ color: `#FFFFFF20`, thickness: "very-lean" }}
                        background={{ colors: [ownerFaction.palette.background] }}
                        sx={{ height: "100%", width: "100%", boxShadow: 0.4 }}
                    >
                        <MediaPreview imageUrl={mech.avatar_url} objectFit="cover" allowModal />
                    </NiceBoxThing>

                    {/* Mech name */}
                    <Link to={`/mech/${mech.id}`}>
                        <Typography sx={{ fontFamily: fonts.nostromoBlack, ...truncateTextLines(1) }}>{mech.name || mech.label}</Typography>
                    </Link>

                    {/* Owner name */}
                    {!hide?.ownerName && (
                        <Typography
                            variant="h6"
                            sx={{
                                color: ownerFaction.palette.primary,
                                fontWeight: "bold",
                                mt: ".3rem !important",
                                ...truncateTextLines(1),
                            }}
                        >
                            {mech.owner.username}#{mech.owner.gid}
                        </Typography>
                    )}

                    {/* Mech status */}
                    <MechIdleStatus mech={mech} />

                    {/* Repair blocks */}
                    <RepairBlocks
                        defaultBlocks={mech.repair_blocks}
                        remainDamagedBlocks={mech.damaged_blocks}
                        sx={{
                            width: "fit-content",
                        }}
                    />

                    {/* KDWL stats */}
                    {!hide?.kdwlStats && (
                        <>
                            <NiceTooltip placement="top-start" text="Total kills">
                                <Typography whiteSpace="nowrap">
                                    <SvgMechKills inline size="1.6rem" /> {numFormatter(mech.stats.total_kills)}
                                </Typography>
                            </NiceTooltip>

                            <NiceTooltip placement="top-start" text="Total deaths">
                                <Typography whiteSpace="nowrap">
                                    <SvgMechDeaths inline size="1.6rem" /> {numFormatter(mech.stats.total_deaths)}
                                </Typography>
                            </NiceTooltip>

                            <NiceTooltip placement="top-start" text="Total wins">
                                <Typography whiteSpace="nowrap">
                                    <SvgMechWins inline size="1.6rem" /> {numFormatter(mech.stats.total_wins)}
                                </Typography>
                            </NiceTooltip>

                            <NiceTooltip placement="top-start" text="Total losses">
                                <Typography whiteSpace="nowrap">
                                    <SvgMechLosses inline size="1.6rem" /> {numFormatter(mech.stats.total_losses)}
                                </Typography>
                            </NiceTooltip>
                        </>
                    )}

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
                color: isSelected ? `${colors.neonBlue}80` : "#FFFFFF20",
                thickness: isSelected ? "lean" : "very-lean",
            }}
            background={{ colors: ["#FFFFFF", "#FFFFFF"], opacity: 0.06 }}
            sx={{ p: "1rem 1.5rem", width: "100%", height: "100%", overflow: "hidden" }}
        >
            <Stack spacing="1.2rem">
                {/* Mech name and checkbox */}
                <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing="1rem">
                    {/* Mech name */}
                    <Link to={`/mech/${mech.id}`}>
                        <Typography sx={{ fontFamily: fonts.nostromoBlack, ...truncateTextLines(1) }}>{mech.name || mech.label}</Typography>
                    </Link>

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
                {!hide?.ownerName && (
                    <Typography
                        variant="h6"
                        sx={{
                            color: ownerFaction.palette.primary,
                            fontWeight: "bold",
                            mt: ".3rem !important",
                            ...truncateTextLines(1),
                        }}
                    >
                        <SvgUserDiamond size="2.5rem" inline fill={ownerFaction.palette.primary} /> {mech.owner.username}#{mech.owner.gid}
                    </Typography>
                )}

                {/* Mech image */}
                <NiceBoxThing
                    border={{ color: `#FFFFFF20`, thickness: "very-lean" }}
                    background={{ colors: [ownerFaction.palette.background] }}
                    sx={{ position: "relative", boxShadow: 0.4, flex: 1 }}
                >
                    <MediaPreview imageUrl={mech.avatar_url} objectFit="cover" sx={{ height: "20rem" }} allowModal />
                </NiceBoxThing>

                {/* Mech KDWL stats */}
                {!hide?.kdwlStats && (
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing=".8rem"
                        sx={{
                            "&>*": { flex: 1, p: ".2rem 1rem", pt: ".5rem", lineHeight: 1, backgroundColor: "#FFFFFF16", boxShadow: 0.4 },
                        }}
                    >
                        <NiceTooltip placement="top-start" text="Total kills">
                            <Typography whiteSpace="nowrap">
                                <SvgMechKills inline size="1.6rem" /> {numFormatter(mech.stats.total_kills)}
                            </Typography>
                        </NiceTooltip>

                        <NiceTooltip placement="top-start" text="Total deaths">
                            <Typography whiteSpace="nowrap">
                                <SvgMechDeaths inline size="1.6rem" /> {numFormatter(mech.stats.total_deaths)}
                            </Typography>
                        </NiceTooltip>

                        <NiceTooltip placement="top-start" text="Total wins">
                            <Typography whiteSpace="nowrap">
                                <SvgMechWins inline size="1.6rem" /> {numFormatter(mech.stats.total_wins)}
                            </Typography>
                        </NiceTooltip>

                        <NiceTooltip placement="top-start" text="Total losses">
                            <Typography whiteSpace="nowrap">
                                <SvgMechLosses inline size="1.6rem" /> {numFormatter(mech.stats.total_losses)}
                            </Typography>
                        </NiceTooltip>
                    </Stack>
                )}

                {/* Mech status and repair blocks */}
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <MechIdleStatus mech={mech} />

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
