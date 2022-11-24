import { Autocomplete, Avatar, Box, CircularProgress, Stack, SxProps, TextField, Typography } from "@mui/material"
import { useFormContext } from "react-hook-form"
import { Accessibility, LobbyForm, Scheduling } from "./CreateLobby"
import { colors, fonts } from "../../../../../theme/theme"
import { useTheme } from "../../../../../containers/theme"
import { useGameServerCommandsFaction, useGameServerSubscriptionSecured } from "../../../../../hooks/useGameServer"
import { GameMap, NewMechStruct, RoleType, User } from "../../../../../types"
import { GameServerKeys } from "../../../../../keys"
import React, { ReactNode, useCallback, useEffect, useMemo, useState } from "react"
import { camelToTitle, combineDateTime, getRarityDeets, shortCodeGenerator } from "../../../../../helpers"
import { SvgClose, SvgLogout, SvgSupToken } from "../../../../../assets"
import { NiceButton } from "../../../../Common/Nice/NiceButton"
import { NiceBoxThing } from "../../../../Common/Nice/NiceBoxThing"
import { WeaponSlot } from "../Common/weaponSlot"
import { RepairBlocks } from "../../../../Common/Mech/MechRepairBlocks"
import { useDebounce, useToggle } from "../../../../../hooks"
import { PlayerNameGid } from "../../../../Common/PlayerNameGid"
import { useSupremacy } from "../../../../../containers"

const UserItem = ({ user, remove }: { user: User; remove?: () => void }) => {
    const { getFaction } = useSupremacy()
    const faction = getFaction(user.faction_id)

    const sxProps: SxProps | undefined = useMemo(() => {
        if (!remove) return undefined
        return {
            border: `${faction.palette.primary} 2px solid`,
            backgroundColor: `${faction.palette.primary}30`,
            p: "1rem",
            borderRadius: 0.9,
        }
    }, [remove, faction])
    return (
        <Stack direction="row" spacing=".6rem" alignItems="center" sx={sxProps}>
            <Avatar
                src={faction.logo_url}
                alt={`${user.username}'s Avatar`}
                sx={{
                    height: "2.6rem",
                    width: "2.6rem",
                    borderRadius: 0.8,
                    border: `${faction.palette.primary} 2px solid`,
                    backgroundColor: faction.palette.primary,
                }}
                variant="square"
            />
            <PlayerNameGid
                player={{
                    id: user.id,
                    username: user.username,
                    gid: user.gid,
                    faction_id: "",
                    rank: "NEW_RECRUIT",
                    features: [],
                    role_type: RoleType.player,
                }}
                styledImageTextProps={{ textColor: "#FFFFFF" }}
            />
            {remove && (
                <NiceButton sx={{ p: 0, ml: "1rem" }} onClick={remove}>
                    <SvgClose />
                </NiceButton>
            )}
        </Stack>
    )
}

export const LobbyFormOverview = () => {
    const { factionTheme } = useTheme()
    const { watch, setValue, getValues } = useFormContext()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const [userDropdown, setUserDropdown] = useState<User[]>([])
    const [isLoadingUsers, toggleIsLoadingUsers] = useToggle()
    const [selectedUsers, setSelectedUsers] = useState<User[]>([])
    const [searchText, setSearchText] = useState("")
    const [search, setSearch] = useDebounce("", 300)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    const {
        name,
        accessibility,
        game_map_id,
        max_deploy_number,
        scheduling_type,
        entry_fee,
        first_faction_cut,
        second_faction_cut,
        extra_reward,
        selected_mechs,
        wont_start_until_date,
        wont_start_until_time,
    } = watch()

    const removeSelectedMech = useCallback(
        (lobbyMechID: string) =>
            setValue(
                "selected_mechs",
                [...selected_mechs].filter((sm) => sm.id !== lobbyMechID),
            ),
        [setValue, selected_mechs],
    )

    const accessCode = useMemo(() => {
        let code = ""
        if (accessibility === Accessibility.Private) code = shortCodeGenerator(10, false, true, false)

        return code
    }, [accessibility])
    const [isCopied, setIsCopied] = useState(false)

    // When searching for player, update the dropdown list
    useEffect(() => {
        if (search === "") return
        ;(async () => {
            toggleIsLoadingUsers(true)
            try {
                const resp = await send<User[], { search: string; excluded_player_ids: string[] }>(GameServerKeys.GetPlayerFriends, {
                    search: search,
                    excluded_player_ids: selectedUsers.map((su) => su.id),
                })

                setUserDropdown(resp || [])
            } catch (e) {
                console.log(e)
            } finally {
                toggleIsLoadingUsers(false)
            }
        })()
    }, [search, send, toggleIsLoadingUsers, selectedUsers])

    const [gameMaps, setGameMaps] = useState<GameMap[]>([])
    useGameServerSubscriptionSecured<GameMap[]>(
        {
            URI: "/game_map_list",
            key: GameServerKeys.SubGameMapList,
        },
        (payload) => {
            if (!payload) return
            setGameMaps(payload)
        },
    )

    const mapName = useMemo(() => gameMaps.find((gm) => gm.id === game_map_id)?.name || "Random", [gameMaps, game_map_id])

    const firstFactionCut = useMemo(() => {
        const firstFactionCut = parseFloat(first_faction_cut)
        if (isNaN(firstFactionCut)) return 0
        return Math.floor(firstFactionCut * 100) / 100
    }, [first_faction_cut])

    const secondFactionCut = useMemo(() => {
        const secondFactionCut = parseFloat(second_faction_cut)
        if (isNaN(secondFactionCut)) return 0
        return Math.floor(secondFactionCut * 100) / 100
    }, [second_faction_cut])

    const losingFactionCut = useMemo(() => 100 - firstFactionCut - secondFactionCut, [firstFactionCut, secondFactionCut])

    const mechSlots = useMemo(() => {
        const list: JSX.Element[] = []
        selected_mechs.forEach((sm: NewMechStruct) => {
            const rarity = getRarityDeets(sm.tier)
            list.push(
                <NiceBoxThing key={sm.id} border={{ color: `${factionTheme.primary}80`, thickness: "very-lean" }} sx={{ flex: 1, height: "20rem" }}>
                    <Stack sx={{ height: "100%", width: "100%", p: ".5rem" }} spacing={1}>
                        <Stack direction="row" justifyContent="flex-start">
                            <Stack direction="row" spacing={1} flex={1}>
                                <NiceBoxThing
                                    key={sm.id}
                                    border={{ color: `${factionTheme.primary}80`, thickness: "very-lean" }}
                                    caret={{ position: "bottom-right", size: "small" }}
                                    sx={{ height: "6rem", width: "6rem", boxShadow: 0.4 }}
                                >
                                    <Box
                                        component="img"
                                        src={sm.avatar_url}
                                        sx={{
                                            height: "100%",
                                            width: "100%",
                                            objectFit: "cover",
                                            objectPosition: "center",
                                        }}
                                    />
                                </NiceBoxThing>

                                <Stack direction="column" flex={1}>
                                    <Typography>{sm.name || sm.label}</Typography>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            fontFamily: fonts.nostromoHeavy,
                                            color: rarity.color,
                                        }}
                                    >
                                        {rarity.label}
                                    </Typography>
                                    <RepairBlocks
                                        defaultBlocks={sm.repair_blocks}
                                        remainDamagedBlocks={sm.damaged_blocks}
                                        sx={{
                                            width: "fit-content",
                                        }}
                                    />
                                </Stack>
                            </Stack>

                            <Box>
                                <NiceButton sx={{ p: 0 }} onClick={() => removeSelectedMech(sm.id)}>
                                    <SvgLogout size="1.5rem" />
                                </NiceButton>
                            </Box>
                        </Stack>

                        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                            {sm.weapon_slots &&
                                sm.weapon_slots.map((ws) => <WeaponSlot key={ws.slot_number} weaponSlot={ws} tooltipPlacement="top-start" size="4.5rem" />)}
                        </Stack>
                    </Stack>
                </NiceBoxThing>,
            )
        })

        while (list.length < 3) {
            list.push(
                <NiceBoxThing
                    key={list.length}
                    border={{ color: `${factionTheme.primary}80`, thickness: "very-lean" }}
                    sx={{ flex: 1, height: "20rem", boxShadow: 0.4 }}
                />,
            )
        }

        return list
    }, [factionTheme.primary, removeSelectedMech, selected_mechs])

    const onCreate = useCallback(async () => {
        const data = getValues() as LobbyForm

        // build payload
        const payload = {
            name: data.name,
            accessibility: data.accessibility,
            access_code: data.accessibility === Accessibility.Private ? accessCode : undefined,
            entry_fee: data.entry_fee,
            first_faction_cut: data.first_faction_cut,
            second_faction_cut: data.second_faction_cut,
            game_map_id: data.game_map_id || undefined,
            scheduling_type: data.scheduling_type,
            wont_start_until:
                data.scheduling_type === Scheduling.SetTime ? combineDateTime(data.wont_start_until_date, data.wont_start_until_time).toDate() : undefined,
            max_deploy_number: data.max_deploy_number,
            extra_reward: data.extra_reward,
            mech_ids: data.selected_mechs.map((sm) => sm.id),
            invited_user_ids: selectedUsers.map((su) => su.id),
        }

        try {
            setIsLoading(true)
            await send<boolean>(GameServerKeys.CreateBattleLobby, payload)
        } catch (err) {
            const message = typeof err === "string" ? err : "Failed to insert into repair bay."
            setError(message)
        } finally {
            setIsLoading(false)
        }
    }, [accessCode, getValues, selectedUsers, send])

    return (
        <Stack
            sx={{
                width: "80rem",
                p: "4rem",
                backgroundColor: `${factionTheme.primary}10`,
            }}
        >
            <Stack flex={1} spacing={3}>
                <Stack direction="row" justifyContent="space-between">
                    <Stack direction="column">
                        <Typography variant="body2" fontFamily={fonts.nostromoHeavy} sx={{ color: `${factionTheme.primary}` }}>
                            Lobby Overview
                        </Typography>
                        <Typography variant="h5" fontFamily={fonts.nostromoBlack} sx={{ opacity: name ? 1 : 0.5 }}>
                            {name ? name : "Lobby Name"}
                        </Typography>
                    </Stack>

                    {accessibility === Accessibility.Private && (
                        <Stack
                            direction="row"
                            alignItems="center"
                            sx={{
                                pt: "0,4rem",
                                pl: "3.5rem",
                                opacity: 1,
                                width: "30rem",
                            }}
                        >
                            <Stack
                                direction="row"
                                alignItems="center"
                                flex={1}
                                sx={{
                                    height: "4rem",
                                    pl: "1.5rem",
                                    borderTop: `${factionTheme.primary} 2px dashed`,
                                    borderLeft: `${factionTheme.primary} 2px dashed`,
                                    borderBottom: `${factionTheme.primary} 2px dashed`,
                                }}
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    if (isCopied || !accessCode) return
                                }}
                            >
                                <Typography variant="subtitle1" fontFamily={fonts.nostromoHeavy}>
                                    {accessCode}
                                </Typography>
                            </Stack>
                            <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="center"
                                sx={{
                                    px: "1rem",
                                    height: "4rem",
                                    backgroundColor: factionTheme.primary,
                                    minWidth: "9.5rem",
                                    cursor: "pointer",
                                }}
                                onClick={async (e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    if (isCopied || !accessCode) return
                                    await navigator.clipboard.writeText(accessCode)
                                    setIsCopied(true)
                                    setTimeout(() => setIsCopied(false), 1000)
                                }}
                            >
                                <Typography variant="body2" fontFamily={fonts.nostromoBlack}>
                                    {isCopied ? "COPIED" : "COPY"}
                                </Typography>
                            </Stack>
                        </Stack>
                    )}
                </Stack>

                <Stack direction="column">
                    <OverviewField label="Type" value={accessibility} />
                    <OverviewField label="Map" value={camelToTitle(mapName)} />
                    <OverviewField label="Max War machine Deploy" value={max_deploy_number} />
                    <OverviewField
                        label="Scheduled"
                        value={
                            scheduling_type === Scheduling.OnReady
                                ? "None"
                                : `${wont_start_until_time.format("HH:mm A")}, ${wont_start_until_date.format("YY/MM/DD")}`
                        }
                    />
                </Stack>

                <Stack direction="column">
                    <OverviewField label="Entry Fee" preIcon={<SvgSupToken fill={colors.gold} />} value={entry_fee} />
                    <OverviewField label="Extra Reward" preIcon={<SvgSupToken fill={colors.gold} />} value={extra_reward} />
                    <OverviewField label="Winning Faction Cut" value={`${firstFactionCut}%`} />
                    <OverviewField label="Second Place Faction Cut" value={`${secondFactionCut}%`} />
                    <OverviewField label="Losing Faction Cut" value={`${losingFactionCut}%`} />
                </Stack>

                <Stack direction="column">
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="h6" fontFamily={fonts.shareTechMono} sx={{ color: `${factionTheme.primary}CC` }}>
                            <strong>War Machines Slots:</strong>
                        </Typography>
                        <Typography variant="body2" sx={{ color: `${factionTheme.primary}CC` }}>
                            Select your War Machines in stop 3.
                        </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                        {mechSlots}
                    </Stack>
                </Stack>

                <Stack direction="column">
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="h6" fontFamily={fonts.shareTechMono} sx={{ color: `${factionTheme.primary}CC` }}>
                            <strong>Invite Friends To Lobby:</strong>
                        </Typography>
                        <Typography variant="body2" sx={{ color: `${factionTheme.primary}CC` }}>
                            Send invites to join your lobby.
                        </Typography>
                    </Stack>
                    <Autocomplete
                        options={userDropdown}
                        loading={isLoadingUsers}
                        sx={{
                            ".MuiAutocomplete-endAdornment": {
                                top: "calc(50% - 9px)",
                            },
                        }}
                        disablePortal
                        onChange={(e, value) => {
                            setSelectedUsers((prev) => prev.concat(value as User))
                        }}
                        renderOption={(props, u) => (
                            <Box key={u.id} component="li" {...props}>
                                <UserItem user={u} />
                            </Box>
                        )}
                        disableClearable
                        getOptionLabel={() => ""}
                        noOptionsText={<Typography sx={{ opacity: 0.6 }}>Start typing a username...</Typography>}
                        filterOptions={(option) => option}
                        renderInput={(params) => (
                            <TextField
                                value={searchText}
                                placeholder="Search for username..."
                                onChange={(e) => {
                                    setSearchText(e.currentTarget.value)
                                    setSearch(e.currentTarget.value)
                                }}
                                type="text"
                                hiddenLabel
                                sx={{
                                    borderRadius: 1,
                                    "& .MuiInputBase-root": {
                                        py: 0,
                                        fontFamily: fonts.rajdhaniMedium,
                                    },
                                    ".Mui-disabled": {
                                        WebkitTextFillColor: "unset",
                                        color: "#FFFFFF70",
                                    },
                                    ".Mui-focused .MuiOutlinedInput-notchedOutline": {
                                        borderColor: `${factionTheme.primary} !important`,
                                    },
                                    input: {
                                        color: "#FFFFFF",
                                    },
                                }}
                                {...params}
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <>
                                            {isLoadingUsers ? <CircularProgress size="1.2rem" sx={{ color: colors.neonBlue }} /> : null}
                                            {params.InputProps.endAdornment}
                                        </>
                                    ),
                                }}
                            />
                        )}
                    />

                    <Stack direction="row" sx={{ flexWrap: "wrap", py: "1rem" }} spacing={1}>
                        {selectedUsers.map((su) => (
                            <NiceBoxThing key={su.id}>
                                <UserItem user={su} remove={() => setSelectedUsers((prev) => prev.filter((p) => p.id !== su.id))} />
                            </NiceBoxThing>
                        ))}
                    </Stack>
                </Stack>
            </Stack>

            <Stack direction="row" alignItems="center" justifyContent="center">
                <NiceButton
                    buttonColor={factionTheme.primary}
                    sx={{
                        px: "4rem",
                        py: "1.5rem",
                    }}
                    onClick={onCreate}
                >
                    Create Lobby
                </NiceButton>
            </Stack>
        </Stack>
    )
}

interface OverviewFieldProps {
    label: string
    value?: ReactNode
    preIcon?: JSX.Element
}
const OverviewField = ({ label, value, preIcon }: OverviewFieldProps) => {
    const { factionTheme } = useTheme()
    return (
        <Stack direction="row" spacing="1rem">
            <Typography variant="body1" fontFamily={fonts.shareTechMono} sx={{ color: `${factionTheme.primary}CC` }}>
                <strong>{label}:</strong>
            </Typography>
            {preIcon}
            <Typography variant="h6" fontFamily={fonts.rajdhaniMedium}>
                <strong>{value}</strong>
            </Typography>
        </Stack>
    )
}
