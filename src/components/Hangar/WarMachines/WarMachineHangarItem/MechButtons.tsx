import { Stack, Typography } from "@mui/material"
import { FancyButton } from "../../.."
import { useTheme } from "../../../../containers/theme"
import { fonts } from "../../../../theme/theme"
import { MechDetails } from "../../../../types"

export const MechButtons = ({
    mechDetails,
    mechQueuePosition,
    setSelectedMechDetails,
    setDeployMechModalOpen,
    setLeaveMechModalOpen,
    setHistoryMechModalOpen,
    setRentalMechModalOpen,
    setSellMechModalOpen,
}: {
    mechDetails: MechDetails
    mechQueuePosition: number
    setSelectedMechDetails: React.Dispatch<React.SetStateAction<MechDetails | undefined>>
    setDeployMechModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    setLeaveMechModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    setHistoryMechModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    setRentalMechModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    setSellMechModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const theme = useTheme()

    return (
        <Stack direction="row" spacing=".8rem">
            {mechQueuePosition === -1 && (
                <ReusableButton
                    primaryColor={theme.factionTheme.primary}
                    backgroundColor={theme.factionTheme.background}
                    label="DEPLOY"
                    disabled={!mechDetails}
                    onClick={() => {
                        setSelectedMechDetails(mechDetails)
                        setDeployMechModalOpen(true)
                    }}
                />
            )}

            {mechQueuePosition === 0 && (
                <ReusableButton primaryColor={theme.factionTheme.primary} backgroundColor={theme.factionTheme.background} label="UNDEPLOY" disabled={true} />
            )}

            {mechQueuePosition > 0 && (
                <ReusableButton
                    primaryColor={theme.factionTheme.primary}
                    backgroundColor={theme.factionTheme.background}
                    label="UNDEPLOY"
                    disabled={true}
                    onClick={() => {
                        setSelectedMechDetails(mechDetails)
                        setLeaveMechModalOpen(true)
                    }}
                />
            )}
            <ReusableButton primaryColor={theme.factionTheme.primary} backgroundColor={theme.factionTheme.background} label="REPAIR" disabled={!mechDetails} />
            <ReusableButton
                primaryColor={theme.factionTheme.primary}
                backgroundColor={theme.factionTheme.background}
                label="HISTORY"
                disabled={!mechDetails}
                onClick={() => {
                    setSelectedMechDetails(mechDetails)
                    setHistoryMechModalOpen(true)
                }}
            />

            <ReusableButton
                primaryColor={theme.factionTheme.primary}
                backgroundColor={theme.factionTheme.background}
                label="SELL"
                disabled={!mechDetails}
                onClick={() => {
                    setSelectedMechDetails(mechDetails)
                    setSellMechModalOpen(true)
                }}
            />

            <ReusableButton
                primaryColor={theme.factionTheme.primary}
                backgroundColor={theme.factionTheme.background}
                label="RENT"
                disabled={true}
                onClick={() => {
                    setSelectedMechDetails(mechDetails)
                    setRentalMechModalOpen(true)
                }}
            />
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
                border: { borderColor: primaryColor, borderThickness: "1.5px" },
                sx: { flex: 1, position: "relative" },
            }}
            sx={{ px: "1.3rem", py: ".3rem", color: primaryColor }}
            onClick={onClick}
        >
            <Typography
                variant="caption"
                sx={{
                    fontFamily: fonts.nostromoBold,
                }}
            >
                {label}
            </Typography>
        </FancyButton>
    )
}
