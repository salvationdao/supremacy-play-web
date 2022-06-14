import { Box, Stack, Typography } from "@mui/material"
import { useHistory } from "react-router-dom"
import { SafePNG } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { useTimer } from "../../../hooks"
import { colors, fonts } from "../../../theme/theme"
import { MysteryCrate } from "../../../types"
import { ItemType } from "../../../types/marketplace"
import { ClipThing } from "../../Common/ClipThing"
import { FancyButton } from "../../Common/FancyButton"

interface MysteryCrateStoreItemProps {
    crate: MysteryCrate
}

export const MysteryCrateHangarItem = ({ crate }: MysteryCrateStoreItemProps) => {
    const history = useHistory()
    const theme = useTheme()

    const primaryColor = theme.factionTheme.primary
    const secondaryColor = theme.factionTheme.secondary
    const backgroundColor = theme.factionTheme.background

    return (
        <>
            <Box
                sx={{
                    height: "100%",
                    width: "100%",
                    transition: "all .15s",
                    ":hover": {
                        transform: "translateY(-.4rem)",
                    },
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
                                height: "20rem",
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
                                }}
                                loop
                                muted
                                autoPlay
                                poster={`${crate.image_url || SafePNG}`}
                            >
                                <source src={crate.animation_url} type="video/mp4" />
                            </Box>

                            <Stack
                                alignItems="center"
                                sx={{ position: "absolute", bottom: "-.2rem", width: "100%", px: ".8rem", py: ".5rem", backgroundColor: "#00000010" }}
                            >
                                <Countdown dateTo={crate.locked_until} />
                            </Stack>
                        </Box>

                        <Stack sx={{ flex: 1, px: ".4rem", py: ".3rem" }}>
                            <Typography variant="h6" sx={{ color: primaryColor, fontFamily: fonts.nostromoBlack }}>
                                {crate.label}
                            </Typography>

                            <Typography variant="h6" sx={{ color: primaryColor }}>
                                {crate.description}
                            </Typography>

                            <Stack alignItems="center" sx={{ mt: "auto !important", pt: ".8rem", alignSelf: "stretch" }}>
                                <FancyButton
                                    disabled={new Date() < crate.locked_until}
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
                                    sx={{ px: "1.6rem", py: ".6rem", color: secondaryColor }}
                                >
                                    <Typography variant={"caption"} sx={{ fontFamily: fonts.nostromoBlack, color: secondaryColor }}>
                                        OPEN
                                    </Typography>
                                </FancyButton>

                                <FancyButton
                                    excludeCaret
                                    onClick={() => {
                                        history.push(`/marketplace/sell?item-type=${ItemType.MysteryCrate}&asset-id=${crate.id}`)
                                    }}
                                    clipThingsProps={{
                                        clipSize: "5px",
                                        backgroundColor: colors.red,
                                        opacity: 1,
                                        border: { isFancy: true, borderColor: colors.red, borderThickness: "1.5px" },
                                        sx: { position: "relative", mt: "1rem", width: "100%" },
                                    }}
                                    sx={{ px: "1.6rem", py: ".6rem" }}
                                >
                                    <Typography variant={"caption"} sx={{ fontFamily: fonts.nostromoBlack }}>
                                        SELL ITEM
                                    </Typography>
                                </FancyButton>
                            </Stack>
                        </Stack>
                    </Stack>
                </ClipThing>
            </Box>
        </>
    )
}

const Countdown = ({ dateTo }: { dateTo: Date | undefined }) => {
    const { days, hours, minutes, seconds } = useTimer(dateTo)

    if (seconds === undefined) return null

    return (
        <Stack direction="row">
            <SingleCountDown value={`${days}`} label="Days" />
            <Typography sx={{ mx: ".5rem" }}>: </Typography>
            <SingleCountDown value={`${hours}`} label="Hours" />
            <Typography sx={{ mx: ".5rem" }}>: </Typography>
            <SingleCountDown value={`${minutes}`} label="Minutes" />
            <Typography sx={{ mx: ".5rem" }}>: </Typography>
            <SingleCountDown value={`${seconds}`} label="Seconds" />
        </Stack>
    )
}

const SingleCountDown = ({ value, label }: { value: string; label: string }) => {
    return (
        <Stack alignItems="center">
            <Typography variant="caption" sx={{ color: colors.lightNeonBlue, fontFamily: fonts.nostromoBold }}>
                {value}
            </Typography>
            <Typography variant="caption" sx={{ fontFamily: fonts.nostromoBold }}>
                {label}
            </Typography>
        </Stack>
    )
}
