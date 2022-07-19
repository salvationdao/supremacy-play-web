import { Box, Stack, Typography } from "@mui/material"
import { ClipThing } from "../.."
import { Gabs } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { fonts } from "../../../theme/theme"
import { PageHeader } from "../../Common/PageHeader"
import { PlayerBattlesSpectated } from "./PlayerBattlesSpectated"

export const GlobalStats = () => {
    const theme = useTheme()

    return (
        <ClipThing
            clipSize="10px"
            border={{
                borderColor: theme.factionTheme.primary,
                borderThickness: ".3rem",
            }}
            corners={{
                topRight: true,
                bottomLeft: true,
                bottomRight: true,
            }}
            opacity={0.7}
            backgroundColor={theme.factionTheme.background}
            sx={{ height: "100%" }}
        >
            <Stack sx={{ position: "relative", height: "100%" }}>
                <Stack sx={{ flex: 1 }}>
                    <PageHeader
                        title={
                            <Typography variant="h5" sx={{ fontFamily: fonts.nostromoBlack }}>
                                GLOBAL LEADERBOARD
                            </Typography>
                        }
                        description={
                            <Typography sx={{ fontSize: "1.85rem" }}>
                                GABS monitors all players in Supremacy, explore the ranks and see who is on top.
                            </Typography>
                        }
                        imageUrl={Gabs}
                    ></PageHeader>

                    <Stack sx={{ px: "2rem", py: "1rem", flex: 1 }}>
                        <Box
                            sx={{
                                flex: 1,
                                ml: "1.9rem",
                                mr: ".5rem",
                                pr: "1.4rem",
                                my: "1rem",
                                overflowY: "auto",
                                overflowX: "hidden",
                                direction: "ltr",

                                "::-webkit-scrollbar": {
                                    width: ".4rem",
                                },
                                "::-webkit-scrollbar-track": {
                                    background: "#FFFFFF15",
                                    borderRadius: 3,
                                },
                                "::-webkit-scrollbar-thumb": {
                                    background: theme.factionTheme.primary,
                                    borderRadius: 3,
                                },
                            }}
                        >
                            <Box sx={{ direction: "ltr", height: 0 }}>
                                <PlayerBattlesSpectated />
                            </Box>
                        </Box>
                    </Stack>
                </Stack>
            </Stack>
        </ClipThing>
    )
}
