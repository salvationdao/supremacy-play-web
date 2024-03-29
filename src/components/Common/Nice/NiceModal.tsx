import { Box, IconButton, Modal, ModalProps, SxProps } from "@mui/material"
import { SvgClose2 } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { colors } from "../../../theme/theme"
import { NiceBoxThing } from "./NiceBoxThing"

export interface NiceModalProps extends ModalProps {
    modalSx?: SxProps
    sx?: SxProps
    onClose?: () => void
    backdropColor?: string
    disableBackdropClose?: boolean
}

export const NiceModal = ({ modalSx, sx, children, onClose, backdropColor, disableBackdropClose, ...props }: NiceModalProps) => {
    const theme = useTheme()

    return (
        <Modal
            {...props}
            onClose={disableBackdropClose ? undefined : onClose}
            closeAfterTransition
            sx={{
                ".MuiBackdrop-root": {
                    backgroundColor: backdropColor || "rgba(0, 0, 0, 0.4)",
                },

                ...modalSx,
            }}
        >
            <NiceBoxThing
                border={{ color: `${colors.darkGrey}90`, thickness: "very-lean" }}
                background={{ colors: [theme.factionTheme.u800] }}
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    maxWidth: "50rem",
                    minWidth: "28rem",
                    minHeight: "15rem",
                    boxShadow: 6,
                    outline: "none",
                    ...sx,
                }}
            >
                {children}

                <IconButton
                    size="small"
                    disabled={!onClose}
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        top: ".4rem",
                        right: ".5rem",

                        opacity: 0.1,
                        ":hover": { opacity: 0.6 },
                        ":active": { opacity: 1 },
                    }}
                >
                    <SvgClose2 size="2.6rem" />
                </IconButton>

                {/* Background color */}
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: "#00000008",
                        zIndex: -1,
                    }}
                />
            </NiceBoxThing>
        </Modal>
    )
}
