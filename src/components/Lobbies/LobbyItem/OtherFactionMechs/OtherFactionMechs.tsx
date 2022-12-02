import { Box, Stack, Typography } from "@mui/material"
import React from "react"
import { useAuth } from "../../../../containers"
import { colors, fonts } from "../../../../theme/theme"
import { BattleLobby } from "../../../../types/battle_queue"
import { FactionLobbySlots } from "../LobbyItem"

export const OtherFactionMechs = React.memo(function OtherFactionMechs({
    battleLobby,
    otherFactionLobbySlots,
}: {
    battleLobby: BattleLobby
    otherFactionLobbySlots: FactionLobbySlots[]
}) {
    return (
        <Stack direction="row" spacing="1.5rem">
            {otherFactionLobbySlots.map((fls) => (
                <SingleColumn key={`fls-${fls.faction.id}`} battleLobby={battleLobby} otherFactionLobbySlots={fls} />
            ))}
        </Stack>
    )
})

const SIZE = "4rem"

const SingleColumn = ({ battleLobby, otherFactionLobbySlots }: { battleLobby: BattleLobby; otherFactionLobbySlots: FactionLobbySlots }) => {
    const { userID } = useAuth()

    const maxMechs = battleLobby.max_deploy_per_player

    return (
        <Stack alignItems="center" justifyContent="center" spacing="1.2rem" sx={{ width: SIZE }}>
            <Box
                sx={{
                    width: "100%",
                    height: SIZE,
                    background: `url(${otherFactionLobbySlots.faction.logo_url})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "contain",
                }}
            />

            {/* Mech cards */}
            {otherFactionLobbySlots.mechSlots.map((mech, i) => {
                return (
                    <Box
                        key={`mech-${mech.id}-${i}`}
                        sx={{
                            border:
                                mech?.queued_by?.id === userID ? `${colors.gold} 2px solid` : `${otherFactionLobbySlots.faction.palette.primary}80 1px solid`,
                            width: "100%",
                            height: SIZE,
                            background: `url(${mech.avatar_url})`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            backgroundSize: "contain",
                            opacity: !mech?.is_destroyed ? 1 : 0.6,
                        }}
                    />
                )
            })}

            {/* Empty slots */}
            {maxMechs - otherFactionLobbySlots.mechSlots.length > 0 &&
                new Array(maxMechs - otherFactionLobbySlots.mechSlots.length).fill(0).map((_, index) => (
                    <Stack
                        key={`empty-slot-${index}`}
                        alignItems="center"
                        justifyContent="center"
                        sx={{
                            border: `${otherFactionLobbySlots.faction.palette.primary} 1px solid`,
                            width: "100%",
                            height: SIZE,
                            opacity: 0.6,
                            backgroundColor: otherFactionLobbySlots.faction.palette.s900,
                        }}
                    >
                        <Typography fontFamily={fonts.nostromoBold} color={otherFactionLobbySlots.faction.palette.primary}>
                            ?
                        </Typography>
                    </Stack>
                ))}
        </Stack>
    )
}
