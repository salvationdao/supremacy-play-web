import { Stack, Typography } from "@mui/material"
import React from "react"
import { SvgPlus } from "../../../../assets"
import { fonts } from "../../../../theme/theme"
import { NiceButton } from "../../../Common/Nice/NiceButton"
import { FactionLobbySlots, NUMBER_MECHS_REQUIRED } from "../LobbyItem"
import { MyFactionMechCard } from "./MyFactionMechCard"

export const MyFactionMechs = React.memo(function MyFactionMechs({
    factionLobbySlots,
    isLocked,
    onSlotClick,
}: {
    factionLobbySlots: FactionLobbySlots
    isLocked: boolean
    onSlotClick: () => void
}) {
    return (
        <Stack flex={1}>
            <Stack direction="row" alignItems="stretch" spacing="2rem" sx={{ flex: 1, "& > *": { flex: 1 } }}>
                {/* Empty slots */}
                {NUMBER_MECHS_REQUIRED - factionLobbySlots.mechSlots.length > 0 &&
                    new Array(NUMBER_MECHS_REQUIRED - factionLobbySlots.mechSlots.length).fill(0).map((_, index) => (
                        <Stack key={`empty-slot-${index}`} alignItems="center" justifyContent="center">
                            <NiceButton corners disabled={isLocked} onClick={onSlotClick} sx={{ p: "1.5rem 2rem" }}>
                                <Stack alignItems="center" justifyContent="center" spacing="1.2rem">
                                    <SvgPlus size="2.5rem" />
                                    <Typography fontFamily={fonts.nostromoBold}>DEPLOY MECH</Typography>
                                </Stack>
                            </NiceButton>
                        </Stack>
                    ))}

                {/* Mech cards */}
                {factionLobbySlots.mechSlots.map((mech) => {
                    return <MyFactionMechCard key={`mech-${mech.id}`} mech={mech} />
                })}
            </Stack>
        </Stack>
    )
})
