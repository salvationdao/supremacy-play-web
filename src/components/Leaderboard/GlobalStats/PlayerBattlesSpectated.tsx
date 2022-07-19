import { Stack, Typography, CircularProgress, Box } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { EmptyWarMachinesPNG } from "../../../assets"
import { useSnackbar } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { useGameServerCommands } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { User } from "../../../types"
import { ClipThing } from "../../Common/ClipThing"

interface RankItem {
    player: User
    view_battle_count: number
}

export const PlayerBattlesSpectated = () => {
    const theme = useTheme()
    const { newSnackbarMessage } = useSnackbar()
    const { send } = useGameServerCommands("/public/commander")
    const [ranks, setRanks] = useState<RankItem[]>()
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState<string>()

    const primaryColor = theme.factionTheme.primary
    const secondaryColor = theme.factionTheme.secondary
    const backgroundColor = theme.factionTheme.background

    useEffect(() => {
        ;(async () => {
            try {
                setIsLoading(true)

                const resp = await send<RankItem[]>(GameServerKeys.GetPlayerBattlesSpectated)

                if (!resp) return
                setLoadError(undefined)
                setRanks(resp)
            } catch (e) {
                const message = typeof e === "string" ? e : "Failed to player battles spectated."
                setLoadError(message)
                newSnackbarMessage(message, "error")
                console.error(e)
            } finally {
                setIsLoading(false)
            }
        })()
    }, [newSnackbarMessage, send])

    const content = useMemo(() => {
        if (loadError) {
            return (
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                    <Stack
                        alignItems="center"
                        justifyContent="center"
                        sx={{ height: "100%", maxWidth: "100%", width: "75rem", px: "3rem", pt: "1.28rem" }}
                        spacing="1.5rem"
                    >
                        <Typography
                            sx={{
                                color: colors.red,
                                fontFamily: fonts.nostromoBold,
                                textAlign: "center",
                            }}
                        >
                            {loadError}
                        </Typography>
                    </Stack>
                </Stack>
            )
        }

        if (!ranks || isLoading) {
            return (
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                    <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", px: "3rem", pt: "1.28rem" }}>
                        <CircularProgress size="3rem" sx={{ color: primaryColor }} />
                    </Stack>
                </Stack>
            )
        }

        if (ranks && ranks.length > 0) {
            return (
                <Box
                    sx={{
                        width: "100%",
                        pt: "1rem",
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(32rem, 1fr))",
                        gap: "2.4rem",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "visible",
                        height: "100%",
                    }}
                >
                    {ranks.map((rank, index) => (
                        // <MysteryCrateStoreItem key={`storefront-mystery-crate-${crate.id}-${index}`} enlargedView={enlargedView} crate={crate} />
                        <Typography key={rank.player.id}>{rank.player.username}</Typography>
                    ))}
                </Box>
            )
        }

        return (
            <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", maxWidth: "40rem" }}>
                    <Box
                        sx={{
                            width: "80%",
                            height: "16rem",
                            opacity: 0.7,
                            filter: "grayscale(100%)",
                            background: `url(${EmptyWarMachinesPNG})`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "bottom center",
                            backgroundSize: "contain",
                        }}
                    />
                    <Typography
                        sx={{
                            px: "1.28rem",
                            pt: "1.28rem",
                            color: colors.grey,
                            fontFamily: fonts.nostromoBold,
                            userSelect: "text !important",
                            opacity: 0.9,
                            textAlign: "center",
                        }}
                    >
                        {"There's nothing to show, please contact support'."}
                    </Typography>
                </Stack>
            </Stack>
        )
    }, [loadError, ranks, isLoading, primaryColor])

    return (
        <ClipThing
            clipSize="10px"
            border={{
                isFancy: true,
                borderColor: primaryColor,
                borderThickness: ".3rem",
            }}
            opacity={0.7}
            backgroundColor={backgroundColor}
        >
            <Stack sx={{ height: "100%" }}>{content}</Stack>
        </ClipThing>
    )
}
