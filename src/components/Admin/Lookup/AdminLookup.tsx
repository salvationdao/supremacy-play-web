import { Autocomplete, Box, CircularProgress, Stack, TextField, Typography } from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import { Link, useHistory } from "react-router-dom"
import { ClipThing } from "../.."
import { HangarBg } from "../../../assets"
import { useGlobalNotifications, useSupremacy } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { useDebounce, useToggle } from "../../../hooks"
import { useGameServerCommandsFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts, siteZIndex } from "../../../theme/theme"
import { User } from "../../../types"
import { PlayerNameGid } from "../../Common/PlayerNameGid"

export const AdminLookup = () => {
    const theme = useTheme()
    const { getFaction } = useSupremacy()
    const [lastLookupPlayer, setLastLookupPlayer] = useState<User>()

    useEffect(() => {
        const toParse = localStorage.getItem("lastLookupPlayer")
        if (!toParse) return
        try {
            const p = JSON.parse(toParse) as User
            setLastLookupPlayer(p)
        } catch (e) {
            console.error(e)
        }
    }, [])

    return (
        <Box
            alignItems="center"
            sx={{
                height: "100%",
                p: "1rem",
                zIndex: siteZIndex.RoutePage,
                backgroundImage: `url(${HangarBg})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
            }}
        >
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
                    <LookupSearchBox />
                    {lastLookupPlayer &&
                        (() => {
                            const faction = getFaction(lastLookupPlayer.faction_id)
                            return (
                                <Stack mt="1rem">
                                    <Typography
                                        sx={{
                                            color: colors.grey,
                                        }}
                                    >
                                        Previously Viewed:
                                    </Typography>
                                    <Link to={`/admin/lookup/${lastLookupPlayer.gid}`}>
                                        <Stack
                                            direction="row"
                                            alignItems="center"
                                            justifyContent="space-between"
                                            p="1rem"
                                            sx={{
                                                borderRadius: "2px",
                                                backgroundColor: `${faction.primary_color}33`,
                                            }}
                                        >
                                            <Stack direction="row">
                                                <Box
                                                    sx={{
                                                        alignSelf: "flex-start",
                                                        flexShrink: 0,
                                                        width: "2rem",
                                                        height: "2rem",
                                                        background: `url(${faction.logo_url})`,
                                                        backgroundColor: faction.background_color,
                                                        backgroundRepeat: "no-repeat",
                                                        backgroundPosition: "center",
                                                        backgroundSize: "contain",
                                                    }}
                                                />
                                                <Typography
                                                    sx={{ ml: "0.3rem", fontWeight: "700", userSelect: "none" }}
                                                >{`${lastLookupPlayer.username} #${lastLookupPlayer.gid}`}</Typography>
                                            </Stack>
                                        </Stack>
                                    </Link>
                                </Stack>
                            )
                        })()}
                </Box>
            </ClipThing>
        </Box>
    )
}

export const LookupSearchBox = () => {
    const history = useHistory()

    const { send } = useGameServerCommandsFaction("/faction_commander")
    const { newSnackbarMessage } = useGlobalNotifications()

    // Items
    const [userDropdown, setUserDropdown] = useState<User[]>([])
    const [isLoadingUsers, toggleIsLoadingUsers] = useToggle()
    const [searchValue, setSearchValue] = useDebounce("", 300)

    const searchPlayer = useCallback(async () => {
        if (searchValue === "") return

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
    }, [newSnackbarMessage, searchValue, send, toggleIsLoadingUsers])

    // When searching for player, update the dropdown list
    useEffect(() => {
        searchPlayer()
    }, [searchPlayer])

    return (
        <>
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
                onChange={(_e, value) => {
                    if (!value?.gid) return

                    history.push(`/admin/lookup/${value?.gid}`)
                }}
                renderOption={(props, u) => (
                    <Stack component="li" direction="row" spacing=".6rem" alignItems="center" {...props}>
                        <PlayerNameGid player={u} styledImageTextProps={{ textColor: "#FFFFFF" }} />
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
        </>
    )
}
