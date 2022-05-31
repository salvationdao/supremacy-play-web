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
    crate: MysteryCrate
}

export const MysteryCrateItem = ({ crate }: MysteryCrateItemProps) => {
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
        <Box sx={{ p: "1.2rem", width: "30rem" }}>
            <ClipThing
                clipSize="10px"
                border={{
                    borderColor: primaryColor,
                    borderThickness: ".2rem",
                }}
                opacity={0.9}
                backgroundColor={backgroundColor}
                sx={{ height: "100%" }}
            >
                <Stack spacing="1.5rem" sx={{ height: "100%", px: "1.5rem", py: "1.5rem" }}>
                    <Box
                        sx={{
                            position: "relative",
                            px: ".6rem",
                            py: "1.5rem",
                            borderRadius: 1,
                            boxShadow: "inset 0 0 12px 6px #00000040",
                            background: `radial-gradient(#FFFFFF20 1px, ${backgroundColor})`,
                            border: "#00000060 1px solid",
                        }}
                    >
                        <Box
                            sx={{
                                width: "100%",
                                height: "9.5rem",
                                background: `url(${crateDeets.image})`,
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "top center",
                                backgroundSize: "contain",
                            }}
                        />

                        <Box sx={{ position: "absolute", right: ".5rem", bottom: ".2rem", px: ".2rem", py: ".5rem", backgroundColor: "#00000095" }}>
                            <Typography
                                sx={{
                                    lineHeight: 1,
                                    fontSize: "1.22rem",
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
                    </Box>

                    <Stack spacing=".4rem" sx={{ px: ".4rem", py: ".3rem" }}>
                        <Typography sx={{ color: primaryColor, fontFamily: fonts.nostromoBlack }}>{crateDeets.label}</Typography>

                        <Typography>{crateDeets.desc}</Typography>

                        <Box sx={{ pt: ".3rem" }}>
                            <Stack direction="row" alignItems="center" spacing=".1rem">
                                <SvgSupToken size="1.6rem" fill={colors.yellow} />
                                <Typography sx={{ fontWeight: "fontWeightBold" }}>{supFormatterNoFixed(price, 2)}</Typography>
                            </Stack>

                            <FancyButton
                                excludeCaret
                                clipThingsProps={{
                                    clipSize: "5px",
                                    backgroundColor: primaryColor,
                                    opacity: 1,
                                    border: { isFancy: true, borderColor: primaryColor, borderThickness: "1.5px" },
                                    sx: { position: "relative", mt: "1rem" },
                                }}
                                sx={{ px: "1.6rem", py: ".4rem" }}
                            >
                                <Typography variant="caption" sx={{ fontFamily: fonts.nostromoBold }}>
                                    BUY NOW
                                </Typography>
                            </FancyButton>
                        </Box>
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
