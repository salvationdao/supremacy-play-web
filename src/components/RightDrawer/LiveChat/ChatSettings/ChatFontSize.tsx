import { Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material"
import { useCallback } from "react"
import { SvgFontCase } from "../../../../assets"
import { FontSizeType, useChat } from "../../../../containers"

export const ChatFontSize = () => {
    const { setFontSize, fontSize } = useChat()

    const onChange = useCallback((event: React.MouseEvent<HTMLElement>, newValue: FontSizeType) => {
        if (newValue) setFontSize(newValue)
    }, [])

    return (
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ px: "1.2rem", py: ".6rem", backgroundColor: "#FFFFFF05", borderRadius: 1 }}
        >
            <Typography sx={{ lineHeight: 1, fontWeight: "fontWeightBold" }}>Font size:</Typography>
            <ToggleButtonGroup size="small" value={fontSize} exclusive onChange={onChange} sx={{ ".MuiToggleButton-root": { p: ".5rem" } }}>
                <ToggleButton value={0.8}>
                    <SvgFontCase size="1rem" sx={{ minWidth: "2rem" }} />
                </ToggleButton>
                <ToggleButton value={1.1}>
                    <SvgFontCase size="1.5rem" sx={{ minWidth: "2rem" }} />
                </ToggleButton>

                <ToggleButton value={1.35}>
                    <SvgFontCase size="1.9rem" sx={{ minWidth: "1.9rem" }} />
                </ToggleButton>
            </ToggleButtonGroup>
        </Stack>
    )
}
