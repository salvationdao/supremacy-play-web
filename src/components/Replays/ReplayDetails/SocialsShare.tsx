import { Box, IconButton, Stack } from "@mui/material"
import { useEffect } from "react"
import { SvgContentCopyIcon, SvgFacebook, SvgTwitter } from "../../../assets"
import { useToggle } from "../../../hooks"
import { TooltipHelper } from "../../Common/TooltipHelper"

export const SocialsShare = () => {
    const [copySuccess, toggleCopySuccess] = useToggle()

    useEffect(() => {
        if (copySuccess) {
            const timeout = setTimeout(() => {
                toggleCopySuccess(false)
            }, 900)

            return () => clearTimeout(timeout)
        }
    }, [copySuccess, toggleCopySuccess])

    return (
        <Stack direction="row" spacing=".1rem" alignItems="center">
            {/* <IconButton size="small" sx={{ opacity: 0.6, ":hover": { opacity: 1 } }} target="_blank" href="https://discord.com/invite/supremacygame">
                <SvgDiscord size="2rem" />
            </IconButton> */}

            <IconButton
                size="small"
                sx={{ opacity: 0.6, ":hover": { opacity: 1 } }}
                target="_blank"
                href={`https://www.facebook.com/sharer/sharer.php?u=${location.href}`}
            >
                <SvgFacebook size="2rem" />
            </IconButton>

            <IconButton
                size="small"
                sx={{ opacity: 0.6, ":hover": { opacity: 1 } }}
                target="_blank"
                href={`https://twitter.com/intent/tweet?url=${location.href}&text=Check out this %23Supremacy battle!`}
            >
                <SvgTwitter size="2rem" />
            </IconButton>

            <TooltipHelper open={copySuccess} placement="right" text="Copied!">
                <Box>
                    <IconButton
                        size="small"
                        sx={{ opacity: 0.6, ":hover": { opacity: 1 } }}
                        onClick={() => {
                            navigator.clipboard.writeText(location.href).then(
                                () => toggleCopySuccess(true),
                                () => toggleCopySuccess(false),
                            )
                        }}
                    >
                        <SvgContentCopyIcon size="2rem" />
                    </IconButton>
                </Box>
            </TooltipHelper>
        </Stack>
    )
}
