import { Stack, Typography } from "@mui/material"
import { useHistory } from "react-router-dom"
import { FancyButton } from "../../.."
import { useTheme } from "../../../../containers/theme"
import { colors, fonts } from "../../../../theme/theme"
import { MechDetails } from "../../../../types"
import { ItemType } from "../../../../types/marketplace"

export const MechButtons = ({
    mechDetails,
    mechQueuePosition,
    setSelectedMechDetails,
    setDeployMechModalOpen,
    setLeaveMechModalOpen,
    setHistoryMechModalOpen,
    setRentalMechModalOpen,
}: {
    mechDetails: MechDetails
    mechQueuePosition: number
    setSelectedMechDetails: React.Dispatch<React.SetStateAction<MechDetails | undefined>>
    setDeployMechModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    setLeaveMechModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    setHistoryMechModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    setRentalMechModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const history = useHistory()
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
                label="RENT"
                disabled={true}
                onClick={() => {
                    setSelectedMechDetails(mechDetails)
                    setRentalMechModalOpen(true)
                }}
            />

            <ReusableButton
                isFancy
                primaryColor={colors.red}
                backgroundColor={colors.red}
                label="SELL"
                disabled={!mechDetails}
                onClick={() => {
                    history.push(`/marketplace/sell?item-type=${ItemType.WarMachine}&asset-id=${mechDetails.id}`)
                }}
            />
        </Stack>
    )
}

const ReusableButton = ({
    isFancy,
    primaryColor,
    backgroundColor,
    label,
    onClick,
    disabled,
}: {
    isFancy?: boolean
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
                border: { isFancy, borderColor: primaryColor, borderThickness: "1.5px" },
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
