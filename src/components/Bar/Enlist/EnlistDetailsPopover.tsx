import { Box, Fade, IconButton, Popover, Stack, Typography } from "@mui/material"
import { useCallback, useMemo, useState } from "react"
import { ClipThing, FancyButton } from "../.."
import { SvgArrowRightAltSharpIcon, SvgSupToken, SvgWrapperProps } from "../../../assets"
import { PASSPORT_SERVER_HOST_IMAGES } from "../../../constants"
import { usePassportServerWebsocket } from "../../../containers"
import { usePassportServerSubscription } from "../../../hooks"
import { PassportServerKeys } from "../../../keys"
import { colors } from "../../../theme/theme"
import { FactionGeneralData, FactionStat } from "../../../types/passport"

interface EnlistDetailsProps {
    popoverRef: React.MutableRefObject<null>
    popoverOpen: boolean
    togglePopoverOpen: (_state: boolean) => void
    faction_id: string
    factionData: FactionGeneralData
}

const Stat = ({
    title,
    content,
    PrefixSvg,
}: {
    title: string
    content: string | number
    PrefixSvg?: SvgWrapperProps
}) => {
    return (
        <Stack spacing=".24rem" sx={{ width: "18rem" }}>
            <Typography variant="body2" sx={{ fontFamily: "Nostromo Regular Bold", color: colors.grey }}>
                {title}
            </Typography>

            <Stack direction="row" alignItems="center" spacing=".32rem">
                {PrefixSvg}
                <Typography
                    variant="body2"
                    sx={{ fontFamily: "Nostromo Regular Bold", lineHeight: 1, whiteSpace: "nowrap" }}
                >
                    {content}
                </Typography>
            </Stack>
        </Stack>
    )
}

interface EnlistFactionRequest {
    faction_id: string
}

const PopoverContent = ({ factionData }: { factionData: FactionGeneralData }) => {
    const factionStat = usePassportServerSubscription<FactionStat>(PassportServerKeys.SubscribeFactionStat, {
        faction_id: factionData.id,
    }).payload

    const [page, setPage] = useState(0)
    const { send, state } = usePassportServerWebsocket()

    const enlistFaction = useCallback(async () => {
        if (state !== WebSocket.OPEN) {
            return
        }
        try {
            await send<any, EnlistFactionRequest>(PassportServerKeys.EnlistFaction, { faction_id: factionData.id })
        } catch (e) {
            throw typeof e === "string" ? e : "Something went wrong, please try again."
        }
        return
    }, [send, state, factionData])

    const factionExtraInfo = useMemo(() => {
        if (!factionStat) return null
        const { velocity, recruit_number, win_count, loss_count, kill_count, death_count, mvp } = factionStat
        return (
            <Fade in={true}>
                <Stack
                    direction="row"
                    flexWrap="wrap"
                    sx={{ pt: ".8rem", px: ".8rem", "& > *": { width: "50%", pb: "1.44rem" } }}
                >
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
                                content={
                                    win_count + loss_count === 0
                                        ? "0%"
                                        : `${((win_count / (win_count + loss_count)) * 100).toFixed(0)}%`
                                }
                            />
                            <Stat title="Kills" content={kill_count} />
                            <Stat title="Deaths" content={death_count} />
                            <Stat
                                title="K/D"
                                content={death_count === 0 ? "0%" : `${((kill_count / death_count) * 100).toFixed(0)}%`}
                            />
                            <Stat title="MVP" content={mvp?.username || ""} />
                        </>
                    )}
                </Stack>
            </Fade>
        )
    }, [factionStat])

    const {
        label,
        theme: { primary, secondary },
        logo_blob_id,
        background_blob_id,
        description,
    } = factionData

    return (
        <Stack direction="row">
            <Stack
                alignItems="center"
                justifyContent="center"
                spacing="1.44rem"
                sx={{
                    px: "2.08rem",
                    py: "2.4rem",
                    backgroundImage: `url(${PASSPORT_SERVER_HOST_IMAGES}/api/files/${background_blob_id})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    width: "19rem",
                    minHeight: "36rem",
                }}
            >
                <Box
                    component="img"
                    src={`${PASSPORT_SERVER_HOST_IMAGES}/api/files/${logo_blob_id}`}
                    alt={`${label} Logo`}
                    sx={{
                        width: "100%",
                        maxHeight: "25rem",
                        borderRadius: 0.5,
                    }}
                />
                <Typography variant="body2" sx={{ fontFamily: "Nostromo Regular Bold" }}>
                    {label.toUpperCase()}
                </Typography>
            </Stack>

            <Stack sx={{ px: "2.4rem", py: "2.24rem", width: 460 }}>
                {page === 0 && (
                    <Fade in={true}>
                        <Typography>{description}</Typography>
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
                            <IconButton
                                sx={{ transform: "scaleX(-1)" }}
                                onClick={() => setPage(0)}
                                disabled={page <= 0}
                            >
                                <SvgArrowRightAltSharpIcon fill={page <= 0 ? "#333333" : primary} />
                            </IconButton>
                            <IconButton onClick={() => setPage(1)} disabled={page >= 1}>
                                <SvgArrowRightAltSharpIcon fill={page >= 1 ? "#333333" : primary} />
                            </IconButton>
                        </>
                    )}

                    <FancyButton
                        clipSize="7px"
                        borderColor={primary}
                        backgroundColor={primary}
                        clipSx={{ ml: "auto !important" }}
                        sx={{
                            px: "2.56rem",
                            py: ".16rem",
                            pt: ".5rem",
                            color: secondary,
                            fontFamily: "Nostromo Regular Black",
                        }}
                        onClick={enlistFaction}
                    >
                        Enlist
                    </FancyButton>
                </Stack>
            </Stack>
        </Stack>
    )
}

export const EnlistDetailsPopover = ({
    popoverRef,
    popoverOpen,
    togglePopoverOpen,
    factionData,
}: EnlistDetailsProps) => {
    const {
        theme: { primary },
    } = factionData

    return (
        <Popover
            open={popoverOpen}
            anchorEl={popoverRef.current}
            onClose={() => togglePopoverOpen(false)}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "center",
            }}
            PaperProps={{ sx: { backgroundColor: "transparent", boxShadow: 0, overflow: "visible" } }}
            sx={{ zIndex: 999999 }}
        >
            <Box sx={{ filter: "drop-shadow(0 3px 3px #00000050)" }}>
                <ClipThing
                    clipSize="10px"
                    border={{
                        isFancy: true,
                        borderColor: primary,
                        borderThickness: ".2rem",
                    }}
                >
                    <Stack direction="row" sx={{ backgroundColor: "#101019" }}>
                        {factionData ? (
                            <PopoverContent factionData={factionData} />
                        ) : (
                            <Box sx={{ px: "2.4rem", py: "1.2rem" }}>
                                <Typography
                                    variant="caption"
                                    sx={{ opacity: 0.6, fontFamily: "Nostromo Regular Bold", color: colors.grey }}
                                >
                                    Loading...
                                </Typography>
                            </Box>
                        )}
                    </Stack>
                </ClipThing>
            </Box>
        </Popover>
    )
}
