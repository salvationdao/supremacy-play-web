import { Autocomplete, Box, CircularProgress, Stack, TextField, Typography } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { ClipThing } from "../.."
import { useGlobalNotifications } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { useDebounce, useToggle, useUrlQuery } from "../../../hooks"
import { useGameServerCommandsFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { parseString } from "../../../helpers"
import { User } from "../../../types"
import { SxProps } from "@mui/system"
import { Player } from "../../Common/Player"
import { PlayerProfile } from "./PlayerProfile"

export const AdminLookup = () => {
    const theme = useTheme()
    const [query, updateQuery] = useUrlQuery()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const { newSnackbarMessage } = useGlobalNotifications()
    const [selectedGID, setSelectedGID] = useState(parseString(query.get("selectedGID"), -1))
    // Items
    const [userDropdown, setUserDropdown] = useState<User[]>([])
    const [selectedUser, setSelectedUser] = useState<User | null | undefined>()
    const [isLoadingUsers, toggleIsLoadingUsers] = useToggle()
    const [searchValue, setSearchValue] = useDebounce("", 300)

    useEffect(() => {
        updateQuery({
            selectedGID: selectedGID > 0 ? `${selectedGID}` : "",
        })
    }, [selectedGID, updateQuery])

    // When searching for player, update the dropdown list
    useEffect(() => {
        if (searchValue === "") return
        ;(async () => {
            toggleIsLoadingUsers(true)
            try {
                const resp = await send<User[], { search: string }>(GameServerKeys.GetPlayerList, {
                    search: searchValue || "",
                })

                if (!resp) return
                setUserDropdown(resp)
            } catch (e) {
                newSnackbarMessage(typeof e === "string" ? e : "Failed to load ban options.", "error")
            } finally {
                toggleIsLoadingUsers(false)
            }
        })()
    }, [searchValue, send, toggleIsLoadingUsers, newSnackbarMessage, userDropdown])

    const content = useMemo(() => {
        if (selectedGID > 0) {
            return <PlayerProfile gid={selectedGID} updateQuery={updateQuery} />
        }

        return (
            <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", maxWidth: "100rem", width: "100%" }}>
                    <Typography
                        sx={{
                            px: "1.28rem",
                            pt: "1.28rem",
                            fontFamily: fonts.nostromoBold,
                        }}
                    >
                        Search Player:
                    </Typography>

                    <Autocomplete
                        options={userDropdown}
                        loading={isLoadingUsers}
                        sx={{
                            ".MuiAutocomplete-endAdornment": {
                                top: "calc(50% - 9px)",
                            },
                            width: "100%",
                        }}
                        disablePortal
                        value={selectedUser}
                        onChange={(e, value) => setSelectedUser(value)}
                        renderOption={(props, u) => (
                            <Box
                                key={u.id}
                                component="li"
                                {...props}
                                onClick={() => {
                                    setSelectedGID(u.gid)
                                }}
                            >
                                <UserItem user={u} />
                            </Box>
                        )}
                        getOptionLabel={(u) => `${u.username}#${u.gid}`}
                        noOptionsText={
                            <Typography sx={{ opacity: 0.6 }}>
                                <i>Start typing a username or gid...</i>
                            </Typography>
                        }
                        filterOptions={(option) => option}
                        renderInput={(params) => (
                            <TextField
                                value={searchValue}
                                placeholder="Search for username..."
                                onChange={(e) => {
                                    setSearchValue(e.currentTarget.value)
                                }}
                                type="text"
                                hiddenLabel
                                sx={{
                                    borderRadius: 1,
                                    "& .MuiInputBase-root": {
                                        py: 0,
                                        fontFamily: fonts.shareTech,
                                    },
                                    ".Mui-disabled": {
                                        WebkitTextFillColor: "unset",
                                        color: "#FFFFFF70",
                                    },
                                    width: "100%",
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
                </Stack>
            </Stack>
        )
    }, [selectedGID, userDropdown, isLoadingUsers, selectedUser, updateQuery, searchValue, setSearchValue])

    const UserItem = ({ user, sx }: { user: User; sx?: SxProps }) => {
        return (
            <Stack direction="row" spacing=".6rem" alignItems="center" sx={sx}>
                <Player player={user} styledImageTextProps={{ textColor: "#FFFFFF" }} />
            </Stack>
        )
    }

    return (
        <ClipThing
            clipSize="10px"
            border={{
                borderColor: theme.factionTheme.primary,
                borderThickness: ".3rem",
            }}
            corners={{
                topRight: true,
                bottomLeft: true,
                bottomRight: true,
            }}
            opacity={0.9}
            backgroundColor={theme.factionTheme.background}
            sx={{ height: "100%" }}
        >
            <Stack sx={{ position: "relative", height: "100%" }}>
                <Stack sx={{ flex: 1 }}>
                    <Stack sx={{ px: "1rem", py: "1rem", flex: 1 }}>
                        <Box
                            sx={{
                                flex: 1,
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
                                    background: theme.factionTheme.primary,
                                    borderRadius: 3,
                                },
                            }}
                        >
                            {content}
                        </Box>
                    </Stack>
                </Stack>
            </Stack>
        </ClipThing>
    )
}
