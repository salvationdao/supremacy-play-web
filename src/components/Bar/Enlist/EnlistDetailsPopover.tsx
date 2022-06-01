import { Box, Fade, IconButton, Popover, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useState } from "react"
import { ClipThing, FancyButton } from "../.."
import { SvgArrowRightAltSharpIcon, SvgSupToken, SvgWrapperProps } from "../../../assets"
import { useSnackbar } from "../../../containers"
import { useToggle } from "../../../hooks"
import { useGameServerCommandsUser } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts, siteZIndex } from "../../../theme/theme"
import { Faction, FactionStat } from "../../../types"

interface EnlistDetailsProps {
    popoverRef: React.MutableRefObject<null>
    open: boolean
    onClose: () => void
    faction_id: string
    faction: Faction
}

export const EnlistDetailsPopover = ({ popoverRef, open, onClose, faction }: EnlistDetailsProps) => {
    const [localOpen, toggleLocalOpen] = useToggle(open)
    const { primary_color } = faction

    useEffect(() => {
        if (!localOpen) {
            const timeout = setTimeout(() => {
                onClose()
            }, 300)

            return () => clearTimeout(timeout)
        }
    }, [localOpen, onClose])

    return (
        <Popover
            open={localOpen}
            anchorEl={popoverRef.current}
            onClose={() => toggleLocalOpen(false)}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "center",
            }}
            PaperProps={{ sx: { backgroundColor: "transparent", boxShadow: 0, overflow: "visible" } }}
            sx={{ zIndex: siteZIndex.Popover }}
        >
            <Box sx={{ filter: "drop-shadow(0 3px 3px #00000050)" }}>
                <ClipThing
                    clipSize="10px"
                    border={{
                        isFancy: true,
                        borderColor: primary_color,
                        borderThickness: ".3rem",
                    }}
                    backgroundColor="#101019"
                >
                    <Stack direction="row">
                        <PopoverContent faction={faction} />
                    </Stack>
                </ClipThing>
            </Box>
        </Popover>
    )
}

const Stat = ({ title, content, PrefixSvg }: { title: string; content: string | number; PrefixSvg?: SvgWrapperProps }) => {
    return (
        <Stack spacing=".24rem" sx={{ width: "18rem" }}>
            <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBold, color: colors.grey }}>
                {title}
            </Typography>

            <Stack direction="row" alignItems="center" spacing=".32rem">
                {PrefixSvg}
                <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBold, lineHeight: 1, whiteSpace: "nowrap" }}>
                    {content}
                </Typography>
            </Stack>
        </Stack>
    )
}

const PopoverContent = ({ faction }: { faction: Faction }) => {
    const { newSnackbarMessage } = useSnackbar()
    const { send } = useGameServerCommandsUser("/user_commander")
    const [page, setPage] = useState(0)

    const [factionStat] = useState<FactionStat>() // Not used atm. type: FactionStat

    const enlistFaction = useCallback(async () => {
        try {
            await send<null, { faction_id: string }>(GameServerKeys.EnlistFaction, { faction_id: faction.id })
            newSnackbarMessage("Successfully enlisted into syndicate.", "success")
        } catch (e) {
            newSnackbarMessage(typeof e === "string" ? e : "Failed to enlist into syndicate.", "error")
            console.debug(e)
        }
        return
    }, [send, faction.id, newSnackbarMessage])

    const factionExtraInfo = useMemo(() => {
        if (!factionStat) return null
        const { velocity, recruit_number, win_count, loss_count, kill_count, death_count, mvp } = factionStat
        return (
            <Fade in={true}>
                <Stack direction="row" flexWrap="wrap" sx={{ pt: ".8rem", px: ".8rem", "& > *": { width: "50%", pb: "1.44rem" } }}>
                    <Stat
                        title="SUPS Velocity"
                        content={velocity.toLocaleString("en-US", {
                            minimumFractionDigits: 1,
                            maximumFractionDigits: 4,
                        })}
                        PrefixSvg={<SvgSupToken size="1.4rem" />}
                    />

                    <Stat title="Recruits" content={recruit_number} />
                    {factionStat && (
                        <>
                            <Stat title="Wins" content={win_count} />
                            <Stat title="Losses" content={loss_count} />
                            <Stat
                                title="Win Rate"
                                content={win_count + loss_count === 0 ? "0%" : `${((win_count / (win_count + loss_count)) * 100).toFixed(0)}%`}
                            />
                            <Stat title="Kills" content={kill_count} />
                            <Stat title="Deaths" content={death_count} />
                            <Stat title="K/D" content={death_count === 0 ? "0%" : `${((kill_count / death_count) * 100).toFixed(0)}%`} />
                            <Stat title="MVP" content={mvp?.username || ""} />
                        </>
                    )}
                </Stack>
            </Fade>
        )
    }, [factionStat])

    const { label, primary_color, secondary_color, logo_url, background_url, description } = faction

    return (
        <Stack direction="row">
            <Stack
                alignItems="center"
                justifyContent="center"
                spacing="1rem"
                sx={{
                    px: "2.08rem",
                    py: "2.4rem",
                    backgroundImage: `url(${background_url})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    width: "19rem",
                    minHeight: "36rem",
                }}
            >
                <Box
                    component="img"
                    src={logo_url}
                    alt={`${label} Logo`}
                    sx={{
                        width: "100%",
                        maxHeight: "25rem",
                        borderRadius: 0.5,
                    }}
                />
                <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBold, textAlign: "center" }}>
                    {label.toUpperCase()}
                </Typography>
            </Stack>

            <Stack sx={{ px: "2.4rem", py: "2.24rem", width: 460 }}>
                {page === 0 && (
                    <Fade in={true}>
                        <Typography sx={{ whiteSpace: "pre-line" }}>{description}</Typography>
                    </Fade>
                )}

                {page === 1 && factionExtraInfo}

                <Stack
                    direction="row"
                    spacing=".48rem"
                    alignItems="center"
                    justifyContent="flex-start"
                    sx={{ mt: "auto", pt: "1.28rem", "& > .Mui-disabled": { color: "#494949 !important" } }}
                >
                    {factionStat && (
                        <>
                            <IconButton sx={{ transform: "scaleX(-1)" }} onClick={() => setPage(0)} disabled={page <= 0}>
                                <SvgArrowRightAltSharpIcon fill={page <= 0 ? "#333333" : primary_color} />
                            </IconButton>
                            <IconButton onClick={() => setPage(1)} disabled={page >= 1}>
                                <SvgArrowRightAltSharpIcon fill={page >= 1 ? "#333333" : primary_color} />
                            </IconButton>
                        </>
                    )}

                    <FancyButton
                        clipThingsProps={{
                            clipSize: "7px",
                            sx: { ml: "auto !important" },
                            backgroundColor: primary_color,
                            border: {
                                isFancy: true,
                                borderColor: primary_color,
                            },
                        }}
                        sx={{
                            px: "2.56rem",
                            py: ".2rem",
                        }}
                        onClick={enlistFaction}
                    >
                        <Typography
                            variant="caption"
                            sx={{
                                color: secondary_color,
                                fontFamily: fonts.nostromoBold,
                            }}
                        >
                            ENLIST
                        </Typography>
                    </FancyButton>
                </Stack>
            </Stack>
        </Stack>
    )
}
