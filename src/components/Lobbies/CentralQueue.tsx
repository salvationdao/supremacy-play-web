import { BattleLobby } from "../../types/battle_queue"
import { useEffect, useMemo, useState } from "react"
import { ClipThing } from "../Common/ClipThing"
import { useTheme } from "../../containers/theme"
import { colors, fonts } from "../../theme/theme"
import { Box, Stack, Typography } from "@mui/material"
import FlipMove from "react-flip-move"
import { SmallLobbyCard } from "./BattleLobbies/SmallLobbyCard"

interface CentralQueueProps {
    battleLobbies: BattleLobby[]
}

export const CentralQueue = ({ battleLobbies }: CentralQueueProps) => {
    const { factionTheme } = useTheme()
    const [list, setList] = useState<BattleLobby[]>([])
    useEffect(
        () =>
            setList((prev) => {
                const bls = [...battleLobbies].filter((bl) => !!bl.ready_at)
                if (prev.length === 0) return bls
                prev = prev.map((p) => bls.find((bl) => bl.id === p.id) || p)
                bls.forEach((bl) => {
                    if (prev.some((p) => p.id === bl.id)) return
                    prev.push(bl)
                })
                return prev.filter((p) => !p.ended_at).sort((a, b) => (!!a.ready_at && !!b.ready_at && a.ready_at > b.ready_at ? 1 : -1))
            }),
        [battleLobbies],
    )

    const content = useMemo(() => {
        if (list.length === 0) {
            return (
                <Typography variant="body2" sx={{ color: colors.grey, textAlign: "center", fontFamily: fonts.nostromoBold }}>
                    No lobby is ready.
                </Typography>
            )
        }

        return (
            <Box sx={{ direction: "ltr", height: 0 }}>
                <FlipMove>
                    {list.map((battleLobby) => {
                        return (
                            <Box
                                key={`battle-lobby-${battleLobby.id}`}
                                sx={{
                                    "&:not(:last-child)": {
                                        mb: ".8rem",
                                    },
                                }}
                            >
                                <SmallLobbyCard battleLobby={battleLobby} />
                            </Box>
                        )
                    })}
                </FlipMove>
            </Box>
        )
    }, [list])

    return (
        <ClipThing
            border={{
                borderColor: colors.bronze,
                borderThickness: ".3rem",
            }}
            clipSize="10px"
            backgroundColor={factionTheme.background}
            sx={{ height: "100%", width: "35rem" }}
        >
            <Stack sx={{ height: "100%" }}>
                <ClipThing
                    clipSize="10px"
                    corners={{ topLeft: true, topRight: true }}
                    border={{
                        borderColor: colors.bronze,
                        borderThickness: ".3rem",
                    }}
                    backgroundColor={colors.bronze}
                    sx={{ m: "-.3rem", p: "1.3rem" }}
                >
                    <Typography sx={{ textAlign: "center", fontFamily: fonts.nostromoBlack }}>Central Queue</Typography>
                </ClipThing>

                <Stack sx={{ px: "1rem", py: "1rem", flex: 1 }}>
                    <Box
                        flex={1}
                        sx={{
                            overflowY: "auto",
                            overflowX: "hidden",
                            direction: "ltr",

                            "::-webkit-scrollbar": {
                                width: ".4rem",
                            },
                            "::-webkit-scrollbar-track": {
                                background: "#FFFFFF15",
                                borderRadius: 3,
                            },
                            "::-webkit-scrollbar-thumb": {
                                background: factionTheme.primary,
                                borderRadius: 3,
                            },
                        }}
                    >
                        {content}
                    </Box>
                </Stack>
            </Stack>
        </ClipThing>
    )
}
