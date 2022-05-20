import { Box, IconButton, Modal, Stack } from "@mui/material"
import { ReactNode } from "react"
import { ClipThing } from "../../.."
import { SvgClose } from "../../../../assets"
import { useTheme } from "../../../../containers/theme"
import { siteZIndex } from "../../../../theme/theme"
import { MechDetails } from "../../../../types"

export const MechModal = ({ mechDetails, onClose, children }: { mechDetails: MechDetails; onClose: () => void; children: ReactNode }) => {
    const theme = useTheme()

    const skin = mechDetails ? mechDetails.chassis_skin || mechDetails.default_chassis_skin : undefined
    const imageUrl = skin?.image_url || mechDetails.image_url

    return (
        <Modal open onClose={onClose} sx={{ zIndex: siteZIndex.Modal }}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "43rem",
                    boxShadow: 6,
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
                        spacing="1.6rem"
                        sx={{
                            position: "relative",
                            px: "2.5rem",
                            py: "2.4rem",
                        }}
                    >
                        <Box
                            sx={{
                                position: "relative",
                                px: ".6rem",
                                py: "1rem",
                                borderRadius: 0.6,
                                boxShadow: "inset 0 0 12px 6px #00000040",
                                background: `radial-gradient(#FFFFFF20 1px, ${theme.factionTheme.background})`,
                            }}
                        >
                            <Box
                                sx={{
                                    width: "100%",
                                    height: "21rem",
                                    backgroundImage: `url(${imageUrl})`,
                                    backgroundRepeat: "no-repeat",
                                    backgroundPosition: "top center",
                                    backgroundSize: "contain",
                                }}
                            />
                        </Box>

                        {children}
                    </Stack>

                    <IconButton size="small" onClick={onClose} sx={{ position: "absolute", top: ".5rem", right: ".5rem" }}>
                        <SvgClose size="1.9rem" sx={{ opacity: 0.1, ":hover": { opacity: 0.6 } }} />
                    </IconButton>
                </ClipThing>
            </Box>
        </Modal>
    )
}
