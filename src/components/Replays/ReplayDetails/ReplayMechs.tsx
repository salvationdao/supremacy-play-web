import { Box, Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { useTheme } from "../../../containers/theme"
import { fonts } from "../../../theme/theme"
import { MechDetails } from "../../../types"
import { MechCommonArea } from "../../Hangar/Deprecated/HangarItemDeprecated"

export const ReplayMechs = ({ mechs }: { mechs?: MechDetails[] }) => {
    const theme = useTheme()

    const sortedMechs = useMemo(() => mechs?.sort((a, b) => a.faction_id.localeCompare(b.faction_id)), [mechs])

    if (!sortedMechs || sortedMechs.length <= 0) {
        return null
    }

    const primaryColor = theme.factionTheme.primary
    const secondaryColor = theme.factionTheme.text

    return (
        <Stack spacing="1rem">
            <Typography sx={{ fontFamily: fonts.nostromoBlack }}>Mechs in battle</Typography>

            <Box
                sx={{
                    width: "100%",
                    display: "grid",
                    gridTemplateColumns: "repeat(3, minmax(26rem, 1fr))",
                    gap: "2rem",
                    alignItems: "start",
                    justifyContent: "start",
                    overflow: "visible",
                }}
            >
                {sortedMechs.map((mechDetails) => {
                    return (
                        <MechCommonArea
                            key={mechDetails.id}
                            isGridView={true}
                            mech={mechDetails}
                            mechDetails={mechDetails}
                            primaryColor={primaryColor}
                            secondaryColor={secondaryColor}
                            hideRepairBlocks
                        />
                    )
                })}
            </Box>
        </Stack>
    )
}
