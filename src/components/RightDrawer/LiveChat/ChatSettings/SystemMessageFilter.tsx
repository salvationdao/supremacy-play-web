import { Stack, Switch, Typography } from "@mui/material"
import { useChat } from "../../../../containers"

export const SystemMessageFilter = () => {
    const { onlyShowSystemMessages, toggleOnlyShowSystemMessages } = useChat()

    return (
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ px: "1.2rem", py: ".6rem", backgroundColor: "#FFFFFF05", borderRadius: 1 }}
        >
            <Typography sx={{ lineHeight: 1, fontWeight: "fontWeightBold" }}>Only show system messages:</Typography>

            <Switch checked={onlyShowSystemMessages} onChange={() => toggleOnlyShowSystemMessages()} />
        </Stack>
    )
}
