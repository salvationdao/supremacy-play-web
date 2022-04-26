import { Box, Button, IconButton, Link, Modal, Stack, Typography, useTheme, Theme } from "@mui/material"
import { useCallback, useMemo, useState } from "react"
import { ClipThing } from "../.."
import { SvgClose, SvgExternalLink } from "../../../assets"
import { PASSPORT_WEB } from "../../../constants"
import { useGameServerWebsocket, usePassportServerAuth, useSnackbar } from "../../../containers"
import { getRarityDeets } from "../../../helpers"
import { useToggle } from "../../../hooks"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { Asset } from "../../../types/assets"

export const LeaveConfirmation = ({ open, asset, onClose }: { open: boolean; asset: Asset; onClose: () => void }) => {
    const theme = useTheme<Theme>()
    const { newSnackbarMessage } = useSnackbar()
    const { state, send } = useGameServerWebsocket()
    const { user } = usePassportServerAuth()
    const { hash, name, label, image_url, avatar_url, tier } = asset.data.mech
    const [isLeaving, toggleIsLeaving] = useToggle()
    const [error, setError] = useState<string>()

    const rarityDeets = useMemo(() => getRarityDeets(tier), [tier])

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
        <Modal open={open} onClose={onClose} sx={{ zIndex: 999999 }}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "36rem",
                    boxShadow: 6,
                }}
            >
                <ClipThing
                    clipSize="0"
                    border={{
                        isFancy: true,
                        borderColor: theme.factionTheme.primary,
                        borderThickness: ".15rem",
                    }}
                    innerSx={{ position: "relative" }}
                >
                    <Stack
                        spacing="1.6rem"
                        sx={{
                            position: "relative",
                            px: "2.5rem",
                            py: "2.4rem",
                            backgroundColor: theme.factionTheme.background,
                        }}
                    >
                        <Box
                            sx={{
                                position: "relative",
                                px: ".6rem",
                                py: "1rem",
                                borderRadius: 0.6,
                                boxShadow: "inset 0 0 12px 6px #00000040",
                            }}
                        >
                            <Box
                                sx={{
                                    width: "100%",
                                    height: "13.8rem",
                                    backgroundImage: `url(${image_url})`,
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
                                    width: "5rem",
                                    height: "5rem",
                                    border: "#FFFFFF60 1px solid",
                                    backgroundImage: `url(${avatar_url})`,
                                    backgroundRepeat: "no-repeat",
                                    backgroundPosition: "top center",
                                    backgroundSize: "contain",
                                }}
                            />
                        </Box>

                        <Stack spacing=".8rem">
                            <Box>
                                <Box>
                                    <Typography sx={{ display: "inline", fontFamily: fonts.nostromoBold }}>{name || label}</Typography>
                                    {user && (
                                        <span>
                                            <Link
                                                href={`${PASSPORT_WEB}profile/${user.username}/asset/${hash}`}
                                                target="_blank"
                                                sx={{ display: "inline", ml: ".7rem" }}
                                            >
                                                <SvgExternalLink size="1rem" sx={{ display: "inline", opacity: 0.2, ":hover": { opacity: 0.6 } }} />
                                            </Link>
                                        </span>
                                    )}

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
                            </Box>

                            <Stack spacing=".8rem">
                                <Typography sx={{ strong: { color: colors.neonBlue } }}>
                                    Are you sure you&apos;d like to remove <strong>{name || label}</strong> from the battle queue? Your will be refunded the
                                    initial queuing fee.
                                </Typography>

                                <Stack direction="row" spacing="2rem" alignItems="center" sx={{ mt: "auto" }}>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        disabled={isLeaving}
                                        onClick={onLeave}
                                        sx={{
                                            flex: 1,
                                            minWidth: 0,
                                            mt: ".8rem",
                                            px: ".8rem",
                                            py: ".6rem",
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
                                                fontWeight: "fontWeightBold",
                                                color: "#FFFFFF",
                                            }}
                                        >
                                            {isLeaving ? "LEAVING QUEUE..." : "REMOVE FROM QUEUE"}
                                        </Typography>
                                    </Button>
                                </Stack>

                                {error && (
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            mt: ".3rem",
                                            color: "red",
                                        }}
                                    >
                                        {error}
                                    </Typography>
                                )}
                            </Stack>
                        </Stack>
                    </Stack>

                    <IconButton size="small" onClick={onClose} sx={{ position: "absolute", top: ".2rem", right: ".2rem" }}>
                        <SvgClose size="1.6rem" sx={{ opacity: 0.1, ":hover": { opacity: 0.6 } }} />
                    </IconButton>
                </ClipThing>
            </Box>
        </Modal>
    )
}
