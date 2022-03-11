import { Box, Stack, Typography } from "@mui/material"
import React from "react"
import { SupBackground } from "../../assets"
import { colors } from "../../theme/theme"

export const WaitingPage: React.FC = () => {
    return (
        <>
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: `center url(${SupBackground})`,
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    boxShadow: "inset 0 0 1000px #000000",
                    pointerEvents: "none",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Stack
                    sx={{
                        position: "relative",
                        zIndex: 1,
                        alignItems: "center",
                        textAlign: "center",
                        WebkitTextStrokeColor: "black",
                        textShadow: "1px 3px black",
                    }}
                >
                    <Typography
                        variant="h1"
                        sx={{
                            fontSize: "6rem",
                            fontFamily: "Nostromo Regular Heavy",
                            WebkitTextStrokeWidth: "2px",
                            "@media (max-width:1440px)": {
                                fontSize: "5vw",
                            },
                            "@media (max-width:800px)": {
                                fontSize: "6vmin",
                            },
                        }}
                    >
                        Battle Arena
                    </Typography>
                    <Typography
                        sx={{
                            fontFamily: "Nostromo Regular Black",
                            fontSize: "3rem",
                            WebkitTextStrokeWidth: "1px",
                            "& span": { color: colors.yellow, fontFamily: "inherit" },
                            "@media (max-width:1440px)": {
                                fontSize: "4vw",
                            },
                            "@media (max-width:800px)": {
                                fontSize: "5vmin",
                            },
                        }}
                    >
                        Powered by <span>$SUPS</span>
                    </Typography>
                </Stack>
            </Box>
            <Box
                sx={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(5,12,18,0.5)",
                    top: 0,
                    left: 0,
                }}
            />
        </>
    )
}
