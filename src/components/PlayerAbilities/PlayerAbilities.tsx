import ApiIcon from "@mui/icons-material/Api"
import { Box, Drawer, Stack, Typography } from "@mui/material"
import React, { useEffect, useState } from "react"
import { DRAWER_TRANSITION_DURATION, GAME_BAR_HEIGHT, RIGHT_DRAWER_WIDTH } from "../../constants"
import { SocketState, useGameServerAuth, useGameServerWebsocket } from "../../containers"
import { useDrawer } from "../../containers/drawer"
import { GameServerKeys } from "../../keys"
import { colors } from "../../theme/theme"
import { DrawerButtons } from "../SideBars/DrawerButtons"
import { SaleAbilityCard } from "./SaleAbilityCard"

const DrawerContent = () => {
    const { user } = useGameServerAuth()
    const { state, send } = useGameServerWebsocket()
    const [saleAbilityIDs, setSaleAbilityIDs] = useState<string[]>([])

    useEffect(() => {
        if (state !== SocketState.OPEN || !state || !user) return
        ;(async () => {
            const resp = await send<{ totaL: number; ability_ids: string[] }>(GameServerKeys.SaleAbilitiesList, {})
            setSaleAbilityIDs(resp.ability_ids)
        })()
    }, [state, send, user])

    return (
        <Stack sx={{ flex: 1 }}>
            <Stack
                direction="row"
                spacing=".96rem"
                alignItems="center"
                sx={{
                    position: "relative",
                    pl: "2rem",
                    pr: "4.8rem",
                    height: `${GAME_BAR_HEIGHT}rem`,
                    background: `${colors.assetsBanner}65`,
                    boxShadow: 1.5,
                }}
            >
                <ApiIcon
                    sx={{
                        color: colors.text,
                        fontSize: "2.3rem",
                        pb: ".56rem",
                    }}
                />
                <Typography variant="caption" sx={{ fontFamily: "Nostromo Regular Black" }}>
                    PLAYER ABILITIES
                </Typography>
            </Stack>

            <Box
                sx={{
                    my: ".8rem",
                    ml: ".3rem",
                    pl: ".5rem",
                    mr: ".3rem",
                    pr: ".5rem",
                }}
            >
                <Stack direction="row" alignItems="center" spacing=".5rem">
                    <Box
                        sx={{
                            flex: 1,
                            minHeight: "1px",
                            backgroundColor: colors.lightGrey,
                        }}
                    />
                    <Typography variant="body1">Owned Abilities</Typography>
                    <Box
                        sx={{
                            flex: 1,
                            minHeight: "1px",
                            backgroundColor: colors.lightGrey,
                        }}
                    />
                </Stack>
                <Stack direction="row" alignItems="center" spacing=".5rem">
                    <Box
                        sx={{
                            flex: 1,
                            minHeight: "1px",
                            backgroundColor: colors.lightGrey,
                        }}
                    />
                    <Typography variant="body1">Abilities On Sale</Typography>
                    <Box
                        sx={{
                            flex: 1,
                            minHeight: "1px",
                            backgroundColor: colors.lightGrey,
                        }}
                    />
                </Stack>
                <Box>
                    {saleAbilityIDs.map((s, index) => (
                        <SaleAbilityCard key={index} abilityID={s} />
                    ))}
                </Box>
            </Box>
        </Stack>
    )
}

export const PlayerAbilities = () => {
    const { isPlayerAbilitiesOpen } = useDrawer()

    return (
        <Drawer
            transitionDuration={DRAWER_TRANSITION_DURATION}
            open={isPlayerAbilitiesOpen}
            variant="persistent"
            anchor="right"
            sx={{
                width: `${RIGHT_DRAWER_WIDTH}rem`,
                flexShrink: 0,
                zIndex: 9999,
                "& .MuiDrawer-paper": {
                    width: `${RIGHT_DRAWER_WIDTH}rem`,
                    backgroundColor: colors.darkNavy,
                },
            }}
        >
            <Stack
                direction="row"
                sx={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: colors.darkNavy,
                }}
            >
                <DrawerButtons isFixed={false} />
                {isPlayerAbilitiesOpen && <DrawerContent />}
            </Stack>
        </Drawer>
    )
}
