import {
    Autocomplete,
    Box,
    Button,
    CircularProgress,
    IconButton,
    MenuItem,
    Modal,
    Select,
    Stack,
    SxProps,
    TextField,
    Typography,
    useTheme,
    Theme,
} from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import { ClipThing } from "../../.."
import { SvgClose, SvgCooldown, SvgSupToken } from "../../../../assets"
import { MAX_BAN_PROPOSAL_REASON_LENGTH, PASSPORT_SERVER_HOST_IMAGES } from "../../../../constants"
import { useGameServerAuth, useGameServerWebsocket, useSnackbar } from "../../../../containers"
import { snakeToTitle } from "../../../../helpers"
import { useDebounce, useToggle } from "../../../../hooks"
import { GameServerKeys } from "../../../../keys"
import { colors, fonts, siteZIndex } from "../../../../theme/theme"
import { BanOption, BanUser } from "../../../../types/chat"
import { User } from "../../../../types"

interface SubmitRequest {
    intend_to_punish_player_id: string
    punish_option_id: string
    reason: string
}

const UserItem = ({ user, banUser, sx }: { user: User; banUser: BanUser; sx?: SxProps }) => {
    return (
        <Stack direction="row" spacing=".6rem" alignItems="center" sx={sx}>
            <Box
                sx={{
                    mt: "-0.1rem !important",
                    width: "1.7rem",
                    height: "1.7rem",
                    flexShrink: 0,
                    backgroundImage: `url(${PASSPORT_SERVER_HOST_IMAGES}/api/files/${user.faction.logo_blob_id})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "contain",
                    backgroundColor: (theme) => theme.factionTheme.primary,
                    borderRadius: 0.8,
                    border: (theme) => `${theme.factionTheme.primary} 1px solid`,
                }}
            />
            <Typography>
                {`${banUser.username}`}
                <span style={{ marginLeft: ".2rem", opacity: 0.7 }}>{`#${banUser.gid}`}</span>
            </Typography>
        </Stack>
    )
}

export const UserBanForm = ({ user, open, onClose, prefillUser }: { user?: User; open: boolean; onClose: () => void; prefillUser?: BanUser }) => {
    const theme = useTheme<Theme>()
    const { newSnackbarMessage } = useSnackbar()
    const { state, send } = useGameServerWebsocket()
    const { userStat } = useGameServerAuth()
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
    const secondaryColor = theme.factionTheme.secondary

    // Load the ban options
    useEffect(() => {
        ;(async () => {
            try {
                if (state !== WebSocket.OPEN) return
                const resp = await send<BanOption[], null>(GameServerKeys.GetBanOptions, null)

                if (resp) setBanOptions(resp)
            } catch (e) {
                newSnackbarMessage(typeof e === "string" ? e : "Failed to load ban options.", "error")
            }
        })()
    }, [newSnackbarMessage, send, state])

    // When searching for player, update the dropdown list
    useEffect(() => {
        ;(async () => {
            toggleIsLoadingUsers(true)
            try {
                if (state !== WebSocket.OPEN) return
                const resp = await send<BanUser[], { search: string }>(GameServerKeys.GetPlayerList, {
                    search: search || "",
                })

                if (resp) setUserDropdown(resp)
            } finally {
                toggleIsLoadingUsers(false)
            }
        })()
    }, [search, send, state, toggleIsLoadingUsers])

    // When a player is selected, get the ban fee for that player
    useEffect(() => {
        ;(async () => {
            try {
                if (state !== WebSocket.OPEN || !selectedUser) return
                const resp = await send<string, { intend_to_punish_player_id: string }>(GameServerKeys.GetBanPlayerCost, {
                    intend_to_punish_player_id: selectedUser.id,
                })

                if (resp) setFee(resp)
            } catch (e) {
                newSnackbarMessage(typeof e === "string" ? e : "Failed to load users from search.", "error")
            }
        })()
    }, [newSnackbarMessage, selectedUser, send, state])

    // Submit the ban proposal
    const onSubmit = useCallback(async () => {
        try {
            if (state !== WebSocket.OPEN || !selectedUser || !selectedBanOptionID || !reason) throw new Error()
            const resp = await send<boolean, SubmitRequest>(GameServerKeys.SubmitBanProposal, {
                intend_to_punish_player_id: selectedUser.id,
                punish_option_id: selectedBanOptionID,
                reason,
            })

            if (resp) {
                onClose()
                setError("")
                newSnackbarMessage("Successfully submitted proposal.", "success")
            }
        } catch (e) {
            setError(typeof e === "string" ? e : "Failed to submit proposal.")
        }
    }, [state, selectedUser, selectedBanOptionID, reason, send, onClose, newSnackbarMessage])

    const isDisabled = !selectedUser || !selectedBanOptionID || !reason || (userStat.last_seven_days_kills < 5 && userStat.ability_kill_count < 100)

    if (!user) return null

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "42rem",
                    boxShadow: 24,
                }}
            >
                <ClipThing
                    clipSize="0"
                    border={{
                        isFancy: true,
                        borderColor: primaryColor,
                        borderThickness: ".15rem",
                    }}
                    sx={{ position: "relative" }}
                    backgroundColor={theme.factionTheme.background}
                >
                    <Stack
                        sx={{
                            px: "2rem",
                            pt: "1.8rem",
                            pb: "2rem",
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
                        <Typography sx={{ mb: ".9rem", fontFamily: fonts.nostromoBlack }}>PROPOSE TO PUNISH A PLAYER</Typography>

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
                                    <UserItem user={user} banUser={u} />
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
                                            fontFamily: fonts.shareTech,
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
                                <Typography sx={{ color: primaryColor, fontWeight: "fontWeightBold" }}>USER:</Typography>
                                {selectedUser ? (
                                    <UserItem user={user} banUser={selectedUser} sx={{ pl: ".2rem" }} />
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
                                <Typography sx={{ color: primaryColor, fontWeight: "fontWeightBold" }}>BAN OPTION:</Typography>
                                <Select
                                    displayEmpty
                                    sx={{
                                        borderRadius: 0.7,
                                        "&:hover": {
                                            backgroundColor: colors.darkNavy,
                                        },
                                        "& .MuiSelect-outlined": { px: "1.6rem", py: ".8rem" },
                                    }}
                                    value={selectedBanOptionID}
                                    MenuProps={{
                                        variant: "menu",
                                        sx: {
                                            "&& .Mui-selected": {
                                                backgroundColor: "#FFFFFF25",
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
                                                sx={{
                                                    "&:hover": {
                                                        backgroundColor: "#FFFFFF15",
                                                    },
                                                }}
                                            >
                                                <Stack direction="row" spacing="1rem" justifyContent="space-between" sx={{ flex: 1 }}>
                                                    <Typography>{snakeToTitle(x.key)}</Typography>
                                                    <Stack spacing=".24rem" direction="row" alignItems="center" justifyContent="center">
                                                        <SvgCooldown component="span" size="1.5rem" sx={{ pb: ".25rem" }} />
                                                        <Typography>{x.punish_duration_hours} Hrs</Typography>
                                                    </Stack>
                                                </Stack>
                                            </MenuItem>
                                        )
                                    })}
                                </Select>
                            </Stack>

                            <Stack spacing=".3rem">
                                <Typography sx={{ color: primaryColor, fontWeight: "fontWeightBold" }}>REASON:</Typography>
                                <TextField
                                    value={reason}
                                    placeholder="Type the reason to punish the user..."
                                    onChange={(e) => {
                                        const m = e.currentTarget.value
                                        if (m.length <= MAX_BAN_PROPOSAL_REASON_LENGTH) setReason(e.currentTarget.value)
                                    }}
                                    type="text"
                                    hiddenLabel
                                    multiline
                                    maxRows={2}
                                    sx={{
                                        borderRadius: 1,
                                        "& .MuiInputBase-root": {
                                            fontFamily: fonts.shareTech,
                                            px: "1.1em",
                                            pt: ".9rem",
                                            pb: ".7rem",
                                        },
                                        ".Mui-disabled": {
                                            WebkitTextFillColor: "unset",
                                            color: "#FFFFFF70",
                                        },
                                        ".Mui-focused .MuiOutlinedInput-notchedOutline": {
                                            borderColor: `${primaryColor} !important`,
                                        },
                                        textarea: {
                                            p: 0,
                                            color: "#FFFFFF",
                                            overflow: "hidden",
                                        },
                                    }}
                                />
                            </Stack>

                            <Stack direction="row" spacing=".4rem">
                                <Typography sx={{ color: primaryColor, fontWeight: "fontWeightBold" }}>FEE:</Typography>
                                <Stack direction="row" alignItems="center">
                                    <SvgSupToken size="1.4rem" fill={colors.yellow} />
                                    <Typography sx={{ lineHeight: 1 }}>{fee || "---"}</Typography>
                                </Stack>
                            </Stack>
                        </Stack>

                        <Button
                            variant="contained"
                            size="small"
                            onClick={onSubmit}
                            disabled={isDisabled}
                            sx={{
                                flex: 1,
                                minWidth: 0,
                                mt: "1.8rem",
                                px: ".8rem",
                                py: ".8rem",
                                backgroundColor: primaryColor,
                                borderRadius: 0.3,
                                ":hover": { backgroundColor: `${primaryColor}90` },
                            }}
                        >
                            <Typography
                                sx={{
                                    color: secondaryColor,
                                    lineHeight: 1,
                                    fontWeight: "fontWeightBold",
                                    opacity: isDisabled ? 0.6 : 1,
                                }}
                            >
                                SUBMIT
                            </Typography>
                        </Button>

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

                    <IconButton size="small" onClick={onClose} sx={{ position: "absolute", top: ".2rem", right: ".2rem" }}>
                        <SvgClose size="1.6rem" sx={{ opacity: 0.1, ":hover": { opacity: 0.6 } }} />
                    </IconButton>
                </ClipThing>
            </Box>
        </Modal>
    )
}
