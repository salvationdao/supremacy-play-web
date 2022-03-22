import { Stack, Switch, Typography } from "@mui/material"
import { useChat } from "../../../containers"
import { colors } from "../../../theme/theme"

export const ChatFilter = ({ faction_id }: { faction_id: string | null }) => {
    const { filterZerosGlobal, toggleFilterZerosGlobal, filterZerosFaction, toggleFilterZerosFaction } = useChat()

    return (
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ px: "1.2rem", py: ".6rem", backgroundColor: "#FFFFFF05", borderRadius: 1 }}
        >
            <Typography sx={{ lineHeight: 1, fontWeight: "fontWeightBold" }}>
                Hide users with no multipliers:
            </Typography>
            <Switch
                size="small"
                checked={faction_id ? filterZerosFaction : filterZerosGlobal}
                onChange={faction_id ? () => toggleFilterZerosFaction() : () => toggleFilterZerosGlobal()}
                sx={{
                    transform: "scale(.7)",
                    ".Mui-checked": { color: colors.neonBlue },
                    ".Mui-checked+.MuiSwitch-track": { backgroundColor: `${colors.neonBlue}50` },
                }}
            />
        </Stack>
    )
}
