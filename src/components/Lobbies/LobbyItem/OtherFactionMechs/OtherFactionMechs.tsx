import { Box, Stack, Typography } from "@mui/material"
import React from "react"
import { useAuth } from "../../../../containers"
import { colors, fonts } from "../../../../theme/theme"
import { FactionLobbySlots, NUMBER_MECHS_REQUIRED } from "../LobbyItem"

export const OtherFactionMechs = React.memo(function OtherFactionMechs({ otherFactionLobbySlots }: { otherFactionLobbySlots: FactionLobbySlots[] }) {
    return (
        <Stack direction="row" spacing="1.2rem">
            {otherFactionLobbySlots.map((fls) => (
                <SingleColumn key={`fls-${fls.faction.id}`} otherFactionLobbySlots={fls} />
            ))}
        </Stack>
    )
})

const SIZE = "3.8rem"

const SingleColumn = ({ otherFactionLobbySlots }: { otherFactionLobbySlots: FactionLobbySlots }) => {
    const { userID } = useAuth()

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
            {otherFactionLobbySlots.mechSlots.map((mech) => {
                return (
                    <Box
                        key={`mech-${mech.id}`}
                        sx={{
                            border: `${mech?.queued_by?.id === userID ? colors.gold : otherFactionLobbySlots.faction.primary_color} 1px solid`,
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
            {NUMBER_MECHS_REQUIRED - otherFactionLobbySlots.mechSlots.length > 0 &&
                new Array(NUMBER_MECHS_REQUIRED - otherFactionLobbySlots.mechSlots.length).fill(0).map((_, index) => (
                    <Stack
                        key={`empty-slot-${index}`}
                        alignItems="center"
                        justifyContent="center"
                        sx={{
                            border: `${otherFactionLobbySlots.faction.primary_color} 1px solid`,
                            width: "100%",
                            height: SIZE,
                            opacity: 0.6,
                        }}
                    >
                        <Typography fontFamily={fonts.nostromoBold} color={otherFactionLobbySlots.faction.primary_color}>
                            ?
                        </Typography>
                    </Stack>
                ))}
        </Stack>
    )
}
