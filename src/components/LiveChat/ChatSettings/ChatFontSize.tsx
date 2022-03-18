import { Stack, ToggleButton, ToggleButtonGroup, Tooltip, Typography } from "@mui/material"
import { SvgChatSplit, SvgFontCase } from "../../../assets"
import { useChat } from "../../../containers"

export const ChatFontSize = () => {
    const { setFontSize, fontSize } = useChat()

    const onChange = (event: React.MouseEvent<HTMLElement>, newValue: number) => {
        if (newValue) setFontSize(newValue)
    }

    return (
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ px: "1.2rem", py: ".6rem", backgroundColor: "#FFFFFF05", borderRadius: 1 }}
        >
            <Typography sx={{ lineHeight: 1, fontWeight: "fontWeightBold" }}>Font Size:</Typography>
            <ToggleButtonGroup
                size="small"
                value={fontSize}
                exclusive
                onChange={onChange}
                sx={{ ".MuiToggleButton-root": { p: ".5rem" } }}
            >
                <ToggleButton value={0.9}>
                    <SvgFontCase size="1rem" sx={{ minWidth: "2rem" }} />
                </ToggleButton>
                <ToggleButton value={1.33}>
                    <SvgFontCase size="1.5rem" sx={{ minWidth: "2rem" }} />
                </ToggleButton>

                <ToggleButton value={2}>
                    <SvgFontCase size="2rem" sx={{ minWidth: "2rem" }} />
                </ToggleButton>
            </ToggleButtonGroup>
        </Stack>
    )
}
