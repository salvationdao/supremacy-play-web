import { Box, Divider, Modal, Stack, Typography } from "@mui/material"
import { useTour } from "@reactour/tour"
import { FancyButton } from "../.."
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
                    <Stack
                        alignItems="center"
                        sx={{
                            px: "3.2rem",
                            py: "2.4rem",
                            width: "100%",
                        }}
                    >
                        <Typography variant="h5" sx={{ fontFamily: fonts.nostromoBlack, textAlign: "center", mb: ".5rem" }}>
                            WELCOME NEW CITIZEN
                        </Typography>

                        <Divider sx={{ width: "100%", mt: "1rem", mb: "1.8rem" }} />

                        <Typography variant="h5" sx={{ width: "100%" }}>
                            You are now in the Battle Arena where different Factions fight for glory. The Arena can be overwhelming if you don&apos;t know your
                            way around, the tutorial can help you get your bearings.
                        </Typography>

                        <Stack direction="row" spacing="1.5rem" sx={{ width: "100%", mt: "2.8rem" }}>
                            <FancyButton
                                clipThingsProps={{
                                    clipSize: "9px",
                                    backgroundColor: colors.neonBlue,
                                    opacity: 1,
                                    border: { isFancy: true, borderColor: colors.neonBlue, borderThickness: "2px" },
                                    sx: { position: "relative" },
                                }}
                                sx={{ px: "1.6rem", py: ".6rem", color: colors.darkNavy }}
                                onClick={() => {
                                    setVisited(true)
                                    setIsOpen(true)
                                }}
                            >
                                <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBlack, color: colors.darkNavy }}>
                                    Tutorial
                                </Typography>
                            </FancyButton>

                            <FancyButton
                                clipThingsProps={{
                                    clipSize: "9px",
                                    backgroundColor: colors.darkNavy,
                                    opacity: 1,
                                    border: { borderColor: colors.neonBlue, borderThickness: "2px" },
                                    sx: { position: "relative" },
                                }}
                                sx={{ px: "1.6rem", py: ".6rem", color: colors.neonBlue }}
                                onClick={() => {
                                    setVisited(true)
                                    localStorage.setItem("visited", "true")
                                }}
                            >
                                <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBlack, color: colors.neonBlue }}>
                                    Skip
                                </Typography>
                            </FancyButton>
                        </Stack>
                    </Stack>
                </ClipThing>
            </Box>
        </Modal>
    )
}
