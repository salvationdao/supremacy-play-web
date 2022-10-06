import { Faction, User } from "../../../types"
import React, { useCallback, useState } from "react"
import { GameServerKeys } from "../../../keys"
import { useGameServerCommandsUser } from "../../../hooks/useGameServer"
import { Box, Checkbox, IconButton, Modal, Stack, TextField, Typography } from "@mui/material"
import { ClipThing } from "../../Common/ClipThing"
import { colors, fonts, siteZIndex } from "../../../theme/theme"
import { SvgClose } from "../../../assets"
import { MAX_BAN_PROPOSAL_REASON_LENGTH } from "../../../constants"
import { FancyButton } from "../../Common/FancyButton"

export const AdminBanModal = ({
    relatedAccounts,
    user,
    modalOpen,
    setModalOpen,
    faction,
    fetchPlayer,
}: {
    relatedAccounts: User[] | undefined
    user: User
    modalOpen: boolean
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    faction: Faction
    fetchPlayer: (newGid: number) => void
}) => {
    const [selectedGID, setSelectedGID] = useState<number[]>([user.gid])
    const { send } = useGameServerCommandsUser("/user_commander")
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [onSuccess, setOnSuccess] = useState<boolean>()
    const [reqError, setReqError] = useState<string>("")
    const [chatBan, setChatBan] = useState<boolean>(false)
    const [locationSelectBan, setLocationSelectBan] = useState<boolean>(false)
    const [supContributeBan, setSupContributeBan] = useState<boolean>(false)
    const [banDurationHours, setBanDurationHours] = useState<number>(0)
    const [banDurationDays, setDurationDays] = useState<number>(0)
    const [banReason, setBanReason] = useState<string>("")

    const onClose = useCallback(() => {
        setModalOpen(false)
    }, [setModalOpen])

    const sendBanCommand = useCallback(() => {
        ;(async () => {
            setIsLoading(true)
            try {
                const resp = await send<
                    boolean,
                    {
                        gid: number[]
                        chat_ban: boolean
                        location_select_ban: boolean
                        sup_contribute_ban: boolean
                        ban_duration_hours: number
                        ban_duration_days: number
                        ban_reason: string
                    }
                >(GameServerKeys.ModBanUser, {
                    gid: selectedGID,
                    chat_ban: chatBan,
                    location_select_ban: locationSelectBan,
                    sup_contribute_ban: supContributeBan,
                    ban_duration_hours: banDurationHours,
                    ban_duration_days: banDurationDays,
                    ban_reason: banReason,
                })

                if (!resp) return
                fetchPlayer(user.gid)
                onClose()
            } catch (e) {
                setReqError(typeof e === "string" ? e : "Failed to get replays.")
                console.error(e)
            } finally {
                setIsLoading(false)
            }
        })()
    }, [banDurationDays, banDurationHours, banReason, chatBan, fetchPlayer, locationSelectBan, onClose, selectedGID, send, supContributeBan, user.gid])

    return (
        <AdminBanModalInner
            relatedAccounts={relatedAccounts}
            user={user}
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
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
            isLoading={isLoading}
            onSuccess={onSuccess}
            reqError={reqError}
            setSelectedGID={setSelectedGID}
            faction={faction}
            fetchPlayer={fetchPlayer}
        />
    )
}

const AdminBanModalInner = ({
    relatedAccounts,
    user,
    modalOpen,
    setModalOpen,
    onClose,
    setChatBan,
    setLocationSelectBan,
    setSupContributeBan,
    setBanDurationHours,
    setDurationDays,
    setBanReason,
    chatBan,
    locationSelectBan,
    supContributeBan,
    banDurationHours,
    banDurationDays,
    banReason,
    sendBanCommand,
    isLoading,
    onSuccess,
    reqError,
    setSelectedGID,
    faction,
    fetchPlayer,
}: {
    relatedAccounts: User[] | undefined
    user: User
    modalOpen: boolean
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    onClose: () => void
    setChatBan: React.Dispatch<React.SetStateAction<boolean>>
    setLocationSelectBan: React.Dispatch<React.SetStateAction<boolean>>
    setSupContributeBan: React.Dispatch<React.SetStateAction<boolean>>
    setBanDurationHours: React.Dispatch<React.SetStateAction<number>>
    setDurationDays: React.Dispatch<React.SetStateAction<number>>
    setBanReason: React.Dispatch<React.SetStateAction<string>>
    chatBan: boolean
    locationSelectBan: boolean
    supContributeBan: boolean
    banDurationHours: number
    banDurationDays: number
    banReason: string
    sendBanCommand: () => void
    isLoading: boolean
    onSuccess: boolean | undefined
    reqError: string
    setSelectedGID: React.Dispatch<React.SetStateAction<number[]>>
    faction: Faction
    fetchPlayer: (newGid: number) => void
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
                        borderColor: faction.primary_color,
                        borderThickness: ".3rem",
                    }}
                    sx={{ position: "relative" }}
                    backgroundColor={faction.background_color}
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

                        <Stack spacing="1rem" direction="row" alignItems="center" onClick={() => setChatBan(!chatBan)} sx={{ cursor: "pointer" }}>
                            <Checkbox
                                size="small"
                                checked={chatBan}
                                onClick={() => setChatBan(!chatBan)}
                                sx={{
                                    p: 0,
                                    color: faction.primary_color,
                                    "& > .MuiSvgIcon-root": { width: "2.5rem", height: "2.5rem" },
                                    ".Mui-checked, .MuiSvgIcon-root": { color: `${faction.primary_color} !important` },
                                    ".Mui-checked+.MuiSwitch-track": { backgroundColor: `${faction.primary_color}50 !important` },
                                }}
                            />

                            <Typography sx={{ pt: ".4rem", userSelect: "none" }}>Ban user from chat</Typography>
                        </Stack>
                        <Stack
                            spacing="1rem"
                            direction="row"
                            alignItems="center"
                            onClick={() => setSupContributeBan(!supContributeBan)}
                            sx={{ cursor: "pointer" }}
                        >
                            <Checkbox
                                size="small"
                                checked={supContributeBan}
                                onClick={() => setSupContributeBan(!supContributeBan)}
                                sx={{
                                    p: 0,
                                    color: faction.primary_color,
                                    "& > .MuiSvgIcon-root": { width: "2.5rem", height: "2.5rem" },
                                    ".Mui-checked, .MuiSvgIcon-root": { color: `${faction.primary_color} !important` },
                                    ".Mui-checked+.MuiSwitch-track": { backgroundColor: `${faction.primary_color}50 !important` },
                                }}
                            />

                            <Typography sx={{ pt: ".4rem", userSelect: "none" }}>Ban user from location select</Typography>
                        </Stack>
                        <Stack
                            spacing="1rem"
                            direction="row"
                            alignItems="center"
                            onClick={() => setLocationSelectBan(!locationSelectBan)}
                            sx={{ cursor: "pointer" }}
                        >
                            <Checkbox
                                size="small"
                                checked={locationSelectBan}
                                onClick={() => setLocationSelectBan(!locationSelectBan)}
                                sx={{
                                    p: 0,
                                    color: faction.primary_color,
                                    "& > .MuiSvgIcon-root": { width: "2.5rem", height: "2.5rem" },
                                    ".Mui-checked, .MuiSvgIcon-root": { color: `${faction.primary_color} !important` },
                                    ".Mui-checked+.MuiSwitch-track": { backgroundColor: `${faction.primary_color}50 !important` },
                                }}
                            />

                            <Typography sx={{ pt: ".4rem", userSelect: "none" }}>Ban user from contributing sups</Typography>
                        </Stack>

                        <Stack spacing="1.5rem" sx={{ mt: "1.6rem" }}>
                            <Stack spacing=".3rem">
                                <Typography sx={{ color: faction.primary_color, fontWeight: "fontWeightBold" }}>Ban Duration (Hours):</Typography>
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
                                            borderColor: `${faction.primary_color} !important`,
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
                                <Typography sx={{ color: faction.primary_color, fontWeight: "fontWeightBold" }}>Ban Duration (Days):</Typography>
                                <TextField
                                    value={banDurationDays === 0 ? "" : banDurationDays.toString()}
                                    placeholder="Ban duration in days"
                                    onChange={(e) => {
                                        setDurationDays(parseInt(e.target.value))
                                    }}
                                    type="number"
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
                                            borderColor: `${faction.primary_color} !important`,
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
                                <Typography sx={{ color: faction.primary_color, fontWeight: "fontWeightBold" }}>Ban reason:</Typography>
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
                                            borderColor: `${faction.primary_color} !important`,
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
                                backgroundColor: faction.primary_color,
                                opacity: 1,
                                border: { isFancy: true, borderColor: faction.primary_color, borderThickness: "2px" },
                                sx: { position: "relative", flex: 1, minWidth: 0, mt: "1.8rem" },
                            }}
                            sx={{ px: "1.6rem", py: ".3rem", color: faction.secondary_color }}
                            onClick={sendBanCommand}
                        >
                            <Typography
                                variant="caption"
                                sx={{
                                    color: faction.secondary_color,
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
