import { Box, Grow, Modal, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { zoomEffect } from "../..//theme/keyframes"
import { BattleRewardsBannerPNG, CoinsLeftPNG, CoinsRightPNG, LightningBackgroundPNG, SkyHighGroupedTextPNG } from "../../assets"
import { colors, fonts } from "../../theme/theme"
import { FancyButton } from "../Common/FancyButton"

export const BattleArenaBanner = () => {
    return (
        <>
            <Stack
                alignItems="center"
                sx={{
                    position: "relative",
                    height: "6rem",
                    width: "100%",
                    zIndex: 9,
                }}
            >
                {/* Text */}
                <Box
                    sx={{
                        position: "absolute",
                        top: ".2rem",
                        bottom: ".2rem",
                        left: "2rem",
                        right: "2rem",
                        zIndex: 6,
                        animation: `${zoomEffect(1.03)} 18s infinite`,
                        background: `url(${SkyHighGroupedTextPNG})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundSize: "contain",
                    }}
                />

                {/* Coin left decorations */}
                <Box
                    sx={{
                        position: "absolute",
                        left: "1rem",
                        top: 0,
                        bottom: 0,
                        width: "20rem",
                        zIndex: -1,
                        background: `url(${CoinsLeftPNG})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                    }}
                />

                {/* Coin right decorations */}
                <Box
                    sx={{
                        position: "absolute",
                        right: "1rem",
                        top: 0,
                        bottom: 0,
                        width: "20rem",
                        zIndex: -1,
                        background: `url(${CoinsRightPNG})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                    }}
                />

                {/* Background */}
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: -2,
                        background: `url(${LightningBackgroundPNG})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                    }}
                />
            </Stack>

            <BattleArenaBannerModal />
        </>
    )
}

const BattleArenaBannerModal = () => {
    const [dismissedSkyHighModal, setDismissedSkyHighModal] = useState(localStorage.getItem("dismissedSkyHighModal") === "true")

    useEffect(() => {
        localStorage.setItem("dismissedSkyHighModal", dismissedSkyHighModal.toString())
    }, [dismissedSkyHighModal])

    if (dismissedSkyHighModal) return null

    return (
        <Modal open={!dismissedSkyHighModal}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    height: "50rem",
                    width: "75rem",
                    maxHeight: "90vh",
                    maxWidth: "90vw",
                    boxShadow: 6,
                    outline: "none",
                }}
            >
                <Grow in>
                    <Stack
                        alignItems="center"
                        sx={{
                            position: "relative",
                            width: "100%",
                            height: "100%",
                        }}
                    >
                        <Box
                            sx={{
                                position: "absolute",
                                top: 0,
                                bottom: 0,
                                left: 0,
                                right: 0,
                                background: `url(${BattleRewardsBannerPNG})`,
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "center",
                                backgroundSize: "contain",
                            }}
                        />

                        <FancyButton
                            clipThingsProps={{
                                clipSize: "9px",
                                backgroundColor: colors.yellow,
                                opacity: 1,
                                border: { borderColor: colors.yellow, borderThickness: "2.5px" },
                                sx: {
                                    position: "absolute",
                                    bottom: "7.8rem",
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                },
                            }}
                            sx={{ px: "2rem", py: ".6rem", color: "#000000" }}
                            onClick={() => setDismissedSkyHighModal(true)}
                        >
                            <Typography sx={{ fontFamily: fonts.nostromoHeavy, color: "#000000" }}>PLAY NOW</Typography>
                        </FancyButton>
                    </Stack>
                </Grow>
            </Box>
        </Modal>
    )
}
