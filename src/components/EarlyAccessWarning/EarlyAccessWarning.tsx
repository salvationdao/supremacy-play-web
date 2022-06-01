import { Box, Modal, Stack, Typography } from "@mui/material"
import { Alert } from "@mui/lab"
import { colors, fonts } from "../../theme/theme"
import { useToggle } from "../../hooks"
import { ClipThing, FancyButton } from ".."

export const EarlyAccessWarning = ({ onAcknowledged }: { onAcknowledged: () => void }) => {
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
                    clipSize="8px"
                    border={{
                        borderColor: "#FFFFFF",
                        borderThickness: ".3rem",
                    }}
                    sx={{ position: "relative" }}
                    backgroundColor={colors.darkNavyBlue}
                >
                    <Box
                        sx={{
                            px: "3.2rem",
                            py: "2.4rem",
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
                                        fontFamily: fonts.nostromoBold,
                                    },
                                }}
                            >
                                The game is in early access and the $SUPS you use are real!
                            </Alert>

                            <Typography sx={{ fontFamily: fonts.nostromoBold }} variant="body1">
                                EARLY ACCESS!
                            </Typography>

                            <Typography sx={{ fontFamily: fonts.nostromoBold }} variant="caption">
                                Thank you for participating in the Supremacy Battle Stream Early Access
                                <br />
                                <br />
                                By choosing to try out this game and continue from here, you expressly acknowledge and accept that you assume all risks
                                associated with the gameplay and/or participating in the Battle Events. This includes contributing to battle abilities, queueing
                                your mech for battle, and other $SUPS related tasks.
                            </Typography>
                        </Stack>

                        <FancyButton
                            excludeCaret
                            clipThingsProps={{
                                clipSize: "9px",
                                backgroundColor: colors.darkNavy,
                                opacity: 1,
                                border: { isFancy: true, borderColor: colors.neonBlue, borderThickness: "2px" },
                                sx: { position: "relative", mt: "2.4rem" },
                            }}
                            sx={{ px: "1.6rem", py: ".6rem", color: colors.neonBlue }}
                            onClick={() => {
                                toggleClosed(true)
                                onAcknowledged()
                                Notification.requestPermission()
                            }}
                        >
                            <Typography
                                variant="caption"
                                sx={{
                                    color: colors.neonBlue,
                                    fontFamily: fonts.nostromoBlack,
                                }}
                            >
                                I AGREE, LET ME IN!
                            </Typography>
                        </FancyButton>
                    </Box>
                </ClipThing>
            </Box>
        </Modal>
    )
}
