import { Box, Divider, Stack, Typography } from "@mui/material"
import { fonts } from "../../../theme/theme"
import { MysteryCrate } from "../../../types"
import { FancyButton } from "../../Common/FancyButton"
import { SafePNG } from "../../../assets"
import { ClipThing } from "../../Common/ClipThing"
import { useTheme } from "../../../containers/theme"
import { GenericCountdown } from "../../Claims/ClaimedRewards"

interface MysteryCrateStoreItemProps {
    crate: MysteryCrate
}

export const MysteryCrateItem = ({ crate }: MysteryCrateStoreItemProps) => {
    const theme = useTheme()

    const primaryColor = theme.factionTheme.primary
    const backgroundColor = theme.factionTheme.background

    return (
        <>
            <Box
                sx={{
                    height: "100%",
                    minHeight: "50rem",
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
                                sx={{
                                    height: "100%",
                                    width: "100%",
                                    background: `url(${crate.image_url || SafePNG})`,
                                    backgroundRepeat: "no-repeat",
                                    backgroundPosition: "center",
                                    backgroundSize: "contain",
                                }}
                            />
                        </Box>

                        <Stack alignItems={"flex-start"} sx={{ flex: 1, px: ".4rem", py: ".3rem" }}>
                            <Typography variant={"h6"} sx={{ color: primaryColor, fontFamily: fonts.nostromoBlack, textAlign: "start" }}>
                                {crate.label}
                            </Typography>
                            <Divider sx={{ width: "100%" }} color={theme.factionTheme.primary} />
                            <Typography variant={"h6"} sx={{ color: primaryColor, textAlign: "start" }}>
                                {crate.description}
                            </Typography>

                            <Stack alignItems="center" sx={{ mt: "auto", pt: ".8rem", alignSelf: "stretch" }}>
                                {new Date() < crate.locked_until ? (
                                    <>
                                        <Typography variant="h6" sx={{ fontFamily: fonts.nostromoBold }}>
                                            open in:
                                        </Typography>
                                        <ClipThing
                                            clipSize="8px"
                                            border={{
                                                isFancy: true,
                                                borderColor: theme.factionTheme.primary,
                                                borderThickness: ".1rem",
                                            }}
                                            corners={{
                                                topLeft: true,
                                                topRight: true,
                                                bottomLeft: true,
                                                bottomRight: true,
                                            }}
                                            opacity={0.7}
                                            backgroundColor={theme.factionTheme.secondary}
                                            sx={{ height: "100%" }}
                                        >
                                            <Stack sx={{ height: "100%", padding: "1rem" }}>
                                                <GenericCountdown dateTo={crate.locked_until} />
                                            </Stack>
                                        </ClipThing>
                                    </>
                                ) : (
                                    <FancyButton
                                        excludeCaret
                                        onClick={() => {
                                            /*TODO: open crate function*/
                                            return
                                        }}
                                        clipThingsProps={{
                                            clipSize: "5px",
                                            backgroundColor: primaryColor,
                                            opacity: 1,
                                            border: { isFancy: true, borderColor: primaryColor, borderThickness: "1.5px" },
                                            sx: { position: "relative", mt: "1rem", width: "100%" },
                                        }}
                                        sx={{ px: "1.6rem", py: ".6rem" }}
                                    >
                                        <Typography variant={"caption"} sx={{ fontFamily: fonts.nostromoBlack, color: theme.factionTheme.secondary }}>
                                            OPEN
                                        </Typography>
                                    </FancyButton>
                                )}
                            </Stack>
                        </Stack>
                    </Stack>
                </ClipThing>
            </Box>
        </>
    )
}
