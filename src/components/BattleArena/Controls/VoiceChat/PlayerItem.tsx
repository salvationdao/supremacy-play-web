import { Box, IconButton, Slider, Stack, Typography } from "@mui/material"
import OvenPlayer from "ovenplayer"
import { useCallback, useEffect, useMemo, useState } from "react"
import { SvgUserDiamond, SvgVolume, SvgVolumeMute } from "../../../../assets"
import { useTheme } from "../../../../containers/theme"
import { useToggle } from "../../../../hooks"
import { colors, fonts } from "../../../../theme/theme"
import { Faction, User } from "../../../../types"
import { ConfirmModal } from "../../../Common/Deprecated/ConfirmModal"
import { NiceButton } from "../../../Common/Nice/NiceButton"
import { TypographyTruncated } from "../../../Common/TypographyTruncated"
import { VoiceStream } from "./VoiceChat"

enum ConfirmModalKeys {
    LeaveFactionCommander = "LeaveFactionCommander",
    JoinFactionCommander = "JoinFactionCommander",
    VoteKickFactionCommander = "VoteKickFactionCommander",
}

export const PlayerItem = ({
    voiceStream,
    currentUser,
    onLeaveFactionCommander,
    onVoteKick,
    isSpeaker,
}: {
    onLeaveFactionCommander: () => void
    onVoteKick: () => void
    currentUser: User
    voiceStream: VoiceStream
    faction: Faction
    isSpeaker: boolean
}) => {
    const theme = useTheme()
    const player = OvenPlayer.getPlayerByContainerId(voiceStream.listen_url)
    const factionCommanderTag = voiceStream.is_faction_commander ? "(FC)" : ""
    const [confirmModal, setConfirmModal] = useState<ConfirmModalKeys | undefined>(undefined)

    const leaveFactionCommanderButton = useMemo(() => {
        return `${currentUser.gid}` === `${voiceStream.user_gid}` && voiceStream.is_faction_commander ? (
            <>
                <NiceButton buttonColor={colors.red} sx={{ p: ".3rem 1rem" }} onClick={() => setConfirmModal(ConfirmModalKeys.LeaveFactionCommander)}>
                    <Typography fontFamily={fonts.nostromoBold} variant="subtitle2">
                        LEAVE
                    </Typography>
                </NiceButton>

                {confirmModal === ConfirmModalKeys.LeaveFactionCommander && (
                    <ConfirmModal
                        title="LEAVE AS FACTION COMMANDER"
                        onConfirm={() => {
                            onLeaveFactionCommander()
                            setConfirmModal(undefined)
                        }}
                        onClose={() => setConfirmModal(undefined)}
                    >
                        <></>
                    </ConfirmModal>
                )}
            </>
        ) : (
            <> </>
        )
    }, [voiceStream.is_faction_commander, currentUser.gid, voiceStream.user_gid, onLeaveFactionCommander, confirmModal])

    const kickVoteButton = useMemo(() => {
        return `${currentUser.gid}` !== `${voiceStream.user_gid}` && voiceStream.is_faction_commander && isSpeaker ? (
            <>
                <NiceButton buttonColor={colors.red} sx={{ p: ".3rem 1rem" }} onClick={() => setConfirmModal(ConfirmModalKeys.VoteKickFactionCommander)}>
                    <Typography fontFamily={fonts.nostromoBold} variant="subtitle2">
                        KICK VOTE ({voiceStream.current_kick_vote})
                    </Typography>
                </NiceButton>

                {confirmModal === ConfirmModalKeys.VoteKickFactionCommander && (
                    <ConfirmModal
                        width="55rem"
                        title="VOTE TO KICK FACTION COMMANDER"
                        onConfirm={() => {
                            onVoteKick()
                            setConfirmModal(undefined)
                        }}
                        onClose={() => setConfirmModal(undefined)}
                    >
                        <Typography variant="h6">
                            If the majority of mech owners vote to kick the faction commander, the faction commander will be banned from being faction commander
                            again for 24hrs
                        </Typography>
                    </ConfirmModal>
                )}
            </>
        ) : (
            <></>
        )
    }, [currentUser.gid, voiceStream.user_gid, voiceStream.is_faction_commander, voiceStream.current_kick_vote, onVoteKick, confirmModal, isSpeaker])

    const onMute = () => {
        if (player) {
            if (!isMute) {
                setVolume(0)
                toggleIsMute(true)
            } else {
                setVolume(0.5)
                toggleIsMute(false)
            }
        }
    }

    const [isMute, toggleIsMute] = useToggle(false)
    const [volume, setVolume] = useState(1)

    const handleVolumeChange = useCallback(
        (_: Event, newValue: number | number[]) => {
            setVolume(newValue as number)
        },
        [setVolume],
    )

    useEffect(() => {
        if (player) {
            if (isMute) {
                player.setVolume(0)
                return
            }

            player.setVolume(volume * 100)
        }
    }, [volume, isMute, player])

    return (
        <Stack direction="row" alignItems="center" sx={{ p: ".8rem 1.2rem" }}>
            <TypographyTruncated key={voiceStream.listen_url}>
                <SvgUserDiamond inline size="1.9rem" /> {voiceStream.username}#{voiceStream.user_gid} {factionCommanderTag}
            </TypographyTruncated>

            <Box flex={1} />

            {!voiceStream.send_url && (
                <>
                    <Slider
                        size="small"
                        min={0}
                        max={1}
                        step={0.01}
                        aria-label="Volume"
                        value={isMute ? 0 : volume}
                        onChange={handleVolumeChange}
                        sx={{
                            ml: "1rem",
                            mr: "1rem",
                            width: "10rem",
                            color: theme.factionTheme.primary,
                        }}
                    />

                    <IconButton size="small" onClick={onMute} sx={{ opacity: 0.5, mr: "1rem", transition: "all .2s", ":hover": { opacity: 1 } }}>
                        {isMute || volume <= 0 ? <SvgVolumeMute size="2rem" sx={{ pb: 0 }} /> : <SvgVolume size="2rem" sx={{ pb: 0 }} />}
                    </IconButton>

                    {kickVoteButton}
                </>
            )}

            {leaveFactionCommanderButton}
        </Stack>
    )
}
