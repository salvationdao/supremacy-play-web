import { Box, Stack } from "@mui/material"
import MDEditor from "@uiw/react-md-editor"
import { useState } from "react"
import { MessageRenderer } from "../MessageRenderer"

export const MessagesComposeView = () => {
    const [message, setMessage] = useState<string>()

    return (
        <Stack p="2rem" height="100%">
            <Box>To</Box>
            <Box>Subject</Box>
            <Stack direction="row">
                <MDEditor preview="edit" value={message} onChange={setMessage} />
                <MessageRenderer markdown={message} />
            </Stack>
        </Stack>
    )
}
