import { Box, Popover, Stack, Typography } from "@mui/material"
import { useMemo, useRef } from "react"
import { ClipThing } from "../../.."
import { SvgSkull2, SvgInfoCircular, SvgAbility, SvgDeath, SvgView } from "../../../../assets"
import { NullUUID, PASSPORT_SERVER_HOST_IMAGES } from "../../../../constants"
import { FactionsAll } from "../../../../containers"
import { dateFormatter, truncate } from "../../../../helpers"
import { useToggle } from "../../../../hooks"
import { colors } from "../../../../theme/theme"
import { TextMessageData } from "../../../../types/chat"
import { UserStat } from "../../../../types"
import { TooltipHelper } from "../../../Common/TooltipHelper"

const getMultiplierColor = (multiplierInt: number): string => {
    return multiplierInt >= 149 ? colors.neonBlue : multiplierInt >= 99 ? colors.yellow : multiplierInt >= 49 ? colors.health : colors.orange
}

const UserDetailsPopover = ({
    factionLogoBlobID,
    factionColor,
    username,
    userStat,
    popoverRef,
    open,
    onClose,
}: {
    factionLogoBlobID?: string
    factionColor?: string
    username: string
    userStat?: UserStat
    popoverRef: React.MutableRefObject<null>
    open: boolean
    onClose: () => void
}) => {
    if (!userStat) return null

    return (
        <Popover
            open={open}
            anchorEl={popoverRef.current}
            onClose={onClose}
            anchorOrigin={{
                vertical: "top",
                horizontal: "left",
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            sx={{
                mt: "-.3rem",
                ml: "-1rem",
                zIndex: 10000,
                ".MuiPaper-root": {
                    background: "none",
                },
            }}
        >
            <ClipThing
                clipSize="0"
                border={{
                    isFancy: true,
                    borderColor: factionColor || colors.neonBlue,
                    borderThickness: ".2rem",
                }}
                innerSx={{ position: "relative" }}
            >
                <Stack sx={{ minWidth: "15rem", px: "1.2rem", py: ".8rem", backgroundColor: colors.darkNavy }}>
                    <Stack direction="row" spacing=".5rem" sx={{ mt: ".3rem", mb: ".7rem" }}>
                        {factionLogoBlobID && factionLogoBlobID != NullUUID && (
                            <Box
                                sx={{
                                    mt: "-0.1rem !important",
                                    width: "1.8rem",
                                    height: "1.8rem",
                                    flexShrink: 0,
                                    backgroundImage: `url(${PASSPORT_SERVER_HOST_IMAGES}/api/files/${factionLogoBlobID})`,
                                    backgroundRepeat: "no-repeat",
                                    backgroundPosition: "center",
                                    backgroundSize: "contain",
                                    backgroundColor: factionColor,
                                    borderRadius: 0.8,
                                    border: `${factionColor} 1px solid`,
                                }}
                            />
                        )}
                        <Typography sx={{ color: factionColor, fontWeight: "fontWeightBold" }}>{username}</Typography>
                    </Stack>

                    <Stack spacing=".3rem" sx={{ ml: ".2rem" }}>
                        <Stack direction="row" spacing=".5rem">
                            <SvgAbility size="1.1rem" sx={{ pb: ".4rem" }} />
                            <Typography variant="body2">
                                <strong>ABILITIES:</strong> {userStat.total_ability_triggered}
                            </Typography>
                        </Stack>

                        <Stack direction="row" spacing=".5rem">
                            <SvgDeath size="1.1rem" sx={{ pb: ".4rem" }} />
                            <Typography variant="body2">
                                <strong>ABILITY KILLS:</strong> {userStat.kill_count}
                            </Typography>
                        </Stack>

                        <Stack direction="row" spacing=".5rem">
                            <SvgSkull2 size="1.1rem" sx={{ pb: ".4rem" }} />
                            <Typography variant="body2">
                                <strong>MECH KILLS:</strong> {userStat.mech_kill_count}
                            </Typography>
                        </Stack>

                        <Stack direction="row" spacing=".5rem">
                            <SvgView size="1.1rem" />
                            <Typography variant="body2">
                                <strong>SPECTATED:</strong> {userStat.view_battle_count}
                            </Typography>
                        </Stack>
                    </Stack>
                </Stack>
            </ClipThing>
        </Popover>
    )
}

export const TextMessage = ({
    data,
    sentAt,
    fontSize,
    isSent,
    isFailed,
    filterZeros,
    factionsAll,
}: {
    data: TextMessageData
    sentAt: Date
    fontSize: number
    isSent?: boolean
    isFailed?: boolean
    filterZeros?: boolean
    factionsAll: FactionsAll
}) => {
    const { from_username, message_color, from_user_faction_id, avatar_id, message, self, total_multiplier, is_citizen, from_user_stat } = data

    const popoverRef = useRef(null)
    const [isPopoverOpen, toggleIsPopoverOpen] = useToggle()
    const multiplierColor = useMemo(() => getMultiplierColor(total_multiplier || 0), [total_multiplier])
    const abilityKillColor = useMemo(() => {
        if (!from_user_stat || from_user_stat.kill_count == 0) return colors.grey
        if (from_user_stat.kill_count < 0) return colors.red
        return message_color
    }, [from_user_stat, message_color])
    const factionColor = useMemo(
        () => (from_user_faction_id ? factionsAll[from_user_faction_id]?.theme.primary : message_color),
        [from_user_faction_id, factionsAll],
    )
    const factionLogoBlobID = useMemo(() => (from_user_faction_id ? factionsAll[from_user_faction_id]?.logo_blob_id : ""), [from_user_faction_id, factionsAll])

    // If it's our own message and it's sent successfully, hide it
    if (isSent && self) return null

    // For the hide zero multi setting
    if (!self && filterZeros && (!total_multiplier || total_multiplier <= 0)) return null

    return (
        <Box sx={{ opacity: !self ? 1 : 0.45, wordBreak: "break-word", "*": { userSelect: "text !important" } }}>
            <Stack ref={popoverRef} direction="row" spacing=".4rem">
                <Stack direction="row" spacing=".4rem" alignItems="start">
                    <Box>
                        {isFailed && <SvgInfoCircular size="1.2rem" fill={colors.red} sx={{ mt: ".2rem" }} />}

                        {avatar_id && (
                            <Box
                                sx={{
                                    mt: "-0.1rem !important",
                                    width: fontSize ? `${1.8 * fontSize}rem` : "1.8rem",
                                    height: fontSize ? `${1.8 * fontSize}rem` : "1.8rem",
                                    flexShrink: 0,
                                    backgroundImage: `url(${PASSPORT_SERVER_HOST_IMAGES}/api/files/${avatar_id})`,
                                    backgroundRepeat: "no-repeat",
                                    backgroundPosition: "center",
                                    backgroundSize: "contain",
                                    backgroundColor: factionColor,
                                    borderRadius: 0.8,
                                    border: `${factionColor} 1px solid`,
                                }}
                            />
                        )}
                        {factionLogoBlobID && factionLogoBlobID != NullUUID && (
                            <Box
                                sx={{
                                    mt: "-0.1rem !important",
                                    width: fontSize ? `${1.8 * fontSize}rem` : "1.8rem",
                                    height: fontSize ? `${1.8 * fontSize}rem` : "1.8rem",
                                    flexShrink: 0,
                                    backgroundImage: `url(${PASSPORT_SERVER_HOST_IMAGES}/api/files/${factionLogoBlobID})`,
                                    backgroundRepeat: "no-repeat",
                                    backgroundPosition: "center",
                                    backgroundSize: "contain",
                                    backgroundColor: factionColor,
                                    borderRadius: 0.8,
                                    border: `${factionColor} 1px solid`,
                                }}
                            />
                        )}
                    </Box>
                </Stack>

                <Box>
                    <Stack direction="row" spacing=".4rem">
                        <Typography
                            onClick={() => toggleIsPopoverOpen()}
                            sx={{
                                display: "inline",
                                color: message_color,
                                fontWeight: 700,
                                fontSize: fontSize ? `${1.33 * fontSize}rem` : "1.33rem",
                                ":hover": {
                                    cursor: "pointer",
                                    textDecoration: "underline",
                                },
                                ":active": {
                                    opacity: 0.7,
                                },
                            }}
                        >
                            {truncate(from_username, 24)}
                        </Typography>

                        {from_user_stat && (
                            <TooltipHelper placement="top-end" text={`${from_user_stat.kill_count} ABILITY KILLS`}>
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    alignSelf="flex-start"
                                    spacing=".2rem"
                                    sx={{ flexShrink: 0, pt: ".1rem", cursor: "default" }}
                                >
                                    <Typography
                                        sx={{
                                            lineHeight: 1,
                                            fontFamily: "Nostromo Regular Bold",
                                            fontSize: fontSize ? `${0.9 * fontSize}rem` : "0.9rem",
                                            color: abilityKillColor,
                                        }}
                                    >
                                        [
                                    </Typography>
                                    <SvgSkull2 size={fontSize ? `${0.85 * fontSize}rem` : "0.85rem"} fill={abilityKillColor} />
                                    <Typography
                                        sx={{
                                            lineHeight: 1,
                                            fontFamily: "Nostromo Regular Bold",
                                            fontSize: fontSize ? `${0.9 * fontSize}rem` : "0.9rem",
                                            color: abilityKillColor,
                                        }}
                                    >
                                        {from_user_stat.kill_count}]
                                    </Typography>
                                </Stack>
                            </TooltipHelper>
                        )}

                        <Typography
                            sx={{
                                display: "inline",
                                ml: ".4rem",
                                color: multiplierColor,
                                textAlign: "center",
                                fontFamily: "Nostromo Regular Bold",
                                fontSize: fontSize ? `${0.9 * fontSize}rem` : "0.9rem",
                                verticalAlign: "top",
                                opacity: (total_multiplier || 0) > 0 ? 1 : 0.7,
                            }}
                        >
                            {total_multiplier || 0}x
                        </Typography>

                        {is_citizen && (
                            <TooltipHelper placement="top-end" text={"CITIZEN"}>
                                <Typography
                                    sx={{
                                        display: "inline",
                                        cursor: "default",
                                        ml: ".4rem",
                                        textAlign: "center",
                                        fontFamily: "Nostromo Regular Bold",
                                        fontSize: fontSize ? `${0.9 * fontSize}rem` : "0.9rem",
                                        verticalAlign: "top",
                                    }}
                                >
                                    🦾
                                </Typography>
                            </TooltipHelper>
                        )}

                        <Typography
                            variant="caption"
                            sx={{
                                display: "inline",
                                ml: ".4rem",
                                color: "grey",
                                opacity: 0.5,
                                fontSize: fontSize ? `${1 * fontSize}rem` : "1rem",
                            }}
                        >
                            {dateFormatter(sentAt)}
                        </Typography>
                    </Stack>

                    <Box>
                        <Typography sx={{ fontSize: fontSize ? `${1.35 * fontSize}rem` : "1.35rem" }}>{message}</Typography>
                    </Box>
                </Box>
            </Stack>

            <UserDetailsPopover
                factionLogoBlobID={factionLogoBlobID}
                factionColor={factionColor}
                username={from_username}
                userStat={from_user_stat}
                popoverRef={popoverRef}
                open={isPopoverOpen}
                onClose={() => toggleIsPopoverOpen(false)}
            />
        </Box>
    )
}
