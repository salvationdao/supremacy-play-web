import { Box, Stack, Typography } from "@mui/material"
import { STAGING_ONLY } from "../../constants"
import { useToggle } from "../../hooks"
import { colors, fonts } from "../../theme/theme"
import { NiceButton } from "../Common/Nice/NiceButton"
import { NiceModal } from "../Common/Nice/NiceModal"

export const EarlyAccessWarningModal = ({ onAcknowledged }: { onAcknowledged: () => void }) => {
    const [closed, toggleClosed] = useToggle()

    if (closed) return null

    return (
        <NiceModal open={!closed}>
            <Box sx={{ px: "3.2rem", py: "2.4rem" }}>
                {STAGING_ONLY ? <StagingMessage /> : <ProdMessage />}

                <NiceButton
                    corners
                    buttonColor={colors.green}
                    onClick={() => {
                        toggleClosed(true)
                        onAcknowledged()
                        Notification.requestPermission()
                    }}
                    sx={{ mt: "2.4rem", width: "100%", py: "1.1rem" }}
                >
                    I AGREE, LET ME IN!
                </NiceButton>
            </Box>
        </NiceModal>
    )
}

const StagingMessage = () => {
    return (
        <Stack spacing="1.6rem">
            <Typography variant="h5" sx={{ fontFamily: fonts.nostromoHeavy, color: colors.neonBlue }}>
                EXPERIMENTAL BATTLE TRAINING GROUNDS
            </Typography>

            <Typography variant="h6">Thank you for participating in the Supremacy Battle Arena Proving Grounds.</Typography>

            <Typography variant="h6">
                This is a <strong>TESTING ENVIRONMENT</strong> and the $SUPS that you spend here <strong>WILL NOT</strong> affect your real accounts.
            </Typography>
        </Stack>
    )
}

const ProdMessage = () => {
    return (
        <Stack spacing="1.6rem">
            <Typography variant="h5" sx={{ fontFamily: fonts.nostromoHeavy, color: colors.neonBlue }}>
                EARLY ACCESS!
            </Typography>

            <Typography variant="h6">Thank you for participating in the Supremacy Battle Arena Early Access.</Typography>

            <Typography variant="h6">
                By choosing to try out this game and continue from here, you expressly acknowledge and accept that you assume all risks associated with the
                gameplay and/or participating in the Battle Events. This includes contributing to battle abilities, queueing your mech for battle, and any $SUPS
                related tasks.
            </Typography>
        </Stack>
    )
}
