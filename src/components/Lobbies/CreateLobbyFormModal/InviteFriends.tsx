import { Autocomplete, Box, CircularProgress, Fade, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { UseFormReturn } from "react-hook-form"
import { SvgClose2 } from "../../../assets"
import { useSupremacy } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { useDebounce } from "../../../hooks"
import { useGameServerCommandsFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { RoleType, User } from "../../../types"
import { NiceBoxThing } from "../../Common/Nice/NiceBoxThing"
import { NiceButton } from "../../Common/Nice/NiceButton"
import { NiceTextField } from "../../Common/Nice/NiceTextField"
import { PlayerNameGid } from "../../Common/PlayerNameGid"
import { CreateLobbyFormFields } from "./CreateLobbyFormModal"

export const InviteFriends = ({ formMethods }: { formMethods: UseFormReturn<CreateLobbyFormFields, unknown> }) => {
    const theme = useTheme()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const [userDropdown, setUserDropdown] = useState<User[]>([])
    const [isLoadingUsers, setIsLoadingUsers] = useState(false)
    const [selectedUsers, setSelectedUsers] = useState<User[]>([])
    const [search, setSearch, searchInstant] = useDebounce("", 300)

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
            } catch (err) {
                console.log(err)
            } finally {
                setIsLoadingUsers(false)
            }
        })()
    }, [search, send, setIsLoadingUsers, selectedUsers])

    return (
        <Fade in>
            <Stack spacing="2rem">
                <Typography variant="h4">Invite friends to join the battle</Typography>

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
                    renderInput={({ InputProps, ...params }) => (
                        <NiceTextField
                            primaryColor={theme.factionTheme.primary}
                            value={searchInstant}
                            placeholder="Search for username..."
                            onChange={(value) => {
                                setSearch(value)
                            }}
                            InputProps={{
                                ...InputProps,
                                endAdornment: (
                                    <>
                                        {isLoadingUsers ? <CircularProgress size="1.2rem" /> : null}
                                        {InputProps.endAdornment}
                                    </>
                                ),
                            }}
                            sx={{ py: 0 }}
                            {...params}
                        />
                    )}
                />

                <Stack direction="row" sx={{ flexWrap: "wrap" }}>
                    {selectedUsers.map((su) => (
                        <NiceBoxThing key={su.id} sx={{ p: ".3rem" }}>
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
                          p: "1rem 1.2rem",
                          border: `${faction.palette.primary}60 1px solid`,
                          backgroundColor: `${faction.palette.primary}20`,
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
                <NiceButton sx={{ p: 0 }} onClick={remove}>
                    <SvgClose2 sx={{ p: 0 }} />
                </NiceButton>
            )}
        </Stack>
    )
}
