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
                    <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                        <Box
                            sx={{
                                width: "80%",
                                height: "10rem",
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
                                px: "1.28rem",
                                pt: "1.28rem",
                                color: colors.grey,
                                fontFamily: fonts.nostromoBold,
                                textAlign: "center",
                            }}
                        >
                            Your lobbies will appear here.
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
                <Stack sx={{ px: "1rem", py: "1rem", flex: 1, overflowY: "auto", overflowX: "hidden" }}>{content}</Stack>
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
                backgroundColor: isOpen ? theme.factionTheme.s600 : theme.factionTheme.s800,
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
                    <SvgLobbies size="3rem" />
                </NiceButton>
            </NiceTooltip>
            <Typography
                sx={{
                    fontFamily: fonts.nostromoBlack,
                    fontSize: "1.8rem",
                }}
            >
                My Lobbies
            </Typography>
            <Box flex={1} />
            <Typography
                sx={{
                    color: involvedLobbies.length > 0 ? colors.lightGrey : colors.darkGrey,
                }}
            >
                {involvedLobbies.length} open lobbies
            </Typography>
        </Stack>
    )
}
MyLobbies.Header = Header
