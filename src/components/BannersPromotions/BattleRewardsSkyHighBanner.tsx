import { Box, Stack } from "@mui/material"
import { CoinsLeftPNG, CoinsRightPNG, LightningBackgroundPNG, SkyHighGroupedTextPNG } from "../../assets"
import { DEV_ONLY, PROD_ONLY } from "../../constants"
import { zoomEffect } from "../../theme/keyframes"
import { BattleRewardsSkyHighModal } from "./BattleRewardsSkyHighModal"

export const BattleRewardsSkyHighBanner = () => {
    if (!PROD_ONLY && !DEV_ONLY) return null

    return (
        <>
            <Stack
                alignItems="center"
                sx={{
                    position: "relative",
                    height: "6rem",
                    width: "100%",
                    zIndex: 9,
                    flexShrink: 0,
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

            <BattleRewardsSkyHighModal />
        </>
    )
}
