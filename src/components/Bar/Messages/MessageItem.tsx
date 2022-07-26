/* eslint-disable no-case-declarations */
import { Box, Collapse, Stack, Typography } from "@mui/material"
import { useMemo, useState } from "react"
import { colors } from "../../../theme/theme"
import { SystemMessageDataMechBattleComplete, SystemMessageType } from "../../../types"
import { FancyButton } from "../../Common/FancyButton"
import { MechBattleCompleteDetails } from "./MessageItem/MechBattleCompleteDetails"
import { SystemMessageDisplayable } from "./Messages"

export interface MessageItemProps {
    message: SystemMessageDisplayable
    onDismiss: () => void
}

export const MessageItem = ({ message, onDismiss }: MessageItemProps) => {
    const [isCollapsed, setIsCollapsed] = useState(true)

    const details = useMemo(() => {
        switch (message.type) {
            case SystemMessageType.MechBattleComplete:
                if (!message.data) break
                const data = message.data as SystemMessageDataMechBattleComplete

                return <MechBattleCompleteDetails message={message.message} data={data} />
        }

        return <Typography variant="h6">{message.message}</Typography>
    }, [message])

    return (
        <Box>
            <Stack direction="row" alignItems="center" spacing=".5rem">
                <Stack direction="row" alignItems="center" spacing="1rem" sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ color: colors.grey }}>
                        {message.sent_at.getHours()}:{message.sent_at.getMinutes()}
                    </Typography>

                    <message.icon size="1.8rem" />

                    <Typography
                        variant="h6"
                        sx={{
                            display: "-webkit-box",
                            overflow: "hidden",
                            overflowWrap: "anywhere",
                            textOverflow: "ellipsis",
                            WebkitLineClamp: 1, // change to max number of lines
                            WebkitBoxOrient: "vertical",
                        }}
                    >
                        {message.message}
                    </Typography>
                </Stack>

                <FancyButton
                    clipThingsProps={{
                        clipSize: "6px",
                        backgroundColor: isCollapsed ? colors.green : colors.lightGrey,
                        border: { isFancy: true, borderColor: isCollapsed ? colors.green : colors.lightGrey, borderThickness: "1px" },
                        sx: { width: "8rem" },
                    }}
                    onClick={() => setIsCollapsed((prev) => !prev)}
                    sx={{ py: ".1rem", color: "#FFFFFF" }}
                >
                    <Typography variant="body2" sx={{ fontWeight: "fontWeightBold" }}>
                        {isCollapsed ? "View" : "Hide"}
                    </Typography>
                </FancyButton>

                <FancyButton
                    clipThingsProps={{
                        clipSize: "6px",
                        backgroundColor: colors.red,
                        border: { isFancy: true, borderColor: colors.red, borderThickness: "1px" },
                        sx: { width: "8rem" },
                    }}
                    onClick={onDismiss}
                    sx={{ py: ".1rem", color: "#FFFFFF" }}
                >
                    <Typography variant="body2" sx={{ fontWeight: "fontWeightBold" }}>
                        Dismiss
                    </Typography>
                </FancyButton>
            </Stack>

            <Collapse in={!isCollapsed}>
                <Box sx={{ my: "1rem", p: ".6rem 1.2rem", backgroundColor: "#FFFFFF10" }}>{details}</Box>
            </Collapse>
        </Box>
    )
}
