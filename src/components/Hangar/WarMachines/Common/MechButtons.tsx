import { Stack, Typography } from "@mui/material"
import { FancyButton } from "../../.."
import { useTheme } from "../../../../containers/theme"
import { fonts } from "../../../../theme/theme"
import { MechBasic, MechDetails } from "../../../../types"

export const MechButtons = ({ mech, mechDetails }: { mech: MechBasic; mechDetails?: MechDetails }) => {
    return (
        <Stack direction="row" spacing=".8rem">
            <ReusableButton label="DEPLOY" />
            <ReusableButton label="REPAIR" />
            <ReusableButton label="HISTORY" />
            <ReusableButton label="SELL" />
            <ReusableButton label="RENT" />
        </Stack>
    )
}

const ReusableButton = ({ label }: { label: string }) => {
    const theme = useTheme()

    return (
        <FancyButton
            excludeCaret
            clipThingsProps={{
                clipSize: "8px",
                backgroundColor: theme.factionTheme.background,
                opacity: 0.8,
                border: { borderColor: theme.factionTheme.primary, borderThickness: "1.5px" },
                sx: { flex: 1, position: "relative" },
            }}
            sx={{ px: "1.3rem", py: ".3rem", color: theme.factionTheme.primary }}
            // onClick={onClick}
        >
            <Typography
                variant="caption"
                sx={{
                    fontSize: "1.1rem",
                    fontFamily: fonts.nostromoBold,
                }}
            >
                {label}
            </Typography>
        </FancyButton>
    )
}
