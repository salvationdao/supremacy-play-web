/* eslint-disable no-case-declarations */
import { Box, Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { colors } from "../../../../../theme/theme"
import { SystemMessageDataMechBattleComplete, SystemMessageDataType } from "../../../../../types"
import { FancyButton } from "../../../../Common/FancyButton"
import MessageRenderer from "../../MessageRenderer"
import { SystemMessageDisplayable } from "../../Messages"
import { MechBattleCompleteDetails } from "./MechBattleCompleteDetails"
import { MechOwnerBattleReward, MechOwnerBattleRewardData } from "./MechOwnerBattleReward"

export interface MessageDisplayProps {
    message: SystemMessageDisplayable
    onClose: () => void
}

export const MessageDisplay = ({ message, onClose }: MessageDisplayProps) => {
    const details = useMemo(() => {
        switch (message.data_type) {
            case SystemMessageDataType.MechBattleComplete:
                if (!message.data) break
                const data = message.data as SystemMessageDataMechBattleComplete

                return <MechBattleCompleteDetails message={message.message} data={data} />

            case SystemMessageDataType.MechOwnerBattleReward:
                return <MechOwnerBattleReward message={message.message} data={message.data as MechOwnerBattleRewardData} />
        }

        return <MessageRenderer markdown={message.message} />
    }, [message])

    return (
        <Stack sx={{ flex: 1, p: "1.4rem" }}>
            <Stack direction="row" alignItems="center">
                <Typography variant="h4" sx={{ fontWeight: "fontWeightBold" }}>
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
                    backgroundColor: "#FFFFFF20",
                    direction: "ltr",
                    scrollbarWidth: "none",
                    "::-webkit-scrollbar": {
                        width: ".4rem",
                    },
                    "::-webkit-scrollbar-track": {
                        background: "#FFFFFF15",
                        borderRadius: 3,
                    },
                    "::-webkit-scrollbar-thumb": {
                        background: (theme) => theme.factionTheme.primary,
                        borderRadius: 3,
                    },
                }}
            >
                <Box sx={{ direction: "ltr", height: 0 }}>
                    <Box>{details}</Box>
                </Box>
            </Box>

            <Stack direction="row" alignItems="center">
                <FancyButton
                    clipThingsProps={{
                        clipSize: "9px",
                        clipSlantSize: "0px",
                        backgroundColor: colors.grey,
                        opacity: 1,
                        border: { borderColor: colors.grey, borderThickness: "1px" },
                        sx: { position: "relative" },
                    }}
                    sx={{ px: "1.6rem", py: ".4rem", color: "#FFFFFF" }}
                    onClick={onClose}
                >
                    <Typography variant="body2" sx={{ fontWeight: "fontWeightBold", color: "#FFFFFF" }}>
                        CLOSE
                    </Typography>
                </FancyButton>
            </Stack>
        </Stack>
    )
}
