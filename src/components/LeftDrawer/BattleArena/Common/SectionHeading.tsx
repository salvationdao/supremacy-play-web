import { Box, Stack, Typography } from "@mui/material"
import { SvgInfoCircular } from "../../../../assets"
import { useTheme } from "../../../../containers/theme"
import { fonts } from "../../../../theme/theme"
import { NiceTooltip } from "../../../Common/Nice/NiceTooltip"

export const SectionHeading = ({ label, tooltip }: { label: string; tooltip?: string }) => {
    const theme = useTheme()

    return (
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ p: ".6rem 1.6rem", background: (theme) => `linear-gradient(${theme.factionTheme.primary} 26%, ${theme.factionTheme.primary}BB)` }}
        >
            <Typography sx={{ color: (theme) => theme.factionTheme.text, fontFamily: fonts.nostromoHeavy }}>{label}</Typography>

            {tooltip && (
                <NiceTooltip text={tooltip} placement="right">
                    <Box
                        sx={{
                            opacity: 0.4,
                            ":hover": { opacity: 1 },
                        }}
                    >
                        <SvgInfoCircular fill={`${theme.factionTheme.text}80`} size="1.5rem" />
                    </Box>
                </NiceTooltip>
            )}
        </Stack>
    )
}
