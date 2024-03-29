import { Box, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import { SvgAbility, SvgDeath, SvgSkull2, SvgView } from "../../../../../assets"
import { useAuth, useGlobalNotifications } from "../../../../../containers"
import { useToggle } from "../../../../../hooks"
import { useGameServerCommandsUser } from "../../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../../keys"
import { fonts } from "../../../../../theme/theme"
import { FeatureName, User, UserStat } from "../../../../../types"
import { ConfirmModal } from "../../../../Common/Deprecated/ConfirmModal"
import { NiceButton } from "../../../../Common/Nice/NiceButton"
import { NicePopover } from "../../../../Common/Nice/NicePopover"
import { NiceSelect } from "../../../../Common/Nice/NiceSelect"
import { NiceTextField } from "../../../../Common/Nice/NiceTextField"
import { PlayerNameGid } from "../../../../Common/PlayerNameGid"

enum DurationOptions {
    TwentyFourHours = "1440",
    ThreeHours = "180",
    OneHour = "60",
    FifteenMinutes = "15",
}

const durationOptions = [
    { label: "24 Hours", value: DurationOptions.TwentyFourHours },
    { label: "3 Hours", value: DurationOptions.ThreeHours },
    { label: "1 Hour", value: DurationOptions.OneHour },
    { label: "15 Minutes", value: DurationOptions.FifteenMinutes },
]

export const UserDetailsPopover = ({
    factionColor,
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
    const { newSnackbarMessage } = useGlobalNotifications()
    const { send } = useGameServerCommandsUser("/user_commander")
    const [showChatBanModal, setShowChatBanModal] = useState(false)
    const [reason, setReason] = useState<string>("")
    const [durationMinutes, setDurationMinutes] = useState<DurationOptions>(DurationOptions.TwentyFourHours) // default one day
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
                duration_minutes: parseFloat(durationMinutes),
            })
            newSnackbarMessage(`Successfully banned player ${fromUser.username}`, "success")
            setReason("")
            setDurationMinutes(DurationOptions.TwentyFourHours)
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
    }, [durationMinutes, fromUser.id, fromUser.username, newSnackbarMessage, reason, send])

    if (!userStat) return null

    return (
        <>
            <NicePopover
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
                }}
            >
                <Stack spacing=".8rem" sx={{ minWidth: "20rem", px: "1.5rem", py: "1.2rem" }}>
                    <Box>
                        <PlayerNameGid player={fromUser} />
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

                    {userHasFeature(FeatureName.profileAvatar) && (
                        <NiceButton
                            route={{ to: `/profile/${fromUser.gid}` }}
                            onClick={() => toggleLocalOpen(false)}
                            buttonColor={factionColor}
                            sx={{ py: ".3rem" }}
                        >
                            <Typography variant="subtitle1" fontFamily={fonts.nostromoBold}>
                                VIEW PROFILE
                            </Typography>
                        </NiceButton>
                    )}

                    {fromUser.faction_id === user.faction_id && (
                        <NiceButton
                            onClick={() => {
                                toggleBanModalOpen()
                                toggleLocalOpen(false)
                            }}
                            buttonColor={factionColor}
                            sx={{ py: ".3rem" }}
                        >
                            <Typography variant="subtitle1" fontFamily={fonts.nostromoBold}>
                                PUNISH
                            </Typography>
                        </NiceButton>
                    )}

                    {userHasFeature(FeatureName.chatBan) && fromUser.id !== user.id && (
                        <NiceButton onClick={() => setShowChatBanModal(true)} buttonColor={factionColor} sx={{ py: ".3rem" }}>
                            <Typography variant="subtitle1" fontFamily={fonts.nostromoBold}>
                                CHAT BAN
                            </Typography>
                        </NiceButton>
                    )}
                </Stack>
            </NicePopover>

            {showChatBanModal && (
                <ConfirmModal
                    title="CONFIRMATION"
                    onConfirm={onChatBan}
                    onClose={() => {
                        setReason("")
                        setDurationMinutes(DurationOptions.TwentyFourHours)
                        setError(undefined)
                        setShowChatBanModal(false)
                    }}
                    isLoading={loading}
                    error={error}
                    disableConfirm={loading}
                    innerSx={{ width: "40rem" }}
                >
                    <Typography variant="h6">
                        Do you wish to chat ban <strong>{fromUser.username}</strong>?
                    </Typography>

                    <NiceTextField value={reason} onChange={(value) => setReason(value)} placeholder="Ban reason" />

                    <NiceSelect options={durationOptions} selected={durationMinutes} onSelected={(value) => setDurationMinutes(value as DurationOptions)} />
                </ConfirmModal>
            )}
        </>
    )
}
