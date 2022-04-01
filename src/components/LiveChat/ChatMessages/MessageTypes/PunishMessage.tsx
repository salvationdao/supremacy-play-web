import { Box, Stack, Typography } from "@mui/material"
import { StyledImageText, TooltipHelper } from "../../.."
import { SvgAnnouncement } from "../../../../assets"
import { PASSPORT_SERVER_HOST_IMAGES } from "../../../../constants"
import { FactionsAll } from "../../../../containers"
import { snakeToTitle } from "../../../../helpers"
import { colors } from "../../../../theme/theme"
import { PunishMessageData } from "../../../../types/chat"

export const PunishMessage = ({
    data,
    sentAt,
    fontSize,
    factionsAll,
}: {
    data?: PunishMessageData
    sentAt: Date
    fontSize: number
    factionsAll: FactionsAll
}) => {
    // const data = {
    //     issued_by_player_username: "jayli3n",
    //     reported_player_username: "darren_hung",
    //     reported_player_faction_id: "98bf7bb3-1a7c-4f21-8843-458d62884060",
    //     is_passed: true,
    //     total_player_number: 16,
    //     agreed_player_number: 12,
    //     disagreed_player_number: 4,
    //     punish_option: {
    //         id: "string",
    //         description: "Ban forever",
    //         key: "limit_location_select",
    //         punish_duration_hours: 24,
    //     },
    //     punish_reason: "He denied my love.",
    // }

    if (!data) return null

    const {
        issued_by_player_username,
        reported_player_username,
        reported_player_faction_id,
        is_passed,
        agreed_player_number,
        disagreed_player_number,
        punish_option,
        punish_reason,
    } = data

    const factionColor = factionsAll[reported_player_faction_id]?.theme.primary || ""

    return (
        <Stack
            sx={{
                my: ".3rem",
                pl: "1rem",
                borderLeft: `${factionColor || colors.neonBlue} .3rem solid`,
                ".MuiTypography-root": {
                    display: "inline",
                    fontSize: fontSize ? `${1.35 * fontSize}rem` : "1.35rem",
                },
            }}
        >
            <Stack direction="row" spacing=".5rem" sx={{ opacity: 0.7 }} alignItems="center">
                <SvgAnnouncement size="1.1rem" sx={{ pb: ".25rem" }} />
                <Typography sx={{ fontWeight: "fontWeightBold" }}>SYSTEM ANNOUCEMENT</Typography>
            </Stack>

            <Box>
                <StyledImageText
                    text={reported_player_username}
                    color={factionColor || "#FFFFFF"}
                    imageUrl={
                        factionsAll[reported_player_faction_id]
                            ? `${PASSPORT_SERVER_HOST_IMAGES}/api/files/${factionsAll[reported_player_faction_id].logo_blob_id}`
                            : undefined
                    }
                    imageMb={-0.2}
                />
                <Typography>&nbsp;</Typography>

                {is_passed ? (
                    <Typography sx={{ px: ".2rem", backgroundColor: "#00000050", color: colors.green, fontWeight: "fontWeightBold" }}>was</Typography>
                ) : (
                    <Typography sx={{ px: ".2rem", backgroundColor: "#00000050", color: colors.red, fontWeight: "fontWeightBold" }}>was not</Typography>
                )}
                <Typography>&nbsp;punished with&nbsp;</Typography>

                <TooltipHelper placement="left" text={punish_option.description}>
                    <Typography sx={{ px: ".2rem", fontWeight: "fontWeightBold", backgroundColor: "#00000050", ":hover": { opacity: 0.8 } }}>
                        {snakeToTitle(punish_option.key, true)}
                    </Typography>
                </TooltipHelper>

                <Typography>&nbsp;for&nbsp;</Typography>
                <Typography sx={{ px: ".2rem", fontWeight: "fontWeightBold", backgroundColor: "#00000050" }}>{punish_option.punish_duration_hours}</Typography>
                <Typography>&nbsp;hours.</Typography>
            </Box>

            <Box>
                <Typography sx={{ color: colors.green, fontWeight: "fontWeightBold" }}>{agreed_player_number} agreed</Typography>
                <Typography>&nbsp;&nbsp;</Typography>
                <Typography sx={{ color: colors.red, fontWeight: "fontWeightBold" }}>{disagreed_player_number} disagreed</Typography>
            </Box>
        </Stack>
    )
}
