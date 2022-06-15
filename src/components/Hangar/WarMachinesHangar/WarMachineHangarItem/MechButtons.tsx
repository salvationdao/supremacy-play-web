import { Box, Typography } from "@mui/material"
import { useHistory, useLocation } from "react-router-dom"
import { FancyButton } from "../../.."
import { useTheme } from "../../../../containers/theme"
import { colors, fonts } from "../../../../theme/theme"
import { MechDetails, MechStatus, MechStatusEnum } from "../../../../types"
import { ItemType } from "../../../../types/marketplace"
import { useGameServerSubscriptionFaction } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { useState } from "react"
import { MARKETPLACE_TABS } from "../../../../pages"

export const MechButtons = ({
    mechDetails,
    setSelectedMechDetails,
    setDeployMechModalOpen,
    setLeaveMechModalOpen,
    setHistoryMechModalOpen,
    setRentalMechModalOpen,
}: {
    mechDetails: MechDetails
    setSelectedMechDetails: React.Dispatch<React.SetStateAction<MechDetails | undefined>>
    setDeployMechModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    setLeaveMechModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    setHistoryMechModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    setRentalMechModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const history = useHistory()
    const location = useLocation()
    const theme = useTheme()
    const [mechState, setMechState] = useState<MechStatusEnum>()

    useGameServerSubscriptionFaction<MechStatus>(
        {
            URI: `/queue/${mechDetails.id}`,
            key: GameServerKeys.SubMechQueuePosition,
        },
        (payload) => {
            if (!payload || mechState === MechStatusEnum.Sold) return
            setMechState(payload.status)
        },
    )

    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr) max-content", // hard-coded to have 5 buttons, adjust as required
                gap: ".8rem",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            {/* Button 1 */}
            {mechState === MechStatusEnum.Battle || mechState === MechStatusEnum.Queue ? (
                <ReusableButton
                    primaryColor={theme.factionTheme.primary}
                    backgroundColor={theme.factionTheme.background}
                    label="UNDEPLOY"
                    disabled={mechState === MechStatusEnum.Battle}
                    onClick={() => {
                        setSelectedMechDetails(mechDetails)
                        setLeaveMechModalOpen(true)
                    }}
                />
            ) : (
                <ReusableButton
                    primaryColor={theme.factionTheme.primary}
                    backgroundColor={theme.factionTheme.background}
                    label="DEPLOY"
                    disabled={mechState !== MechStatusEnum.Idle}
                    onClick={() => {
                        setSelectedMechDetails(mechDetails)
                        setDeployMechModalOpen(true)
                    }}
                />
            )}

            {/* Button 2 */}
            <ReusableButton primaryColor={theme.factionTheme.primary} backgroundColor={theme.factionTheme.background} label="REPAIR" disabled={!mechDetails} />

            {/* Button 3 */}
            <ReusableButton
                primaryColor={theme.factionTheme.primary}
                backgroundColor={theme.factionTheme.background}
                label="HISTORY"
                onClick={() => {
                    setSelectedMechDetails(mechDetails)
                    setHistoryMechModalOpen(true)
                }}
            />

            {/* Button 4 */}
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

            {/* Button 5 */}
            <ReusableButton
                isFancy={mechState !== MechStatusEnum.Market}
                primaryColor={colors.red}
                secondaryColor={mechState === MechStatusEnum.Market ? colors.red : undefined}
                backgroundColor={mechState === MechStatusEnum.Market ? theme.factionTheme.background : colors.red}
                label={mechState === MechStatusEnum.Market ? "VIEW LISTING" : "SELL"}
                disabled={mechState !== MechStatusEnum.Idle && mechState !== MechStatusEnum.Market}
                onClick={() => {
                    if (mechDetails.locked_to_marketplace) {
                        if (!mechDetails.item_sale_id) return
                        history.push(`/marketplace/${MARKETPLACE_TABS.WarMachines}/${mechDetails.item_sale_id}${location.hash}`)
                    } else {
                        history.push(`/marketplace/sell?item-type=${ItemType.WarMachine}&asset-id=${mechDetails.id}${location.hash}`)
                    }
                }}
            />
        </Box>
    )
}

const ReusableButton = ({
    isFancy,
    primaryColor,
    secondaryColor,
    backgroundColor,
    label,
    onClick,
    disabled,
}: {
    isFancy?: boolean
    primaryColor: string
    secondaryColor?: string
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
                sx: { position: "relative", minWidth: "10rem" },
            }}
            sx={{ px: "1.3rem", py: ".3rem", color: secondaryColor || primaryColor }}
            onClick={onClick}
        >
            <Typography
                variant="caption"
                sx={{
                    color: secondaryColor || "#FFFFFF",
                    fontFamily: fonts.nostromoBold,
                }}
            >
                {label}
            </Typography>
        </FancyButton>
    )
}
