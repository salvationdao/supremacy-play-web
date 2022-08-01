import { Box, MenuItem, Modal, Select, Stack, TextField, Typography } from "@mui/material"
import { useCallback, useState } from "react"
import { TextMessageData } from "../../../../types"
import { colors, siteZIndex } from "../../../../theme/theme"
import { ClipThing } from "../../../Common/ClipThing"
import { useTheme } from "../../../../containers/theme"
import { FancyButton } from "../../../Common/FancyButton"

interface ReportModalProps {
    message: TextMessageData
    setReportModalOpen: (value?: boolean) => void
    reportModalOpen: boolean
}

interface ReportSend {
    reported_user_id: string
    message: string
    reason: string
    other_description: string
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
    const [selected, setSelected] = useState<string>(reasons.OffensiveLanguage)

    const handleReport = useCallback(async () => {
        if (!message.id) return

        try {
            console.log("lol")
        } catch (e) {
            console.error(e)
        }
    }, [message])

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
                    <Box sx={{ padding: "1rem" }}>
                        <Typography variant={"h3"}>Report {message.from_user.username}</Typography>
                        <Typography>Message:</Typography>
                        <Typography>{message.message}</Typography>
                        <Stack direction={"row"} sx={{ alignItems: "center" }}>
                            <Typography sx={{ mr: "1rem" }}>Reason:</Typography>
                            <Select
                                sx={{
                                    width: "100%",
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
                                value={selected ?? ""}
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
                                                setSelected(x)
                                            }}
                                            sx={{ "&:hover": { backgroundColor: "#FFFFFF20" } }}
                                        >
                                            <Typography textTransform="uppercase">{x}</Typography>
                                        </MenuItem>
                                    )
                                })}
                            </Select>
                        </Stack>
                        {selected === reasons.Other && (
                            <Stack direction={"row"} sx={{ alignItems: "center" }}>
                                <Typography>Description:</Typography>
                                <TextField />
                            </Stack>
                        )}
                        <Stack direction={"row"} sx={{ alignItems: "center" }}>
                            <Typography>Comments:</Typography>
                            <TextField />
                        </Stack>
                        <FancyButton onClick={() => handleReport()}>Report</FancyButton>
                    </Box>
                </ClipThing>
            </Box>
        </Modal>
    )
}
