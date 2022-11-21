import { Box, MenuItem, Modal, Select, Stack, TextField, Typography } from "@mui/material"
import { useCallback, useState } from "react"
import { useGlobalNotifications } from "../../../../containers"
import { useTheme } from "../../../../containers/theme"
import { useToggle } from "../../../../hooks"
import { useGameServerCommandsUser } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { colors, fonts, siteZIndex } from "../../../../theme/theme"
import { TextMessageData, User } from "../../../../types"
import { ClipThing } from "../../../Common/Deprecated/ClipThing"
import { FancyButton } from "../../../Common/Deprecated/FancyButton"
import { PlayerNameGid } from "../../../Common/PlayerNameGid"

interface ReportSend {
    message_id: string
    reason: string
    other_description?: string
    description: string
}

enum reasons {
    OffensiveLanguage = "Offensive Language",
    HateSpeech = "Hate Speech",
    Scams = "Scams",
    Spam = "Spamming",
    UAAdvertisement = "Unauthorized Advertisement",
    Cheating = "Cheating/Sabotaging",
    Other = "Other",
}

interface ReportModalProps {
    fromUser: User
    message: TextMessageData
    setReportModalOpen: (value?: boolean) => void
    reportModalOpen: boolean
}

export const ReportModal = ({ fromUser, message, reportModalOpen, setReportModalOpen }: ReportModalProps) => {
    const theme = useTheme()
    const { newSnackbarMessage } = useGlobalNotifications()
    const { send } = useGameServerCommandsUser("/user_commander")

    const [reason, setReason] = useState<string>(reasons.OffensiveLanguage)
    const [otherDescription, setOtherDescription] = useState<string>("")
    const [description, setDescription] = useState<string>("")
    const [loading, setLoading] = useToggle(false)
    const [error, setError] = useState<string>()

    const handleReport = useCallback(async () => {
        if (!message.id || loading) return
        const payload: ReportSend = {
            message_id: message.id,
            reason: reason,
            other_description: otherDescription,
            description: description,
        }

        try {
            setLoading(true)
            const resp = await send<boolean, ReportSend>(GameServerKeys.ChatReport, payload)
            if (!resp) return
            newSnackbarMessage("Thank you for reporting the message.", "success")
            setReportModalOpen(false)
        } catch (err) {
            setError(typeof err === "string" ? err : "Failed to send report, try again or contact support.")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }, [message, reason, otherDescription, description, send, newSnackbarMessage, setReportModalOpen, loading, setLoading])

    const primaryColor = theme.factionTheme.primary
    const secondaryColor = theme.factionTheme.text
    const backgroundColor = theme.factionTheme.background

    return (
        <Modal open={reportModalOpen} onClose={() => setReportModalOpen(false)} sx={{ zIndex: siteZIndex.Modal }}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "60rem",
                    maxWidth: "calc(100vw - 18rem)",
                    boxShadow: 6,
                    outline: "none",
                }}
            >
                <ClipThing
                    clipSize="8px"
                    border={{
                        borderColor: primaryColor,
                        borderThickness: ".3rem",
                    }}
                    sx={{ position: "relative" }}
                    backgroundColor={backgroundColor}
                >
                    <Stack spacing="1.4rem" sx={{ p: "2rem" }}>
                        <Typography sx={{ fontFamily: fonts.nostromoBlack }}>MESSAGE REPORTING</Typography>

                        <Stack direction="row" alignItems="flex-start">
                            <Typography sx={{ width: "10rem", fontWeight: "bold" }}>User:</Typography>
                            <PlayerNameGid player={fromUser} />
                        </Stack>

                        <Stack direction="row" alignItems="flex-start">
                            <Typography sx={{ width: "10rem", fontWeight: "bold" }}>Message:</Typography>
                            <Typography>{message.message}</Typography>
                        </Stack>

                        <Stack direction="row" alignItems="flex-start">
                            <Typography sx={{ width: "10rem", fontWeight: "bold" }}>Reason:</Typography>

                            <Select
                                sx={{
                                    flex: 1,
                                    "&:hover": {
                                        backgroundColor: `${primaryColor}80`,
                                        ".MuiTypography-root": { color: secondaryColor },
                                    },
                                    ".MuiTypography-root": {
                                        px: "1rem",
                                        py: ".5rem",
                                    },
                                    "& .MuiSelect-outlined": { px: ".8rem", pt: ".2rem", pb: 0 },
                                    ".MuiOutlinedInput-notchedOutline": {
                                        borderRadius: 0.5,
                                    },
                                    ".MuiSelect-select": {
                                        ".MuiTypography-root": {
                                            color: secondaryColor,
                                        },
                                    },
                                    ".MuiSelect-icon": {
                                        fill: secondaryColor,
                                    },
                                }}
                                value={reason || ""}
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
                                            backgroundColor: colors.darkNavy,
                                            borderRadius: 0.5,
                                        },
                                    },
                                }}
                            >
                                {Object.values(reasons).map((x, i) => {
                                    return (
                                        <MenuItem
                                            key={x + i}
                                            value={x}
                                            onClick={() => {
                                                setReason(x)
                                            }}
                                            sx={{ "&:hover": { backgroundColor: "#FFFFFF20" } }}
                                        >
                                            <Typography textTransform="uppercase" sx={{ fontWeight: "bold" }}>
                                                {x}
                                            </Typography>
                                        </MenuItem>
                                    )
                                })}
                            </Select>
                        </Stack>

                        {reason === reasons.Other && (
                            <Stack direction="row" alignItems="flex-start">
                                <Typography sx={{ width: "10rem", fontWeight: "bold" }}>Description:</Typography>

                                <TextField
                                    required={reason === reasons.Other}
                                    value={otherDescription}
                                    onChange={(e) => {
                                        setOtherDescription(e.target.value)
                                    }}
                                    sx={{
                                        flex: 1,
                                        "& .MuiInputBase-input": {
                                            p: ".5rem",
                                        },
                                    }}
                                    inputProps={{ maxLength: 30 }}
                                />
                            </Stack>
                        )}

                        <Stack direction="row" alignItems="flex-start">
                            <Typography sx={{ width: "10rem", fontWeight: "bold" }}>Comments:</Typography>

                            <TextField
                                multiline
                                required
                                minRows={2}
                                value={description}
                                onChange={(e) => {
                                    setDescription(e.target.value)
                                }}
                                sx={{
                                    flex: 1,
                                    "& .MuiInputBase-root": {
                                        p: ".5rem",
                                    },
                                }}
                            />
                        </Stack>

                        <Box sx={{ mt: "auto" }}>
                            <FancyButton
                                loading={loading}
                                clipThingsProps={{
                                    clipSize: "9px",
                                    backgroundColor: primaryColor,
                                    opacity: 1,
                                    border: { borderColor: primaryColor, borderThickness: "2px" },
                                    sx: { position: "relative" },
                                }}
                                sx={{ px: "1.6rem", py: ".6rem", color: secondaryColor }}
                                onClick={handleReport}
                            >
                                <Typography variant="caption" sx={{ fontFamily: fonts.nostromoBlack, color: secondaryColor }}>
                                    REPORT
                                </Typography>
                            </FancyButton>
                        </Box>

                        {error && (
                            <Typography variant="body2" sx={{ color: colors.red }}>
                                {error}
                            </Typography>
                        )}
                    </Stack>
                </ClipThing>
            </Box>
        </Modal>
    )
}
