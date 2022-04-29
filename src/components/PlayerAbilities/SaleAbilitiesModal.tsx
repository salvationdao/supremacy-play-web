import { Box, Modal, Typography } from "@mui/material"
import Slide from "@mui/material/Slide"
import { useEffect, useState } from "react"
import { DRAWER_TRANSITION_DURATION, GAME_BAR_HEIGHT } from "../../constants"
import { SocketState, useGameServerAuth, useGameServerWebsocket } from "../../containers"
import { useToggle } from "../../hooks"
import { GameServerKeys } from "../../keys"
import { colors, fonts } from "../../theme/theme"
import { ClipThing } from "../Common/ClipThing"
import { SaleAbilityCard } from "../PlayerAbilities/SaleAbilityCard"

export interface SaleAbilitiesModalProps {
    open: boolean
    onClose: () => void | undefined
}

const modalWidth = 400

export const SaleAbilitiesModal = ({ open, onClose }: SaleAbilitiesModalProps) => {
    const { userID } = useGameServerAuth()
    const { state, send, subscribe } = useGameServerWebsocket()
    const [localOpen, toggleLocalOpen] = useToggle(open)
    const [saleAbilityIDs, setSaleAbilityIDs] = useState<string[]>([])

    useEffect(() => {
        if (state !== SocketState.OPEN || !send || !subscribe || !userID) return

        const fetchSaleAbilities = async () => {
            const resp = await send<{ total: number; ability_ids: string[] }>(GameServerKeys.SaleAbilitiesList, {
                filter: {
                    items: [
                        {
                            table: "sale_player_abilities",
                            column: "available_until",
                            operator: "after",
                            value: "now()",
                        },
                    ],
                },
            })
            setSaleAbilityIDs(resp.ability_ids)
        }

        fetchSaleAbilities()

        return subscribe(GameServerKeys.TriggerSaleAbilitiesListUpdated, () => fetchSaleAbilities())
    }, [state, send, subscribe, userID])

    useEffect(() => {
        if (!localOpen) {
            setTimeout(() => {
                onClose()
            }, DRAWER_TRANSITION_DURATION + 50)
        }
    }, [localOpen, onClose])

    return (
        <>
            <Modal open={localOpen} onClose={() => toggleLocalOpen(false)} closeAfterTransition>
                <Slide in={localOpen}>
                    <Box
                        sx={{
                            position: "absolute",
                            top: `calc(${GAME_BAR_HEIGHT}rem + 3rem)`,
                            left: `calc(50vw - min(${modalWidth / 2}px, 50vw))`,
                            width: "100%",
                            maxWidth: modalWidth,
                        }}
                    >
                        <ClipThing
                            border={{
                                borderThickness: ".15rem",
                                borderColor: colors.blue2,
                                isFancy: true,
                            }}
                            skipRightCorner
                            backgroundColor={colors.darkNavy}
                        >
                            <Box sx={{ px: "2rem", py: "1.5rem" }}>
                                <Typography
                                    variant="h5"
                                    sx={{
                                        marginBottom: ".5rem",
                                        fontFamily: fonts.nostromoBold,
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
                                        {saleAbilityIDs.map((s) => (
                                            <SaleAbilityCard key={s} abilityID={s} />
                                        ))}
                                    </Box>
                                </Box>
                            </Box>
                        </ClipThing>
                    </Box>
                </Slide>
            </Modal>
        </>
    )
}
