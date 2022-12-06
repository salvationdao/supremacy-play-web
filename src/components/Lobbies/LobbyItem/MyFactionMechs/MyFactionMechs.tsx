import { Stack, Typography } from "@mui/material"
import React from "react"
import { SvgPlus } from "../../../../assets"
import { fonts } from "../../../../theme/theme"
import { BattleLobby } from "../../../../types/battle_queue"
import { NiceButton } from "../../../Common/Nice/NiceButton"
import { FactionLobbySlots } from "../LobbyItem"
import { MyFactionMechCard } from "./MyFactionMechCard"

export const MyFactionMechs = React.memo(function MyFactionMechs({
    battleLobby,
    myFactionLobbySlots,
    isLocked,
    onSlotClick,
}: {
    battleLobby: BattleLobby
    myFactionLobbySlots: FactionLobbySlots
    isLocked: boolean
    onSlotClick: () => void
}) {
    const maxMechsForFaction = battleLobby.each_faction_mech_amount

    return (
        <Stack flex={1}>
            <Stack direction="row" alignItems="center" justifyContent="flex-start" spacing="2rem" sx={{ pb: "3rem", flex: 1, "& > *": { flex: 1 } }}>
                {/* Mech cards */}
                {myFactionLobbySlots.mechSlots.map((mech, i) => {
                    return <MyFactionMechCard key={`mech-${mech.id}-${i}`} mech={mech} isLocked={isLocked} />
                })}

                {/* Empty slots */}
                {maxMechsForFaction - myFactionLobbySlots.mechSlots.length > 0 &&
                    new Array(maxMechsForFaction - myFactionLobbySlots.mechSlots.length).fill(0).map((_, index) => (
                        <Stack key={`empty-slot-${index}`} alignItems="center" justifyContent="center">
                            <NiceButton corners disabled={isLocked} onClick={onSlotClick} sx={{ p: "1.5rem 2rem" }}>
                                <Stack alignItems="center" justifyContent="center" spacing="1.2rem">
                                    <SvgPlus size="2.5rem" />
                                    <Typography fontFamily={fonts.nostromoBold}>DEPLOY MECH</Typography>
                                </Stack>
                            </NiceButton>
                        </Stack>
                    ))}
            </Stack>
        </Stack>
    )
})
