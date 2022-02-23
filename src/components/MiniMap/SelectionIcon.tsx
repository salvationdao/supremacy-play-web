import { Box, Typography, Zoom } from "@mui/material"
import { Dispatch, MutableRefObject, SetStateAction } from "react"
import { FancyButton, MapSelection } from ".."
import { GAME_SERVER_HOSTNAME } from "../../constants"
import { httpProtocol, useWebsocket } from "../../containers"
import HubKey from "../../keys"
import { GameAbility } from "../../types"

interface MapSelectRequest {
    x: number
    y: number
}

export const SelectionIcon = ({
    selection,
    gameAbility,
    setSelection,
    setSubmitted,
    confirmed,
}: {
    selection: MapSelection | undefined
    gameAbility: GameAbility
    setSelection: Dispatch<SetStateAction<MapSelection | undefined>>
    setSubmitted: Dispatch<SetStateAction<boolean>>
    confirmed: MutableRefObject<boolean>
}) => {
    const { state, send } = useWebsocket()

    if (!selection) return null

    const onConfirm = async () => {
        try {
            if (state !== WebSocket.OPEN) return
            confirmed.current = true
            const resp = await send<boolean, MapSelectRequest>(HubKey.SubmitAbilityLocationSelect, {
                x: selection.x,
                y: selection.y,
            })

            if (resp) {
                setSubmitted(true)
            } else {
                confirmed.current = false
            }
        } catch (e) {
            confirmed.current = false
        }
    }

    if (!gameAbility) return null

    const { colour, imageUrl } = gameAbility

    return (
        <Box
            sx={{
                position: "absolute",
                height: "54px",
                width: "54px",
                mt: "1px",
                zIndex: 6,
                border: `2px solid ${colour}`,
                borderRadius: 1,
                transform: `translate3d(${selection.x * 50}px, ${selection.y * 50}px, 0)`,
            }}
        >
            <Box
                sx={{
                    position: "relative",
                    height: "100%",
                    width: "100%",
                }}
            >
                <Box
                    onClick={() => setSelection(undefined)}
                    sx={{
                        height: "100%",
                        width: "100%",
                        opacity: 0.65,
                        backgroundImage: `url(${httpProtocol()}://${GAME_SERVER_HOSTNAME}${imageUrl})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                    }}
                ></Box>

                <Box
                    sx={{
                        position: "absolute",
                        bottom: 0,
                        left: "50%",
                        transform: "translate(-50%, 50%)",
                    }}
                >
                    <Zoom in={!confirmed.current}>
                        <Box>
                            <FancyButton
                                disabled={!selection}
                                excludeCaret
                                clipSize="4px"
                                sx={{ p: 0.4 }}
                                backgroundColor={colour}
                                borderColor={colour}
                                onClick={onConfirm}
                            >
                                <Typography variant="body2" sx={{ fontWeight: "fontWeightBold" }}>
                                    CONFIRM
                                </Typography>
                            </FancyButton>
                        </Box>
                    </Zoom>
                </Box>
            </Box>
        </Box>
    )
}
