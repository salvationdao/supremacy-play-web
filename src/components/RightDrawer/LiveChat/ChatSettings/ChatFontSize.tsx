import { Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material"
import { useCallback, MouseEvent } from "react"
import { SvgFontCase } from "../../../../assets"
import { useChat } from "../../../../containers"
import { FontSizeType } from "../../../../types"

export const ChatFontSize = () => {
    const { setFontSize, fontSize } = useChat()

    const onChange = useCallback(
        (event: MouseEvent<HTMLElement>, newValue: FontSizeType) => {
            if (newValue) setFontSize(newValue)
        },
        [setFontSize],
    )

    return (
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ px: "1.2rem", py: ".6rem", backgroundColor: "#FFFFFF05", borderRadius: 1 }}
        >
            <Typography sx={{ lineHeight: 1, fontWeight: "bold" }}>Font size:</Typography>
            <ToggleButtonGroup size="small" value={fontSize} exclusive onChange={onChange} sx={{ ".MuiToggleButton-root": { p: ".5rem" } }}>
                <ToggleButton value={0.8}>
                    <SvgFontCase size="1rem" sx={{ minWidth: "2rem" }} />
                </ToggleButton>
                <ToggleButton value={1.2}>
                    <SvgFontCase size="1.5rem" sx={{ minWidth: "2rem" }} />
                </ToggleButton>

                <ToggleButton value={1.35}>
                    <SvgFontCase size="1.9rem" sx={{ minWidth: "1.9rem" }} />
                </ToggleButton>
            </ToggleButtonGroup>
        </Stack>
    )
}
