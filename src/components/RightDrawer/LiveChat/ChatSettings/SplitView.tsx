import { Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material"
import { useCallback, MouseEvent } from "react"
import { SvgChatSplit, SvgChatTabbed } from "../../../../assets"
import { useChat } from "../../../../containers"
import { SplitOptionType } from "../../../../types"

export const SplitView = () => {
    const { splitOption, setSplitOption } = useChat()

    const onChange = useCallback(
        (event: MouseEvent<HTMLElement>, newValue: SplitOptionType) => {
            if (newValue) setSplitOption(newValue)
        },
        [setSplitOption],
    )

    return (
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ px: "1.2rem", py: ".6rem", backgroundColor: "#FFFFFF05", borderRadius: 1 }}
        >
            <Typography sx={{ lineHeight: 1, fontWeight: "fontWeightBold" }}>Layout:</Typography>
            <ToggleButtonGroup size="small" value={splitOption} exclusive onChange={onChange} sx={{ ".MuiToggleButton-root": { p: ".5rem" } }}>
                <ToggleButton value="tabbed">
                    <SvgChatTabbed size="1.7rem" />
                </ToggleButton>
                <ToggleButton value="split">
                    <SvgChatSplit size="1.7rem" />
                </ToggleButton>
            </ToggleButtonGroup>
        </Stack>
    )
}
