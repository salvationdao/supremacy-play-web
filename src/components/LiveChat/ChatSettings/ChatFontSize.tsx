import { Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material"
import { SvgFontCase } from "../../../assets"
import { FontSizeType, useChat } from "../../../containers"

export const ChatFontSize = () => {
    const { setFontSize, fontSize } = useChat()

    const onChange = (event: React.MouseEvent<HTMLElement>, newValue: FontSizeType) => {
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
                <ToggleButton value={0.75}>
                    <SvgFontCase size="1rem" sx={{ minWidth: "2rem" }} />
                </ToggleButton>
                <ToggleButton value={1}>
                    <SvgFontCase size="1.5rem" sx={{ minWidth: "2rem" }} />
                </ToggleButton>

                <ToggleButton value={1.5}>
                    <SvgFontCase size="2rem" sx={{ minWidth: "2rem" }} />
                </ToggleButton>
            </ToggleButtonGroup>
        </Stack>
    )
}
