import { Box, Checkbox, IconButton, Modal, Stack, TextField, Typography } from "@mui/material"
import React, { useCallback, useEffect, useState } from "react"
import { SvgClose } from "../../../assets"
import { MAX_BAN_PROPOSAL_REASON_LENGTH } from "../../../constants"
import { useGameServerCommandsUser } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts, siteZIndex } from "../../../theme/theme"
import { Faction, User } from "../../../types"
import { ClipThing } from "../../Common/Deprecated/ClipThing"
import { FancyButton } from "../../Common/Deprecated/FancyButton"

export const AdminBanModal = ({
    user,
    modalOpen,
    setModalOpen,
    faction,
    fetchPlayer,
}: {
    user: User
    modalOpen: boolean
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    faction: Faction
    fetchPlayer: (newGid: number) => void
}) => {
    const { send } = useGameServerCommandsUser("/user_commander")
    const [reqError, setReqError] = useState<string>("")
    const [chatBan, setChatBan] = useState<boolean>(false)
    const [locationSelectBan, setLocationSelectBan] = useState<boolean>(false)
    const [supContributeBan, setSupContributeBan] = useState<boolean>(false)
    const [banMechQueue, setBanMechQueue] = useState<boolean>(false)
    const [banDurationHours, setBanDurationHours] = useState<number>(0)
    const [banDurationDays, setDurationDays] = useState<number>(0)
    const [banReason, setBanReason] = useState<string>("")
    const [isShadowBan, setIsShadowBan] = useState<boolean>(true)
    const [canSubmit, setCanSubmit] = useState<boolean>(false)

    useEffect(() => {
        if (!supContributeBan || !locationSelectBan || !chatBan || !banMechQueue || (supContributeBan && locationSelectBan && chatBan && banMechQueue)) {
            if (banDurationDays > 0 || banDurationHours > 0) {
                if (banReason != "") {
                    setCanSubmit(true)
                    return
                }
            }
        }
        setCanSubmit(false)
    }, [banDurationDays, banDurationHours, banMechQueue, banReason, chatBan, locationSelectBan, supContributeBan])

    const onClose = useCallback(() => {
        setModalOpen(false)
    }, [setModalOpen])

    const sendBanCommand = useCallback(() => {
        ;(async () => {
            try {
                await send<
                    boolean,
                    {
                        gid: number[]
                        chat_ban: boolean
                        location_select_ban: boolean
                        sup_contribute_ban: boolean
                        ban_duration_hours: number
                        ban_duration_days: number
                        ban_mech_queue: boolean
                        ban_reason: string
                        is_shadow_ban: boolean
                    }
                >(GameServerKeys.ModBanUser, {
                    gid: [user.gid],
                    chat_ban: chatBan,
                    location_select_ban: locationSelectBan,
                    sup_contribute_ban: supContributeBan,
                    ban_duration_hours: banDurationHours,
                    ban_duration_days: banDurationDays,
                    ban_mech_queue: banMechQueue,
                    ban_reason: banReason,
                    is_shadow_ban: isShadowBan,
                })

                fetchPlayer(user.gid)
                onClose()
            } catch (e) {
                setReqError(typeof e === "string" ? e : "Failed to ban player")
                console.error(e)
            }
        })()
    }, [
        banDurationDays,
        banDurationHours,
        banMechQueue,
        banReason,
        chatBan,
        fetchPlayer,
        isShadowBan,
        locationSelectBan,
        onClose,
        send,
        supContributeBan,
        user.gid,
    ])

    return (
        <AdminBanModalInner
            user={user}
            modalOpen={modalOpen}
            banDurationDays={banDurationDays}
            banDurationHours={banDurationHours}
            banReason={banReason}
            chatBan={chatBan}
            locationSelectBan={locationSelectBan}
            onClose={onClose}
            sendBanCommand={sendBanCommand}
            setBanDurationHours={setBanDurationHours}
            setBanReason={setBanReason}
            setChatBan={setChatBan}
            setDurationDays={setDurationDays}
            setLocationSelectBan={setLocationSelectBan}
            setSupContributeBan={setSupContributeBan}
            supContributeBan={supContributeBan}
            reqError={reqError}
            faction={faction}
            setModalOpen={setModalOpen}
            setIsShadowBan={setIsShadowBan}
            shadowBan={isShadowBan}
            canSubmit={canSubmit}
            setBanMechQueue={setBanMechQueue}
            banMechQueue={banMechQueue}
        />
    )
}

const AdminBanModalInner = ({
    user,
    modalOpen,
    onClose,
    setChatBan,
    setLocationSelectBan,
    setSupContributeBan,
    setIsShadowBan,
    setBanDurationHours,
    setDurationDays,
    setBanReason,
    chatBan,
    locationSelectBan,
    supContributeBan,
    shadowBan,
    banDurationHours,
    banDurationDays,
    banReason,
    sendBanCommand,
    reqError,
    faction,
    canSubmit,
    setBanMechQueue,
    banMechQueue,
}: {
    user: User
    modalOpen: boolean
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    onClose: () => void
    setChatBan: React.Dispatch<React.SetStateAction<boolean>>
    setLocationSelectBan: React.Dispatch<React.SetStateAction<boolean>>
    setSupContributeBan: React.Dispatch<React.SetStateAction<boolean>>
    setIsShadowBan: React.Dispatch<React.SetStateAction<boolean>>
    setBanMechQueue: React.Dispatch<React.SetStateAction<boolean>>
    setBanDurationHours: React.Dispatch<React.SetStateAction<number>>
    setDurationDays: React.Dispatch<React.SetStateAction<number>>
    setBanReason: React.Dispatch<React.SetStateAction<string>>
    chatBan: boolean
    locationSelectBan: boolean
    supContributeBan: boolean
    shadowBan: boolean
    banMechQueue: boolean
    banDurationHours: number
    banDurationDays: number
    banReason: string
    sendBanCommand: () => void
    reqError: string
    faction: Faction
    canSubmit: boolean
}) => {
    return (
        <Modal open={modalOpen} onClose={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "42rem",
                    boxShadow: 24,
                    outline: "none",
                }}
            >
                <ClipThing
                    clipSize="8px"
                    border={{
                        borderColor: faction.palette.primary,
                        borderThickness: ".3rem",
                    }}
                    sx={{ position: "relative" }}
                    backgroundColor={faction.palette.background}
                >
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
                        <Typography sx={{ mb: "1.2rem", fontFamily: fonts.nostromoBlack }}>
                            Ban user {user.username} #{user.gid.toString()}
                        </Typography>

                        <Stack spacing="1rem" direction="row" alignItems="center" onClick={() => setIsShadowBan(!shadowBan)} sx={{ cursor: "pointer" }}>
                            <Checkbox checked={shadowBan} onClick={() => setIsShadowBan(!shadowBan)} />

                            <Typography sx={{ pt: ".4rem", userSelect: "none" }}>Shadowban user</Typography>
                        </Stack>

                        <Stack spacing="1rem" direction="row" alignItems="center" onClick={() => setBanMechQueue(!banMechQueue)} sx={{ cursor: "pointer" }}>
                            <Checkbox checked={banMechQueue} onClick={() => setBanMechQueue(!banMechQueue)} />

                            <Typography sx={{ pt: ".4rem", userSelect: "none" }}>Ban user from queuing mechs</Typography>
                        </Stack>

                        <Stack spacing="1rem" direction="row" alignItems="center" onClick={() => setChatBan(!chatBan)} sx={{ cursor: "pointer" }}>
                            <Checkbox checked={chatBan} onClick={() => setChatBan(!chatBan)} />

                            <Typography sx={{ pt: ".4rem", userSelect: "none" }}>Ban user from chat</Typography>
                        </Stack>
                        <Stack
                            spacing="1rem"
                            direction="row"
                            alignItems="center"
                            onClick={() => setSupContributeBan(!supContributeBan)}
                            sx={{ cursor: "pointer" }}
                        >
                            <Checkbox checked={supContributeBan} onClick={() => setSupContributeBan(!supContributeBan)} />

                            <Typography sx={{ pt: ".4rem", userSelect: "none" }}>Ban user from location select</Typography>
                        </Stack>
                        <Stack
                            spacing="1rem"
                            direction="row"
                            alignItems="center"
                            onClick={() => setLocationSelectBan(!locationSelectBan)}
                            sx={{ cursor: "pointer" }}
                        >
                            <Checkbox checked={locationSelectBan} onClick={() => setLocationSelectBan(!locationSelectBan)} />

                            <Typography sx={{ pt: ".4rem", userSelect: "none" }}>Ban user from contributing sups</Typography>
                        </Stack>

                        <Stack spacing="1.5rem" sx={{ mt: "1.6rem" }}>
                            <Stack spacing=".3rem">
                                <Typography sx={{ color: faction.palette.primary, fontWeight: "bold" }}>Ban Duration (Hours):</Typography>
                                <TextField
                                    value={banDurationHours === 0 ? "" : banDurationHours.toString()}
                                    placeholder="Ban duration in hours"
                                    onChange={(e) => {
                                        if (isNaN(parseInt(e.target.value))) {
                                            setBanDurationHours(0)
                                            return
                                        }

                                        setBanDurationHours(parseInt(e.target.value))
                                    }}
                                    type="number"
                                    hiddenLabel
                                    multiline
                                    maxRows={2}
                                    sx={{
                                        borderRadius: 1,
                                        "& .MuiInputBase-root": {
                                            fontFamily: fonts.rajdhaniMedium,
                                            px: "1.1em",
                                            pt: ".9rem",
                                            pb: ".7rem",
                                        },
                                        ".Mui-disabled": {
                                            WebkitTextFillColor: "unset",
                                            color: "#FFFFFF70",
                                        },
                                        ".Mui-focused .MuiOutlinedInput-notchedOutline": {
                                            borderColor: `${faction.palette.primary} !important`,
                                        },
                                        textarea: {
                                            p: 0,
                                            color: "#FFFFFF",
                                            overflow: "hidden",
                                        },
                                    }}
                                />
                            </Stack>

                            <Stack spacing=".3rem">
                                <Typography sx={{ color: faction.palette.primary, fontWeight: "bold" }}>Ban Duration (Days):</Typography>
                                <TextField
                                    value={banDurationDays === 0 ? "" : banDurationDays.toString()}
                                    placeholder="Ban duration in days"
                                    onChange={(e) => {
                                        if (isNaN(parseInt(e.target.value))) {
                                            setDurationDays(0)
                                            return
                                        }

                                        setDurationDays(parseInt(e.target.value))
                                    }}
                                    type="number"
                                    hiddenLabel
                                    multiline
                                    maxRows={2}
                                    sx={{
                                        borderRadius: 1,
                                        "& .MuiInputBase-root": {
                                            fontFamily: fonts.rajdhaniMedium,
                                            px: "1.1em",
                                            pt: ".9rem",
                                            pb: ".7rem",
                                        },
                                        ".Mui-disabled": {
                                            WebkitTextFillColor: "unset",
                                            color: "#FFFFFF70",
                                        },
                                        ".Mui-focused .MuiOutlinedInput-notchedOutline": {
                                            borderColor: `${faction.palette.primary} !important`,
                                        },
                                        textarea: {
                                            p: 0,
                                            color: "#FFFFFF",
                                            overflow: "hidden",
                                        },
                                    }}
                                />
                            </Stack>

                            <Stack spacing=".3rem">
                                <Typography sx={{ color: faction.palette.primary, fontWeight: "bold" }}>Ban reason:</Typography>
                                <TextField
                                    value={banReason}
                                    placeholder="Type the reason to punish the user..."
                                    onChange={(e) => {
                                        const m = e.currentTarget.value
                                        if (m.length <= MAX_BAN_PROPOSAL_REASON_LENGTH) setBanReason(e.currentTarget.value)
                                    }}
                                    type="text"
                                    hiddenLabel
                                    multiline
                                    maxRows={2}
                                    sx={{
                                        borderRadius: 1,
                                        "& .MuiInputBase-root": {
                                            fontFamily: fonts.rajdhaniMedium,
                                            px: "1.1em",
                                            pt: ".9rem",
                                            pb: ".7rem",
                                        },
                                        ".Mui-disabled": {
                                            WebkitTextFillColor: "unset",
                                            color: "#FFFFFF70",
                                        },
                                        ".Mui-focused .MuiOutlinedInput-notchedOutline": {
                                            borderColor: `${faction.palette.primary} !important`,
                                        },
                                        textarea: {
                                            p: 0,
                                            color: "#FFFFFF",
                                            overflow: "hidden",
                                        },
                                    }}
                                />
                            </Stack>
                        </Stack>

                        <FancyButton
                            clipThingsProps={{
                                clipSize: "9px",
                                backgroundColor: faction.palette.primary,
                                opacity: 1,
                                border: { isFancy: true, borderColor: faction.palette.primary, borderThickness: "2px" },
                                sx: { position: "relative", flex: 1, minWidth: 0, mt: "1.8rem" },
                            }}
                            sx={{ px: "1.6rem", py: ".3rem", color: faction.palette.text }}
                            onClick={sendBanCommand}
                            disabled={!canSubmit}
                        >
                            <Typography
                                variant="caption"
                                sx={{
                                    color: faction.palette.text,
                                    fontFamily: fonts.nostromoBlack,
                                }}
                            >
                                SUBMIT
                            </Typography>
                        </FancyButton>

                        {reqError && (
                            <Typography variant="body2" sx={{ mt: ".3rem", color: colors.red }}>
                                {reqError}
                            </Typography>
                        )}
                    </Stack>

                    <IconButton size="small" onClick={onClose} sx={{ position: "absolute", top: ".5rem", right: ".5rem" }}>
                        <SvgClose size="2.6rem" sx={{ opacity: 0.1, ":hover": { opacity: 0.6 } }} />
                    </IconButton>
                </ClipThing>
            </Box>
        </Modal>
    )
}
