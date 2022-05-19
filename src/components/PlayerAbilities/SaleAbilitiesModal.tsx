import { Box, Modal, Typography } from "@mui/material"
import Slide from "@mui/material/Slide"
import { useEffect, useState } from "react"
import { DRAWER_TRANSITION_DURATION, GAME_BAR_HEIGHT } from "../../constants"
import { useToggle } from "../../hooks"
import { useGameServerSubscriptionUser } from "../../hooks/useGameServer"
import { GameServerKeys } from "../../keys"
import { colors, fonts } from "../../theme/theme"
import { SaleAbility } from "../../types"
import { ClipThing } from "../Common/ClipThing"
import { SaleAbilityCard } from "../PlayerAbilities/SaleAbilityCard"

export interface SaleAbilitiesModalProps {
    open: boolean
    onClose: () => void | undefined
}

const modalWidth = 400

export const SaleAbilitiesModal = ({ open, onClose }: SaleAbilitiesModalProps) => {
    const [localOpen, toggleLocalOpen] = useToggle(open)
    const [saleAbilities, setSaleAbilities] = useState<SaleAbility[]>([])
    const [priceMap, setPriceMap] = useState<Map<string, string>>(new Map())

    useGameServerSubscriptionUser<SaleAbility[]>(
        {
            URI: "/secure_public/sale_abilities",
            key: GameServerKeys.SaleAbilitiesList,
        },
        (payload) => {
            if (!payload) return
            setSaleAbilities(payload)
        },
    )

    useGameServerSubscriptionUser<{ id: string; price: string }>(
        {
            URI: "/secure_public/sale_abilities",
            key: GameServerKeys.SaleAbilitiesPriceSubscribe,
        },
        (payload) => {
            if (!payload) return
            setPriceMap((prev) => {
                return new Map(prev.set(payload.id, payload.price))
            })
        },
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
                                    {saleAbilities.length > 0 ? (
                                        <Box
                                            sx={{
                                                display: "grid",
                                                gridTemplateColumns: "repeat(6, 70px)",
                                                gap: ".5rem",
                                            }}
                                        >
                                            {saleAbilities.map((s) => (
                                                <SaleAbilityCard key={s.id} saleAbility={s} updatedPrice={priceMap.get(s.id) || s.current_price} />
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
