import { Box, Button, Modal, Stack, Typography } from "@mui/material"
import { Alert } from "@mui/lab"
import { colors } from "../../theme/theme"
import { useToggle } from "../../hooks"
import { ClipThing } from ".."

export const EarlyAccessWarning = () => {
    const [closed, toggleClosed] = useToggle()

    if (closed) return null

    return (
        <Modal open={!closed}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "42rem",
                    boxShadow: 6,
                }}
            >
                <ClipThing
                    clipSize="0"
                    border={{
                        isFancy: true,
                        borderColor: "#FFFFFF",
                        borderThickness: ".3rem",
                    }}
                    innerSx={{ position: "relative" }}
                >
                    <Box
                        sx={{
                            px: "3.2rem",
                            py: "2.4rem",
                            backgroundColor: `${colors.darkNavyBlue}`,
                        }}
                    >
                        <Stack spacing="1.6rem">
                            <Alert
                                severity="warning"
                                sx={{
                                    alignItems: "center",
                                    ".MuiAlert-message": {
                                        pt: "1.12rem",
                                        fontSize: "1.3rem",
                                        fontWeight: "fontWeightBold",
                                        fontFamily: "Nostromo Regular Bold",
                                    },
                                }}
                            >
                                The game is in early access and the $SUPS you use are real!
                            </Alert>

                            <Typography sx={{ fontFamily: "Nostromo Regular Bold" }} variant="body1">
                                EARLY ACCESS!
                            </Typography>

                            <Typography sx={{ fontFamily: "Nostromo Regular Bold" }} variant="caption">
                                Thank you for participating in the Supremacy Battle Stream Early Access
                                <br />
                                <br />
                                By choosing to try out this game and continue from here, you expressly acknowledge and
                                accept that you assume all risks associated with the gameplay and/or participating in
                                the Battle Events. This includes contributing to battle abilities, queueing your mech
                                for battle, and other $SUPS related tasks.
                            </Typography>
                        </Stack>

                        <Button
                            variant="outlined"
                            sx={{
                                mt: "2.4rem",
                                py: ".64rem",
                                width: "100%",
                                color: colors.neonBlue,
                                backgroundColor: colors.darkNavy,
                                borderRadius: 0.7,
                                fontFamily: "Nostromo Regular Bold",
                                border: `${colors.neonBlue} 1px solid`,
                                ":hover": {
                                    opacity: 0.8,
                                    border: `${colors.neonBlue} 1px solid`,
                                },
                            }}
                            onClick={() => {
                                toggleClosed(true)
                                Notification.requestPermission()
                            }}
                        >
                            I AGREE, LET ME IN!
                        </Button>
                    </Box>
                </ClipThing>
            </Box>
        </Modal>
    )
}
