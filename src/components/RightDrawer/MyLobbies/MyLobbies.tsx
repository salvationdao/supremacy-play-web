import { Box, Stack, Typography } from "@mui/material"
import { useMemo, useState } from "react"
import FlipMove from "react-flip-move"
import { EmptyWarMachinesPNG, SvgLobbies } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { useGameServerSubscriptionSecuredUser } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { HeaderProps } from "../../../routes"
import { colors, fonts } from "../../../theme/theme"
import { BattleLobby } from "../../../types/battle_queue"
import { NiceButton } from "../../Common/Nice/NiceButton"
import { NiceTooltip } from "../../Common/Nice/NiceTooltip"
import { MyLobbyItem } from "./MyLobbyItem"

export const MyLobbies = () => {
    const [involvedLobbies, setInvolvedLobbies] = useState<BattleLobby[]>([])
    useGameServerSubscriptionSecuredUser<BattleLobby[]>(
        {
            URI: "/involved_battle_lobbies",
            key: GameServerKeys.SubInvolvedBattleLobbiesUpdate,
        },
        (payload) => {
            if (!payload) return
            setInvolvedLobbies((prev) => {
                if (prev.length === 0) return payload.filter((bl) => !bl.ended_at && !bl.deleted_at).sort((a, b) => (a.stage_order > b.stage_order ? 1 : -1))

                const list = prev.map((bl) => payload.find((p) => p.id === bl.id) || bl)

                payload.forEach((p) => {
                    // if already exists
                    if (list.some((b) => b.id === p.id)) {
                        return
                    }
                    // otherwise, push to the list
                    list.push(p)
                })

                return list.filter((bl) => !bl.ended_at && !bl.deleted_at).sort((a, b) => (a.stage_order > b.stage_order ? 1 : -1))
            })
        },
    )

    const content = useMemo(() => {
        if (involvedLobbies.length === 0) {
            return (
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                    <Stack alignItems="center" justifyContent="center" spacing="2rem" sx={{ height: "100%", p: "1rem" }}>
                        <Box
                            sx={{
                                width: "80%",
                                height: "8rem",
                                opacity: 0.7,
                                filter: "grayscale(100%)",
                                background: `url(${EmptyWarMachinesPNG})`,
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "bottom center",
                                backgroundSize: "contain",
                            }}
                        />
                        <Typography
                            variant="body2"
                            sx={{
                                color: colors.grey,
                                fontFamily: fonts.nostromoBold,
                                textAlign: "center",
                            }}
                        >
                            Your lobbies will appear here
                        </Typography>
                    </Stack>
                </Stack>
            )
        }

        return (
            <FlipMove>
                {involvedLobbies.map((battleLobby) => {
                    return (
                        <Box
                            key={`battle-lobby-${battleLobby.id}`}
                            sx={{
                                "&:not(:last-child)": {
                                    mb: ".8rem",
                                },
                            }}
                        >
                            <MyLobbyItem battleLobby={battleLobby} />
                        </Box>
                    )
                })}
            </FlipMove>
        )
    }, [involvedLobbies])

    return (
        <>
            <Stack sx={{ position: "relative", height: "100%", overflow: "hidden" }}>
                <Stack sx={{ p: "1rem", flex: 1, overflowY: "auto", overflowX: "hidden" }}>{content}</Stack>
            </Stack>
        </>
    )
}

const Header = ({ isOpen, onClose }: HeaderProps) => {
    const theme = useTheme()
    const [involvedLobbies, setInvolvedLobbies] = useState<BattleLobby[]>([])

    useGameServerSubscriptionSecuredUser<BattleLobby[]>(
        {
            URI: "/involved_battle_lobbies",
            key: GameServerKeys.SubInvolvedBattleLobbiesUpdate,
        },
        (payload) => {
            if (!payload) return
            setInvolvedLobbies((prev) => {
                if (prev.length === 0) return payload.filter((bl) => !bl.ended_at && !bl.deleted_at).sort((a, b) => (a.stage_order > b.stage_order ? 1 : -1))

                const list = prev.map((bl) => payload.find((p) => p.id === bl.id) || bl)

                payload.forEach((p) => {
                    // if already exists
                    if (list.some((b) => b.id === p.id)) {
                        return
                    }
                    // otherwise, push to the list
                    list.push(p)
                })

                return list.filter((bl) => !bl.ended_at && !bl.deleted_at).sort((a, b) => (a.stage_order > b.stage_order ? 1 : -1))
            })
        },
    )

    return (
        <Stack
            spacing="1rem"
            direction="row"
            sx={{
                width: "100%",
                p: "1rem",
                alignItems: "center",
                opacity: isOpen ? 1 : 0.7,
                background: isOpen ? `linear-gradient(${theme.factionTheme.s500}70 26%, ${theme.factionTheme.s600})` : theme.factionTheme.s800,
                transition: "background-color .2s ease-out",
            }}
        >
            <NiceTooltip text="My Lobbies" placement="left">
                <NiceButton
                    onClick={onClose}
                    buttonColor={theme.factionTheme.primary}
                    corners
                    sx={{
                        p: ".8rem",
                        pb: ".6rem",
                    }}
                >
                    <SvgLobbies size="2.6rem" />
                </NiceButton>
            </NiceTooltip>
            <Typography
                sx={{
                    fontFamily: fonts.nostromoBlack,
                    fontSize: "1.6rem",
                }}
            >
                My Lobbies
            </Typography>
            <Box flex={1} />
            <Typography sx={{ color: colors.lightGrey }}>
                {involvedLobbies.length} open {involvedLobbies.length === 1 ? "lobby" : "lobbies"}
            </Typography>
        </Stack>
    )
}
MyLobbies.Header = Header
