import { Box, InputAdornment, Stack, TextField, Typography } from "@mui/material"
import MDEditor, { commands } from "@uiw/react-md-editor"
import { useCallback, useEffect, useRef, useState } from "react"
import { SvgSend } from "../../../../assets"
import { useGlobalNotifications } from "../../../../containers"
import { useTheme } from "../../../../containers/theme"
import { useGameServerCommandsUser } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { scaleUpKeyframes } from "../../../../theme/keyframes"
import { colors, fonts } from "../../../../theme/theme"
import { SystemMessageDataType } from "../../../../types"
import { NiceButton } from "../../../Common/Nice/NiceButton"
import MessageRenderer from "../MessageRenderer"

interface MessageComposeViewProps {
    onBack: () => void
    type: SystemMessageDataType
}

const MESSAGE_LIMIT = 1000

export const MessagesComposeView = ({ onBack, type }: MessageComposeViewProps) => {
    const theme = useTheme()
    const { send } = useGameServerCommandsUser("/user_commander")
    const { newSnackbarMessage } = useGlobalNotifications()

    const editorContainerEl = useRef<HTMLDivElement>()
    const [height, setHeight] = useState<number>()

    // const [to, setTo] = useState("")
    const [subject, setSubject] = useState("")
    const [message, setMessage] = useState("")

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string>()

    useEffect(() => {
        if (!editorContainerEl.current) return

        setHeight(editorContainerEl.current.clientHeight)
        editorContainerEl.current.setAttribute("data-color-mode", "dark")
    }, [])

    const onSend = useCallback(async () => {
        try {
            setLoading(true)
            await send(GameServerKeys.SystemMessageSend, {
                type,
                subject,
                message,
            })
            newSnackbarMessage(`Successfully sent ${type} message.`, "success")
            setError(undefined)
            onBack()
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message)
            } else if (typeof e === "string") {
                setError(e)
            }
        } finally {
            setLoading(false)
        }
    }, [send, type, subject, message, newSnackbarMessage, onBack])

    return (
        <Stack height="100%" spacing="1rem">
            <Stack
                direction="row"
                sx={{
                    p: "1rem 2rem",
                    pt: "1.5rem",
                    borderBottom: `${colors.darkGrey} 1.5px solid`,
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
                                <Typography variant="h6" sx={{ lineHeight: 1, fontWeight: "bold" }}>
                                    TO:
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
                                WebkitAppearance: "none",
                            },
                        },
                        ".MuiOutlinedInput-notchedOutline": { border: "unset" },
                    }}
                    type="text"
                    value={type}
                    disabled
                />

                <TextField
                    variant="outlined"
                    hiddenLabel
                    fullWidth
                    placeholder="Message subject"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Typography variant="h6" sx={{ lineHeight: 1, fontWeight: "bold" }}>
                                    SUBJECT:
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
                                WebkitAppearance: "none",
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
                    },
                }}
            >
                <MDEditor
                    id="md-editor"
                    preview="live"
                    previewOptions={MessageRenderer.generateOptions(theme.factionTheme.u800)}
                    style={{
                        backgroundColor: theme.factionTheme.u800,
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

            <Stack direction="row" spacing="1rem" alignItems="center" sx={{ pb: "1rem", px: "2rem" }}>
                <NiceButton buttonColor={colors.grey} onClick={onBack}>
                    Discard / Back
                </NiceButton>

                <Box flex={1} />

                {error && <Typography sx={{ color: colors.red, mr: "1rem" }}>{error}</Typography>}

                <Stack direction="row">
                    <Typography sx={{ color: colors.grey }}>
                        <Box component="span" key={message ? message.length : 0} sx={{ animate: `${scaleUpKeyframes} .2s ease-out` }}>
                            {message?.length || 0}
                        </Box>{" "}
                        / {MESSAGE_LIMIT}
                    </Typography>
                </Stack>

                <NiceButton disabled={!message || loading} loading={loading} buttonColor={colors.green} onClick={onSend}>
                    Submit Message <SvgSend size="1.6rem" inline />
                </NiceButton>
            </Stack>
        </Stack>
    )
}
