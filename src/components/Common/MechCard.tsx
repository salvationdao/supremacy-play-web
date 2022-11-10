import { Box, Checkbox, Stack, Typography } from "@mui/material"
import React, { useMemo } from "react"
import { SvgUserDiamond } from "../../assets"
import { useSupremacy } from "../../containers"
import { getRarityDeets } from "../../helpers"
import { TruncateTextLines } from "../../theme/styles"
import { fonts } from "../../theme/theme"
import { LobbyMech } from "../../types"
import { NiceBoxThing } from "./Nice/NiceBoxThing"

interface MechCardProps {
    mech: LobbyMech
    isGridView: boolean
    isSelected?: boolean
}

export const MechCard = React.memo(function MechCard({ mech, isGridView, isSelected }: MechCardProps) {
    const { getFaction } = useSupremacy()
    const { name, label } = mech

    const ownerFaction = useMemo(() => getFaction(mech.owner.faction_id), [getFaction, mech.owner.faction_id])

    const rarityDeets = useMemo(() => getRarityDeets(mech.tier), [mech.tier])

    return (
        <NiceBoxThing border={{ color: "#FFFFFF30", thickness: "lean" }} background={{ color: ["#FFFFFF10", "#FFFFFF20"] }} sx={{ p: "1rem 1.5rem" }}>
            {/* Mech name */}
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing=".5rem">
                <Typography sx={{ fontFamily: fonts.nostromoBlack, ...TruncateTextLines(1) }}>{name || label}</Typography>
                <Checkbox />
            </Stack>

            {/* Owner name */}
            <Typography variant="h6" sx={{ color: ownerFaction.primary_color, fontWeight: "fontWeightBold", mt: ".3rem" }}>
                <SvgUserDiamond size="2.5rem" inline fill={ownerFaction.primary_color} /> {mech.owner.username}#{mech.owner.gid}
            </Typography>

            {/* Mech image */}
            <NiceBoxThing border={{ color: rarityDeets.color }} caret={{ position: "bottom-right" }} sx={{ mt: "1.2rem" }}>
                <Box component="img" src={mech.avatar_url} sx={{ height: "20rem", width: "100%", objectFit: "cover", objectPosition: "center" }} />
            </NiceBoxThing>

            {/* Mech KDWL stats */}
        </NiceBoxThing>
    )
})
