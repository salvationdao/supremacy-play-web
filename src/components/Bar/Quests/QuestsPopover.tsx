import { Box, IconButton, Popover, Stack, Typography } from "@mui/material"
import { MutableRefObject, useEffect } from "react"
import { ClipThing } from "../.."
import { SvgClose } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { useToggle } from "../../../hooks"
import { fonts, siteZIndex } from "../../../theme/theme"
import { QuestStat } from "../../../types"
import { QuestItem } from "./QuestItem"

export const QuestsPopover = ({
    open,
    questStats,
    onClose,
    popoverRef,
}: {
    open: boolean
    questStats: QuestStat[]
    onClose: () => void
    popoverRef: MutableRefObject<null>
}) => {
    const theme = useTheme()
    const [localOpen, toggleLocalOpen] = useToggle(open)

    useEffect(() => {
        if (!localOpen) {
            const timeout = setTimeout(() => {
                onClose()
            }, 300)

            return () => clearTimeout(timeout)
        }
    }, [localOpen, onClose])

    return (
        <Popover
            open={localOpen}
            anchorEl={popoverRef.current}
            onClose={() => toggleLocalOpen(false)}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "center",
            }}
            sx={{
                mt: ".8rem",
                zIndex: siteZIndex.Popover,
                ".MuiPaper-root": {
                    mt: ".8rem",
                    background: "none",
                    boxShadow: 0,
                },
            }}
        >
            <ClipThing
                clipSize="10px"
                border={{
                    borderColor: theme.factionTheme.primary,
                    borderThickness: ".2rem",
                }}
                backgroundColor={theme.factionTheme.background}
                sx={{ height: "100%" }}
            >
                <Box sx={{ position: "relative", width: "38rem", px: "2rem", py: "1.4rem" }}>
                    <Typography gutterBottom sx={{ fontFamily: fonts.nostromoBlack, color: theme.factionTheme.primary }}>
                        YOUR QUESTS
                    </Typography>

                    <Stack spacing=".4rem">
                        {questStats.map((qs) => {
                            return <QuestItem key={`qs-key-${qs.id}`} questStat={qs} />
                        })}
                    </Stack>

                    <IconButton size="small" onClick={() => toggleLocalOpen(false)} sx={{ position: "absolute", top: "-2rem", right: ".2rem" }}>
                        <SvgClose size="1.9rem" sx={{ opacity: 0.1, ":hover": { opacity: 0.6 } }} />
                    </IconButton>
                </Box>
            </ClipThing>
        </Popover>
    )
}
