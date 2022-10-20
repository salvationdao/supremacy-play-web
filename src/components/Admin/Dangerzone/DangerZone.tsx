import { Box, Stack, Typography } from "@mui/material"
import { ClipThing, FancyButton } from "../.."
import { useTheme } from "../../../containers/theme"
import { colors, fonts } from "../../../theme/theme"
import React, { useState } from "react"
import { RestartServerModal } from "./RestartServerModal"

export const DangerZone = () => {
    const theme = useTheme()

    const [modalOpen, setModalOpen] = useState<boolean>(false)

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
            opacity={0.9}
            backgroundColor={theme.factionTheme.background}
            sx={{ height: "100%" }}
        >
            <Stack sx={{ position: "relative", height: "100%" }}>
                <Stack sx={{ flex: 1 }}>
                    <Stack sx={{ px: "1rem", py: "1rem", flex: 1 }}>
                        <Box
                            sx={{
                                flex: 1,
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
                            <Stack justifyContent={"center"} alignItems={"center"} sx={{ width: "100%", height: "100%" }}>
                                <FancyButton
                                    clipThingsProps={{
                                        clipSize: "9px",
                                        backgroundColor: colors.red,
                                        opacity: 1,
                                        border: { borderColor: colors.lightRed, borderThickness: "2px" },
                                        sx: { position: "relative" },
                                    }}
                                    sx={{ px: "1.6rem", py: ".6rem", color: "#FFFFFF" }}
                                    onClick={() => setModalOpen(true)}
                                >
                                    <Typography variant="caption" sx={{ fontFamily: fonts.nostromoBlack }}>
                                        Restart Server
                                    </Typography>
                                </FancyButton>
                            </Stack>
                        </Box>
                    </Stack>
                </Stack>
            </Stack>

            {modalOpen && <RestartServerModal modalOpen={modalOpen} setModalOpen={setModalOpen} />}
        </ClipThing>
    )
}