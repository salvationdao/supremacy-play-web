import { Box, Stack, Typography } from "@mui/material"
import { fonts } from "../../../theme/theme"
import { Keycard } from "../../../types"
import { ClipThing } from "../../Common/ClipThing"
import { useTheme } from "../../../containers/theme"

interface MysteryCrateStoreItemProps {
    keycard: Keycard
}

export const KeycardItem = ({ keycard }: MysteryCrateStoreItemProps) => {
    const theme = useTheme()

    const primaryColor = theme.factionTheme.primary
    const backgroundColor = theme.factionTheme.background

    return (
        <Box
            sx={{
                width: "100%",
            }}
        >
            <ClipThing
                clipSize="12px"
                border={{
                    borderColor: primaryColor,
                    borderThickness: ".2rem",
                }}
                opacity={0.9}
                backgroundColor={backgroundColor}
                sx={{ height: "100%" }}
            >
                <Stack spacing={"1.5rem"} justifyContent="center" sx={{ height: "100%", p: "1.5rem" }}>
                    <Box
                        sx={{
                            position: "relative",
                            px: ".8rem",
                            py: "2rem",
                            borderRadius: 1,
                            height: "25rem",
                            boxShadow: "inset 0 0 12px 6px #00000040",
                            background: `radial-gradient(#FFFFFF20 10px, ${backgroundColor})`,
                            border: "#00000060 1px solid",
                        }}
                    >
                        <Box
                            component="video"
                            sx={{
                                height: "100%",
                                width: "100%",
                                overflow: "hidden",
                                objectFit: "contain",
                                objectPosition: "center",
                                borderRadius: 1,
                            }}
                            loop
                            muted
                            autoPlay
                            poster={`${keycard.blueprints.image_url}`}
                        >
                            {keycard.blueprints.animation_url && <source src={keycard.blueprints.animation_url} type="video/mp4" />}
                        </Box>
                    </Box>

                    <Stack spacing={".4rem"} alignItems={"flex-start"} sx={{ flex: 1, px: ".4rem", py: ".3rem" }}>
                        <Typography variant={"h6"} sx={{ color: primaryColor, fontFamily: fonts.nostromoBlack, textAlign: "start" }}>
                            {keycard.blueprints.label}
                        </Typography>
                        <Typography variant={"h6"} sx={{ color: primaryColor, textAlign: "start" }}>
                            {keycard.blueprints.description}
                        </Typography>
                    </Stack>
                </Stack>
            </ClipThing>
        </Box>
    )
}
