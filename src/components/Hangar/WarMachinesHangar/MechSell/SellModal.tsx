import { Box, Stack, Typography } from "@mui/material"
import { useCallback, useState } from "react"
import { FancyButton } from "../../.."
import { useSnackbar } from "../../../../containers"
import { useGameServerCommandsFaction } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { colors, fonts } from "../../../../theme/theme"
import { MechModal } from "../Common/MechModal"
import { MechDetails } from "../../../../types"

export const SellModal = ({
    selectedMechDetails: sellMechDetails,
    sellMechModalOpen,
    setSellMechModalOpen,
}: {
    selectedMechDetails: MechDetails
    sellMechModalOpen: boolean
    setSellMechModalOpen: (close: boolean) => void
}) => {
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const { newSnackbarMessage } = useSnackbar()
    const [isLoading, setIsLoading] = useState(false)
    const [sellError, setSellError] = useState<string>()

    const onClose = useCallback(() => {
        setSellMechModalOpen(false)
        setSellError(undefined)
    }, [setSellMechModalOpen])

    const onSellMech = useCallback(
        async ({ id }: { id: string }) => {
            try {
                setIsLoading(true)
                // const resp = await send(GameServerKeys.MarketplaceSalesCreate, {
                //     has_buyout: true,
                //     sale_type: "BUYOUT",
                //     item_type: "mech",
                //     item_id: id,
                //     asking_price: "88888",
                //     listing_duration_hours: 50,
                // })

                const resp = await send(GameServerKeys.MarketplaceSalesCreate, {
                    has_auction: true,
                    item_type: "mech",
                    item_id: id,
                    asking_price: "999",
                    auction_reserved_price: "88888",
                    listing_duration_hours: 8,
                })

                if (resp) {
                    newSnackbarMessage("Successfully listed war machine for sale.", "success")
                    onClose()
                }
            } catch (e) {
                setSellError(typeof e === "string" ? e : "Failed to list war machine.")
                console.error(e)
                return
            } finally {
                setIsLoading(false)
            }
        },
        [newSnackbarMessage, onClose, send],
    )

    // // Fetch
    // const { send } = useGameServerCommandsYYY("xxxxxxxxx")

    // useEffect(() => {
    //     ;(async () => {
    //         try {
    //             const resp = await send<RESPONSE_TYPE>(GameServerKeys.XXXXXX, {
    //                 payload: something,
    //             })

    //             if (!resp) return
    //             setFactionsData(resp)
    //         } catch (e) {
    //             console.error(e)
    //         }
    //     })()
    // }, [send])

    // // Subscription
    // const payload = useGameServerSubscriptionYYY<RESPONSE_TYPE>({
    //     URI: "/xxxxxxxxx",
    //     key: GameServerKeys.SomeKey,
    // })

    // useGameServerSubscriptionYYY<RESPONSE_TYPE>(
    //     {
    //         URI: "/xxxxxxxxx",
    //         key: GameServerKeys.SomeKey,
    //     },
    //     (payload) => {
    //         if (!payload) return
    //         setState(payload)
    //     },
    // )

    if (!sellMechDetails) return null

    const { id } = sellMechDetails

    return (
        <MechModal open={sellMechModalOpen} mechDetails={sellMechDetails} onClose={onClose}>
            <Stack spacing="1.5rem">
                <Box sx={{ mt: "auto" }}>
                    <FancyButton
                        loading={isLoading}
                        excludeCaret
                        clipThingsProps={{
                            clipSize: "5px",
                            backgroundColor: colors.red,
                            border: { isFancy: true, borderColor: colors.red },
                            sx: { position: "relative", width: "100%" },
                        }}
                        sx={{ px: "1.6rem", py: ".6rem", color: "#FFFFFF" }}
                        onClick={() => onSellMech({ id })}
                    >
                        <Typography variant="caption" sx={{ fontFamily: fonts.nostromoBlack }}>
                            LIST FOR SALE
                        </Typography>
                    </FancyButton>
                </Box>

                {sellError && (
                    <Typography
                        variant="body2"
                        sx={{
                            mt: ".3rem",
                            color: "red",
                        }}
                    >
                        {sellError}
                    </Typography>
                )}
            </Stack>
        </MechModal>
    )
}
