/* eslint-disable no-case-declarations */
import { Box, Collapse, Fade, Stack, Typography } from "@mui/material"
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
                {message.icon({})}
                <Typography
                    variant="h6"
                    sx={{
                        flexShrink: 1,
                        overflowX: "hidden",
                        minWidth: 0,
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                    }}
                >
                    {message.message}
                </Typography>
                <Box
                    sx={{
                        flex: 1,
                        width: "fit-content",
                    }}
                >
                    <FancyButton
                        clipThingsProps={{
                            backgroundColor: colors.darkGrey,
                        }}
                        size="small"
                        onClick={() => setIsCollapsed((prev) => !prev)}
                    >
                        {isCollapsed ? "View" : "Hide"}
                    </FancyButton>
                </Box>
                <Box
                    sx={{
                        flex: 1,
                        width: "fit-content",
                    }}
                >
                    <FancyButton
                        clipThingsProps={{
                            backgroundColor: colors.lightRed,
                        }}
                        size="small"
                        onClick={() => onDismiss()}
                    >
                        Dismiss
                    </FancyButton>
                </Box>
            </Stack>
            <Collapse in={!isCollapsed}>
                <Fade in={true}>
                    <Box>{details}</Box>
                </Fade>
            </Collapse>
        </Box>
    )
}
