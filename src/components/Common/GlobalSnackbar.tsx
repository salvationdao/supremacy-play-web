import { ReactNode, SyntheticEvent, useCallback, useMemo } from "react"
import { Box, IconButton, Snackbar, SnackbarCloseReason, Stack, Typography } from "@mui/material"
import { useSnackbar } from "../../containers"
import { colors } from "../../theme/theme"
import { SvgClose2, SvgInfoCircular, SvgSuccess, SvgWarnTriangle } from "../../assets"

export const GlobalSnackbar = () => {
    const { open, setOpen, messageInfo, setMessageInfo } = useSnackbar()

    const handleClose = useCallback((_event: Event | SyntheticEvent<unknown, Event>, reason?: SnackbarCloseReason) => {
        if (reason === "clickaway") return
        setOpen(false)
    }, [])

    const handleExited = useCallback(() => {
        setMessageInfo(undefined)
    }, [])

    const severityDeets: { color: string; icon: ReactNode } = useMemo(() => {
        let color = colors.blue
        let icon = <SvgInfoCircular size="1.4rem" />

        switch (messageInfo?.severity) {
            case "error":
                color = colors.red
                break
            case "success":
                color = colors.green
                icon = <SvgSuccess size="1.4rem" />
                break
            case "warning":
                color = colors.orange
                icon = <SvgWarnTriangle size="1.4rem" />
                break
            case "info":
            default:
                break
        }

        return { color, icon }
    }, [messageInfo])

    return (
        <Snackbar
            key={messageInfo ? `global-snackbar-${messageInfo.key}` : undefined}
            open={open}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            autoHideDuration={4000}
            onClose={handleClose}
            TransitionProps={{ onExited: handleExited }}
        >
            <Box>
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing=".9rem"
                    sx={{
                        mb: "1.8rem",
                        ml: ".9rem",
                        px: "1.4rem",
                        py: "1.1rem",
                        pr: ".9rem",
                        backgroundColor: severityDeets.color,
                        borderRadius: 0.8,
                        boxShadow: 23,
                    }}
                >
                    {severityDeets.icon}

                    <Typography sx={{ lineHeight: 1 }}>{messageInfo ? messageInfo.message : undefined}</Typography>

                    <IconButton size="small" onClick={handleClose}>
                        <SvgClose2 size="1.4rem" sx={{ opacity: 0.8, ":hover": { opacity: 1 } }} />
                    </IconButton>
                </Stack>
            </Box>
        </Snackbar>
    )
}