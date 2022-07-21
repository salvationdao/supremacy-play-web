import { Box, Typography } from "@mui/material"
import { useState } from "react"
import { useLocation } from "react-router-dom"
import { ClipThing, FancyButton, TooltipHelper } from "../../.."
import { BATTLE_ARENA_OPEN } from "../../../../constants"
import { useTheme } from "../../../../containers/theme"
import { useGameServerSubscriptionFaction } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { MARKETPLACE_TABS } from "../../../../pages"
import { colors, fonts } from "../../../../theme/theme"
import { MechDetails, MechStatus, MechStatusEnum } from "../../../../types"
import { ItemType } from "../../../../types/marketplace"

export const MechButtons = ({
    mechDetails,
    setSelectedMechDetails,
    setDeployMechModalOpen,
    setLeaveMechModalOpen,
    setRentalMechModalOpen,
    marketLocked,
}: {
    mechDetails: MechDetails
    setSelectedMechDetails: React.Dispatch<React.SetStateAction<MechDetails | undefined>>
    setDeployMechModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    setLeaveMechModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    setRentalMechModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    marketLocked: boolean
}) => {
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
        <ClipThing
            clipSize="10px"
            border={{
                borderColor: theme.factionTheme.primary,
                borderThickness: "2.2px",
            }}
            opacity={0.7}
            backgroundColor={theme.factionTheme.background}
            sx={{ m: "-.3rem" }}
        >
            <Box sx={{ p: "1rem", gap: ".8rem", display: "grid", gridTemplateColumns: "repeat(2, 1fr)" }}>
                {/* Button 1 */}
                {mechState === MechStatusEnum.Battle || mechState === MechStatusEnum.Queue ? (
                    <ReusableButton
                        primaryColor="#E0B61B"
                        secondaryColor="#111111"
                        backgroundColor="#E0B61B"
                        label="UNDEPLOY"
                        disabled={!mechState || mechState === MechStatusEnum.Battle}
                        onClick={() => {
                            setSelectedMechDetails(mechDetails)
                            setLeaveMechModalOpen(true)
                        }}
                    />
                ) : (
                    <ReusableButton
                        isFancy
                        primaryColor={colors.green}
                        backgroundColor={colors.green}
                        label="DEPLOY"
                        disabled={!BATTLE_ARENA_OPEN || !mechState || mechState !== MechStatusEnum.Idle || !mechDetails.battle_ready}
                        onClick={() => {
                            setSelectedMechDetails(mechDetails)
                            setDeployMechModalOpen(true)
                        }}
                    />
                )}

                {/* Button 2 */}
                <ReusableButton
                    isFancy
                    primaryColor={colors.orange}
                    backgroundColor={colors.orange}
                    label="REPAIR"
                    disabled={mechState != MechStatusEnum.Damaged}
                />

                {/* Button 4 */}
                <ReusableButton
                    isFancy
                    primaryColor={colors.purple}
                    backgroundColor={colors.purple}
                    label="RENT"
                    disabled={true}
                    onClick={() => {
                        setSelectedMechDetails(mechDetails)
                        setRentalMechModalOpen(true)
                    }}
                />

                {/* Button 5 */}
                <TooltipHelper
                    placement={"right"}
                    text={marketLocked ? "Unfortunately assets on the old staking contract cannot be listed on the marketplace." : ""}
                >
                    <Box>
                        <ReusableButton
                            isFancy={mechState !== MechStatusEnum.Market}
                            primaryColor={colors.red}
                            secondaryColor={mechState === MechStatusEnum.Market ? colors.red : undefined}
                            backgroundColor={mechState === MechStatusEnum.Market ? theme.factionTheme.background : colors.red}
                            label={mechState === MechStatusEnum.Market ? "VIEW LISTING" : "SELL"}
                            disabled={!mechState || (mechState !== MechStatusEnum.Idle && mechState !== MechStatusEnum.Market) || marketLocked}
                            to={
                                mechDetails.locked_to_marketplace
                                    ? !mechDetails.item_sale_id
                                        ? undefined
                                        : `/marketplace/${MARKETPLACE_TABS.WarMachines}/${mechDetails.item_sale_id}${location.hash}`
                                    : `/marketplace/sell?itemType=${ItemType.WarMachine}&assetID=${mechDetails.id}${location.hash}`
                            }
                        />
                    </Box>
                </TooltipHelper>
            </Box>
        </ClipThing>
    )
}

export const ReusableButton = ({
    primaryColor,
    secondaryColor,
    backgroundColor,
    label,
    onClick,
    disabled,
    to,
    href,
}: {
    isFancy?: boolean
    primaryColor: string
    secondaryColor?: string
    backgroundColor: string
    label: string
    onClick?: () => void
    disabled?: boolean
    to?: string
    href?: string
}) => {
    return (
        <FancyButton
            to={to}
            href={href}
            disabled={(!onClick && !to) || disabled}
            clipThingsProps={{
                clipSize: "6px",
                clipSlantSize: "0px",
                corners: { topLeft: true, topRight: true, bottomLeft: true, bottomRight: true },
                backgroundColor: backgroundColor,
                border: { isFancy: false, borderColor: primaryColor, borderThickness: "1.5px" },
                sx: { position: "relative", minWidth: "10rem" },
            }}
            sx={{ px: "1.3rem", py: ".9rem", color: secondaryColor || primaryColor }}
            onClick={onClick}
        >
            <Typography
                variant="caption"
                sx={{
                    color: secondaryColor || "#FFFFFF",
                    fontFamily: fonts.nostromoBlack,
                }}
            >
                {label}
            </Typography>
        </FancyButton>
    )
}
