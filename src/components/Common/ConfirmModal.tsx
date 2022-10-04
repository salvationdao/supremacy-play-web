import { Box, IconButton, Modal, Stack, Typography } from "@mui/material"
import { ReactNode } from "react"
import { ClipThing, FancyButton } from ".."
import { SvgClose } from "../../assets"
import { useTheme } from "../../containers/theme"
import { colors, fonts, siteZIndex } from "../../theme/theme"

interface ConfirmModalProps {
    title: string
    children: ReactNode
    onConfirm: () => void
    onClose: () => void
    isLoading?: boolean
    width?: string
    error?: string
    confirmPrefix?: ReactNode
    confirmSuffix?: ReactNode
    disableConfirm?: boolean
    confirmLabel?: string
    cancelLabel?: string
    confirmButton?: ReactNode
    confirmBackground?: string
    cancelBackground?: string
    confirmColor?: string
    cancelColor?: string
    omitCancel?: boolean
}

export const ConfirmModal = ({
    title,
    children,
    onConfirm,
    onClose,
    width,
    isLoading,
    error,
    confirmPrefix,
    confirmSuffix,
    disableConfirm,
    confirmLabel,
    cancelLabel,
    confirmBackground,
    cancelBackground,
    confirmColor,
    cancelColor,
    omitCancel,
    confirmButton,
}: ConfirmModalProps) => {
    const theme = useTheme()

    return (
        <Modal open onClose={onClose} sx={{ zIndex: siteZIndex.Modal }}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: width || "50rem",
                    boxShadow: 6,
                    outline: "none",
                }}
            >
                <ClipThing
                    clipSize="8px"
                    border={{
                        borderColor: theme.factionTheme.primary,
                        borderThickness: ".2rem",
                    }}
                    sx={{ position: "relative" }}
                    backgroundColor={theme.factionTheme.background}
                >
                    <Stack
                        spacing="1.2rem"
                        sx={{
                            position: "relative",
                            px: "2.5rem",
                            py: "2.4rem",
                            ".MuiTypography-root span": {
                                color: colors.neonBlue,
                                fontWeight: "fontWeightBold",
                            },
                        }}
                    >
                        <Typography variant="h5" sx={{ lineHeight: 1, fontFamily: fonts.nostromoBlack }}>
                            {title}
                        </Typography>

                        {children}

                        {error && (
                            <Typography
                                sx={{
                                    mt: ".3rem",
                                    color: colors.red,
                                }}
                            >
                                {error}
                            </Typography>
                        )}

                        <Stack direction="row" spacing="1rem" sx={{ pt: ".4rem" }}>
                            <FancyButton
                                clipThingsProps={{
                                    clipSize: "5px",
                                    backgroundColor: cancelBackground || colors.red,
                                    border: { borderColor: cancelBackground || colors.red, borderThickness: "2px" },
                                    sx: { flex: 2, position: "relative", visibility: omitCancel ? "hidden" : undefined },
                                }}
                                sx={{ pt: 0, pb: 0, minWidth: "5rem", visibility: omitCancel ? "hidden" : undefined }}
                                onClick={!omitCancel ? onClose : undefined}
                            >
                                <Typography variant="h6" sx={{ color: cancelColor || "#FFFFFF", fontWeight: "fontWeightBold" }}>
                                    {cancelLabel || "CANCEL"}
                                </Typography>
                            </FancyButton>

                            {confirmButton ? (
                                confirmButton
                            ) : (
                                <FancyButton
                                    disabled={disableConfirm}
                                    loading={isLoading}
                                    clipThingsProps={{
                                        clipSize: "5px",
                                        backgroundColor: confirmBackground || colors.green,
                                        border: { borderColor: confirmBackground || colors.green, borderThickness: "2px" },
                                        sx: { flex: 2, position: "relative" },
                                    }}
                                    sx={{ pt: 0, pb: 0, minWidth: "5rem" }}
                                    onClick={onConfirm}
                                >
                                    <Stack direction="row" justifyContent="center">
                                        {confirmPrefix}
                                        <Typography variant="h6" sx={{ color: confirmColor || "#FFFFFF", fontWeight: "fontWeightBold" }}>
                                            {confirmLabel || "CONFIRM"}
                                        </Typography>
                                        {confirmSuffix}
                                    </Stack>
                                </FancyButton>
                            )}
                        </Stack>
                    </Stack>

                    <IconButton size="small" onClick={onClose} sx={{ position: "absolute", top: ".5rem", right: ".5rem" }}>
                        <SvgClose size="2.6rem" sx={{ opacity: 0.1, ":hover": { opacity: 0.6 } }} />
                    </IconButton>
                </ClipThing>
            </Box>
        </Modal>
    )
}
