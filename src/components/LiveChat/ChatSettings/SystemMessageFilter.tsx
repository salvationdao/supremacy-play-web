import { Stack, Switch, Typography } from "@mui/material"
import { useChat } from "../../../containers"
import { colors } from "../../../theme/theme"

export const SystemMessageFilter = () => {
    const { filterSystemMessages, toggleFilterSystemMessages } = useChat()

    return (
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ px: "1.2rem", py: ".6rem", backgroundColor: "#FFFFFF05", borderRadius: 1 }}
        >
            <Typography sx={{ lineHeight: 1, fontWeight: "fontWeightBold" }}>Only show system messages:</Typography>
            <Switch
                size="small"
                checked={filterSystemMessages}
                onChange={() => toggleFilterSystemMessages()}
                sx={{
                    transform: "scale(.7)",
                    ".Mui-checked": { color: `${colors.neonBlue} !important` },
                    ".Mui-checked+.MuiSwitch-track": { backgroundColor: `${colors.neonBlue}50 !important` },
                }}
            />
        </Stack>
    )
}
