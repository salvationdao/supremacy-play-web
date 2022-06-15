import { Box, Modal, Typography } from "@mui/material"
import Slide from "@mui/material/Slide"
import { useCallback, useEffect, useState } from "react"
import { DRAWER_TRANSITION_DURATION, GAME_BAR_HEIGHT } from "../../constants"
import { useToggle } from "../../hooks"
import { useGameServerCommandsUser, useGameServerSubscription } from "../../hooks/useGameServer"
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
    const { send } = useGameServerCommandsUser("user_commander")
    const [localOpen, toggleLocalOpen] = useToggle(open)
    const [saleAbilityIDs, setSaleAbilityIDs] = useState<string[]>([])

    const fetchSaleAbilities = useCallback(async () => {
        ;(async () => {
            try {
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
                if (!resp) return
                setSaleAbilityIDs(resp.ability_ids)
            } catch (e) {
                console.error(e)
            }
        })()
    }, [send])

    useEffect(() => {
        fetchSaleAbilities()
    }, [fetchSaleAbilities])

    useGameServerSubscription(
        {
            URI: "/public/live_data",
            key: GameServerKeys.TriggerSaleAbilitiesListUpdated,
        },
        () => fetchSaleAbilities(),
    )

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
                            outline: "none",
                        }}
                    >
                        <ClipThing
                            clipSize="8px"
                            border={{
                                borderThickness: ".3rem",
                                borderColor: colors.blue2,
                            }}
                            corners={{
                                bottomLeft: true,
                            }}
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
                                    {saleAbilityIDs.length > 0 ? (
                                        <Box
                                            sx={{
                                                display: "grid",
                                                gridTemplateColumns: "repeat(6, 70px)", // hard-coded to have 6 columns, adjust as required
                                                gap: ".5rem",
                                            }}
                                        >
                                            {saleAbilityIDs.map((s) => (
                                                <SaleAbilityCard key={s} abilityID={s} />
                                            ))}
                                        </Box>
                                    ) : (
                                        <Typography
                                            sx={{
                                                px: "1.28rem",
                                                pt: "1.28rem",
                                                mb: ".56rem",
                                                color: colors.grey,
                                                userSelect: "text !important",
                                                opacity: 0.8,
                                            }}
                                        >
                                            There are currently no abilities on sale.
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                        </ClipThing>
                    </Box>
                </Slide>
            </Modal>
        </>
    )
}
