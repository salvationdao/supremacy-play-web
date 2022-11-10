import { useGameServerCommandsUser } from "../../../hooks/useGameServer"
import React, { useCallback, useState } from "react"
import { GameServerKeys } from "../../../keys"
import { Box, IconButton, Modal, Stack, TextField, Typography } from "@mui/material"
import { ClipThing } from "../../Common/Deprecated/ClipThing"
import { colors, fonts, siteZIndex } from "../../../theme/theme"
import { MAX_BAN_PROPOSAL_REASON_LENGTH } from "../../../constants"
import { FancyButton } from "../../Common/Deprecated/FancyButton"
import { SvgClose } from "../../../assets"

export const RestartServerModal = ({ modalOpen, setModalOpen }: { modalOpen: boolean; setModalOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const { send } = useGameServerCommandsUser("/user_commander")
    const [restartReason, setRestartReason] = useState<string>("")
    const [reqError, setReqError] = useState<string>("")

    const onClose = useCallback(() => {
        setModalOpen(false)
    }, [setModalOpen])

    const sendRestartCommand = useCallback(() => {
        ;(async () => {
            try {
                await send<
                    boolean,
                    {
                        reason: string
                    }
                >(GameServerKeys.ModRestartServer, {
                    reason: restartReason,
                })

                onClose()
            } catch (e) {
                console.error(e)
                setReqError(typeof e === "string" ? e : "Failed to unban player")
            }
        })()
    }, [onClose, send, restartReason])

    return (
        <AdminUnbanModalInner
            sendUnbanCommand={sendRestartCommand}
            setRestartReason={setRestartReason}
            modalOpen={modalOpen}
            onClose={onClose}
            reqError={reqError}
            restartReason={restartReason}
        />
    )
}

const AdminUnbanModalInner = ({
    sendUnbanCommand,
    setRestartReason,
    modalOpen,
    onClose,
    reqError,
    restartReason,
}: {
    sendUnbanCommand: () => void
    setRestartReason: (value: ((prevState: string) => string) | string) => void
    modalOpen: boolean
    onClose: () => void
    reqError: string
    restartReason: string
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
                        borderColor: colors.red,
                        borderThickness: ".3rem",
                    }}
                    sx={{ position: "relative" }}
                    backgroundColor={colors.darkGrey}
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
                        <Typography sx={{ mb: "1.2rem", fontFamily: fonts.nostromoBlack }}>RESTART GAMESERVER</Typography>

                        <Typography sx={{ mb: "1.2rem" }}>
                            WARNING: This action is recorded and reported. Consider messaging #rapid-response-unit before attempting restart. If you are
                            proceeding please provide a really good reason before considering restarting the server.
                        </Typography>
                        <Stack spacing=".3rem">
                            <Typography sx={{ color: colors.red, fontWeight: "bold" }}>Restart reason:</Typography>
                            <TextField
                                value={restartReason}
                                placeholder="Type the reason to restart server..."
                                onChange={(e) => {
                                    const m = e.currentTarget.value
                                    if (m.length <= MAX_BAN_PROPOSAL_REASON_LENGTH) setRestartReason(e.currentTarget.value)
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
                                        borderColor: `${colors.red} !important`,
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
                                backgroundColor: colors.red,
                                opacity: 1,
                                border: { isFancy: true, borderColor: colors.red, borderThickness: "2px" },
                                sx: { position: "relative", minWidth: 0, mt: "1.8rem" },
                            }}
                            sx={{ px: "0.5rem", py: ".3rem", color: colors.offWhite }}
                            onClick={() => sendUnbanCommand()}
                            disabled={restartReason === ""}
                        >
                            <Typography
                                variant="caption"
                                sx={{
                                    color: colors.offWhite,
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
