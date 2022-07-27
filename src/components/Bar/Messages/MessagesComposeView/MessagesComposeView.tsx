import { Box, Stack, Typography } from "@mui/material"
import MDEditor, { commands } from "@uiw/react-md-editor"
import { useEffect, useRef, useState } from "react"
import { useTheme } from "../../../../containers/theme"
import { colors, fonts } from "../../../../theme/theme"
import { FancyButton } from "../../../Common/FancyButton"
import MessageRenderer from "../MessageRenderer"

interface MessageComposeViewProps {
    onBack: () => void
}

export const MessagesComposeView = ({ onBack }: MessageComposeViewProps) => {
    const theme = useTheme()
    const editorContainerEl = useRef<HTMLDivElement>()
    const [message, setMessage] = useState<string>()
    const [height, setHeight] = useState<number>()

    useEffect(() => {
        if (!editorContainerEl.current) return

        setHeight(editorContainerEl.current.clientHeight)
        editorContainerEl.current.setAttribute("data-color-mode", "dark")
    }, [])

    return (
        <Stack p="2rem" height="100%">
            <Stack direction="row">
                <FancyButton
                    clipThingsProps={{
                        clipSize: "7px",
                    }}
                    sx={{
                        fontSize: "2rem",
                        px: "1.2rem",
                        backgroundColor: colors.grey,
                    }}
                    onClick={() => onBack()}
                >
                    Back
                </FancyButton>
            </Stack>
            <Box>
                <Typography>To</Typography>
            </Box>
            <Box>
                <Typography>Subject</Typography>
            </Box>

            <Box
                ref={editorContainerEl}
                flex={1}
                sx={{
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
                    onChange={setMessage}
                />
            </Box>
        </Stack>
    )
}
