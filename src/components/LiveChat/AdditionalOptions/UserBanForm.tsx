import { Box, IconButton, Modal, Stack } from "@mui/material"
import { ClipThing } from "../.."
import { SvgClose } from "../../../assets"
import { colors } from "../../../theme/theme"
import { UserData } from "../../../types/passport"

export const UserBanForm = ({ user, open, onClose }: { user?: UserData; open: boolean; onClose: () => void }) => {
    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "46rem",
                }}
            >
                <ClipThing
                    clipSize="10px"
                    border={{
                        isFancy: true,
                        borderColor: (user && user.faction.theme.primary) || colors.neonBlue,
                        borderThickness: ".3rem",
                    }}
                >
                    <Stack
                        direction="row"
                        spacing="1.6rem"
                        sx={{
                            position: "relative",
                            pl: "1.76rem",
                            pr: "2.56rem",
                            py: "2.4rem",

                            backgroundColor: (user && user.faction.theme.background) || colors.darkNavyBlue,
                        }}
                    >
                        <IconButton
                            size="small"
                            onClick={onClose}
                            sx={{ position: "absolute", top: ".2rem", right: ".2rem" }}
                        >
                            <SvgClose size="1.6rem" sx={{ opacity: 0.1, ":hover": { opacity: 0.6 } }} />
                        </IconButton>
                    </Stack>
                </ClipThing>
            </Box>
        </Modal>
    )
}
