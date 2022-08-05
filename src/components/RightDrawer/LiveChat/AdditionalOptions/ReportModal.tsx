import { Box, MenuItem, Modal, Select, Stack, TextField, Typography } from "@mui/material"
import { useCallback, useState } from "react"
import { TextMessageData } from "../../../../types"
import { colors, siteZIndex } from "../../../../theme/theme"
import { ClipThing } from "../../../Common/ClipThing"
import { useTheme } from "../../../../containers/theme"
import { FancyButton } from "../../../Common/FancyButton"
import { GameServerKeys } from "../../../../keys"
import { useGameServerCommandsUser } from "../../../../hooks/useGameServer"
import { useSnackbar } from "../../../../containers"

interface ReportModalProps {
    message: TextMessageData
    setReportModalOpen: (value?: boolean) => void
    reportModalOpen: boolean
}

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

export const ReportModal = ({ message, reportModalOpen, setReportModalOpen }: ReportModalProps) => {
    const theme = useTheme()
    const { newSnackbarMessage } = useSnackbar()
    const { send } = useGameServerCommandsUser("/user_commander")

    const [reason, setReason] = useState<string>(reasons.OffensiveLanguage)
    const [otherDescription, setOtherDescription] = useState<string>("")
    const [description, setDescription] = useState<string>("")

    const handleReport = useCallback(async () => {
        if (!message.id) return
        const payload: ReportSend = {
            message_id: message.id,
            reason: reason,
            other_description: otherDescription,
            description: description,
        }

        try {
            const resp = await send<boolean, ReportSend>(GameServerKeys.ChatReport, payload)
            if (!resp) return
            setReportModalOpen(false)
            newSnackbarMessage("Thank you, your report has been successful.", "success")
        } catch (e) {
            console.error(e)
            newSnackbarMessage(typeof e === "string" ? e : "Failed to send report, try again or contact support.", "error")
        }
    }, [message, reason, otherDescription, description, send, newSnackbarMessage, setReportModalOpen])

    const primaryColor = theme.factionTheme.primary
    const secondaryColor = theme.factionTheme.secondary
    const backgroundColor = theme.factionTheme.background

    // const reasons = ["Offensive Language", "Hate Speech", "Scams", "Spamming", "Unauthorized Advertisement", "Cheating/Sabotaging", "Other"]

    //only display if net !== 0 or is hovered
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
                    <form onSubmit={handleReport}>
                        <Box sx={{ padding: "2rem", display: "grid", gridTemplateColumns: "70px 1fr", gridGap: "1rem" }}>
                            <Typography variant={"h3"} sx={{ gridColumn: "1 / 3" }}>
                                Report {message.from_user.username}
                            </Typography>
                            <Typography sx={{ gridColumn: "1 / 2" }}>Message:</Typography>
                            <Typography sx={{ gridColumn: "2 / 3" }}>{message.message}</Typography>

                            <Typography sx={{ mr: "1rem", gridColumn: "1 / 2" }}>Reason:</Typography>
                            <Select
                                sx={{
                                    width: "100%",
                                    gridColumn: "2 / 3",
                                    borderRadius: 0.5,
                                    "&:hover": {
                                        backgroundColor: primaryColor,
                                        ".MuiTypography-root": { color: (theme) => theme.factionTheme.secondary },
                                    },
                                    ".MuiTypography-root": {
                                        px: "1rem",
                                        py: ".5rem",
                                    },
                                    "& .MuiSelect-outlined": { px: ".8rem", pt: ".2rem", pb: 0 },
                                }}
                                value={reason ?? ""}
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
                                            <Typography textTransform="uppercase">{x}</Typography>
                                        </MenuItem>
                                    )
                                })}
                            </Select>
                            {reason === reasons.Other && (
                                <Stack direction={"row"} sx={{ alignItems: "center", gridColumn: "1 / 3", ml: "3rem" }}>
                                    <Typography>Description:</Typography>
                                    <TextField
                                        required={reason === reasons.Other}
                                        value={otherDescription}
                                        onChange={(e) => {
                                            setOtherDescription(e.target.value)
                                        }}
                                        sx={{
                                            width: "100%",
                                            ml: "1rem",
                                            "& .MuiInputBase-input": {
                                                p: ".5rem",
                                            },
                                        }}
                                        inputProps={{ maxLength: 30 }}
                                    />
                                </Stack>
                            )}
                            <Typography sx={{ gridColumn: "1 / 2" }}>Comments:</Typography>
                            <TextField
                                multiline
                                required
                                minRows={2}
                                value={description}
                                onChange={(e) => {
                                    setDescription(e.target.value)
                                }}
                                sx={{
                                    gridColumn: "2 / 3",
                                    "& .MuiInputBase-root": {
                                        p: ".5rem",
                                    },
                                }}
                            />
                            <Box sx={{ gridColumn: "1 / 3" }}>
                                <FancyButton type={"submit"}>Report</FancyButton>
                            </Box>
                        </Box>
                    </form>
                </ClipThing>
            </Box>
        </Modal>
    )
}
