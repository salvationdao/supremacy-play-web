import { Box, Grow, Modal, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { BattleRewardsBannerPNG } from "../../assets"
import { colors, fonts } from "../../theme/theme"
import { FancyButton } from "../Common/Deprecated/FancyButton"

export const BattleRewardsSkyHighModal = () => {
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
