import { Box, Stack, Typography } from "@mui/material"
import BigNumber from "bignumber.js"
import { useMemo, useState } from "react"
import {
    SvgChest2,
    SvgFirstPlace,
    SvgLeaderboard,
    SvgLobbies,
    SvgMap,
    SvgQueue,
    SvgSecondPlace,
    SvgSupToken,
    SvgThirdPlace,
    SvgUserDiamond2,
    SvgWrapperProps,
} from "../../../assets"
import { useArena, useAuth, useSupremacy } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { supFormatter, truncateTextLines } from "../../../helpers"
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
    const { arenaList } = useArena()
    const { factionsAll, getFaction } = useSupremacy()

    const ownerFaction = useMemo(() => getFaction(battleLobby.host_by.faction_id), [getFaction, battleLobby.host_by.faction_id])

    const arenaName = useMemo(() => arenaList.find((a) => a.id === battleLobby.assigned_to_arena_id)?.name, [arenaList, battleLobby.assigned_to_arena_id])

    const [showLobbyModal, setShowLobbyModal] = useState(false)

    const lobbyStatus = useMemo(() => {
        let textColor = colors.orange
        let text = "PENDING"

        if (battleLobby.assigned_to_battle_id) {
            textColor = colors.orange
            text = "BATTLE"
        } else if (battleLobby.ready_at) {
            textColor = colors.green
            text = "READY"
        }

        return (
            <Typography variant="body2" color={textColor} fontWeight="bold">
                {text}
            </Typography>
        )
    }, [battleLobby.assigned_to_battle_id, battleLobby.ready_at])

    return (
        <>
            <NiceTooltip
                placement="left"
                renderNode={
                    <Box sx={{ minWidth: "38rem", backgroundColor: factionTheme.s800 }}>
                        {/* Lobby name */}
                        <Typography
                            sx={{
                                p: "1rem 1.5rem",
                                fontFamily: fonts.nostromoBlack,
                                fontSize: "2rem",
                                borderBottom: `1px solid ${factionTheme.primary}`,
                                backgroundColor: factionTheme.s600,
                                ...truncateTextLines(1),
                            }}
                        >
                            <SvgLobbies inline size="2.2rem" /> {battleLobby.name}
                        </Typography>

                        {/* Label */}
                        <Typography
                            variant="body2"
                            sx={{
                                p: ".4rem 1rem",
                                backgroundColor: colors.green,
                                textAlign: "center",
                                fontFamily: fonts.nostromoBlack,
                            }}
                        >
                            Exhibition Arena
                        </Typography>

                        <Stack sx={{ p: "1.4rem", pb: "2rem" }} spacing="1rem">
                            {/* Position */}
                            <Stack direction="row" justifyContent="space-between">
                                <Typography sx={{ fontFamily: fonts.nostromoBlack }}>
                                    <SvgQueue inline /> Position:
                                </Typography>
                                <Typography>{battleLobby.stage_order}</Typography>
                            </Stack>

                            {/* Host name */}
                            <Stack direction="row" justifyContent="space-between">
                                <Typography sx={{ fontFamily: fonts.nostromoBlack }}>
                                    <SvgUserDiamond2 inline /> Hosted By:
                                </Typography>
                                <Stack direction="row" alignItems="center" spacing=".6rem">
                                    {ownerFaction.logo_url && (
                                        <Box
                                            sx={{
                                                width: "2.8rem",
                                                height: "2.8rem",
                                                background: `url(${ownerFaction.logo_url})`,
                                                backgroundRepeat: "no-repeat",
                                                backgroundPosition: "center",
                                                backgroundSize: "contain",
                                            }}
                                        />
                                    )}
                                    <Typography sx={{ color: ownerFaction.palette.primary, ...truncateTextLines(1) }}>
                                        {battleLobby.generated_by_system ? "The Overseer" : `${battleLobby.host_by.username}#${battleLobby.host_by.gid}`}
                                    </Typography>
                                </Stack>
                            </Stack>

                            {/* Arena name */}
                            {arenaName && (
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography sx={{ fontFamily: fonts.nostromoBlack }}>
                                        <SvgMap inline /> Arena:
                                    </Typography>
                                    <Typography>{arenaName}</Typography>
                                </Stack>
                            )}

                            {/* Map */}
                            <Stack direction="row" justifyContent="space-between">
                                <Typography sx={{ fontFamily: fonts.nostromoBlack }}>
                                    <SvgMap inline /> Map:
                                </Typography>
                                <Typography>{battleLobby.game_map?.name || "To be determined..."}</Typography>
                            </Stack>

                            {/* Reward pool */}
                            <Stack direction="row" justifyContent="space-between">
                                <Typography sx={{ fontFamily: fonts.nostromoBlack }}>
                                    <SvgChest2 inline /> Reward Pool:
                                </Typography>
                                <Typography>
                                    <SvgSupToken inline fill={colors.gold} />
                                    {supFormatter(battleLobby.sups_pool, 2)}
                                </Typography>
                            </Stack>

                            {/* Distribution */}
                            <Box>
                                <Typography sx={{ mb: "1rem", fontFamily: fonts.nostromoBlack }}>
                                    <SvgLeaderboard inline /> Distribution:
                                </Typography>

                                <Stack direction="row" justifyContent="space-around" spacing="1rem">
                                    <DistributionValue
                                        Icon={SvgFirstPlace}
                                        value={new BigNumber(battleLobby.sups_pool)
                                            .shiftedBy(-18)
                                            .multipliedBy(parseFloat(battleLobby.first_faction_cut))
                                            .toFixed(0)}
                                        color={colors.gold}
                                    />
                                    <DistributionValue
                                        Icon={SvgSecondPlace}
                                        value={new BigNumber(battleLobby.sups_pool)
                                            .shiftedBy(-18)
                                            .multipliedBy(parseFloat(battleLobby.second_faction_cut))
                                            .toFixed(0)}
                                        color={colors.silver}
                                    />
                                    <DistributionValue
                                        Icon={SvgThirdPlace}
                                        value={new BigNumber(battleLobby.sups_pool)
                                            .shiftedBy(-18)
                                            .multipliedBy(parseFloat(battleLobby.third_faction_cut))
                                            .toFixed(0)}
                                        color={colors.bronze}
                                    />
                                </Stack>
                            </Box>

                            {/* Players */}
                            <Box>
                                <Stack direction="row" justifyContent="space-between" my="1rem">
                                    <Typography sx={{ fontFamily: fonts.nostromoBlack }}>
                                        <SvgUserDiamond2 inline /> Players:
                                    </Typography>
                                    <Typography
                                        sx={{
                                            color: battleLobby.battle_lobbies_mechs.length < 9 ? colors.lightGrey : colors.green,
                                            fontFamily: fonts.rajdhaniBold,
                                        }}
                                    >
                                        {battleLobby.battle_lobbies_mechs.length}/9
                                    </Typography>
                                </Stack>

                                <Stack spacing="1rem" ml=".5rem">
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
                <NiceButton onClick={() => setShowLobbyModal(true)} buttonColor={factionTheme.primary} sx={{ width: "100%", p: 0 }}>
                    <Stack direction="row" alignItems="stretch" width="100%">
                        {/* Map image */}
                        <Box
                            sx={{
                                flexShrink: 0,
                                height: "100%",
                                width: "8rem",
                                background: `url(${battleLobby.game_map?.background_url})`,
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "center",
                                backgroundSize: "contain",
                            }}
                        />

                        <Stack alignItems="stretch" spacing=".4rem" sx={{ flex: 1, p: "1rem 1.5rem" }}>
                            <Stack direction="row" justifyContent="space-between">
                                {/* Lobby name */}
                                <Stack direction="row" spacing=".5rem" alignItems="baseline">
                                    <Typography sx={{ fontFamily: fonts.nostromoBlack }}>{battleLobby.name}</Typography>
                                    {lobbyStatus}
                                </Stack>

                                <Typography sx={{ fontFamily: fonts.nostromoBold }}>
                                    <SvgQueue inline size="1.4rem" />
                                    {battleLobby.stage_order}
                                </Typography>
                            </Stack>

                            <Stack direction="row" justifyContent="space-between">
                                <Typography>
                                    Reward Pool:
                                    <SvgSupToken fill={colors.gold} size="1.6rem" inline />
                                    {supFormatter(battleLobby.sups_pool, 2)}
                                </Typography>

                                <Typography
                                    sx={{
                                        color: battleLobby.battle_lobbies_mechs.length < 9 ? colors.lightGrey : colors.green,
                                        fontWeight: "bold",
                                    }}
                                >
                                    <SvgUserDiamond2 inline size="1.8rem" /> {battleLobby.battle_lobbies_mechs.length}/9
                                </Typography>
                            </Stack>
                        </Stack>
                    </Stack>
                </NiceButton>
            </NiceTooltip>

            {showLobbyModal && <BattleLobbySingleModal showingLobby={battleLobby} setOpen={setShowLobbyModal} />}
        </>
    )
}

const DistributionValue = ({ Icon, value }: { Icon: React.VoidFunctionComponent<SvgWrapperProps>; value: string; color: string }) => (
    <Stack
        spacing=".5rem"
        alignItems="center"
        justifyContent="center"
        sx={{
            flex: 1,
            p: ".5rem",
            border: `1px solid #FFFFFF20`,
            backgroundColor: "#FFFFFF15",
        }}
    >
        <Icon size="3.8rem" />
        <Typography>
            <SvgSupToken inline size="2rem" fill={colors.gold} />
            {value}
        </Typography>
    </Stack>
)

const NUMBER_MECHS_REQUIRED = 3
const SIZE = "5rem"

const FactionMechList = ({ factionID, battleLobbiesMechs }: { factionID: string; battleLobbiesMechs: BattleLobbiesMech[] }) => {
    const { userID } = useAuth()
    const { getFaction } = useSupremacy()

    const faction = useMemo(() => getFaction(factionID), [getFaction, factionID])

    const mechsFiltered = useMemo(() => battleLobbiesMechs.filter((mech) => mech.faction_id === factionID), [battleLobbiesMechs, factionID])

    return (
        <Stack direction="row" alignItems="center" spacing="2rem">
            <Box
                component="img"
                src={faction.logo_url}
                alt={`${faction.label} logo`}
                sx={{
                    height: SIZE,
                    width: SIZE,
                }}
            />
            <Stack direction="row" alignItems="center" spacing="1rem">
                {/* Mech cards */}
                {mechsFiltered.map((mech) => {
                    return (
                        <Box
                            key={`mech-${mech.id}`}
                            sx={{
                                border: `${mech?.queued_by?.id === userID ? colors.gold : faction.palette.primary} 1px solid`,
                                width: SIZE,
                                height: SIZE,
                                background: `url(${mech.avatar_url})`,
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "center",
                                backgroundSize: "contain",
                                opacity: !mech?.is_destroyed ? 1 : 0.6,
                            }}
                        />
                    )
                })}

                {/* Empty slots */}
                {NUMBER_MECHS_REQUIRED - mechsFiltered.length > 0 &&
                    new Array(NUMBER_MECHS_REQUIRED - mechsFiltered.length).fill(0).map((_, index) => (
                        <Stack
                            key={`empty-slot-${index}`}
                            alignItems="center"
                            justifyContent="center"
                            sx={{
                                border: `${faction.palette.primary} 1px solid`,
                                width: SIZE,
                                height: SIZE,
                                opacity: 0.6,
                                backgroundColor: faction.palette.s900,
                            }}
                        >
                            <Typography fontFamily={fonts.nostromoBold} color={faction.palette.primary}>
                                ?
                            </Typography>
                        </Stack>
                    ))}
            </Stack>
        </Stack>
    )
}
