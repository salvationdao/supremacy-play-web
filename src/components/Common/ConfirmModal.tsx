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
    error?: string
    confirmPrefix?: ReactNode
    confirmSuffix?: ReactNode
}

export const ConfirmModal = ({ title, children, onConfirm, onClose, isLoading, error, confirmPrefix, confirmSuffix }: ConfirmModalProps) => {
    const theme = useTheme()

    return (
        <Modal open onClose={onClose} sx={{ zIndex: siteZIndex.Modal }}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "50rem",
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
                            span: {
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
                                    color: "red",
                                }}
                            >
                                {error}
                            </Typography>
                        )}

                        <Stack direction="row" spacing="1rem" sx={{ pt: ".4rem" }}>
                            <FancyButton
                                excludeCaret
                                clipThingsProps={{
                                    clipSize: "5px",
                                    backgroundColor: colors.red,
                                    border: { borderColor: colors.red, borderThickness: "2px" },
                                    sx: { flex: 2, position: "relative" },
                                }}
                                sx={{ pt: 0, pb: 0, minWidth: "5rem", color: "#FFFFFF" }}
                                onClick={onClose}
                            >
                                <Typography variant="h6" sx={{ fontWeight: "fontWeightBold" }}>
                                    CANCEL
                                </Typography>
                            </FancyButton>

                            <FancyButton
                                loading={isLoading}
                                excludeCaret
                                clipThingsProps={{
                                    clipSize: "5px",
                                    backgroundColor: colors.green,
                                    border: { borderColor: colors.green, borderThickness: "2px" },
                                    sx: { flex: 2, position: "relative" },
                                }}
                                sx={{ pt: 0, pb: 0, minWidth: "5rem", color: "#FFFFFF" }}
                                onClick={onConfirm}
                            >
                                <Stack direction="row" justifyContent="center">
                                    {confirmPrefix}
                                    <Typography variant="h6" sx={{ fontWeight: "fontWeightBold" }}>
                                        CONFIRM
                                    </Typography>
                                    {confirmSuffix}
                                </Stack>
                            </FancyButton>
                        </Stack>
                    </Stack>

                    <IconButton size="small" onClick={onClose} sx={{ position: "absolute", top: ".5rem", right: ".5rem" }}>
                        <SvgClose size="1.9rem" sx={{ opacity: 0.1, ":hover": { opacity: 0.6 } }} />
                    </IconButton>
                </ClipThing>
            </Box>
        </Modal>
    )
}
