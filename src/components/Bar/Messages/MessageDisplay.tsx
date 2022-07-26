/* eslint-disable no-case-declarations */
import { Box, Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { useTheme } from "../../../containers/theme"
import { fonts } from "../../../theme/theme"
import { SystemMessageDataMechBattleComplete, SystemMessageDataType } from "../../../types"
import { MechBattleCompleteDetails } from "./MechBattleCompleteDetails"
import { SystemMessageDisplayable } from "./Messages"

export interface MessageDisplayProps {
    message: SystemMessageDisplayable
}

export const MessageDisplay = ({ message }: MessageDisplayProps) => {
    const theme = useTheme()

    const details = useMemo(() => {
        switch (message.data_type) {
            case SystemMessageDataType.MechBattleComplete:
                if (!message.data) break
                const data = message.data as SystemMessageDataMechBattleComplete

                return <MechBattleCompleteDetails message={message.message} data={data} />
        }

        return <Typography variant="h6">{message.message}</Typography>
    }, [message])

    return (
        <Stack height="100%">
            <Typography
                variant="h4"
                sx={{
                    fontFamily: fonts.shareTechMono,
                    fontWeight: "fontWeightBold",
                }}
            >
                {message.title}
            </Typography>
            <Box
                sx={{
                    overflowY: "auto",
                    overflowX: "hidden",
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
                        background: theme.factionTheme.primary,
                        borderRadius: 3,
                    },
                }}
            >
                {details}
            </Box>
        </Stack>
    )
}
