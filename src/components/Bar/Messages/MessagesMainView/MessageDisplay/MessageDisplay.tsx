/* eslint-disable no-case-declarations */
import { Box, Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { colors } from "../../../../../theme/theme"
import { SystemMessageDataMechBattleBegin, SystemMessageDataMechBattleComplete, SystemMessageDataType, SystemMessageMechStruct } from "../../../../../types"
import { BattleLobby } from "../../../../../types/battle_queue"
import { NiceButton } from "../../../../Common/Nice/NiceButton"
import MessageRenderer from "../../MessageRenderer"
import { SystemMessageDisplayable } from "../../Messages"
import { BattleLobbyInvitation } from "./BattleLobbyInvitation"
import { ExpiredBattleLobby } from "./ExpiredBattleLobby"
import { MechBattleBeginDetails } from "./MechBattleBeginDetails"
import { MechBattleCompleteDetails } from "./MechBattleCompleteDetails"
import { PlayerAbilityRefundedData, PlayerAbilityRefundedMessage } from "./PlayerAbilityRefundedMessage"

export interface MessageDisplayProps {
    message: SystemMessageDisplayable
    onClose: () => void
}

export const MessageDisplay = ({ message, onClose }: MessageDisplayProps) => {
    const details = useMemo(() => {
        switch (message.data_type) {
            case SystemMessageDataType.MechBattleComplete:
                return <MechBattleCompleteDetails message={message.message} data={message.data as SystemMessageDataMechBattleComplete} />
            case SystemMessageDataType.MechBattleBegin:
                return <MechBattleBeginDetails message={message.message} data={message.data as SystemMessageDataMechBattleBegin} />
            case SystemMessageDataType.PlayerAbilityRefunded:
                return <PlayerAbilityRefundedMessage message={message.message} data={message.data as PlayerAbilityRefundedData[]} />
            case SystemMessageDataType.ExpiredBattleLobby:
                return <ExpiredBattleLobby message={message.message} data={message.data as SystemMessageMechStruct[]} />
            case SystemMessageDataType.BattleLobbyInvitation:
                return <BattleLobbyInvitation message={message.message} data={message.data as BattleLobby} />
        }

        return <MessageRenderer markdown={message.message} />
    }, [message])

    return (
        <Stack sx={{ height: "100%", p: "1.4rem" }}>
            <Stack direction="row" alignItems="center">
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                    {message.title}
                </Typography>
                <Typography sx={{ ml: "auto", color: colors.grey }}>
                    {message.sent_at.toLocaleTimeString()}, {message.sent_at.toDateString()}
                </Typography>
            </Stack>

            <Typography>
                <strong>FROM:</strong> {message.sender.username}
            </Typography>

            <Box
                sx={{
                    flex: 1,
                    overflowY: "auto",
                    overflowX: "hidden",
                    mt: ".5rem",
                    mb: ".8rem",
                    p: "1rem 1.4rem",
                    backgroundColor: "#FFFFFF15",
                    direction: "ltr",
                }}
            >
                <Box sx={{ direction: "ltr", height: 0 }}>
                    <Box>{details}</Box>
                </Box>
            </Box>

            <Stack direction="row" alignItems="center">
                <NiceButton buttonColor={colors.grey} onClick={onClose}>
                    CLOSE
                </NiceButton>
            </Stack>
        </Stack>
    )
}
