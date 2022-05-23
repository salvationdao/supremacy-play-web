import { Stack, Typography } from "@mui/material"
import { FancyButton } from "../../.."
import { useHangarWarMachine } from "../../../../containers/hangar/hangarWarMachines"
import { useTheme } from "../../../../containers/theme"
import { fonts } from "../../../../theme/theme"
import { MechBasic, MechDetails } from "../../../../types"

export const MechButtons = ({ mechDetails }: { mech: MechBasic; mechDetails?: MechDetails }) => {
    const theme = useTheme()
    const { setDeployMechDetails, setHistoryMechDetails } = useHangarWarMachine()

    return (
        <Stack direction="row" spacing=".8rem">
            <ReusableButton
                primaryColor={theme.factionTheme.primary}
                backgroundColor={theme.factionTheme.background}
                label="DEPLOY"
                disabled={!mechDetails}
                onClick={() => mechDetails && setDeployMechDetails(mechDetails)}
            />
            <ReusableButton primaryColor={theme.factionTheme.primary} backgroundColor={theme.factionTheme.background} label="REPAIR" disabled={!mechDetails} />
            <ReusableButton
                primaryColor={theme.factionTheme.primary}
                backgroundColor={theme.factionTheme.background}
                label="HISTORY"
                disabled={!mechDetails}
                onClick={() => mechDetails && setHistoryMechDetails(mechDetails)}
            />
            <ReusableButton primaryColor={theme.factionTheme.primary} backgroundColor={theme.factionTheme.background} label="SELL" disabled={!mechDetails} />
            <ReusableButton primaryColor={theme.factionTheme.primary} backgroundColor={theme.factionTheme.background} label="RENT" disabled={!mechDetails} />
        </Stack>
    )
}

const ReusableButton = ({
    primaryColor,
    backgroundColor,
    label,
    onClick,
    disabled,
}: {
    primaryColor: string
    backgroundColor: string
    label: string
    onClick?: () => void
    disabled?: boolean
}) => {
    return (
        <FancyButton
            disabled={!onClick || disabled}
            excludeCaret
            clipThingsProps={{
                clipSize: "8px",
                backgroundColor: backgroundColor,
                opacity: 0.8,
                border: { borderColor: primaryColor, borderThickness: "1.5px" },
                sx: { flex: 1, position: "relative" },
            }}
            sx={{ px: "1.3rem", py: ".3rem", color: primaryColor }}
            onClick={onClick}
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
