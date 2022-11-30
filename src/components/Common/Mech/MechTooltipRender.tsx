import { Box, Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { SvgLoadoutSkin, SvgUserDiamond2 } from "../../../assets"
import { useSupremacy } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { getRarityDeets } from "../../../helpers"
import { fonts } from "../../../theme/theme"
import { NewMechStruct } from "../../../types"
import { TypographyTruncated } from "../TypographyTruncated"

export const MechTooltipRender = ({ mech }: { mech: NewMechStruct }) => {
    const theme = useTheme()
    const { getFaction } = useSupremacy()

    const ownerFaction = useMemo(() => getFaction(mech.owner.faction_id), [getFaction, mech.owner.faction_id])

    const rarityDeets = useMemo(() => getRarityDeets(mech.tier), [mech.tier])

    return (
        <Box sx={{ width: "45rem", backgroundColor: theme.factionTheme.s800 }}>
            {/* Mech name */}
            <Stack
                spacing=".4rem"
                sx={{
                    p: "1rem 1.5rem",
                    pr: ".5rem",
                    backgroundColor: theme.factionTheme.s700,
                }}
            >
                <TypographyTruncated variant="h5" fontFamily={fonts.nostromoBlack}>
                    {mech.name || mech.label}
                </TypographyTruncated>

                <TypographyTruncated variant="h6">
                    <SvgUserDiamond2 inline /> {mech.owner.username}#{mech.owner.gid}
                </TypographyTruncated>

                <TypographyTruncated variant="h6">
                    <SvgLoadoutSkin inline /> {mech.skin_label} |{" "}
                    <strong style={{ color: rarityDeets.color, textTransform: "uppercase" }}>{rarityDeets.label}</strong>
                </TypographyTruncated>
            </Stack>

            <Stack direction="row" alignItems="center"></Stack>
        </Box>
    )
}
