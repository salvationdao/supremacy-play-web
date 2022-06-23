import { Box, Stack, Typography } from "@mui/material"
import { useState } from "react"
import { ClipThing, FancyButton } from "../.."
import { useTheme } from "../../../containers/theme"
import { useGameServerSubscriptionSecurePublic } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors } from "../../../theme/theme"
import { SaleAbility } from "../../../types"
import { PageHeader } from "../../Common/PageHeader"
import { PlayerAbilityStoreItem } from "./PlayerAbilityStoreItem"

export const PlayerAbilitiesStore = () => {
    const theme = useTheme()

    const [saleAbilities, setSaleAbilities] = useState<SaleAbility[]>([])
    const [priceMap, setPriceMap] = useState<Map<string, string>>(new Map())

    useGameServerSubscriptionSecurePublic<SaleAbility[]>(
        {
            URI: "sale_abilities",
            key: GameServerKeys.SaleAbilitiesList,
        },
        (payload) => {
            if (!payload) return
            setSaleAbilities(payload)
        },
    )

    useGameServerSubscriptionSecurePublic<{ id: string; current_price: string }>(
        {
            URI: "sale_abilities",
            key: GameServerKeys.SaleAbilitiesPriceSubscribe,
        },
        (payload) => {
            if (!payload) return
            setPriceMap((prev) => {
                return new Map(prev.set(payload.id, payload.current_price))
            })
        },
    )

    return (
        <ClipThing
            clipSize="10px"
            border={{
                borderColor: theme.factionTheme.primary,
                borderThickness: ".3rem",
            }}
            corners={{
                topRight: true,
                bottomLeft: true,
                bottomRight: true,
            }}
            opacity={0.7}
            backgroundColor={theme.factionTheme.background}
            sx={{ height: "100%" }}
        >
            <Stack
                sx={{
                    position: "relative",
                    height: "100%",
                }}
            >
                <Stack
                    sx={{
                        flex: 1,
                    }}
                >
                    <PageHeader
                        title={
                            <>
                                PLAYER ABILITIES <span style={{ color: colors.neonBlue, fontFamily: "inherit", fontSize: "inherit" }}>(ROTATES EVERY 1H)</span>
                            </>
                        }
                        description={
                            <>
                                Player abilities are abilities that can be bought and used on the battle arena. The price of a player ability is determined by
                                how active it is at any given time. When players buy an ability, its price will go up. If an ability is not being bought, its
                                price will go down.
                            </>
                        }
                    >
                        <FancyButton
                            clipThingsProps={{
                                clipSize: "9px",
                                backgroundColor: theme.factionTheme.primary,
                                border: { isFancy: true, borderColor: theme.factionTheme.primary, borderThickness: "2px" },
                                sx: { position: "relative" },
                            }}
                            sx={{
                                display: "flex",
                                flexWrap: "nowrap",
                                px: "2rem",
                                py: ".3rem",
                            }}
                            // onClick={() => {}}
                        >
                            <Typography
                                variant="body2"
                                sx={{
                                    color: theme.factionTheme.secondary,
                                    whiteSpace: "nowrap",
                                }}
                            >
                                OWNED ABILITIES: 1337
                            </Typography>
                        </FancyButton>
                    </PageHeader>
                    <Stack
                        sx={{
                            px: "2rem",
                            py: "1rem",
                            flex: 1,
                        }}
                    >
                        <Box
                            sx={{
                                flex: 1,
                                ml: "1.9rem",
                                mr: ".5rem",
                                pr: "1.4rem",
                                my: "1rem",
                                overflowY: "auto",
                                overflowX: "hidden",
                                direction: "ltr",

                                "::-webkit-scrollbar": {
                                    width: ".4rem",
                                },
                                "::-webkit-scrollbar-track": {
                                    background: "#FFFFFF15",
                                    borderRadius: 3,
                                },
                                "::-webkit-scrollbar-thumb": {
                                    background: theme.factionTheme.primary,
                                    borderRadius: 3,
                                },
                            }}
                        >
                            <Box sx={{ direction: "ltr", height: 0 }}>
                                <Box
                                    sx={{
                                        width: "100%",
                                        pt: "2.5%",
                                        display: "grid",
                                        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                                        gridTemplateRows: "repeat(1, min-content)",
                                        gap: "5rem",
                                        alignItems: "stretch",
                                        justifyContent: "center",
                                        overflow: "visible",
                                    }}
                                >
                                    {saleAbilities.map((s) => (
                                        <PlayerAbilityStoreItem key={s.id} saleAbility={s} updatedPrice={priceMap.get(s.id) || s.current_price} />
                                    ))}
                                </Box>
                            </Box>
                        </Box>
                    </Stack>
                </Stack>
            </Stack>
        </ClipThing>
    )
}
