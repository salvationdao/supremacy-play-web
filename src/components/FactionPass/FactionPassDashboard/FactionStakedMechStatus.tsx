import { useGameServerSubscriptionFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { Box, Stack, Typography } from "@mui/material"
import { ReactNode, useMemo, useState } from "react"
import { NiceBoxThing } from "../../Common/Nice/NiceBoxThing"
import { colors, fonts } from "../../../theme/theme"
import { FactionStakedMechStatistic } from "./FactionStakedMechStatistic"

export const FactionStakedMechStatus = () => {
    const [stakedMechCount, setStakedMechCount] = useState(0)
    useGameServerSubscriptionFaction<number>(
        {
            URI: "/staked_mech_count",
            key: GameServerKeys.SubFactionStakedMechCount,
        },
        (payload) => setStakedMechCount(payload),
    )

    const [inQueueStakedMechCount, setInQueueStakedMechCount] = useState(0)
    useGameServerSubscriptionFaction<number>(
        {
            URI: "/in_queue_staked_mech_count",
            key: GameServerKeys.SubFactionStakedMechInQueueCount,
        },
        (payload) => setInQueueStakedMechCount(payload),
    )

    const [damagedStakedMechCount, setDamagedStakedMechCount] = useState(0)
    useGameServerSubscriptionFaction<number>(
        {
            URI: "/damaged_staked_mech_count",
            key: GameServerKeys.SubFactionStakedMechDamagedCount,
        },
        (payload) => setDamagedStakedMechCount(payload),
    )

    const [battleReadyStakedMechCount, setBattleReadyStakedMechCount] = useState(0)
    useGameServerSubscriptionFaction<number>(
        {
            URI: "/battle_ready_staked_mech_count",
            key: GameServerKeys.SubFactionStakedMechBattleReadyCount,
        },
        (payload) => setBattleReadyStakedMechCount(payload),
    )

    const [inBattleStakedMechCount, setInBattleStakedMechCount] = useState(0)
    useGameServerSubscriptionFaction<number>(
        {
            URI: "/in_battle_staked_mech_count",
            key: GameServerKeys.SubFactionStakedMechInBattleCount,
        },
        (payload) => setInBattleStakedMechCount(payload),
    )

    const [battledStakedMechCount, setBattledStakedMechCount] = useState(0)
    useGameServerSubscriptionFaction<number>(
        {
            URI: "/battled_staked_mech_count",
            key: GameServerKeys.SubFactionStakedMechBattledCount,
        },
        (payload) => setBattledStakedMechCount(payload),
    )

    return (
        <Stack direction="row" flex={1} spacing="1.5rem">
            <Box
                flex={1}
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(30rem, 1fr))",
                    gridTemplateRows: "repeat(auto-fill, 20rem) ",
                    gap: "1.5rem",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Box
                    sx={{
                        width: "100%",
                        height: "100%",
                        backgroundColor: `${colors.offWhite}20`,
                        gridColumn: "1 / span 2",
                        gridRow: "1 / span 2",
                        p: "1.5rem",
                    }}
                ></Box>
                <FactionStakedMechStatusBox title={"STAKED MECHS BATTLED"} value={battledStakedMechCount} caption={" "} />
                <FactionStakedMechStatusBox title={"STAKED MECHS"} value={stakedMechCount} caption={" "} />
                <FactionStakedMechStatusBox title={"STAKED MECHS IN QUEUE"} value={inQueueStakedMechCount} caption={"GO TO MECH POOL"} color={colors.green} />
                <FactionStakedMechStatusBox
                    title={"STAKED MECHS DAMAGED"}
                    value={damagedStakedMechCount}
                    caption={"GO TO REPAIR BAY"}
                    color={colors.lightRed}
                />
                <FactionStakedMechStatusBox
                    title={"STAKED MECHS BATTLE READY"}
                    value={battleReadyStakedMechCount}
                    caption={"GO TO MECH POOL"}
                    color={colors.orange}
                />
                <FactionStakedMechStatusBox title={"STAKED MECHS IN BATTLE"} value={inBattleStakedMechCount} caption={"MECH SUPPORTER"} color={colors.bronze} />
            </Box>
            <FactionStakedMechStatistic
                totalCount={stakedMechCount}
                battleReadyCount={battleReadyStakedMechCount}
                damagedCount={damagedStakedMechCount}
                inBattleCount={inBattleStakedMechCount}
                inQueueCount={inQueueStakedMechCount}
            />
        </Stack>
    )
}

interface FactionStakedMechStatusBoxProps {
    title: ReactNode
    value: string | number
    caption: ReactNode
    color?: string
}

const FactionStakedMechStatusBox = ({ title, value, caption, color }: FactionStakedMechStatusBoxProps) => {
    const label = useMemo(() => {
        if (typeof title === "string")
            return (
                <Typography variant="h5" fontFamily={fonts.rajdhaniBold} sx={{ opacity: 0.7 }}>
                    {title}
                </Typography>
            )
        return title
    }, [title])
    const description = useMemo(() => {
        if (typeof caption === "string")
            return (
                <Typography variant="h5" color={color} fontFamily={fonts.rajdhaniBold}>
                    {caption}
                </Typography>
            )
        return caption
    }, [caption])
    return (
        <NiceBoxThing background={{ colors: [`${colors.offWhite}20`] }} sx={{ width: "100%", height: "100%", p: "1.5rem" }}>
            <Stack direction="column" flex={1} height="100%">
                {label}
                <Stack direction="row" alignItems="center" flex={1}>
                    <Typography variant="h2" fontFamily={fonts.nostromoBlack}>
                        {value}
                    </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    {description}
                    {color && (
                        <Box
                            sx={{
                                width: "2rem",
                                height: "2rem",
                                borderRadius: 0.8,
                                backgroundColor: color,
                            }}
                        />
                    )}
                </Stack>
            </Stack>
        </NiceBoxThing>
    )
}
