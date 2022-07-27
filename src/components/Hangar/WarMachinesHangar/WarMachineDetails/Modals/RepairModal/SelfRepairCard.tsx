import { Stack, Typography } from "@mui/material"
import { FancyButton } from "../../../../.."
import { colors, fonts } from "../../../../../../theme/theme"

export const SelfRepairCard = () => {
    return (
        <Stack spacing="1rem" sx={{ p: "2rem", pt: "1.6rem", backgroundColor: "#FFFFFF20", border: `${colors.green}30 1px solid` }}>
            <Typography variant="h6" sx={{ fontFamily: fonts.nostromoBlack, color: colors.green }}>
                SELF REPAIR
            </Typography>

            <Typography variant="h6">Get your hands dirty and do the repair work yourself.</Typography>

            <FancyButton
                clipThingsProps={{
                    clipSize: "5px",
                    backgroundColor: colors.green,
                    border: { isFancy: true, borderColor: colors.green },
                    sx: { position: "relative", width: "100%" },
                }}
                sx={{ px: "1.6rem", py: ".8rem", color: "#FFFFFF" }}
                // TODO: onClick
            >
                <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBlack }}>
                    REPAIR
                </Typography>
            </FancyButton>
        </Stack>
    )
}
