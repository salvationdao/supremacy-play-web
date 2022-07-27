import { Box, InputAdornment, Stack, TextField, Typography } from "@mui/material"
import MDEditor, { commands } from "@uiw/react-md-editor"
import { useEffect, useRef, useState } from "react"
import { SvgSend } from "../../../../assets"
import { useTheme } from "../../../../containers/theme"
import { scaleUpKeyframes } from "../../../../theme/keyframes"
import { colors, fonts } from "../../../../theme/theme"
import { FancyButton } from "../../../Common/FancyButton"
import MessageRenderer from "../MessageRenderer"

interface MessageComposeViewProps {
    onBack: () => void
}

const MESSAGE_LIMIT = 1000

export const MessagesComposeView = ({ onBack }: MessageComposeViewProps) => {
    const theme = useTheme()

    const editorContainerEl = useRef<HTMLDivElement>()
    const [height, setHeight] = useState<number>()

    const [to, setTo] = useState("")
    const [subject, setSubject] = useState("")
    const [message, setMessage] = useState("")

    useEffect(() => {
        if (!editorContainerEl.current) return

        setHeight(editorContainerEl.current.clientHeight)
        editorContainerEl.current.setAttribute("data-color-mode", "dark")
    }, [])

    return (
        <Stack p="2rem" height="100%" spacing="1rem">
            <Stack
                direction="row"
                sx={{
                    pb: "1rem",
                    borderBottom: `${theme.factionTheme.primary}70 1.5px solid`,
                }}
            >
                <Typography variant="h6" sx={{ fontFamily: fonts.nostromoBlack }}>
                    COMPOSE MESSAGE
                </Typography>
            </Stack>
            <Stack spacing=".5rem">
                <TextField
                    variant="outlined"
                    hiddenLabel
                    fullWidth
                    placeholder="Recipient ID"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: "fontWeightBold",
                                    }}
                                >
                                    To
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
                    value={to}
                    onChange={(e) => {
                        setTo(e.target.value)
                    }}
                />
                <TextField
                    variant="outlined"
                    hiddenLabel
                    fullWidth
                    placeholder="Message subject"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: "fontWeightBold",
                                    }}
                                >
                                    Subject
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
                    value={subject}
                    onChange={(e) => {
                        setSubject(e.target.value)
                    }}
                />
            </Stack>
            <Box
                ref={editorContainerEl}
                flex={1}
                sx={{
                    "& .w-md-editor-toolbar": {
                        borderRadius: 0,
                    },
                    "& .w-md-editor-text": {
                        fontFamily: fonts.shareTechMono,
                        "& *": {
                            fontFamily: `${fonts.shareTechMono} !important`,
                        },
                        // "& .w-md-editor-text-pre": {
                        // },
                        // "& .w-md-editor-text-input": {
                        // },
                    },
                }}
            >
                <MDEditor
                    id="md-editor"
                    preview="live"
                    previewOptions={MessageRenderer.generateOptions(theme.factionTheme.background)}
                    style={{
                        backgroundColor: theme.factionTheme.background,
                        boxShadow: "none",
                    }}
                    height={height}
                    commands={[
                        commands.bold,
                        commands.italic,
                        commands.strikethrough,
                        commands.hr,
                        commands.group([commands.title1, commands.title2, commands.title3, commands.title4, commands.title5, commands.title6], {
                            name: "title",
                            groupName: "title",
                            buttonProps: { "aria-label": "Insert title" },
                        }),
                        commands.divider,
                        commands.link,
                        commands.quote,
                        commands.code,
                        commands.codeBlock,
                        commands.image,
                        commands.divider,
                        commands.unorderedListCommand,
                        commands.orderedListCommand,
                        commands.checkedListCommand,
                    ]}
                    extraCommands={[commands.codeEdit, commands.codeLive, commands.codePreview]}
                    visibleDragbar={false}
                    value={message}
                    onChange={(value) => {
                        setMessage((value || "").substring(0, MESSAGE_LIMIT))
                    }}
                />
            </Box>
            <Stack direction="row" alignItems="start">
                <FancyButton
                    clipThingsProps={{
                        clipSize: "7px",
                    }}
                    sx={{
                        px: "1.2rem",
                        fontSize: "1.6rem",
                        backgroundColor: colors.grey,
                        "&:hover": {
                            backgroundColor: colors.red,
                            color: "white",
                        },
                    }}
                    onClick={() => onBack()}
                >
                    Discard / Back
                </FancyButton>
                <Box flex={1} />
                <Stack direction="row">
                    <Typography
                        sx={{
                            color: colors.grey,
                        }}
                    >
                        <Box
                            key={message ? message.length : 0}
                            component="span"
                            sx={{
                                animate: `${scaleUpKeyframes} .2s ease-out`,
                            }}
                        >
                            {message ? message.length : 0}
                        </Box>{" "}
                        / {MESSAGE_LIMIT}
                    </Typography>
                </Stack>
                <FancyButton
                    clipThingsProps={{
                        clipSize: "7px",
                        sx: {
                            ml: "1rem",
                        },
                    }}
                    sx={{
                        px: "1.2rem",
                        fontSize: "1.6rem",
                        backgroundColor: colors.green,
                    }}
                    endIcon={<SvgSend />}
                    disabled={!message}
                >
                    Submit Message
                </FancyButton>
            </Stack>
        </Stack>
    )
}
