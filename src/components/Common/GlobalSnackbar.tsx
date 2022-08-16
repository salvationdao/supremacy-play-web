import { Box, IconButton, Snackbar, SnackbarCloseReason, Stack, Typography } from "@mui/material"
import { ReactNode, SyntheticEvent, useCallback, useMemo } from "react"
import { ClipThing } from ".."
import { SvgClose2, SvgInfoCircular, SvgSuccess, SvgWarnTriangle } from "../../assets"
import { useGlobalNotifications } from "../../containers"
import { colors } from "../../theme/theme"

export const GlobalSnackbar = () => {
    const { open, setOpen, messageInfo, setMessageInfo } = useGlobalNotifications()

    const handleClose = useCallback(
        (_event: Event | SyntheticEvent<unknown, Event>, reason?: SnackbarCloseReason) => {
            if (reason === "clickaway") return
            setOpen(false)
        },
        [setOpen],
    )

    const handleExited = useCallback(() => {
        setMessageInfo(undefined)
    }, [setMessageInfo])

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
                <ClipThing
                    clipSize="9px"
                    border={{
                        borderThickness: ".25rem",
                        borderColor: "#FFFFFF",
                    }}
                    corners={{
                        topRight: true,
                        bottomLeft: true,
                    }}
                    sx={{
                        mb: "-1rem",
                        ml: "1.5rem",
                    }}
                    backgroundColor={severityDeets.color}
                    opacity={0.99}
                >
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing=".9rem"
                        sx={{
                            px: "1.4rem",
                            pt: ".6rem",
                            pb: ".5rem",
                            pr: ".9rem",
                            borderRadius: 0.4,
                            boxShadow: 23,
                        }}
                    >
                        {severityDeets.icon}

                        <Typography variant="h6" sx={{ lineHeight: 1, fontWeight: "fontWeightBold" }}>
                            {messageInfo ? messageInfo.message : undefined}
                        </Typography>

                        <IconButton size="small" onClick={handleClose}>
                            <SvgClose2 size="1.4rem" sx={{ opacity: 0.8, ":hover": { opacity: 1 } }} />
                        </IconButton>
                    </Stack>
                </ClipThing>
            </Box>
        </Snackbar>
    )
}
