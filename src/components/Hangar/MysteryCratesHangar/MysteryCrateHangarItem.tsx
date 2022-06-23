import { Box, Stack, Typography } from "@mui/material"
import { useLocation } from "react-router-dom"
import { SafePNG } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { useTimer } from "../../../hooks"
import { MARKETPLACE_TABS } from "../../../pages"
import { colors, fonts } from "../../../theme/theme"
import { MysteryCrate } from "../../../types"
import { ItemType } from "../../../types/marketplace"
import { ClipThing } from "../../Common/ClipThing"
import { FancyButton } from "../../Common/FancyButton"
import { MediaPreview } from "../../Common/MediaPreview/MediaPreview"
import { useGameServerCommandsFaction } from "../../../hooks/useGameServer"
import { useCallback } from "react"
import { GameServerKeys } from "../../../keys"

interface MysteryCrateStoreItemProps {
    crate: MysteryCrate
}

export const MysteryCrateHangarItem = ({ crate }: MysteryCrateStoreItemProps) => {
    const location = useLocation()
    const theme = useTheme()
    const { send } = useGameServerCommandsFaction("/faction_commander")

    const primaryColor = theme.factionTheme.primary
    const secondaryColor = theme.factionTheme.secondary
    const backgroundColor = theme.factionTheme.background

    const openCrate = useCallback(async () => {
        try {
            //change these types obviously
            const resp = await send<any, any>(GameServerKeys.OpenCrate, {
                id: crate.id,
            })

            if (!resp) return
            console.log(resp)
        } catch (e) {
            const message = typeof e === "string" ? e : "Failed to get mystery crates."
            console.log(message)
            console.error(e)
        }
    }, [send, crate.id])

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
                                height: "20rem",
                            }}
                        >
                            <MediaPreview imageUrl={crate.image_url || SafePNG} videoUrls={[crate.animation_url, crate.card_animation_url]} />

                            {new Date() < crate.locked_until && (
                                <Stack
                                    alignItems="center"
                                    sx={{
                                        position: "absolute",
                                        bottom: "-.2rem",
                                        width: "100%",
                                        px: ".8rem",
                                        py: ".5rem",
                                        backgroundColor: "#00000010",
                                    }}
                                >
                                    <Countdown dateTo={crate.locked_until} />
                                </Stack>
                            )}
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
                                    onClick={() => {
                                        openCrate()
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
                                    to={
                                        crate.locked_to_marketplace
                                            ? !crate.item_sale_id
                                                ? undefined
                                                : `/marketplace/${MARKETPLACE_TABS.MysteryCrates}/${crate.item_sale_id}${location.hash}`
                                            : `/marketplace/sell?itemType=${ItemType.MysteryCrate}&assetID=${crate.id}${location.hash}`
                                    }
                                    clipThingsProps={{
                                        clipSize: "5px",
                                        backgroundColor: crate.locked_to_marketplace ? backgroundColor : colors.red,
                                        opacity: 1,
                                        border: { isFancy: !crate.locked_to_marketplace, borderColor: colors.red, borderThickness: "1.5px" },
                                        sx: { position: "relative", mt: "1rem", width: "100%" },
                                    }}
                                    sx={{ px: "1.6rem", py: ".6rem", color: crate.locked_to_marketplace ? colors.red : "#FFFFFF" }}
                                >
                                    <Typography
                                        variant={"caption"}
                                        sx={{ fontFamily: fonts.nostromoBlack, color: crate.locked_to_marketplace ? colors.red : "#FFFFFF" }}
                                    >
                                        {crate.locked_to_marketplace ? "VIEW LISTING" : "SELL ITEM"}
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
