import { Box, Stack, Typography } from "@mui/material"
import { useState } from "react"
import { ClipThing, FancyButton } from "../.."
import { HangarBg } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { colors, fonts, siteZIndex } from "../../../theme/theme"
import { RestartServerModal } from "./RestartServerModal"

export const DangerZone = () => {
    const theme = useTheme()

    const [modalOpen, setModalOpen] = useState<boolean>(false)

    return (
        <Box
            alignItems="center"
            sx={{
                height: "100%",
                p: "1rem",
                zIndex: siteZIndex.RoutePage,
                backgroundImage: `url(${HangarBg})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
            }}
        >
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
                backgroundColor={theme.factionTheme.u800}
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
        </Box>
    )
}
