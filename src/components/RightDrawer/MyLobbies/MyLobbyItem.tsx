import { Box, Stack, StackProps, styled, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useState } from "react"
import {
    SvgChest2,
    SvgFirstPlace,
    SvgLeaderboard,
    SvgLobbies,
    SvgQuestionMark2,
    SvgQueue,
    SvgSecondPlace,
    SvgSupToken,
    SvgThirdPlace,
    SvgUserDiamond2,
} from "../../../assets"
import { useAuth, useSupremacy } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { scaleUpKeyframes } from "../../../theme/keyframes"
import { colors, fonts } from "../../../theme/theme"
import { BattleLobbiesMech, BattleLobby } from "../../../types/battle_queue"
import { NiceButton } from "../../Common/Nice/NiceButton"
import { NiceTooltip } from "../../Common/Nice/NiceTooltip"
import { BattleLobbySingleModal } from "../../Lobbies/BattleLobbies/BattleLobbySingleModal"

interface MyLobbyItemProps {
    battleLobby: BattleLobby
}

export const MyLobbyItem = ({ battleLobby }: MyLobbyItemProps) => {
    const { factionTheme } = useTheme()
    const { factionsAll } = useSupremacy()
    const { name } = battleLobby

    const [showLobby, setShowLobby] = useState(false)

    const lobbyStatus = useMemo(() => {
        let textColor = colors.green
        let text = "PENDING"

        if (battleLobby.assigned_to_battle_id) {
            textColor = colors.orange
            text = "BATTLE"
        } else if (battleLobby.ready_at) {
            textColor = colors.gold
            text = "READY"
        }

        return (
            <Typography variant="body2" color={textColor}>
                {text}
            </Typography>
        )
    }, [battleLobby.assigned_to_battle_id, battleLobby.ready_at])

    return (
        <>
            <NiceTooltip
                placement="left"
                renderNode={
                    <Box
                        sx={{
                            minWidth: 300,
                            backgroundColor: factionTheme.s800,
                        }}
                    >
                        <Typography
                            sx={{
                                p: "1rem",
                                fontFamily: fonts.nostromoBlack,
                                fontSize: "2rem",
                                borderBottom: `1px solid ${factionTheme.primary}`,
                                backgroundColor: factionTheme.s600,
                            }}
                        >
                            <SvgLobbies inline /> {battleLobby.name}
                        </Typography>
                        <Typography
                            sx={{
                                p: "1rem",
                                backgroundColor: `#7cc8cc`,
                                textAlign: "center",
                                fontFamily: fonts.nostromoBlack,
                            }}
                        >
                            Exhibition Arena
                        </Typography>
                        <Stack
                            sx={{
                                p: "1rem",
                                pb: "1.5rem",
                                fontFamily: fonts.nostromoBlack,
                            }}
                            spacing="1rem"
                        >
                            <Stack direction="row" justifyContent="space-between">
                                <Typography
                                    sx={{
                                        fontFamily: "inherit",
                                        color: colors.grey,
                                    }}
                                >
                                    <SvgUserDiamond2 inline mr=".5rem" />
                                    Hosted By:
                                </Typography>
                                <Typography>{battleLobby.host_by.username}</Typography>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between">
                                <Typography
                                    sx={{
                                        fontFamily: "inherit",
                                        color: colors.grey,
                                    }}
                                >
                                    <SvgChest2 inline mr=".5rem" />
                                    Reward Pool:
                                </Typography>
                                <Typography>
                                    <SvgSupToken inline fill={colors.gold} />
                                    {battleLobby.sups_pool}
                                </Typography>
                            </Stack>
                            <Box>
                                <Typography
                                    sx={{
                                        mb: ".5rem",
                                        fontFamily: "inherit",
                                        color: colors.grey,
                                    }}
                                >
                                    <SvgLeaderboard inline mr=".5rem" />
                                    Distribution:
                                </Typography>
                                <Stack direction="row" justifyContent="space-around">
                                    <PrizeCut
                                        svg={<SvgFirstPlace size="4rem" />}
                                        cut={`${parseFloat(battleLobby.first_faction_cut) * parseFloat(battleLobby.sups_pool)}`}
                                    />
                                    <PrizeCut
                                        svg={<SvgSecondPlace size="4rem" />}
                                        cut={`${parseFloat(battleLobby.second_faction_cut) * parseFloat(battleLobby.sups_pool)}`}
                                    />
                                    <PrizeCut
                                        svg={<SvgThirdPlace size="4rem" />}
                                        cut={`${parseFloat(battleLobby.third_faction_cut) * parseFloat(battleLobby.sups_pool)}`}
                                    />
                                </Stack>
                            </Box>
                            <Box>
                                <Stack direction="row" justifyContent="space-between" mb=".5rem">
                                    <Typography
                                        sx={{
                                            fontFamily: "inherit",
                                            color: colors.grey,
                                        }}
                                    >
                                        <SvgUserDiamond2 inline mr=".5rem" />
                                        Players:
                                    </Typography>
                                    <Typography
                                        sx={{
                                            color: battleLobby.battle_lobbies_mechs.length < 9 ? colors.lightGrey : colors.green,
                                            fontFamily: fonts.rajdhaniBold,
                                        }}
                                    >
                                        {battleLobby.battle_lobbies_mechs.length} / 9
                                    </Typography>
                                </Stack>
                                <Stack spacing="1rem">
                                    {Object.keys(factionsAll).map((fid, index) => (
                                        <FactionMechList key={index} factionID={fid} battleLobbiesMechs={battleLobby.battle_lobbies_mechs} />
                                    ))}
                                </Stack>
                            </Box>
                        </Stack>
                    </Box>
                }
                color={factionTheme.primary}
            >
                <NiceButton
                    onClick={() => setShowLobby(true)}
                    buttonColor={factionTheme.primary}
                    sx={{
                        width: "100%",
                        flexDirection: "column",
                        alignItems: "stretch",
                        fontFamily: fonts.nostromoBlack,
                    }}
                >
                    <Stack direction="row" justifyContent="space-between" mb=".5rem">
                        <Stack direction="row" spacing=".5rem" alignItems="baseline">
                            <Typography sx={{ fontFamily: "inherit" }}>{name}</Typography>
                            {lobbyStatus}
                        </Stack>
                        <Typography sx={{ fontFamily: "inherit" }}>
                            <SvgQueue inline />
                            {battleLobby.stage_order}
                        </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                        <Typography>
                            Reward Pool:
                            <SvgSupToken fill={colors.gold} inline />
                            {battleLobby.sups_pool}
                        </Typography>
                        <Typography
                            sx={{
                                color: battleLobby.battle_lobbies_mechs.length < 9 ? colors.lightGrey : colors.green,
                                fontFamily: fonts.rajdhaniBold,
                            }}
                        >
                            <SvgUserDiamond2 inline /> {battleLobby.battle_lobbies_mechs.length} / 9
                        </Typography>
                    </Stack>
                </NiceButton>
            </NiceTooltip>
            {showLobby && <BattleLobbySingleModal showingLobby={battleLobby} setOpen={setShowLobby} />}
        </>
    )
}

interface PrizeCutProps extends StackProps {
    svg: React.ReactNode
    cut: string
}
const PrizeCut = styled(({ svg, cut, ...props }: PrizeCutProps) => (
    <Stack
        spacing=".5rem"
        sx={{
            height: 80,
            width: 80,
            p: ".5rem",
            alignItems: "center",
            justifyContent: "center",
            border: `1px solid ${colors.grey}`,
            backgroundColor: `${colors.darkGrey}77`,
        }}
        {...props}
    >
        {svg}
        <Typography
            sx={{
                fontFamily: "inherit",
                fontSize: "2rem",
            }}
        >
            <SvgSupToken inline size="2.6rem" fill={colors.gold} />
            {cut}
        </Typography>
    </Stack>
))({})

interface FactionMechListProps {
    factionID: string
    battleLobbiesMechs: BattleLobbiesMech[]
}
const MECH_BLOCK_SIZE = 50
const FactionMechList = ({ factionID, battleLobbiesMechs }: FactionMechListProps) => {
    const { userID } = useAuth()
    const { getFaction } = useSupremacy()

    const [mechBlocks, setMechBlocks] = useState<BattleLobbiesMech[]>([])
    const [emptyBlocks, setEmptyBlocks] = useState<string[]>([])

    useEffect(() => {
        const list = [...battleLobbiesMechs].filter((blm) => blm.faction_id === factionID)
        const emptyList: string[] = []
        while (list.length + emptyList.length < 3) emptyList.push("")

        setMechBlocks(list)
        setEmptyBlocks(emptyList)
    }, [factionID, battleLobbiesMechs])

    const faction = useMemo(() => getFaction(factionID), [getFaction, factionID])

    const MechBox = useCallback(
        (key: number, blm?: BattleLobbiesMech) => {
            const isQueuedBy = blm?.queued_by?.id === userID
            const isDestroyed = !!blm?.is_destroyed

            return (
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                    key={key}
                    sx={{
                        position: "relative",
                        height: MECH_BLOCK_SIZE,
                        width: MECH_BLOCK_SIZE,
                        border: `${isQueuedBy ? colors.gold : faction.palette.primary} 1px solid`,
                    }}
                >
                    {blm ? (
                        <>
                            <Box
                                sx={{
                                    position: "absolute",
                                    left: "50%",
                                    bottom: 0,
                                    width: "100%",
                                    transform: "translate(-50%, 0)",
                                    backgroundColor: `${faction.palette.background}dd`,
                                }}
                            />
                            <Box
                                component="img"
                                src={blm.avatar_url}
                                sx={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                }}
                            />
                            {isDestroyed && (
                                <Box
                                    sx={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        width: "100%",
                                        height: "100%",
                                        backgroundColor: `${faction.palette.background}AA`,
                                    }}
                                />
                            )}
                        </>
                    ) : (
                        <SvgQuestionMark2
                            fill={`${colors.offWhite}20`}
                            sx={{
                                animation: `${scaleUpKeyframes} .5s ease-out`,
                            }}
                        />
                    )}
                </Stack>
            )
        },
        [faction.palette.background, faction.palette.primary, userID],
    )

    return (
        <Stack direction="row" alignItems="center" justifyContent="center" spacing="2rem">
            <Box
                component="img"
                src={faction.logo_url}
                alt={`${faction.label} logo`}
                sx={{
                    height: MECH_BLOCK_SIZE,
                    width: MECH_BLOCK_SIZE,
                }}
            />
            <Stack direction="row" alignItems="center" spacing="1rem">
                {mechBlocks.map((mb, index) => MechBox(index, mb))}
                {emptyBlocks.map((v, index) => MechBox(index))}
            </Stack>
        </Stack>
    )
}
