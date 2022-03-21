import { Box, Button, Divider, Link, Modal, Stack, Typography } from "@mui/material"
import { colors } from "../../theme/theme"
import { useEffect } from "react"
import { useToggle } from "../../hooks/useToggle"
import WarningAmberIcon from "@mui/icons-material/WarningAmber"
import { TOKEN_SALE_PAGE, PASSPORT_WEB } from "../../constants"
import { useGameServerAuth } from "../../containers"

export const NoSupsModal = ({ haveSups }: { haveSups: boolean }) => {
    const { user } = useGameServerAuth()
    const [open, toggleOpen] = useToggle(false)

    useEffect(() => {
        if (!haveSups) return toggleOpen(true)
        toggleOpen(false)
    }, [haveSups])

    if (!user) return null

    return (
        <Modal open={open} onClose={() => toggleOpen(false)}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    maxWidth: "60rem",
                    px: "3.2rem",
                    py: "2.4rem",
                    backgroundColor: `${colors.darkNavyBlue}`,
                    outline: "1px solid #FFFFFF",
                    borderRadius: 1,
                    boxShadow: 24,
                }}
            >
                <Stack spacing={2}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <WarningAmberIcon color="warning" sx={{ fontSize: "4rem", mr: "1.3rem" }} />
                        <Typography variant="h4" sx={{ fontFamily: "Nostromo Regular Black" }}>
                            NOT ENOUGH $SUPS
                        </Typography>
                    </Box>

                    <Typography sx={{ fontSize: "1.2rem", fontFamily: "Nostromo Regular Bold" }}>
                        In order to experience the Battle Arena to its&apos; maximum potential, including voting on in
                        game abilities, viewing the minimap and individual mech health bars, your wallet must contain
                        $SUPS.
                    </Typography>

                    <Divider />

                    <Typography variant="h5" sx={{ fontFamily: "Nostromo Regular Bold" }}>
                        To Obtain $SUPS:
                    </Typography>

                    <Typography sx={{ fontSize: "1.2rem", fontFamily: "Nostromo Regular Bold" }}>
                        1. Navigate to the{" "}
                        <Link target="_blank" href={TOKEN_SALE_PAGE} color={colors.neonBlue}>
                            token sale here
                        </Link>{" "}
                        or click the &quot;Get SUPS&quot; button in the top right-hand corner of the stream.
                        <br />
                        <br />
                        2. From PancakeSwap, the tokens will reside in your off-world wallet. To use them on-world, and
                        in game, you will have to deposit your $SUPS into your connected account. You can{" "}
                        <Link target="_blank" href={PASSPORT_WEB + "deposit"} color={colors.neonBlue}>
                            deposit your tokens here
                        </Link>
                        .
                        <br />
                        <br />
                        3. Come back and enjoy the Battle Arena to its&apos; fullest.
                    </Typography>
                </Stack>

                <Button
                    variant="outlined"
                    sx={{
                        mt: "2.4rem",
                        py: "1rem",
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
                    onClick={() => toggleOpen(false)}
                >
                    I just want to watch
                </Button>
            </Box>
        </Modal>
    )
}
