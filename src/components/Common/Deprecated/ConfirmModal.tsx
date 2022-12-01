import { Stack, SxProps, Typography } from "@mui/material"
import { ReactNode, useMemo } from "react"
import { colors, fonts } from "../../../theme/theme"
import { NiceButton } from "../Nice/NiceButton"
import { NiceModal } from "../Nice/NiceModal"

interface ConfirmModalProps {
    title: string
    children: ReactNode
    onConfirm?: () => void
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
    omitConfirm?: boolean
    omitButtons?: boolean
    open?: boolean
    omitHeader?: boolean
    innerSx?: SxProps
}

export const ConfirmModal = ({
    open,
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
    omitConfirm,
    omitButtons,
    confirmButton,
    omitHeader,
    innerSx,
}: ConfirmModalProps) => {
    const confirmButtonElement = useMemo(() => {
        if (omitConfirm) return null
        if (confirmButton) return confirmButton

        return (
            <NiceButton loading={isLoading} disabled={disableConfirm} buttonColor={confirmColor || confirmBackground || colors.green} onClick={onConfirm}>
                {confirmPrefix}
                {confirmLabel || "CONFIRM"}
                {confirmSuffix}
            </NiceButton>
        )
    }, [omitConfirm, confirmButton, isLoading, disableConfirm, confirmColor, confirmBackground, onConfirm, confirmPrefix, confirmLabel, confirmSuffix])

    return (
        <NiceModal open={open !== undefined ? open : true} onClose={onClose} sx={width ? { width, maxWidth: width } : {}}>
            <Stack
                spacing="1.2rem"
                sx={{
                    position: "relative",
                    px: "2.5rem",
                    py: "2.4rem",
                    ".MuiTypography-root span": {
                        color: colors.neonBlue,
                        fontWeight: "bold",
                    },
                    ...innerSx,
                }}
            >
                {!omitHeader && (
                    <Typography variant="h5" sx={{ fontFamily: fonts.nostromoBlack }}>
                        {title}
                    </Typography>
                )}

                {children}

                {error && <Typography sx={{ mt: ".3rem", color: colors.red }}>{error}</Typography>}

                {!omitButtons && (
                    <Stack direction="row" spacing="1rem" alignItems="center" sx={{ pt: ".4rem" }}>
                        <NiceButton
                            buttonColor={cancelColor || cancelBackground || colors.red}
                            sx={{ visibility: omitCancel ? "hidden" : undefined }}
                            onClick={!omitCancel ? onClose : undefined}
                        >
                            {cancelLabel || "CANCEL"}
                        </NiceButton>

                        {confirmButtonElement}
                    </Stack>
                )}
            </Stack>
        </NiceModal>
    )
}
