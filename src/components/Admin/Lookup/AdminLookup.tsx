import { Autocomplete, Box, CircularProgress, Stack, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useHistory, useRouteMatch } from "react-router-dom"
import { ClipThing } from "../.."
import { useGlobalNotifications } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { useDebounce, useToggle } from "../../../hooks"
import { useGameServerCommandsFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { User } from "../../../types"
import { Player } from "../../Common/Player"

export const AdminLookup = () => {
    const theme = useTheme()
    const history = useHistory()
    const { url } = useRouteMatch()

    const { send } = useGameServerCommandsFaction("/faction_commander")
    const { newSnackbarMessage } = useGlobalNotifications()

    // Items
    const [userDropdown, setUserDropdown] = useState<User[]>([])
    const [isLoadingUsers, toggleIsLoadingUsers] = useToggle()
    const [searchValue, setSearchValue] = useDebounce("", 300)

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
            contentSx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    maxWidth: "300px",
                    p: "1rem",
                }}
            >
                <Typography
                    sx={{
                        fontFamily: fonts.nostromoBold,
                    }}
                >
                    Search Player:
                </Typography>

                <Autocomplete
                    fullWidth
                    options={userDropdown}
                    loading={isLoadingUsers}
                    sx={{
                        ".MuiAutocomplete-endAdornment": {
                            top: "calc(50% - 9px)",
                        },
                    }}
                    disablePortal
                    onChange={(_e, value) => history.push(`${url}/${value?.gid}`)}
                    renderOption={(props, u) => (
                        <Stack component="li" direction="row" spacing=".6rem" alignItems="center" {...props}>
                            <Player player={u} styledImageTextProps={{ textColor: "#FFFFFF" }} />
                        </Stack>
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
            </Box>
        </ClipThing>
    )
}
