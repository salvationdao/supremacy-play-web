import { Box, IconButton, Modal, Stack, Typography } from "@mui/material"
import { useCallback, useMemo } from "react"
import { ClipThing, FancyButton } from "../../.."
import { SvgClose } from "../../../../assets"
import { useHangarWarMachine } from "../../../../containers/hangar/hangarWarMachines"
import { useTheme } from "../../../../containers/theme"
import { getRarityDeets } from "../../../../helpers"
import { colors, fonts, siteZIndex } from "../../../../theme/theme"
import { MechDetails } from "../../../../types"

export const LeaveModal = () => {
    const { leaveMechDetails } = useHangarWarMachine()

    if (!leaveMechDetails) return null
    return <LeaveModalInner mechDetails={leaveMechDetails} />
}

const LeaveModalInner = ({ mechDetails }: { mechDetails: MechDetails }) => {
    const { onLeaveQueue, leaveQueueError, setLeaveMechDetails, setLeaveQueueError } = useHangarWarMachine()
    const theme = useTheme()

    const { hash, tier, name, label } = mechDetails
    const skin = mechDetails ? mechDetails.chassis_skin || mechDetails.default_chassis_skin : undefined
    const avatarUrl = skin?.avatar_url || mechDetails.avatar_url
    const imageUrl = skin?.image_url || mechDetails.image_url

    const rarityDeets = useMemo(() => getRarityDeets(tier), [tier])

    const onClose = useCallback(() => {
        setLeaveMechDetails(undefined)
        setLeaveQueueError("")
    }, [setLeaveQueueError, setLeaveMechDetails])

    return (
        <Modal open onClose={onClose} sx={{ zIndex: siteZIndex.Modal }}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "43rem",
                    boxShadow: 6,
                }}
            >
                <ClipThing
                    clipSize="8px"
                    border={{
                        borderColor: theme.factionTheme.primary,
                        borderThickness: ".2rem",
                    }}
                    sx={{ position: "relative" }}
                    backgroundColor={theme.factionTheme.background}
                >
                    <Stack
                        spacing="1.6rem"
                        sx={{
                            position: "relative",
                            px: "2.5rem",
                            py: "2.4rem",
                        }}
                    >
                        <Box
                            sx={{
                                position: "relative",
                                px: ".6rem",
                                py: "1rem",
                                borderRadius: 0.6,
                                boxShadow: "inset 0 0 12px 6px #00000040",
                                background: `radial-gradient(#FFFFFF20 1px, ${theme.factionTheme.background})`,
                            }}
                        >
                            <Box
                                sx={{
                                    width: "100%",
                                    height: "21rem",
                                    backgroundImage: `url(${imageUrl})`,
                                    backgroundRepeat: "no-repeat",
                                    backgroundPosition: "top center",
                                    backgroundSize: "contain",
                                }}
                            />

                            <Box
                                sx={{
                                    position: "absolute",
                                    left: "2rem",
                                    bottom: "1.3rem",
                                }}
                            >
                                <ClipThing
                                    clipSize="6px"
                                    border={{
                                        isFancy: true,
                                        borderColor: theme.factionTheme.primary,
                                        borderThickness: ".15rem",
                                    }}
                                    opacity={0.7}
                                    backgroundColor={theme.factionTheme.background}
                                    sx={{ height: "100%" }}
                                >
                                    <Box
                                        sx={{
                                            width: "5.5rem",
                                            height: "5.5rem",
                                            border: "#FFFFFF60 1px solid",
                                            backgroundImage: `url(${avatarUrl})`,
                                            backgroundRepeat: "no-repeat",
                                            backgroundPosition: "top center",
                                            backgroundSize: "contain",
                                        }}
                                    />
                                </ClipThing>
                            </Box>
                        </Box>

                        <Stack spacing="1.5rem">
                            <Box>
                                <Typography sx={{ fontFamily: fonts.nostromoBlack, letterSpacing: "1px" }}>{name || label}</Typography>

                                <Typography
                                    variant="caption"
                                    sx={{
                                        mt: ".4rem",
                                        lineHeight: 1,
                                        color: rarityDeets.color,
                                        fontFamily: fonts.nostromoHeavy,
                                    }}
                                >
                                    {rarityDeets.label}
                                </Typography>
                            </Box>

                            <Typography sx={{ fontSize: "1.6rem", strong: { color: colors.neonBlue } }}>
                                Are you sure you&apos;d like to remove <strong>{name || label}</strong> from the battle queue? Your will be refunded the initial
                                queuing fee.
                            </Typography>

                            <Stack direction="row" spacing="2rem" alignItems="center" sx={{ mt: "auto" }}>
                                <FancyButton
                                    excludeCaret
                                    clipThingsProps={{
                                        clipSize: "5px",
                                        backgroundColor: colors.red,
                                        border: { isFancy: true, borderColor: colors.red },
                                        sx: { position: "relative", width: "100%" },
                                    }}
                                    sx={{ px: "1.6rem", py: ".5rem", color: "#FFFFFF" }}
                                    onClick={() => onLeaveQueue(hash)}
                                >
                                    <Typography variant="caption" sx={{ fontFamily: fonts.nostromoBlack }}>
                                        LEAVE QUEUE
                                    </Typography>
                                </FancyButton>
                            </Stack>

                            {leaveQueueError && (
                                <Typography
                                    variant="body2"
                                    sx={{
                                        mt: ".3rem",
                                        color: "red",
                                    }}
                                >
                                    {leaveQueueError}
                                </Typography>
                            )}
                        </Stack>
                    </Stack>

                    <IconButton size="small" onClick={onClose} sx={{ position: "absolute", top: ".5rem", right: ".5rem" }}>
                        <SvgClose size="1.9rem" sx={{ opacity: 0.1, ":hover": { opacity: 0.6 } }} />
                    </IconButton>
                </ClipThing>
            </Box>
        </Modal>
    )
}
