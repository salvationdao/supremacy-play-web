import { Autocomplete, Box, CircularProgress, Fade, Stack, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { UseFormReturn } from "react-hook-form"
import { SvgClose2 } from "../../../assets"
import { useSupremacy } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { useDebounce } from "../../../hooks"
import { useGameServerCommandsFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { fonts } from "../../../theme/theme"
import { RoleType, User } from "../../../types"
import { NiceBoxThing } from "../../Common/Nice/NiceBoxThing"
import { NiceButton } from "../../Common/Nice/NiceButton"
import { PlayerNameGid } from "../../Common/PlayerNameGid"
import { CreateLobbyFormFields } from "./CreateLobbyFormModal"

export const InviteFriends = ({ formMethods }: { formMethods: UseFormReturn<CreateLobbyFormFields, unknown> }) => {
    const theme = useTheme()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const [userDropdown, setUserDropdown] = useState<User[]>([])
    const [isLoadingUsers, setIsLoadingUsers] = useState(false)
    const [selectedUsers, setSelectedUsers] = useState<User[]>([])
    const [searchText, setSearchText] = useState("")
    const [search, setSearch] = useDebounce("", 300)

    // When searching for player, update the dropdown list
    useEffect(() => {
        if (search === "") return
        ;(async () => {
            setIsLoadingUsers(true)
            try {
                const resp = await send<User[], { search: string; excluded_player_ids: string[] }>(GameServerKeys.GetPlayerFriends, {
                    search: search,
                    excluded_player_ids: selectedUsers.map((su) => su.id),
                })

                setUserDropdown(resp || [])
            } catch (e) {
                console.log(e)
            } finally {
                setIsLoadingUsers(false)
            }
        })()
    }, [search, send, setIsLoadingUsers, selectedUsers])

    return (
        <Fade in>
            <Stack>
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
                                    borderColor: `${theme.factionTheme.primary} !important`,
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
                                        {isLoadingUsers ? <CircularProgress size="1.2rem" /> : null}
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
        </Fade>
    )
}

const UserItem = ({ user, remove }: { user: User; remove?: () => void }) => {
    const { getFaction } = useSupremacy()
    const faction = getFaction(user.faction_id)

    return (
        <Stack
            direction="row"
            spacing=".6rem"
            alignItems="center"
            sx={
                !remove
                    ? undefined
                    : {
                          border: `${faction.palette.primary} 2px solid`,
                          backgroundColor: `${faction.palette.primary}30`,
                          p: "1rem",
                          borderRadius: 0.9,
                      }
            }
        >
            <Box
                sx={{
                    height: "2.6rem",
                    width: "2.6rem",
                    background: `url(${faction.logo_url})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "contain",
                }}
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
                    <SvgClose2 />
                </NiceButton>
            )}
        </Stack>
    )
}
