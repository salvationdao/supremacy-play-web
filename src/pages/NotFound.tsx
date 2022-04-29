import { Box, Stack, Typography } from "@mui/material"
import React from "react"
import { useHistory } from "react-router-dom"
import { Gabs } from "../assets"
import { FancyButton } from "../components"
import { colors, siteZIndex } from "../theme/theme"

export const NotFoundPage = () => {
    const history = useHistory()
    return (
        <Stack
            spacing="8rem"
            direction="row"
            alignItems="center"
            justifyContent="center"
            sx={{
                position: "fixed",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                px: "5em",
                background: colors.darkNavyBlue,
                zIndex: siteZIndex.RoutePage,
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
                    clipThingsProps={{
                        clipSize: "8px",
                        backgroundColor: colors.darkerNeonBlue,
                        border: {
                            borderColor: colors.neonBlue,
                        },
                    }}
                    sx={{
                        fontSize: "3rem",
                        px: "2em",
                        "@media (max-width:600px)": {
                            fontSize: "5vw",
                        },
                    }}
                    onClick={() => history.push("/")}
                >
                    Go to the Battle Arena
                </FancyButton>
            </Stack>

            <Box
                sx={{
                    backgroundImage: `url(${Gabs})`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    boxShadow: `inset 0px 0px 20px 50px rgba(0,0,0,0.6)`,
                    width: "650px",
                    height: "650px",
                    "@media (max-width:1440px)": {
                        width: "450px",
                        height: "450px",
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
        </Stack>
    )
}
