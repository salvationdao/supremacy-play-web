import { Box, Fade, IconButton, Popover, Stack, Typography } from "@mui/material"
import { useCallback, useState } from "react"
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
    factionID: string
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
        <Stack spacing={0.3} sx={{ width: 180 }}>
            <Typography variant="body2" sx={{ fontFamily: "Nostromo Regular Bold", color: colors.grey }}>
                {title}
            </Typography>

            <Stack direction="row" alignItems="center" spacing={0.4}>
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
    factionID: string
}

const PopoverContent = ({ factionData }: { factionData: FactionGeneralData }) => {
    const factionStat = usePassportServerSubscription<FactionStat>(PassportServerKeys.SubscribeFactionStat, {
        factionID: factionData.id,
    }).payload

    const [page, setPage] = useState(0)
    const { send, state } = usePassportServerWebsocket()

    const enlistFaction = useCallback(async () => {
        if (state !== WebSocket.OPEN) {
            return
        }
        try {
            await send<any, EnlistFactionRequest>(PassportServerKeys.EnlistFaction, { factionID: factionData.id })
        } catch (e) {
            throw typeof e === "string" ? e : "Something went wrong, please try again."
        }
        return
    }, [send, state, factionData])

    const factionExtraInfo = () => {
        if (!factionStat) return null
        const { velocity, recruitNumber, winCount, lossCount, killCount, deathCount, mvp } = factionStat
        return (
            <Fade in={true}>
                <Stack direction="row" flexWrap="wrap" sx={{ pt: 1, px: 1, "& > *": { width: "50%", pb: 1.8 } }}>
                    <Stat
                        title="SUPS Velocity"
                        content={velocity.toLocaleString("en-US", {
                            minimumFractionDigits: 1,
                            maximumFractionDigits: 4,
                        })}
                        PrefixSvg={<SvgSupToken size="14px" />}
                    />

                    <Stat title="Recruits" content={recruitNumber} />
                    {factionStat && (
                        <>
                            <Stat title="Wins" content={winCount} />
                            <Stat title="Losses" content={lossCount} />
                            <Stat
                                title="Win Rate"
                                content={
                                    winCount + lossCount === 0
                                        ? "0%"
                                        : `${((winCount / (winCount + lossCount)) * 100).toFixed(0)}%`
                                }
                            />
                            <Stat title="Kills" content={killCount} />
                            <Stat title="Deaths" content={deathCount} />
                            <Stat
                                title="K/D"
                                content={deathCount === 0 ? "0%" : `${((killCount / deathCount) * 100).toFixed(0)}%`}
                            />
                            <Stat title="MVP" content={mvp?.username || ""} />
                        </>
                    )}
                </Stack>
            </Fade>
        )
    }

    const {
        label,
        theme: { primary, secondary },
        logoBlobID,
        backgroundBlobID,
        description,
    } = factionData

    return (
        <Stack direction="row">
            <Stack
                alignItems="center"
                justifyContent="center"
                spacing={1.8}
                sx={{
                    px: 2.6,
                    py: 3,
                    backgroundImage: `url(${PASSPORT_SERVER_HOST_IMAGES}/api/files/${backgroundBlobID})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    width: 190,
                    minHeight: 360,
                }}
            >
                <Box
                    component="img"
                    src={`${PASSPORT_SERVER_HOST_IMAGES}/api/files/${logoBlobID}`}
                    alt={`${label} Logo`}
                    sx={{
                        width: "100%",
                        maxHeight: 250,
                        borderRadius: 0.5,
                    }}
                />
                <Typography variant="body2" sx={{ fontFamily: "Nostromo Regular Bold" }}>
                    {label.toUpperCase()}
                </Typography>
            </Stack>

            <Stack sx={{ px: 3, py: 2.8, width: 460 }}>
                {page === 0 && (
                    <Fade in={true}>
                        <Typography>{description}</Typography>
                    </Fade>
                )}

                {page === 1 && factionExtraInfo()}

                <Stack
                    direction="row"
                    spacing={0.6}
                    alignItems="center"
                    justifyContent="flex-start"
                    sx={{ mt: "auto", pt: 1.6, "& > .Mui-disabled": { color: "#494949 !important" } }}
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
                        sx={{ px: 3.2, py: 0.2, pt: 0.5 }}
                        onClick={enlistFaction}
                    >
                        <Typography variant="caption" sx={{ color: secondary, fontFamily: "Nostromo Regular Black" }}>
                            Enlist
                        </Typography>
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
    factionID,
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
                        borderThickness: "2px",
                    }}
                >
                    <Stack direction="row" sx={{ backgroundColor: "#101019" }}>
                        {factionData ? (
                            <PopoverContent factionData={factionData} />
                        ) : (
                            <Box sx={{ px: 3, py: 1.5 }}>
                                <Typography
                                    variant="caption"
                                    sx={{ fontFamily: "Nostromo Regular Bold", color: colors.grey }}
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
