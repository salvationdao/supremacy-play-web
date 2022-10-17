import { useGameServerCommandsUser } from "../../../hooks/useGameServer"
import React, { useCallback, useState } from "react"
import { GameServerKeys } from "../../../keys"
import { Box, IconButton, Modal, Stack, TextField, Typography } from "@mui/material"
import { ClipThing } from "../../Common/ClipThing"
import { colors, fonts, siteZIndex } from "../../../theme/theme"
import { MAX_BAN_PROPOSAL_REASON_LENGTH } from "../../../constants"
import { FancyButton } from "../../Common/FancyButton"
import { SvgClose } from "../../../assets"
import { Faction, User } from "../../../types"

export const AdminUnbanModal = ({
    playerUnbanIDs,
    modalOpen,
    setModalOpen,
    user,
    faction,
    fetchPlayer,
}: {
    playerUnbanIDs: string[]
    modalOpen: boolean
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    user: User
    faction: Faction
    fetchPlayer: (newGid: number) => void
}) => {
    const { send } = useGameServerCommandsUser("/user_commander")
    const [unbanReason, setUnbanReason] = useState<string>("")
    const [reqError, setReqError] = useState<string>("")

    const onClose = useCallback(() => {
        setModalOpen(false)
    }, [setModalOpen])

    const sendUnbanCommand = useCallback(() => {
        ;(async () => {
            try {
                await send<
                    boolean,
                    {
                        player_ban_id: string[]
                        unban_reason: string
                    }
                >(GameServerKeys.ModUnbanUser, {
                    player_ban_id: playerUnbanIDs,
                    unban_reason: unbanReason,
                })

                onClose()
                fetchPlayer(user.gid)
            } catch (e) {
                console.error(e)
                setReqError(typeof e === "string" ? e : "Failed to unban player")
            }
        })()
    }, [fetchPlayer, onClose, playerUnbanIDs, send, unbanReason, user.gid])

    return (
        <AdminUnbanModalInner
            sendUnbanCommand={sendUnbanCommand}
            setUnbanReason={setUnbanReason}
            modalOpen={modalOpen}
            onClose={onClose}
            reqError={reqError}
            user={user}
            faction={faction}
            unbanReason={unbanReason}
        />
    )
}

const AdminUnbanModalInner = ({
    sendUnbanCommand,
    setUnbanReason,
    modalOpen,
    onClose,
    reqError,
    unbanReason,
    user,
    faction,
}: {
    sendUnbanCommand: () => void
    setUnbanReason: (value: ((prevState: string) => string) | string) => void
    modalOpen: boolean
    onClose: () => void
    reqError: string
    unbanReason: string
    user: User
    faction: Faction
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
                    p: "1rem",
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
                            Unban user {user.username} #{user.gid.toString()}
                        </Typography>
                        <Stack spacing=".3rem">
                            <Typography sx={{ color: faction.primary_color, fontWeight: "fontWeightBold" }}>Unban reason:</Typography>
                            <TextField
                                value={unbanReason}
                                placeholder="Type the reason to unban this user..."
                                onChange={(e) => {
                                    const m = e.currentTarget.value
                                    if (m.length <= MAX_BAN_PROPOSAL_REASON_LENGTH) setUnbanReason(e.currentTarget.value)
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

                    <Box sx={{ p: "1rem" }}>
                        <FancyButton
                            clipThingsProps={{
                                clipSize: "9px",
                                backgroundColor: faction.primary_color,
                                opacity: 1,
                                border: { isFancy: true, borderColor: faction.primary_color, borderThickness: "2px" },
                                sx: { position: "relative", minWidth: 0, mt: "1.8rem" },
                            }}
                            sx={{ px: "0.5rem", py: ".3rem", color: faction.secondary_color }}
                            onClick={() => sendUnbanCommand()}
                            disabled={unbanReason === ""}
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
                    </Box>

                    {reqError && (
                        <Typography variant="body2" sx={{ mt: ".3rem", color: colors.red }}>
                            {reqError}
                        </Typography>
                    )}

                    <IconButton size="small" onClick={onClose} sx={{ position: "absolute", top: ".5rem", right: ".5rem" }}>
                        <SvgClose size="2.6rem" sx={{ opacity: 0.1, ":hover": { opacity: 0.6 } }} />
                    </IconButton>
                </ClipThing>
            </Box>
        </Modal>
    )
}
