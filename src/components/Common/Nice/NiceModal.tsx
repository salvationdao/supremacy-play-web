import { Box, IconButton, Modal, ModalProps, SxProps } from "@mui/material"
import { SvgClose2 } from "../../../assets"
import { colors } from "../../../theme/theme"
import { NiceBoxThing } from "./NiceBoxThing"

export interface NiceModalProps extends ModalProps {
    modalSx?: SxProps
    sx?: SxProps
    onClose?: () => void
}

export const NiceModal = ({ modalSx, sx, children, onClose, ...props }: NiceModalProps) => {
    return (
        <Modal {...props} onClose={onClose} sx={modalSx}>
            <NiceBoxThing
                border={{ color: colors.darkGrey, thickness: "very-lean" }}
                background={{ colors: [colors.darkerNavy] }}
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
                        backgroundColor: "#FFFFFF08",
                        zIndex: -1,
                    }}
                />
            </NiceBoxThing>
        </Modal>
    )
}
