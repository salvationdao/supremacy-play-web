import { Box, InputAdornment, Popover, Stack, TextField, Typography } from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import { ClipThing, FancyButton } from "../../../.."
import { SvgAbility, SvgDeath, SvgSkull2, SvgView } from "../../../../../assets"
import { useAuth, useSnackbar } from "../../../../../containers"
import { useToggle } from "../../../../../hooks"
import { useGameServerCommandsUser } from "../../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../../keys"
import { colors, fonts, siteZIndex } from "../../../../../theme/theme"
import { FeatureName, User, UserStat } from "../../../../../types"
import { ConfirmModal } from "../../../../Common/ConfirmModal"
import { Player } from "../../../../Common/Player"

export const UserDetailsPopover = ({
    factionColor,
    factionSecondaryColor,
    userStat,
    popoverRef,
    open,
    onClose,
    user,
    fromUser,
    toggleBanModalOpen,
}: {
    factionColor?: string
    factionSecondaryColor?: string
    userStat?: UserStat
    popoverRef: React.MutableRefObject<null>
    open: boolean
    onClose: () => void
    user: User
    fromUser: User
    toggleBanModalOpen: (value?: boolean | undefined) => void
}) => {
    const { userHasFeature } = useAuth()
    const [localOpen, toggleLocalOpen] = useToggle(open)

    // Chat banning
    const { newSnackbarMessage } = useSnackbar()
    const { send } = useGameServerCommandsUser("/user_commander")
    const [showChatBanModal, setShowChatBanModal] = useState(false)
    const [reason, setReason] = useState<string>("")
    const [error, setError] = useState<string>()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!localOpen) {
            const timeout = setTimeout(() => {
                onClose()
            }, 300)

            return () => clearTimeout(timeout)
        }
    }, [localOpen, onClose])

    const onChatBan = useCallback(async () => {
        try {
            setLoading(true)
            await send(GameServerKeys.ChatBanPlayer, {
                player_id: fromUser.id,
                reason,
            })
            newSnackbarMessage(`Successfully banned player ${fromUser.username}`, "success")
            setShowChatBanModal(false)
            setError(undefined)
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message)
            } else if (typeof e === "string") {
                setError(e)
            }
        } finally {
            setLoading(false)
        }
    }, [fromUser, newSnackbarMessage, reason, send])

    if (!userStat) return null

    return (
        <>
            <Popover
                open={localOpen}
                anchorEl={popoverRef.current}
                onClose={() => toggleLocalOpen(false)}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                sx={{
                    mt: "-.3rem",
                    ml: "-1rem",
                    zIndex: siteZIndex.Popover,
                    ".MuiPaper-root": {
                        background: "none",
                    },
                }}
            >
                <ClipThing
                    clipSize="8px"
                    border={{
                        borderColor: factionColor || colors.neonBlue,
                        borderThickness: ".2rem",
                    }}
                    corners={{
                        topRight: true,
                        bottomLeft: true,
                    }}
                    sx={{ position: "relative" }}
                    backgroundColor={colors.darkNavy}
                >
                    <Stack sx={{ minWidth: "20rem", px: "1.5rem", py: "1.2rem" }}>
                        <Box sx={{ mt: ".3rem", mb: ".7rem" }}>
                            <Player player={fromUser} />
                        </Box>

                        <Stack spacing=".3rem" sx={{ ml: ".2rem" }}>
                            <Stack direction="row" spacing=".5rem">
                                <SvgAbility size="1.1rem" sx={{ pb: ".4rem" }} />
                                <Typography variant="body2">
                                    <strong>ABILITIES:</strong> {userStat.total_ability_triggered}
                                </Typography>
                            </Stack>

                            <Stack direction="row" spacing=".5rem">
                                <SvgSkull2 size="1.1rem" sx={{ pb: ".4rem" }} />
                                <Typography variant="body2">
                                    <strong>MECH KILLS:</strong> {userStat.mech_kill_count}
                                </Typography>
                            </Stack>

                            <Stack direction="row" spacing=".5rem">
                                <SvgDeath size="1.1rem" sx={{ pb: ".4rem" }} />
                                <Typography variant="body2">
                                    <strong>ABILITY KILLS:</strong> {userStat.ability_kill_count}
                                </Typography>
                            </Stack>

                            <Stack direction="row" spacing=".5rem">
                                <SvgDeath size="1.1rem" sx={{ pb: ".4rem" }} />
                                <Typography variant="body2">
                                    <strong>ABILITY KILLS (7 DAYS):</strong> {userStat.last_seven_days_kills}
                                </Typography>
                            </Stack>

                            <Stack direction="row" spacing=".5rem">
                                <SvgView size="1.1rem" />
                                <Typography variant="body2">
                                    <strong>SPECTATED:</strong> {userStat.view_battle_count}
                                </Typography>
                            </Stack>
                        </Stack>

                        {fromUser.faction_id === user.faction_id && (
                            <FancyButton
                                clipThingsProps={{
                                    clipSize: "5px",
                                    backgroundColor: factionColor,
                                    opacity: 1,
                                    border: { isFancy: true, borderColor: factionColor, borderThickness: "2px" },
                                    sx: { position: "relative", mt: ".7rem" },
                                }}
                                sx={{ px: "1.6rem", py: ".1rem", color: factionSecondaryColor }}
                                onClick={() => {
                                    toggleBanModalOpen()
                                    toggleLocalOpen(false)
                                }}
                            >
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: factionSecondaryColor,
                                        fontFamily: fonts.nostromoBlack,
                                    }}
                                >
                                    PUNISH
                                </Typography>
                            </FancyButton>
                        )}
                        {userHasFeature(FeatureName.chatBan) && fromUser.id !== user.id && (
                            <FancyButton
                                clipThingsProps={{
                                    clipSize: "5px",
                                    backgroundColor: factionColor,
                                    opacity: 1,
                                    border: { isFancy: true, borderColor: factionColor, borderThickness: "2px" },
                                    sx: { position: "relative", mt: ".7rem" },
                                }}
                                sx={{ px: "1.6rem", py: ".1rem", color: factionSecondaryColor }}
                                onClick={() => {
                                    setShowChatBanModal(true)
                                }}
                            >
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: factionSecondaryColor,
                                        fontFamily: fonts.nostromoBlack,
                                    }}
                                >
                                    CHAT BAN
                                </Typography>
                            </FancyButton>
                        )}
                    </Stack>
                </ClipThing>
            </Popover>
            {showChatBanModal && (
                <ConfirmModal
                    title="CONFIRMATION"
                    onConfirm={onChatBan}
                    onClose={() => {
                        setReason("")
                        setError(undefined)
                        setShowChatBanModal(false)
                    }}
                    isLoading={loading}
                    error={error}
                    confirmSuffix={
                        <Typography variant="h6" sx={{ fontWeight: "fontWeightBold", ml: ".4rem" }}>
                            BAN
                        </Typography>
                    }
                    disableConfirm={loading}
                >
                    <Typography variant="h6">
                        Do you wish to chat ban <strong>{fromUser.username}</strong>?
                    </Typography>
                    <TextField
                        variant="outlined"
                        hiddenLabel
                        fullWidth
                        placeholder="Ban reason"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: "fontWeightBold",
                                        }}
                                    >
                                        Reason
                                    </Typography>
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            backgroundColor: "#00000090",
                            ".MuiOutlinedInput-input": {
                                px: "1.5rem",
                                py: "1.5rem",
                                fontSize: "2rem",
                                height: "unset",
                                "::-webkit-outer-spin-button, ::-webkit-inner-spin-button": {
                                    "-webkit-appearance": "none",
                                },
                            },
                            ".MuiOutlinedInput-notchedOutline": { border: "unset" },
                        }}
                        type="text"
                        value={reason}
                        onChange={(e) => {
                            setReason(e.target.value)
                        }}
                    />
                </ConfirmModal>
            )}
        </>
    )
}
