import { Divider, IconButton, Stack } from "@mui/material"
import { SvgDiscord, SvgTwitter } from "../../assets"

export const BarSocials = () => {
    return (
        <Stack
            direction="row"
            alignItems="center"
            sx={{
                mx: "1rem",
                height: "100%",
            }}
        >
            <Stack direction="row" spacing=".5rem" alignItems="center">
                <IconButton size="small" target="_blank" href="https://discord.com/invite/supremacygame">
                    <SvgDiscord size="2rem" />
                </IconButton>
                <IconButton size="small" target="_blank" href="https://twitter.com/SupremacyMeta">
                    <SvgTwitter size="2rem" />
                </IconButton>
            </Stack>

            <Divider
                orientation="vertical"
                flexItem
                sx={{
                    height: "2.3rem",
                    my: "auto !important",
                    ml: "1.7rem",
                    borderColor: "#494949",
                    borderRightWidth: 1.6,
                }}
            />
        </Stack>
    )
}
