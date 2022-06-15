import { Box, Stack, Divider, Typography } from "@mui/material"
import { useCallback } from "react"
import { useHistory } from "react-router-dom"
import { FancyButton } from "../../.."
import { useAuth, useSnackbar } from "../../../../containers"
import { useGameServerCommandsFaction } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { colors, fonts } from "../../../../theme/theme"
import { MarketUser } from "../../../../types/marketplace"

export const ManageListing = ({ id, owner, isKeycard }: { id: string; owner?: MarketUser; isKeycard?: boolean }) => {
    const { userID } = useAuth()
    const history = useHistory()
    const { newSnackbarMessage } = useSnackbar()
    const { send } = useGameServerCommandsFaction("/faction_commander")

    const onCancelListing = useCallback(async () => {
        try {
            await send(isKeycard ? GameServerKeys.CancelKeycardListing : GameServerKeys.CancelMarketplaceListing, {
                id,
            })

            newSnackbarMessage("Successfully cancel listing.", "success")
            history.push(`/marketplace`)
        } catch (err) {
            const message = typeof err === "string" ? err : "Failed to cancel listing."
            newSnackbarMessage(message, "error")
            console.error(err)
        }
    }, [history, id, isKeycard, newSnackbarMessage, send])

    const isSelfItem = userID === owner?.id

    if (!isSelfItem) return null

    return (
        <Stack spacing="2rem">
            <Divider />

            <Box>
                <Typography gutterBottom sx={{ color: colors.lightGrey, fontFamily: fonts.nostromoBold }}>
                    MANAGE:
                </Typography>
                <Stack direction="row" alignItems="center" spacing=".7rem">
                    <FancyButton
                        excludeCaret
                        clipThingsProps={{
                            clipSize: "9px",
                            backgroundColor: colors.red,
                            opacity: 1,
                            border: { isFancy: true, borderColor: colors.red, borderThickness: "2px" },
                            sx: { position: "relative", width: "18rem" },
                        }}
                        sx={{ py: ".7rem", color: "#FFFFFF" }}
                        onClick={onCancelListing}
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
    )
}
