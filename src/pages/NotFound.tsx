import { Box, Stack, Typography } from "@mui/material"
import React from "react"
import { useHistory } from "react-router-dom"
import { Gabs } from "../assets"
import { FancyButton } from "../components"
import { colors } from "../theme/theme"

export const NotFoundPage: React.FC = () => {
    const history = useHistory()
    return (
        <Box
            sx={{
                background: colors.darkNavyBlue,
                width: "100vw",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "8rem",
                px: "5em",
                "@media (max-width:1000px)": {
                    flexDirection: "column-reverse",
                    justifyContent: "flex-end",
                },
                "@media (max-width:600px)": {
                    gap: "6rem",
                },
            }}
        >
            <Stack
                sx={{
                    gap: "2rem",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    zIndex: 1,
                    "@media (max-width:600px)": {
                        justifyContent: "flex-start",
                    },
                }}
            >
                <Typography
                    variant="h1"
                    sx={{
                        fontSize: "18rem",
                        "@media (max-width:1000px)": {
                            fontSize: "12vw",
                        },
                        "@media (max-width:600px)": {
                            fontSize: "15vw",
                        },
                    }}
                >
                    404
                </Typography>
                <Typography
                    sx={{
                        fontSize: "5.8rem",
                        "@media (max-width:1440px)": {
                            fontSize: "3vw",
                        },
                        "@media (max-width:600px)": {
                            fontSize: "5vw",
                        },
                    }}
                >
                    This page does not exist.
                </Typography>
                <FancyButton
                    onClick={() => history.push("/")}
                    sx={{
                        fontSize: "3rem",
                        px: "2em",
                        "&:hover": {
                            background: colors.darkerNeonBlue,
                        },
                        "@media (max-width:600px)": {
                            fontSize: "5vw",
                        },
                    }}
                >
                    Go to the Battle Arena
                </FancyButton>
            </Stack>
            <Box
                sx={{
                    background: `url(${Gabs})`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    boxShadow: `inset 0px 0px 20px 50px rgba(0,0,0,0.6)`,
                    width: "800px",
                    height: "800px",
                    "@media (max-width:1440px)": {
                        width: "600px",
                        height: "600px",
                    },
                    "@media (max-width:1000px)": {
                        mt: "5rem",
                        width: "90vw",
                        height: "30rem",
                    },
                    "@media (max-width:600px)": {
                        height: "30vh",
                        boxShadow: `inset 0px 0px 10px 20px rgba(0,0,0,0.6)`,
                        backgroundPosition: "center 40%",
                    },
                }}
            />
        </Box>
    )
}
