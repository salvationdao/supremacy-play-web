import { Box, Stack, Typography } from "@mui/material"
import React from "react"
import { useAuth } from "../../../../containers"
import { colors, fonts } from "../../../../theme/theme"
import { FactionLobbySlots, NUMBER_MECHS_REQUIRED } from "../LobbyItem"

export const OtherFactionMechs = React.memo(function OtherFactionMechs({ factionLobbySlots }: { factionLobbySlots: FactionLobbySlots[] }) {
    return (
        <Stack direction="row" spacing="1.2rem">
            {factionLobbySlots.map((fls) => (
                <SingleColumn key={`fls-${fls.faction.id}`} factionLobbySlots={fls} />
            ))}
        </Stack>
    )
})

const SIZE = "3.8rem"

const SingleColumn = ({ factionLobbySlots }: { factionLobbySlots: FactionLobbySlots }) => {
    const { userID } = useAuth()

    return (
        <Stack alignItems="center" justifyContent="center" spacing="1.2rem" sx={{ width: SIZE }}>
            <Box
                sx={{
                    width: "100%",
                    height: SIZE,
                    background: `url(${factionLobbySlots.faction.logo_url})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "contain",
                }}
            />

            {/* Mech cards */}
            {factionLobbySlots.mechSlots.map((mech) => {
                return (
                    <Box
                        key={`mech-${mech.id}`}
                        sx={{
                            border: `${mech?.queued_by?.id === userID ? colors.gold : factionLobbySlots.faction.primary_color} 1px solid`,
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
            {NUMBER_MECHS_REQUIRED - factionLobbySlots.mechSlots.length > 0 &&
                new Array(NUMBER_MECHS_REQUIRED - factionLobbySlots.mechSlots.length).fill(0).map((_, index) => (
                    <Stack
                        key={`empty-slot-${index}`}
                        alignItems="center"
                        justifyContent="center"
                        sx={{
                            border: `${factionLobbySlots.faction.primary_color} 1px solid`,
                            width: "100%",
                            height: SIZE,
                            opacity: 0.6,
                        }}
                    >
                        <Typography fontFamily={fonts.nostromoBold} color={factionLobbySlots.faction.primary_color}>
                            ?
                        </Typography>
                    </Stack>
                ))}
        </Stack>
    )
}
