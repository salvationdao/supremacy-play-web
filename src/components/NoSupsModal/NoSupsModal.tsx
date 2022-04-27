import { Box, Button, Divider, Link, Modal, Stack, Typography } from "@mui/material"
import { colors, fonts } from "../../theme/theme"
import { useToggle } from "../../hooks/useToggle"
import WarningAmberIcon from "@mui/icons-material/WarningAmber"
import { TOKEN_SALE_PAGE, PASSPORT_WEB } from "../../constants"
import { usePassportServerAuth } from "../../containers"
import { ClipThing } from ".."

export const NoSupsModal = () => {
    const { user } = usePassportServerAuth()
    const [open, toggleOpen] = useToggle(true)

    if (!user || !open) return null

    return (
        <Modal open>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    maxWidth: "50rem",
                    boxShadow: 6,
                }}
            >
                <ClipThing
                    clipSize="0"
                    border={{
                        isFancy: true,
                        borderColor: "#FFFFFF",
                        borderThickness: ".15rem",
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
                        <Stack spacing={2}>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <WarningAmberIcon color="warning" sx={{ fontSize: "3rem", mr: "1.3rem" }} />
                                <Typography variant="h5" sx={{ fontFamily: fonts.nostromoBlack }}>
                                    NOT ENOUGH $SUPS
                                </Typography>
                            </Box>

                            <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBold }}>
                                In order to experience the Battle Arena to its&apos; maximum potential, including voting on in game abilities, viewing the
                                minimap and individual mech health bars, your wallet must contain $SUPS.
                            </Typography>

                            <Divider />

                            <Typography variant="h6" sx={{ fontFamily: fonts.nostromoBold }}>
                                To Obtain $SUPS:
                            </Typography>

                            <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBold }}>
                                1. Navigate to the{" "}
                                <Link target="_blank" href={TOKEN_SALE_PAGE} color={colors.neonBlue}>
                                    token sale here
                                </Link>{" "}
                                or click the &quot;Get SUPS&quot; button in the top right-hand corner of the stream.
                                <br />
                                <br />
                                2. From PancakeSwap, the tokens will reside in your off-world wallet. To use them on-world, and in game, you will have to
                                deposit your $SUPS into your connected account. You can{" "}
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
                                mt: "2.3rem",
                                py: ".8rem",
                                width: "100%",
                                color: colors.neonBlue,
                                backgroundColor: colors.darkNavy,
                                borderRadius: 0.7,
                                fontFamily: fonts.nostromoBold,
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
                </ClipThing>
            </Box>
        </Modal>
    )
}
