import { IconButton, Modal, ModalProps, SxProps } from "@mui/material"
import { SvgClose } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { NiceBoxThing } from "./NiceBoxThing"

export interface NiceModalProps extends ModalProps {
    modalSx?: SxProps
    sx?: SxProps
    onClose: () => void
}

export const NiceModal = ({ modalSx, sx, children, onClose, ...props }: NiceModalProps) => {
    const theme = useTheme()

    return (
        <Modal {...props} onClose={onClose} sx={modalSx}>
            <NiceBoxThing
                border={{ color: theme.factionTheme.primary }}
                background={{ colors: [theme.factionTheme.background] }}
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
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        top: ".5rem",
                        right: ".5rem",

                        opacity: 0.1,
                        ":hover": { opacity: 0.6 },
                        ":active": { opacity: 1 },
                    }}
                >
                    <SvgClose size="2.6rem" sx={{}} />
                </IconButton>
            </NiceBoxThing>
        </Modal>
    )
}
