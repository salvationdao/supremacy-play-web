import { Box, Button, Divider, Modal, Stack, Typography } from "@mui/material"
import { useTour } from "@reactour/tour"
import { useToggle } from "../../../hooks"
import { colors, fonts } from "../../../theme/theme"
import { ClipThing } from "../../Common/ClipThing"

export const TutorialModal = () => {
    const [visited, setVisited] = useToggle(localStorage.getItem("visited") === "true")
    const { setIsOpen } = useTour()

    if (visited) return null

    return (
        <Modal open onClose={() => setVisited(true)}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    maxWidth: "50rem",
                    boxShadow: 6,
                    outline: "none",
                }}
            >
                <ClipThing
                    clipSize="8px"
                    border={{
                        borderColor: "#FFFFFF",
                        borderThickness: ".3rem",
                    }}
                    backgroundColor={colors.darkNavyBlue}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            px: "3.2rem",
                            py: "2.4rem",
                            width: "100%",
                        }}
                    >
                        <Typography variant="h5" sx={{ fontFamily: fonts.nostromoBlack, textAlign: "center", mb: ".5rem" }}>
                            WELCOME NEW CITIZEN
                        </Typography>

                        <Divider sx={{ width: "100%", mt: "1rem", mb: "2rem" }} />

                        <Typography sx={{ fontFamily: fonts.nostromoBold, width: "100%" }}>
                            You are now in the Battle Arena where Syndicates will fight for glory. The Arena can be overwhelming if you don&apos;t know your way
                            around, the tutorial can help you get your bearings.
                        </Typography>

                        <Stack direction="row" spacing="1.5rem" sx={{ width: "100%", mt: "2rem" }}>
                            <Button
                                variant="contained"
                                onClick={() => {
                                    setVisited(true)
                                    setIsOpen(true)
                                }}
                                sx={{
                                    pt: ".7rem",
                                    pb: ".4rem",
                                    backgroundColor: colors.neonBlue,
                                    color: colors.darkNavy,
                                    borderRadius: 0.7,
                                    ":hover": {
                                        backgroundColor: colors.neonBlue,
                                    },
                                }}
                            >
                                <Typography sx={{ color: colors.darkNavy, fontFamily: fonts.nostromoBlack }}>Tutorial</Typography>
                            </Button>

                            <Button
                                variant="outlined"
                                onClick={() => {
                                    setVisited(true)
                                    localStorage.setItem("visited", "true")
                                }}
                                sx={{
                                    alignSelf: "flex-end",
                                    pt: ".7rem",
                                    pb: ".4rem",
                                    color: colors.neonBlue,
                                    backgroundColor: colors.darkNavy,
                                    borderRadius: 0.7,
                                    border: `${colors.neonBlue} 1px solid`,
                                    ":hover": {
                                        backgroundColor: colors.darkNavy,
                                        border: `${colors.neonBlue} 1px solid`,
                                    },
                                }}
                            >
                                <Typography sx={{ color: colors.neonBlue, fontFamily: fonts.nostromoBold }}>Skip</Typography>
                            </Button>
                        </Stack>
                    </Box>
                </ClipThing>
            </Box>
        </Modal>
    )
}
