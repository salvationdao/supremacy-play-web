import { Stack, Typography } from "@mui/material"
import React, { useMemo } from "react"
import { SvgUserDiamond2 } from "../../../assets"
import { FactionIDs } from "../../../constants"
import { useAuth } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { colors, fonts } from "../../../theme/theme"
import { BattleLobby, BattleLobbySupporter } from "../../../types/battle_queue"
import { NiceButton } from "../../Common/Nice/NiceButton"

const NUMBER_SUPPORTERS_REQUIRED = 5
const SIZE = "2rem"

export const Supporters = React.memo(function Supporters({ battleLobby }: { battleLobby: BattleLobby }) {
    const { factionID } = useAuth()
    const theme = useTheme()

    const { supporters, isAlreadySet } = useMemo(() => {
        let supporters: BattleLobbySupporter[] = []
        let isAlreadySet = false // This means battle already started, supporters are set and fixed

        if (factionID === FactionIDs.BC) {
            isAlreadySet = battleLobby.selected_bc_supporters.length > 0
            supporters = isAlreadySet ? battleLobby.selected_bc_supporters : battleLobby.opted_in_bc_supporters
        } else if (factionID === FactionIDs.RM) {
            isAlreadySet = battleLobby.selected_rm_supporters.length > 0
            supporters = isAlreadySet ? battleLobby.selected_rm_supporters : battleLobby.opted_in_rm_supporters
        } else if (factionID === FactionIDs.ZHI) {
            isAlreadySet = battleLobby.selected_zai_supporters.length > 0
            supporters = isAlreadySet ? battleLobby.selected_zai_supporters : battleLobby.opted_in_zai_supporters
        }

        return {
            supporters,
            isAlreadySet,
        }
    }, [
        battleLobby.opted_in_bc_supporters,
        battleLobby.opted_in_rm_supporters,
        battleLobby.opted_in_zai_supporters,
        battleLobby.selected_bc_supporters,
        battleLobby.selected_rm_supporters,
        battleLobby.selected_zai_supporters,
        factionID,
    ])

    return (
        <Stack direction="row" alignItems="center" spacing=".9rem" sx={{ height: "3rem", backgroundColor: "#00000036", px: "1.5rem" }}>
            <Typography fontWeight="bold">SUPPORTERS:</Typography>

            {supporters.map((mech, i) => {
                return (
                    <NiceButton
                        key={`mech-${mech.id}-${i}`}
                        sx={{
                            position: "relative",
                            width: `calc(${SIZE} - 1px)`,
                            height: `calc(${SIZE} - 1px)`,
                            p: 0,
                        }}
                        disableAutoColor
                    >
                        <SvgUserDiamond2 fill={theme.factionTheme.primary} size={`calc(${SIZE} - .6rem)`} />

                        {/* Minus overlay */}
                        <Stack
                            alignItems="center"
                            justifyContent="center"
                            sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                zIndex: 3,
                                backgroundColor: "#00000088",
                                opacity: 0,
                                ":hover": { opacity: 1 },
                            }}
                        >
                            <Typography fontFamily={fonts.nostromoBold} variant="h4" color={colors.gold}>
                                -
                            </Typography>
                        </Stack>
                    </NiceButton>
                )
            })}

            {/* Empty slots */}
            {NUMBER_SUPPORTERS_REQUIRED - supporters.length > 0 &&
                !isAlreadySet &&
                new Array(NUMBER_SUPPORTERS_REQUIRED - supporters.length).fill(0).map((_, index) => {
                    return (
                        <NiceButton
                            key={`empty-slot-${index}`}
                            buttonColor={theme.factionTheme.primary}
                            sx={{
                                width: `calc(${SIZE} - 1px)`,
                                height: `calc(${SIZE} - 1px)`,
                                p: 0,
                            }}
                        >
                            <Typography lineHeight={1} fontFamily={fonts.nostromoBold}>
                                +
                            </Typography>
                        </NiceButton>
                    )
                })}
        </Stack>
    )
})
