import { Box, Modal, Stack, Typography } from "@mui/material"
import { Alert } from "@mui/lab"
import { colors, fonts } from "../../theme/theme"
import { useToggle } from "../../hooks"
import { ClipThing, FancyButton } from ".."
import { STAGING_OR_DEV_ONLY } from "../../constants"

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
                    width: "45rem",
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
                    sx={{ position: "relative" }}
                    backgroundColor={colors.darkNavyBlue}
                >
                    <Box
                        sx={{
                            px: "3.2rem",
                            py: "2.4rem",
                        }}
                    >
                        {STAGING_OR_DEV_ONLY ? <StagingMessage /> : <ProdMessage />}

                        <FancyButton
                            clipThingsProps={{
                                clipSize: "9px",
                                backgroundColor: colors.darkNavy,
                                opacity: 1,
                                border: { borderColor: colors.neonBlue, borderThickness: "2px" },
                                sx: { position: "relative", mt: "2.4rem" },
                            }}
                            sx={{ px: "1.6rem", py: ".7rem", color: colors.neonBlue }}
                            onClick={() => {
                                toggleClosed(true)
                                onAcknowledged()
                                Notification.requestPermission()
                            }}
                        >
                            <Typography variant="body2" sx={{ color: colors.neonBlue, fontFamily: fonts.nostromoBlack }}>
                                I AGREE, LET ME IN!
                            </Typography>
                        </FancyButton>
                    </Box>
                </ClipThing>
            </Box>
        </Modal>
    )
}

const StagingMessage = () => {
    return (
        <Stack spacing="1.6rem">
            <Typography variant="h5" sx={{ fontFamily: fonts.nostromoHeavy, color: colors.neonBlue }}>
                EXPERIMENTAL BATTLE TRAINING GROUNDS
            </Typography>

            <Typography variant="h6">Thank you for participating in the Supremacy Battle Arena Early Access.</Typography>

            <Typography variant="h6">
                This is a <strong>TESTING ENVIRONMENT</strong> and the $SUPS that you spend here <strong>WILL NOT</strong> affect your real accounts.
            </Typography>
        </Stack>
    )
}

const ProdMessage = () => {
    return (
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

            <Typography variant="h5" sx={{ fontFamily: fonts.nostromoHeavy, color: colors.neonBlue }}>
                EARLY ACCESS!
            </Typography>

            <Typography variant="h6">Thank you for participating in the Supremacy Battle Arena Early Access.</Typography>

            <Typography variant="h6">
                By choosing to try out this game and continue from here, you expressly acknowledge and accept that you assume all risks associated with the
                gameplay and/or participating in the Battle Events. This includes contributing to battle abilities, queueing your mech for battle, and other
                $SUPS related tasks.
            </Typography>
        </Stack>
    )
}
