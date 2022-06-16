import { Box, IconButton, Modal, Stack } from "@mui/material"
import { ClipThing } from ".."
import { SvgClose } from "../../assets"
import { useTheme } from "../../containers/theme"
import { siteZIndex } from "../../theme/theme"

export const MechDeployListModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
    const theme = useTheme()

    return (
        <Modal open={open} onClose={onClose} sx={{ zIndex: siteZIndex.Modal, ".MuiBackdrop-root": { backgroundColor: "#00000020" } }}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "43rem",
                    boxShadow: 6,
                    outline: "none",
                }}
            >
                <ClipThing
                    clipSize="8px"
                    border={{
                        borderColor: theme.factionTheme.primary,
                        borderThickness: ".3rem",
                    }}
                    corners={{
                        topLeft: true,
                        topRight: true,
                        bottomLeft: true,
                        bottomRight: true,
                    }}
                    sx={{ position: "relative" }}
                    backgroundColor={theme.factionTheme.background}
                >
                    <Stack
                        spacing="1.6rem"
                        sx={{
                            position: "relative",
                            px: "2.5rem",
                            py: "2.4rem",
                            maxHeight: "calc(100vh - 15rem)",
                            overflow: "hidden",
                        }}
                    >
                        aaa
                    </Stack>

                    <IconButton size="small" onClick={onClose} sx={{ position: "absolute", top: ".5rem", right: ".5rem" }}>
                        <SvgClose size="1.9rem" sx={{ opacity: 0.1, ":hover": { opacity: 0.6 } }} />
                    </IconButton>
                </ClipThing>
            </Box>
        </Modal>
    )
}
