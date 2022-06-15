import { Box, CircularProgress, Divider, Stack, Typography } from "@mui/material"
import { BarExpandable, EnlistButton } from "../.."
import { RedMountainLogo } from "../../../assets"
import { useSupremacy } from "../../../containers"
import { colors, fonts } from "../../../theme/theme"

export const EnlistButtonGroup = () => {
    const { factionsAll } = useSupremacy()

    if (!factionsAll) {
        return (
            <Stack alignItems="center" sx={{ position: "relative", width: "13rem" }}>
                <CircularProgress size="1.8rem" sx={{ color: colors.neonBlue }} />
            </Stack>
        )
    }

    return (
        <BarExpandable
            noDivider
            barName={"enlist"}
            iconComponent={
                <Box
                    sx={{
                        width: "2.8rem",
                        height: "2.8rem",
                        backgroundImage: `url(${RedMountainLogo})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundSize: "contain",
                        backgroundColor: "#C52A1F",
                        borderRadius: 1,
                        border: `${"#C52A1F"} 2px solid`,
                    }}
                />
            }
        >
            <Stack id="tutorial-enlist" direction="row" alignItems="center" sx={{ mx: "1.2rem", height: "100%" }}>
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing="1.6rem"
                    sx={{
                        position: "relative",
                        height: "100%",
                        overflowX: "auto",
                        overflowY: "hidden",

                        "::-webkit-scrollbar": {
                            height: ".3rem",
                        },
                        "::-webkit-scrollbar-track": {
                            background: "#FFFFFF15",
                            borderRadius: 3,
                        },
                        "::-webkit-scrollbar-thumb": {
                            background: "#FFFFFF50",
                            borderRadius: 3,
                        },
                    }}
                >
                    <Typography sx={{ fontFamily: fonts.nostromoBold }}>Enlist:</Typography>

                    {Object.values(factionsAll).map((f) => (
                        <EnlistButton key={f.id} faction={f} />
                    ))}
                </Stack>

                <Divider
                    orientation="vertical"
                    flexItem
                    sx={{
                        height: "2.3rem",
                        my: "auto !important",
                        ml: "2.4rem",
                        borderColor: "#494949",
                        borderRightWidth: 1.6,
                    }}
                />
            </Stack>
        </BarExpandable>
    )
}
