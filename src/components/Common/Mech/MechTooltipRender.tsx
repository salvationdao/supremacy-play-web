import { Box, Stack } from "@mui/material"
import { useMemo } from "react"
import { useSupremacy } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { fonts } from "../../../theme/theme"
import { NewMechStruct } from "../../../types"
import { TypographyTruncated } from "../TypographyTruncated"

export const MechTooltipRender = ({ mech }: { mech: NewMechStruct }) => {
    const theme = useTheme()
    const { getFaction } = useSupremacy()

    const ownerFaction = useMemo(() => getFaction(mech.owner.faction_id), [getFaction, mech.owner.faction_id])

    return (
        <Box sx={{ width: "40rem", backgroundColor: theme.factionTheme.s800 }}>
            {/* Mech name */}
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing="1.6rem"
                sx={{
                    p: "1rem 1.5rem",
                    pr: ".5rem",
                    backgroundColor: theme.factionTheme.s600,
                }}
            >
                <TypographyTruncated variant="h6" sx={{ fontFamily: fonts.nostromoBlack }}>
                    xxxxx
                </TypographyTruncated>
            </Stack>
        </Box>
    )
}
