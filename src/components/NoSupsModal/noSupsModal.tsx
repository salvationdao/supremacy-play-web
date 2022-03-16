import { Alert, Box, Button, Dialog, Divider, Link, Modal, Stack, Typography } from "@mui/material"
import { colors } from "../../theme/theme"
import React, { useEffect } from "react"
import { useToggle } from "../../hooks/useToggle"
import WarningAmberIcon from "@mui/icons-material/WarningAmber"
import { TOKEN_SALE_PAGE, PASSPORT_WEB } from "../../constants"
import { useWallet } from "../../containers/wallet"
import BigNumber from "bignumber.js"

export const NoSupsModal = () => {
    const [open, toggleOpen] = useToggle(false)
    const { onWorldSups } = useWallet()

    useEffect(() => {
        const newBigNum = new BigNumber(0)
        onWorldSups?.isEqualTo(newBigNum) ? toggleOpen(true) : null
    }, [onWorldSups])

    return (
        <Box>
            <Modal open={open} onClose={() => toggleOpen(false)}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        maxWidth: 500,
                        px: 4,
                        py: 3,
                        backgroundColor: `${colors.darkNavyBlue}`,
                        outline: "1px solid #FFFFFF",
                        borderRadius: 1,
                        boxShadow: 24,
                    }}
                >
                    <Stack spacing={2}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <WarningAmberIcon color="warning" sx={{ fontSize: "4rem", marginRight: ".5rem" }} />
                            <Typography
                                sx={{
                                    fontFamily: "Nostromo Regular Bold",
                                    textTransform: "uppercase",
                                    fontSize: "2rem",
                                }}
                                variant="h3"
                            >
                                The connected account does not own $sups
                            </Typography>
                        </Box>

                        <Typography sx={{ fontFamily: "Nostromo Regular Bold", fontSize: "1.25rem" }} variant="caption">
                            In order to experience the Battle Arena to its&apos; maximum potential, including voting on
                            in game abilities, viewing the minimap and individual mech health bars, your wallet must
                            contain $SUPS.
                        </Typography>
                        <Divider />
                        <Typography sx={{ fontFamily: "Nostromo Regular Bold", fontSize: "1.75rem" }} variant="h4">
                            To Obtain $SUPS:
                        </Typography>
                        <Typography sx={{ fontFamily: "Nostromo Regular Bold", fontSize: "1.25rem" }} variant="caption">
                            1. Navigate to the{" "}
                            <Link target="_blank" href={TOKEN_SALE_PAGE} color={colors.neonBlue}>
                                token sale here
                            </Link>{" "}
                            or click the &quot;Get SUPS&quot; button in the top right-hand corner of the stream.
                        </Typography>
                        <Typography sx={{ fontFamily: "Nostromo Regular Bold", fontSize: "1.25rem" }} variant="caption">
                            2. From PancakeSwap, the tokens will reside in your off-world wallet. To use them on-world,
                            and in game, you will have to deposit your $SUPS into your connected account. You can{" "}
                            <Link target="_blank" href={PASSPORT_WEB + "deposit"} color={colors.neonBlue}>
                                deposit your tokens here
                            </Link>
                            .
                        </Typography>
                        <Typography sx={{ fontFamily: "Nostromo Regular Bold", fontSize: "1.25rem" }} variant="caption">
                            3. Come back and enjoy the Battle Arena to its&apos; fullest.
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
                        onClick={() => toggleOpen(false)}
                    >
                        I just want to watch
                    </Button>
                </Box>
            </Modal>
        </Box>
    )
}
