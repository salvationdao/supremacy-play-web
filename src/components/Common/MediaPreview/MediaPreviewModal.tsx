import { Box, IconButton, Modal } from "@mui/material"
import { SvgClose2 } from "../../../assets"
import { siteZIndex } from "../../../theme/theme"
import { MediaPreview } from "./MediaPreview"

export const MediaPreviewModal = ({ imageUrl, videoUrls, onClose }: { imageUrl?: string; videoUrls?: (string | undefined)[]; onClose: () => void }) => {
    return (
        <Modal open onClose={onClose} sx={{ zIndex: siteZIndex.Modal }}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "80vw",
                    height: "90vh",
                    boxShadow: 6,
                    outline: "none",
                    backgroundColor: "#000000",
                }}
            >
                <Box sx={{ position: "relative", height: "100%" }}>
                    <MediaPreview imageUrl={imageUrl} videoUrls={videoUrls} showBorder />

                    <IconButton
                        size="small"
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
                        <SvgClose2 size="3rem" />
                    </IconButton>
                </Box>
            </Box>
        </Modal>
    )
}
