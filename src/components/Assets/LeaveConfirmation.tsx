import { Box, Button, IconButton, Link, Modal, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ClipThing } from ".."
import { SvgClose, SvgExternalLink } from "../../assets"
import { PASSPORT_WEB } from "../../constants"
import { useGameServerWebsocket, usePassportServerAuth, useSnackbar } from "../../containers"
import { getRarityDeets } from "../../helpers"
import { useToggle } from "../../hooks"
import { GameServerKeys } from "../../keys"
import { colors } from "../../theme/theme"
import { Asset } from "../../types/assets"

export const LeaveConfirmation = ({ open, asset, onClose }: { open: boolean; asset: Asset; onClose: () => void }) => {
    const { newSnackbarMessage } = useSnackbar()
    const { state, send } = useGameServerWebsocket()
    const { user } = usePassportServerAuth()
    const { hash, name, label, image_url, tier } = asset.data.mech
    const [isLeaving, toggleIsLeaving] = useToggle()
    // const [deployFailed, toggleLeaveFailed] = useToggle()
    const [error, setError] = useState<string>()

    const rarityDeets = useMemo(() => getRarityDeets(tier), [tier])

    // useEffect(() => {
    //     if (!open) toggleLeaveFailed(false)
    // }, [open])

    const onLeave = useCallback(async () => {
        if (state !== WebSocket.OPEN || isLeaving) return
        try {
            toggleIsLeaving(true)
            const resp = await send(GameServerKeys.LeaveQueue, { asset_hash: hash })
            if (resp) {
                onClose()
                newSnackbarMessage("Successfully removed war machine from queue.", "success")
            }
        } catch (e) {
            setError(typeof e === "string" ? e : "Failed to leave queue.")
            console.debug(e)
        } finally {
            toggleIsLeaving(false)
        }
    }, [state, hash])

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "46rem",
                }}
            >
                <ClipThing
                    clipSize="10px"
                    border={{
                        isFancy: true,
                        borderColor: (user && user.faction.theme.primary) || colors.neonBlue,
                        borderThickness: ".3rem",
                    }}
                >
                    <Stack
                        direction="row"
                        spacing="1.6rem"
                        sx={{
                            position: "relative",
                            pl: "1.76rem",
                            pr: "2.56rem",
                            py: "2.4rem",
                            backgroundColor: (user && user.faction.theme.background) || colors.darkNavyBlue,
                        }}
                    >
                        <Box
                            sx={{
                                position: "relative",
                                flexShrink: 0,
                                px: ".64rem",
                                py: "1.2rem",
                                borderRadius: 0.6,
                                boxShadow: "inset 0 0 12px 6px #00000055",
                            }}
                        >
                            <Box
                                sx={{
                                    my: "auto",
                                    width: "11rem",
                                    height: "13.2rem",
                                    backgroundImage: `url(${image_url})`,
                                    backgroundRepeat: "no-repeat",
                                    backgroundPosition: "top center",
                                    backgroundSize: "contain",
                                }}
                            />

                            <Stack
                                spacing=".48rem"
                                direction="row"
                                alignItems="center"
                                sx={{
                                    position: "absolute",
                                    bottom: ".8rem",
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                }}
                            >
                                <Typography
                                    variant="caption"
                                    sx={{
                                        lineHeight: 1,
                                        color: rarityDeets.color,
                                        fontFamily: "Nostromo Regular Heavy",
                                        textAlign: "center",
                                    }}
                                >
                                    {rarityDeets.label}
                                </Typography>
                            </Stack>
                        </Box>

                        <Stack spacing=".8rem">
                            <Box>
                                <Typography
                                    sx={{
                                        fontFamily: "Nostromo Regular Bold",
                                        display: "-webkit-box",
                                        overflow: "hidden",
                                        overflowWrap: "anywhere",
                                        textOverflow: "ellipsis",
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: "vertical",
                                    }}
                                >
                                    {name || label}

                                    {user && (
                                        <span>
                                            <Link
                                                href={`${PASSPORT_WEB}profile/${user.username}/asset/${hash}`}
                                                target="_blank"
                                                sx={{ ml: ".48rem" }}
                                            >
                                                <SvgExternalLink
                                                    size="1rem"
                                                    sx={{ opacity: 0.2, ":hover": { opacity: 0.6 } }}
                                                />
                                            </Link>
                                        </span>
                                    )}
                                </Typography>
                            </Box>

                            <Typography sx={{ strong: { color: colors.neonBlue } }}>
                                Are you sure you&apos;d like to remove <strong>{name || label}</strong> from the battle
                                queue? Your will be refunded the initial queuing fee.
                            </Typography>

                            <Button
                                variant="contained"
                                size="small"
                                disabled={isLeaving}
                                onClick={onLeave}
                                sx={{
                                    mt: "auto",
                                    minWidth: 0,
                                    px: ".8rem",
                                    py: ".48rem",
                                    backgroundColor: colors.red,
                                    border: `${colors.red} 1px solid`,
                                    borderRadius: 0.3,
                                    ":hover": { backgroundColor: `${colors.red}90` },
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    sx={{
                                        lineHeight: 1,
                                        color: "#FFFFFF",
                                    }}
                                >
                                    {isLeaving ? "LEAVING QUEUE..." : "REMOVE FROM QUEUE"}
                                </Typography>
                            </Button>

                            {error && (
                                <Typography
                                    variant="caption"
                                    sx={{
                                        lineHeight: 1,
                                        color: "red",
                                    }}
                                >
                                    {error}
                                </Typography>
                            )}
                        </Stack>

                        <IconButton
                            size="small"
                            onClick={onClose}
                            sx={{ position: "absolute", top: ".2rem", right: ".2rem" }}
                        >
                            <SvgClose size="1.6rem" sx={{ opacity: 0.1, ":hover": { opacity: 0.6 } }} />
                        </IconButton>
                    </Stack>
                </ClipThing>
            </Box>
        </Modal>
    )
}
