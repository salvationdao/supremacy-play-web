import { Box, Modal, Typography } from "@mui/material"
import Slide from "@mui/material/Slide"
import { useEffect, useState } from "react"
import { GAME_BAR_HEIGHT } from "../../constants"
import { SocketState, useGameServerAuth, useGameServerWebsocket } from "../../containers"
import { GameServerKeys } from "../../keys"
import { fonts } from "../../theme/theme"
import { SaleAbilityCard } from "../PlayerAbilities/SaleAbilityCard"

export interface SaleAbilitiesModalProps {
    open: boolean
    onClose: ((event: any, reason: "backdropClick" | "escapeKeyDown") => void) | undefined
}

const modalWidth = 400

export const SaleAbilitiesModal = ({ open, onClose }: SaleAbilitiesModalProps) => {
    const { user } = useGameServerAuth()
    const { state, send, subscribe } = useGameServerWebsocket()
    const [saleAbilityIDs, setSaleAbilityIDs] = useState<string[]>([])

    useEffect(() => {
        if (state !== SocketState.OPEN || !send || !subscribe || !user) return
        ;(async () => {
            const resp = await send<{ total: number; ability_ids: string[] }>(GameServerKeys.SaleAbilitiesList)
            setSaleAbilityIDs(resp.ability_ids)
        })()

        return subscribe(GameServerKeys.TriggerSaleAbilitiesListUpdated, async () => {
            const resp = await send<{ total: number; ability_ids: string[] }>(GameServerKeys.SaleAbilitiesList)
            setSaleAbilityIDs(resp.ability_ids)
        })
    }, [state, send, subscribe, user])

    return (
        <Modal open={open} onClose={onClose} closeAfterTransition>
            <Slide in={open}>
                <Box
                    sx={{
                        position: "absolute",
                        top: `calc(${GAME_BAR_HEIGHT}rem + 3rem)`,
                        left: `calc(50vw - min(${modalWidth / 2}px, 50vw))`,
                        border: "1px solid orangered",
                        width: "100%",
                        maxWidth: modalWidth,
                        padding: "1rem",
                    }}
                >
                    <Typography
                        variant="h5"
                        sx={{
                            marginBottom: ".5rem",
                            fontFamily: fonts.nostromobold,
                            textTransform: "uppercase",
                        }}
                    >
                        Purchase Abilities
                    </Typography>
                    <Box
                        sx={{
                            overflowX: "auto",
                            scrollbarWidth: "none",
                            "::-webkit-scrollbar": {
                                width: ".4rem",
                            },
                            "::-webkit-scrollbar-track": {
                                background: "#FFFFFF15",
                                borderRadius: 3,
                            },
                            "::-webkit-scrollbar-thumb": {
                                background: "#FFFFFF80",
                                borderRadius: 3,
                            },
                        }}
                    >
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: "repeat(6, 70px)",
                                gap: ".5rem",
                            }}
                        >
                            {saleAbilityIDs.map((s, index) => (
                                <SaleAbilityCard key={index} abilityID={s} />
                            ))}
                        </Box>
                    </Box>
                </Box>
            </Slide>
        </Modal>
    )
}
