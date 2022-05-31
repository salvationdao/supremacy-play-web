import { Box, Skeleton, Stack, Typography } from "@mui/material"
import { useMemo, useState } from "react"
import { ClipThing, FancyButton } from "../../.."
import { SvgSupToken } from "../../../../assets"
import { useTheme } from "../../../../containers/theme"
import { getMysteryCrateDeets, numberCommaFormatter, supFormatterNoFixed } from "../../../../helpers"
import { useGameServerSubscriptionFaction } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { colors, fonts } from "../../../../theme/theme"
import { MysteryCrate } from "../../../../types"

interface MysteryCrateItemProps {
    enlargedView?: boolean
    crate: MysteryCrate
}

export const MysteryCrateItem = ({ enlargedView, crate }: MysteryCrateItemProps) => {
    const theme = useTheme()
    const [mysteryCrate, setMysteryCrate] = useState<MysteryCrate>(crate)

    const crateDeets = useMemo(() => getMysteryCrateDeets(mysteryCrate.mystery_crate_type), [mysteryCrate])

    const primaryColor = theme.factionTheme.primary
    const backgroundColor = theme.factionTheme.background

    useGameServerSubscriptionFaction<MysteryCrate>(
        {
            URI: "/xxxxxxxxx",
            key: GameServerKeys.SubMysteryCrate,
        },
        (payload) => {
            if (!payload) return
            setMysteryCrate(payload)
        },
    )

    const { price, sold, amount } = mysteryCrate

    return (
        <Box
            sx={{
                height: enlargedView ? "88%" : "unset",
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
                <Stack spacing={enlargedView ? "2.5rem" : "1.5rem"} justifyContent="center" sx={{ height: "100%", p: enlargedView ? "3rem" : "1.5rem" }}>
                    <Box
                        sx={{
                            position: "relative",
                            flex: enlargedView ? 1 : "unset",
                            px: enlargedView ? "5rem" : ".8rem",
                            py: enlargedView ? "8rem" : "2rem",
                            borderRadius: 1,
                            boxShadow: "inset 0 0 12px 6px #00000040",
                            background: `radial-gradient(#FFFFFF20 1px, ${backgroundColor})`,
                            border: "#00000060 1px solid",
                        }}
                    >
                        <Box
                            sx={{
                                width: "100%",
                                height: enlargedView ? "100%" : "16rem",
                                background: `url(${crateDeets.image})`,
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "center",
                                backgroundSize: "contain",
                            }}
                        />

                        <Box
                            sx={{
                                position: "absolute",
                                right: enlargedView ? "1.4rem" : ".5rem",
                                bottom: enlargedView ? ".6rem" : ".2rem",
                                px: ".2rem",
                                py: ".5rem",
                                backgroundColor: "#00000095",
                            }}
                        >
                            <Typography
                                sx={{
                                    lineHeight: 1,
                                    fontSize: enlargedView ? "1.6rem" : "1.22rem",
                                    fontFamily: fonts.nostromoBold,
                                    span: {
                                        fontFamily: "inherit",
                                        color: sold >= amount ? colors.red : colors.neonBlue,
                                    },
                                }}
                            >
                                <span>{numberCommaFormatter(amount - sold)}</span> / {numberCommaFormatter(amount)}
                            </Typography>
                        </Box>

                        {enlargedView && (
                            <Stack direction="row" alignItems="center" spacing=".1rem" sx={{ position: "absolute", left: "1.4rem", bottom: ".6rem" }}>
                                <SvgSupToken size={enlargedView ? "2.6rem" : "1.6rem"} fill={colors.yellow} />
                                <Typography sx={{ fontSize: enlargedView ? "2.1rem" : "1.6rem", fontWeight: "fontWeightBold" }}>
                                    {supFormatterNoFixed(price, 2)}
                                </Typography>
                            </Stack>
                        )}
                    </Box>

                    <Stack alignItems={enlargedView ? "center" : "flex-start"} sx={{ flex: enlargedView ? "unset" : 1, px: ".4rem", py: ".3rem" }}>
                        {!enlargedView && (
                            <Stack direction="row" alignItems="center" spacing=".1rem">
                                <SvgSupToken size={enlargedView ? "2.6rem" : "1.6rem"} fill={colors.yellow} />
                                <Typography sx={{ fontSize: enlargedView ? "2.1rem" : "1.6rem", fontWeight: "fontWeightBold" }}>
                                    {supFormatterNoFixed(price, 2)}
                                </Typography>
                            </Stack>
                        )}

                        <Typography
                            variant={enlargedView ? "h4" : "h6"}
                            sx={{ color: primaryColor, fontFamily: fonts.nostromoBlack, textAlign: enlargedView ? "center" : "start" }}
                        >
                            {crateDeets.label}
                        </Typography>

                        <Typography sx={{ fontSize: enlargedView ? "2.1rem" : "1.6rem", textAlign: enlargedView ? "center" : "start" }}>
                            {crateDeets.desc}
                        </Typography>

                        <Stack alignItems="center" sx={{ mt: "auto", pt: ".8rem", alignSelf: "stretch" }}>
                            <FancyButton
                                excludeCaret
                                clipThingsProps={{
                                    clipSize: "5px",
                                    backgroundColor: primaryColor,
                                    opacity: 1,
                                    border: { isFancy: true, borderColor: primaryColor, borderThickness: "1.5px" },
                                    sx: { position: "relative", mt: "1rem", width: enlargedView ? "50%" : "100%" },
                                }}
                                sx={{ px: "1.6rem", py: enlargedView ? "1.1rem" : ".6rem" }}
                            >
                                <Typography variant={enlargedView ? "body1" : "caption"} sx={{ fontFamily: fonts.nostromoBlack }}>
                                    BUY NOW
                                </Typography>
                            </FancyButton>
                        </Stack>
                    </Stack>
                </Stack>
            </ClipThing>
        </Box>
    )
}

export const MysteryCrateItemLoadingSkeleton = () => {
    const theme = useTheme()

    return (
        <Box sx={{ p: "1.2rem", width: "30rem" }}>
            <ClipThing
                clipSize="10px"
                border={{
                    borderColor: theme.factionTheme.primary,
                    borderThickness: ".2rem",
                }}
                opacity={0.5}
                backgroundColor={theme.factionTheme.background}
            >
                <Stack spacing=".7rem" sx={{ px: "1.8rem", py: "1.6rem" }}>
                    <Skeleton variant="rectangular" width="100%" height="12rem" sx={{ mb: ".3rem !important" }} />
                    <Skeleton variant="rectangular" width="80%" height="2.2rem" />
                    <Skeleton variant="rectangular" width="100%" height="1.5rem" />
                    <Skeleton variant="rectangular" width="100%" height="1.5rem" />
                    <Skeleton variant="rectangular" width="100%" height="1.5rem" />
                    <Skeleton variant="rectangular" width="100%" height="4rem" sx={{ mt: "1rem !important" }} />
                </Stack>
            </ClipThing>
        </Box>
    )
}
