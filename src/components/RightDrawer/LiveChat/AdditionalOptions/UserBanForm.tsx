import { Autocomplete, Box, CircularProgress, MenuItem, Select, Stack, SxProps, TextField, Typography } from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import { SvgCooldown, SvgSupToken } from "../../../../assets"
import { MAX_BAN_PROPOSAL_REASON_LENGTH } from "../../../../constants"
import { useAuth, useGlobalNotifications } from "../../../../containers"
import { useTheme } from "../../../../containers/theme"
import { snakeToTitle } from "../../../../helpers"
import { useDebounce, useToggle } from "../../../../hooks"
import { useGameServerCommandsFaction } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { colors, fonts, siteZIndex } from "../../../../theme/theme"
import { RoleType } from "../../../../types"
import { BanOption, BanUser } from "../../../../types/chat"
import { NiceButton } from "../../../Common/Nice/NiceButton"
import { NiceModal } from "../../../Common/Nice/NiceModal"
import { NiceTextField } from "../../../Common/Nice/NiceTextField"
import { PlayerNameGid } from "../../../Common/PlayerNameGid"

interface SubmitRequest {
    intend_to_punish_player_id: string
    punish_option_id: string
    reason: string
}

const UserItem = ({ banUser, sx }: { banUser: BanUser; sx?: SxProps }) => {
    return (
        <Stack direction="row" spacing=".6rem" alignItems="center" sx={sx}>
            <PlayerNameGid
                player={{
                    id: banUser.id,
                    username: banUser.username,
                    gid: banUser.gid,
                    faction_id: "",
                    rank: "NEW_RECRUIT",
                    features: [],
                    role_type: RoleType.player,
                }}
            />
        </Stack>
    )
}

export const UserBanForm = ({ open, onClose, prefillUser }: { open: boolean; onClose: () => void; prefillUser?: BanUser }) => {
    const theme = useTheme()
    const { newSnackbarMessage } = useGlobalNotifications()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const { userStat, userRank } = useAuth()
    // Options and display only
    const [searchText, setSearchText] = useState(prefillUser ? `${prefillUser.username}#${prefillUser.gid}` : "")
    const [search, setSearch] = useDebounce(prefillUser ? `${prefillUser.username}#${prefillUser.gid}` : "", 300)
    const [isLoadingUsers, toggleIsLoadingUsers] = useToggle()
    const [userDropdown, setUserDropdown] = useState<BanUser[]>([])
    const [banOptions, setBanOptions] = useState<BanOption[]>([])
    const [fee, setFee] = useState("")
    const [error, setError] = useState("")
    // Inputs
    const [selectedUser, setSelectedUser] = useState<BanUser | null | undefined>(prefillUser)
    const [selectedBanOptionID, setSelectedBanOptionID] = useState("")
    const [reason, setReason] = useState("")

    const primaryColor = theme.factionTheme.primary
    const secondaryColor = theme.factionTheme.text

    // Load the ban options
    useEffect(() => {
        ;(async () => {
            try {
                const resp = await send<BanOption[], null>(GameServerKeys.GetBanOptions, null)

                if (!resp) return
                setBanOptions(resp)
            } catch (e) {
                newSnackbarMessage(typeof e === "string" ? e : "Failed to load ban options.", "error")
            }
        })()
    }, [newSnackbarMessage, send])

    // When searching for player, update the dropdown list
    useEffect(() => {
        if (search === "") return
        ;(async () => {
            toggleIsLoadingUsers(true)
            try {
                const resp = await send<BanUser[], { search: string }>(GameServerKeys.GetPlayerListFaction, {
                    search: search || "",
                })

                if (!resp) return
                setUserDropdown(resp)
            } catch (e) {
                newSnackbarMessage(typeof e === "string" ? e : "Failed to load ban options.", "error")
            } finally {
                toggleIsLoadingUsers(false)
            }
        })()
    }, [search, send, toggleIsLoadingUsers, newSnackbarMessage])

    // When a player is selected, get the ban fee for that player
    useEffect(() => {
        ;(async () => {
            try {
                if (!selectedUser) return
                const resp = await send<string, { intend_to_punish_player_id: string }>(GameServerKeys.GetBanPlayerCost, {
                    intend_to_punish_player_id: selectedUser.id,
                })

                if (!resp) return
                setFee(resp)
            } catch (e) {
                newSnackbarMessage(typeof e === "string" ? e : "Failed to load users from search.", "error")
            }
        })()
    }, [newSnackbarMessage, selectedUser, send])

    // Submit the ban proposal
    const onSubmit = useCallback(async () => {
        try {
            if (!selectedUser || !selectedBanOptionID || !reason) throw new Error()
            const resp = await send<boolean, SubmitRequest>(GameServerKeys.SubmitBanProposal, {
                intend_to_punish_player_id: selectedUser.id,
                punish_option_id: selectedBanOptionID,
                reason,
            })

            if (!resp) return
            onClose()
            setError("")
            newSnackbarMessage("Successfully submitted proposal.", "success")
        } catch (e) {
            setError(typeof e === "string" ? e : "Failed to submit proposal.")
        }
    }, [selectedUser, selectedBanOptionID, reason, send, onClose, newSnackbarMessage])

    const isDisabled =
        !selectedUser || !selectedBanOptionID || !reason || (userStat.last_seven_days_kills < 5 && userStat.ability_kill_count < 100 && userRank !== "GENERAL")

    return (
        <NiceModal open={open} onClose={onClose} sx={{ width: "42rem" }}>
            <Stack
                sx={{
                    px: "2.2rem",
                    py: "2.1rem",
                    ".MuiAutocomplete-popper": {
                        zIndex: siteZIndex.Modal,
                        ".MuiPaper-root": {
                            background: "none",
                            backgroundColor: colors.darkerNeonBlue,
                            zIndex: siteZIndex.Modal,
                        },
                    },
                }}
            >
                <Typography sx={{ mb: "1.2rem", fontFamily: fonts.nostromoBlack }}>PROPOSE TO PUNISH A PLAYER</Typography>

                <Autocomplete
                    options={userDropdown}
                    loading={isLoadingUsers}
                    sx={{
                        ".MuiAutocomplete-endAdornment": {
                            top: "calc(50% - 9px)",
                        },
                    }}
                    disablePortal
                    value={selectedUser}
                    onChange={(e, value) => setSelectedUser(value)}
                    renderOption={(props, u) => (
                        <Box key={u.id} component="li" {...props}>
                            <UserItem banUser={u} />
                        </Box>
                    )}
                    getOptionLabel={(u) => `${u.username}#${u.gid}`}
                    noOptionsText={
                        <Typography sx={{ opacity: 0.6 }}>
                            <i>Start typing a username...</i>
                        </Typography>
                    }
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
                                    borderColor: `${primaryColor} !important`,
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

                <Stack spacing="1.5rem" sx={{ mt: "1.6rem" }}>
                    <Stack spacing=".1rem">
                        <Typography sx={{ color: primaryColor, fontWeight: "bold" }}>USER:</Typography>
                        {selectedUser ? (
                            <UserItem banUser={selectedUser} sx={{ pl: ".2rem" }} />
                        ) : (
                            <Typography sx={{ opacity: 0.6 }}>
                                <i>Use the search box to find a user...</i>
                            </Typography>
                        )}
                    </Stack>

                    <Stack
                        spacing=".3rem"
                        sx={{
                            pb: ".4rem",
                            ".Mui-focused .MuiOutlinedInput-notchedOutline": {
                                borderColor: `${primaryColor} !important`,
                            },
                        }}
                    >
                        <Typography sx={{ color: primaryColor, fontWeight: "bold" }}>BAN OPTION:</Typography>

                        <Select
                            displayEmpty
                            sx={{
                                borderRadius: 0.7,
                                "&:hover": {
                                    backgroundColor: colors.darkNavy,
                                },
                                "& .MuiSelect-outlined": { px: "1.6rem", py: ".5rem" },
                            }}
                            value={selectedBanOptionID}
                            MenuProps={{
                                variant: "menu",
                                sx: {
                                    "&& .Mui-selected": {
                                        ".MuiTypography-root": {
                                            color: secondaryColor,
                                        },
                                        backgroundColor: primaryColor,
                                    },
                                },
                                PaperProps: {
                                    sx: {
                                        background: "none",
                                        backgroundColor: colors.darkerNeonBlue,
                                        borderRadius: 0.5,
                                    },
                                },
                            }}
                        >
                            {banOptions.map((x) => {
                                return (
                                    <MenuItem
                                        key={`ban-reason-${x.id}`}
                                        value={x.id}
                                        onClick={() => setSelectedBanOptionID(x.id)}
                                        sx={{ "&:hover": { backgroundColor: "#FFFFFF20" } }}
                                    >
                                        <Stack direction="row" spacing="1rem" justifyContent="space-between" sx={{ flex: 1 }}>
                                            <Typography>{snakeToTitle(x.key)}</Typography>
                                            <Stack spacing=".24rem" direction="row" alignItems="center" justifyContent="center">
                                                <SvgCooldown component="span" size="1.5rem" sx={{ pb: ".25rem" }} />
                                                <Typography>{x.punish_duration_hours} mins</Typography>
                                            </Stack>
                                        </Stack>
                                    </MenuItem>
                                )
                            })}
                        </Select>
                    </Stack>

                    <Stack spacing=".3rem">
                        <Typography sx={{ color: primaryColor, fontWeight: "bold" }}>REASON:</Typography>

                        <NiceTextField
                            value={reason}
                            placeholder="Type the reason to punish the user..."
                            multiline
                            maxRows={2}
                            onChange={(value) => {
                                if (value.length <= MAX_BAN_PROPOSAL_REASON_LENGTH) setReason(value)
                            }}
                        />
                    </Stack>

                    <Stack direction="row" spacing=".4rem">
                        <Typography sx={{ color: primaryColor, fontWeight: "bold" }}>FEE:</Typography>
                        <Typography>
                            <SvgSupToken inline size="1.4rem" fill={colors.yellow} />
                            {fee || "---"}
                        </Typography>
                    </Stack>
                </Stack>

                <NiceButton buttonColor={primaryColor} onClick={onSubmit} disabled={isDisabled}>
                    <Typography
                        variant="caption"
                        sx={{
                            color: secondaryColor,
                            fontFamily: fonts.nostromoBlack,
                        }}
                    >
                        SUBMIT
                    </Typography>
                </NiceButton>

                {userStat.last_seven_days_kills < 5 && userStat.ability_kill_count < 100 && (
                    <Typography variant="body2" sx={{ mt: "1rem", opacity: 0.6, lineHeight: 1.2 }}>
                        <i>You need at least 100 ability kills OR 5 ability kills in the past 7 days to issue a punish proposal.</i>
                    </Typography>
                )}

                {error && (
                    <Typography variant="body2" sx={{ mt: ".3rem", color: colors.red }}>
                        {error}
                    </Typography>
                )}
            </Stack>
        </NiceModal>
    )
}
