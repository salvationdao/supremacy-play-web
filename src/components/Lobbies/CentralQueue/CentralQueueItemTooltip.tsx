import { Box, IconButton, Stack, Typography } from "@mui/material"
import BigNumber from "bignumber.js"
import { useMemo } from "react"
import {
    SvgChest2,
    SvgContentCopyIcon,
    SvgFirstPlace,
    SvgLeaderboard,
    SvgLobbies,
    SvgLock,
    SvgMap,
    SvgSecondPlace,
    SvgSupToken,
    SvgThirdPlace,
    SvgUserDiamond2,
    SvgWrapperProps,
} from "../../../assets"
import { useArena, useAuth, useSupremacy } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { supFormatter } from "../../../helpers"
import { colors, fonts } from "../../../theme/theme"
import { BattleLobbiesMech, BattleLobby } from "../../../types/battle_queue"
import { NiceButton } from "../../Common/Nice/NiceButton"
import { TypographyTruncated } from "../../Common/TypographyTruncated"

export const CentralQueueItemTooltip = ({
    battleLobby,
    displayAccessCode,
    width,
    setShowJoinLobbyModal,
}: {
    battleLobby: BattleLobby
    displayAccessCode?: string
    width?: string
    setShowJoinLobbyModal: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const { factionTheme } = useTheme()
    const { arenaList } = useArena()
    const { factionsAll, getFaction } = useSupremacy()

    const ownerFaction = useMemo(() => getFaction(battleLobby.host_by.faction_id), [getFaction, battleLobby.host_by.faction_id])

    const arenaName = useMemo(() => arenaList.find((a) => a.id === battleLobby.assigned_to_arena_id)?.name, [arenaList, battleLobby.assigned_to_arena_id])

    return (
        <Box sx={{ width: width || "40rem", backgroundColor: factionTheme.s800 }}>
            {/* Lobby name */}
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing="1.6rem"
                sx={{
                    p: "1rem 1.5rem",
                    pr: ".5rem",
                    backgroundColor: factionTheme.s600,
                }}
            >
                <TypographyTruncated variant="h6" sx={{ fontFamily: fonts.nostromoBlack }}>
                    {displayAccessCode ? <SvgLock inline size="2.2rem" fill={colors.orange} /> : <SvgLobbies inline size="2.2rem" />}{" "}
                    {battleLobby.name || `Lobby #${battleLobby.number}`}
                </TypographyTruncated>

                {displayAccessCode && (
                    <Stack direction="row" alignItems="center">
                        <Typography variant="h6">{displayAccessCode}</Typography>
                        <IconButton
                            size="small"
                            sx={{ opacity: 0.6, ":hover": { opacity: 1 } }}
                            onClick={() => {
                                navigator.clipboard.writeText(displayAccessCode)
                            }}
                        >
                            <SvgContentCopyIcon inline size="1.3rem" />
                        </IconButton>
                    </Stack>
                )}
            </Stack>

            {/* Label */}
            <Typography
                variant="body2"
                sx={{
                    p: ".4rem 1rem",
                    backgroundColor: battleLobby.generated_by_system ? colors.green : colors.orange,
                    textAlign: "center",
                    fontFamily: fonts.nostromoBlack,
                }}
            >
                {battleLobby.generated_by_system ? "System Battle" : "Exhibition Battle"}
            </Typography>

            <Stack sx={{ p: "1.8rem", pb: "2rem" }} spacing="1rem">
                {/* Host name */}
                <Stack direction="row" justifyContent="space-between" spacing="1rem">
                    <Typography sx={{ fontFamily: fonts.nostromoBlack }} variant="body2">
                        <SvgUserDiamond2 inline /> Hosted By:
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing=".6rem">
                        {ownerFaction.logo_url && (
                            <Box
                                sx={{
                                    width: "2.4rem",
                                    height: "2.4rem",
                                    background: `url(${ownerFaction.logo_url})`,
                                    backgroundRepeat: "no-repeat",
                                    backgroundPosition: "center",
                                    backgroundSize: "contain",
                                }}
                            />
                        )}
                        <TypographyTruncated sx={{ color: ownerFaction.palette.primary, fontWeight: "bold" }}>
                            {battleLobby.generated_by_system ? "The Overseer" : `${battleLobby.host_by.username}#${battleLobby.host_by.gid}`}
                        </TypographyTruncated>
                    </Stack>
                </Stack>

                {/* Arena name */}
                {arenaName && (
                    <Stack direction="row" justifyContent="space-between" spacing="1rem">
                        <Typography sx={{ fontFamily: fonts.nostromoBlack }} variant="body2">
                            <SvgMap inline /> Arena:
                        </Typography>
                        <Typography>{arenaName}</Typography>
                    </Stack>
                )}

                {/* Map */}
                <Stack direction="row" justifyContent="space-between" spacing="1rem">
                    <Typography sx={{ fontFamily: fonts.nostromoBlack }} variant="body2">
                        <SvgMap inline /> Map:
                    </Typography>
                    <TypographyTruncated>{battleLobby.game_map?.name || "To be determined..."}</TypographyTruncated>
                </Stack>

                {/* Reward pool */}
                <Stack direction="row" justifyContent="space-between" spacing="1rem">
                    <Typography sx={{ fontFamily: fonts.nostromoBlack }} variant="body2">
                        <SvgChest2 inline /> Reward Pool:
                    </Typography>
                    <Typography>
                        <SvgSupToken inline fill={colors.gold} />
                        {supFormatter(battleLobby.sups_pool, 2)}
                    </Typography>
                </Stack>

                {/* Distribution */}
                <Box>
                    <Typography sx={{ mb: "1rem", fontFamily: fonts.nostromoBlack }} variant="body2">
                        <SvgLeaderboard inline /> Distribution:
                    </Typography>

                    <Stack direction="row" justifyContent="space-around" spacing="1rem">
                        <DistributionValue
                            Icon={SvgFirstPlace}
                            value={new BigNumber(battleLobby.sups_pool).shiftedBy(-18).multipliedBy(parseFloat(battleLobby.first_faction_cut)).toFixed(0)}
                            color={colors.gold}
                        />
                        <DistributionValue
                            Icon={SvgSecondPlace}
                            value={new BigNumber(battleLobby.sups_pool).shiftedBy(-18).multipliedBy(parseFloat(battleLobby.second_faction_cut)).toFixed(0)}
                            color={colors.silver}
                        />
                        <DistributionValue
                            Icon={SvgThirdPlace}
                            value={new BigNumber(battleLobby.sups_pool).shiftedBy(-18).multipliedBy(parseFloat(battleLobby.third_faction_cut)).toFixed(0)}
                            color={colors.bronze}
                        />
                    </Stack>
                </Box>

                {/* Players */}
                <Box>
                    <Stack direction="row" justifyContent="space-between" spacing="1rem" my="1rem">
                        <Typography sx={{ fontFamily: fonts.nostromoBlack }} variant="body2">
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
                            <FactionMechList
                                key={index}
                                factionID={fid}
                                battleLobbiesMechs={battleLobby.battle_lobbies_mechs}
                                setShowJoinLobbyModal={setShowJoinLobbyModal}
                            />
                        ))}
                    </Stack>
                </Box>
            </Stack>
        </Box>
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
            pt: "1rem",
            border: `1px solid #FFFFFF20`,
            backgroundColor: "#FFFFFF15",
        }}
    >
        <Icon size="3.2rem" />
        <Typography>
            <SvgSupToken inline size="2rem" fill={colors.gold} />
            {value}
        </Typography>
    </Stack>
)

const NUMBER_MECHS_REQUIRED = 3
const SIZE = "4.5rem"

const FactionMechList = ({
    factionID,
    battleLobbiesMechs,
    setShowJoinLobbyModal,
}: {
    factionID: string
    battleLobbiesMechs: BattleLobbiesMech[]
    setShowJoinLobbyModal: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const { userID, factionID: userFactionID } = useAuth()
    const { getFaction } = useSupremacy()

    const faction = useMemo(() => getFaction(factionID), [getFaction, factionID])

    const mechsFiltered = useMemo(() => battleLobbiesMechs.filter((mech) => mech.faction_id === factionID), [battleLobbiesMechs, factionID])

    const isOwnFaction = userFactionID === factionID

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
                {mechsFiltered.map((mech, i) => {
                    return (
                        <Box
                            key={`mech-${mech.id}-${i}`}
                            sx={{
                                border: mech?.queued_by?.id === userID ? `${colors.gold} 2px solid` : `${faction.palette.primary}80 1px solid`,
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
                    new Array(NUMBER_MECHS_REQUIRED - mechsFiltered.length).fill(0).map((_, index) => {
                        if (isOwnFaction) {
                            return (
                                <NiceButton
                                    key={`empty-slot-${index}`}
                                    corners
                                    buttonColor={faction.palette.primary}
                                    sx={{
                                        width: `calc(${SIZE} - 1px)`,
                                        height: `calc(${SIZE} - 1px)`,
                                        p: 0,
                                    }}
                                    onClick={() => setShowJoinLobbyModal(true)}
                                >
                                    <Typography fontFamily={fonts.nostromoBold} variant="h4">
                                        +
                                    </Typography>
                                </NiceButton>
                            )
                        }

                        return (
                            <Stack
                                key={`empty-slot-${index}`}
                                alignItems="center"
                                justifyContent="center"
                                sx={{
                                    border: `${faction.palette.primary} 1px solid`,
                                    width: SIZE,
                                    height: SIZE,
                                    opacity: 0.4,
                                    backgroundColor: faction.palette.s900,
                                }}
                            >
                                <Typography fontFamily={fonts.nostromoBold} color={faction.palette.primary}>
                                    ?
                                </Typography>
                            </Stack>
                        )
                    })}
            </Stack>
        </Stack>
    )
}
