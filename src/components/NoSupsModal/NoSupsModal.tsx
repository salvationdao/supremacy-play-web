import { Box, Divider, Modal, Stack, Typography } from "@mui/material"
import { Link } from "react-router-dom"
import { colors, fonts } from "../../theme/theme"
import WarningAmberIcon from "@mui/icons-material/WarningAmber"
import { TOKEN_SALE_PAGE, PASSPORT_WEB } from "../../constants"
import { useAuth } from "../../containers"
import { ClipThing, FancyButton } from ".."

export const NoSupsModal = ({ onClose }: { onClose: () => void }) => {
    const { userID } = useAuth()

    if (!userID) return null

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
                                • Navigate to the{" "}
                                <Link target="_blank" to={TOKEN_SALE_PAGE}>
                                    token sale here
                                </Link>{" "}
                                or click the &quot;Get SUPS&quot; button in the top right-hand corner of the stream.
                                <br />
                                <br />• From PancakeSwap, the tokens will reside in your off-world wallet. To use them on-world, and in game, you will have to
                                deposit your $SUPS into your connected account. You can{" "}
                                <Link target="_blank" to={PASSPORT_WEB + "deposit"}>
                                    deposit your tokens here
                                </Link>
                                .
                            </Typography>
                        </Stack>

                        <FancyButton
                            clipThingsProps={{
                                clipSize: "9px",
                                backgroundColor: colors.darkNavy,
                                opacity: 1,
                                border: { isFancy: true, borderColor: colors.neonBlue, borderThickness: "2px" },
                                sx: { position: "relative", mt: "2.3rem", width: "100%" },
                            }}
                            sx={{ px: "1.6rem", py: ".6rem", color: colors.neonBlue }}
                            onClick={onClose}
                        >
                            <Typography
                                variant="caption"
                                sx={{
                                    color: colors.neonBlue,
                                    fontFamily: fonts.nostromoBlack,
                                }}
                            >
                                I JUST WANT TO WATCH
                            </Typography>
                        </FancyButton>
                    </Box>
                </ClipThing>
            </Box>
        </Modal>
    )
}
