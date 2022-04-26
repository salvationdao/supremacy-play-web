import { Box, Stack, Typography } from "@mui/material"
import { TooltipHelper } from "../.."
import { SvgCooldown } from "../../../assets"

interface BattleAbilityTextTopProps {
    label: string
    description: string
    image_url: string
    colour: string
    cooldown_duration_second: number
}

export const BattleAbilityTextTop = ({ label, description, image_url, colour, cooldown_duration_second }: BattleAbilityTextTopProps) => (
    <Stack spacing="2.4rem" direction="row" alignItems="center" justifyContent="space-between" alignSelf="stretch">
        <TooltipHelper placement="right" text={description}>
            <Stack spacing=".8rem" direction="row" alignItems="center" justifyContent="center">
                <Box
                    sx={{
                        height: "1.9rem",
                        width: "1.9rem",
                        backgroundImage: `url(${image_url})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                        backgroundColor: colour || "#030409",
                        border: `${colour} 1px solid`,
                        borderRadius: 0.6,
                        mb: ".24rem",
                    }}
                />
                <Typography
                    sx={{
                        lineHeight: 1,
                        fontWeight: "fontWeightBold",
                        fontFamily: "Nostromo Regular Bold",
                        color: colour,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: "20rem",
                    }}
                >
                    {label}
                </Typography>
            </Stack>
        </TooltipHelper>

        <Stack spacing=".24rem" direction="row" alignItems="center" justifyContent="center">
            <SvgCooldown component="span" size="1.3rem" fill={"grey"} sx={{ pb: ".32rem" }} />
            <Typography variant="body2" sx={{ lineHeight: 1, color: "grey !important" }}>
                {cooldown_duration_second}s
            </Typography>
        </Stack>
    </Stack>
)
