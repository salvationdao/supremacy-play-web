import { Box, Divider, Stack, Typography } from "@mui/material"
import { useCallback, useState } from "react"
import { useHistory, useLocation } from "react-router-dom"
import { FancyButton } from "../../.."
import { useAuth } from "../../../../containers"
import { useToggle } from "../../../../hooks"
import { useGameServerCommandsFaction } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { colors, fonts } from "../../../../theme/theme"
import { MarketUser } from "../../../../types/marketplace"
import { ConfirmModal } from "../../../Common/ConfirmModal"
import { SuccessModal } from "../../../Common/SuccessModal"

export const ManageListing = ({ id, owner, isKeycard, isTimeEnded }: { id: string; owner?: MarketUser; isKeycard?: boolean; isTimeEnded: boolean }) => {
    const { userID } = useAuth()
    const history = useHistory()
    const location = useLocation()
    const { send } = useGameServerCommandsFaction("/faction_commander")

    // Cancel listing
    const [confirmCancelModalOpen, toggleConfirmCancelModalOpen] = useToggle()
    const [cancelSuccessModalOpen, toggleCancelSuccessModalOpen] = useToggle()
    const [cancelling, toggleCancelling] = useToggle()
    const [cancelError, setCancelError] = useState<string>()

    const onCancelListing = useCallback(async () => {
        try {
            toggleCancelling(true)
            const resp = await send(isKeycard ? GameServerKeys.CancelKeycardListing : GameServerKeys.CancelMarketplaceListing, {
                id,
            })

            if (!resp) return
            toggleConfirmCancelModalOpen(false)
            toggleCancelSuccessModalOpen(true)
            setCancelError(undefined)
        } catch (err) {
            const message = typeof err === "string" ? err : "Failed to cancel listing."
            setCancelError(message)
            console.error(err)
        } finally {
            toggleCancelling(false)
        }
    }, [id, isKeycard, send, toggleCancelSuccessModalOpen, toggleCancelling, toggleConfirmCancelModalOpen])

    const isSelfItem = userID === owner?.id

    if (!isSelfItem) return null

    return (
        <>
            <Stack spacing="2rem">
                <Divider />

                <Box>
                    <Typography gutterBottom sx={{ color: colors.lightGrey, fontFamily: fonts.nostromoBold }}>
                        MANAGE:
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing=".7rem">
                        <FancyButton
                            excludeCaret
                            disabled={isTimeEnded}
                            clipThingsProps={{
                                clipSize: "9px",
                                backgroundColor: colors.red,
                                opacity: 1,
                                border: { isFancy: true, borderColor: colors.red, borderThickness: "2px" },
                                sx: { position: "relative", width: "18rem" },
                            }}
                            sx={{ py: ".7rem", color: "#FFFFFF" }}
                            onClick={() => toggleConfirmCancelModalOpen(true)}
                        >
                            <Typography
                                variant="body2"
                                sx={{
                                    flexShrink: 0,
                                    color: "#FFFFFF",
                                    fontFamily: fonts.nostromoBlack,
                                }}
                            >
                                CANCEL LISTING
                            </Typography>
                        </FancyButton>
                    </Stack>
                </Box>
            </Stack>

            {confirmCancelModalOpen && (
                <ConfirmModal
                    title="CONFIRMATION"
                    onConfirm={onCancelListing}
                    onClose={() => {
                        setCancelError(undefined)
                        toggleConfirmCancelModalOpen(false)
                    }}
                    isLoading={cancelling}
                    error={cancelError}
                >
                    <Typography variant="h6">
                        Do you wish to remove the listing from the marketplace?
                        <br />
                        Your listing fee will not be refunded.
                    </Typography>
                </ConfirmModal>
            )}

            {cancelSuccessModalOpen && (
                <SuccessModal
                    title="ITEM CANCELLED"
                    leftLabel="SELL ANOTHER"
                    onLeftButton={() => {
                        history.replace(`/marketplace/sell${location.hash}`)
                    }}
                    rightLabel="GO BACK TO MARKETPLACE"
                    onRightButton={() => {
                        history.replace(`/marketplace${location.hash}`)
                    }}
                >
                    <Typography variant="h6">Your item has been removed from the marketplace.</Typography>
                </SuccessModal>
            )}
        </>
    )
}
