import { IconButton, Modal, ModalProps, SxProps } from "@mui/material"
import { SvgClose2 } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { colors } from "../../../theme/theme"
import { NiceBoxThing } from "./NiceBoxThing"

export interface NiceModalProps extends ModalProps {
    modalSx?: SxProps
    sx?: SxProps
    onClose?: () => void
}

export const NiceModal = ({ modalSx, sx, children, onClose, ...props }: NiceModalProps) => {
    const theme = useTheme()

    return (
        <Modal {...props} onClose={onClose} sx={modalSx}>
            <NiceBoxThing
                border={{ color: colors.darkGrey, thickness: "very-lean" }}
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
            </NiceBoxThing>
        </Modal>
    )
}
