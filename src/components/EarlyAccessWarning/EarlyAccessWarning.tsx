import { AlertTitle, Box, Button, Modal, Stack, Typography } from "@mui/material"
import { Alert } from "@mui/lab"
import { colors } from "../../theme/theme"
import { useToggle } from "../../hooks"

export const EarlyAccessWarning = () => {
    const [closed, toggleClosed] = useToggle()

    return (
        <Box>
            <Modal open={!closed} onClose={() => toggleClosed(true)}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        maxWidth: 420,
                        px: 4,
                        py: 3,
                        backgroundColor: `${colors.darkNavyBlue}`,
                        outline: "1px solid #FFFFFF",
                        borderRadius: 1,
                        boxShadow: 24,
                    }}
                >
                    <Stack spacing={2}>
                        <Alert severity="warning" sx={{ ".MuiAlert-message": { pt: 1.35 } }}>
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
                            accept that you assume all risks associated with the gameplay and/or participating in the
                            Battle Events. This includes contributing to battle abilities, queueing your mech for
                            battle, and other $SUPS related tasks.
                        </Typography>
                    </Stack>

                    <Button
                        variant="outlined"
                        sx={{
                            mt: 3,
                            py: 0.8,
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
                        onClick={() => toggleClosed(true)}
                    >
                        I AGREE, LET ME IN!
                    </Button>
                </Box>
            </Modal>
        </Box>
    )
}
