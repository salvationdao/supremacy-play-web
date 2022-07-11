import { Box, IconButton, Modal, Stack, Typography } from "@mui/material"
import { ClipThing } from "../.."
import { SvgClose } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { dateFormatter } from "../../../helpers"
import { colors, fonts } from "../../../theme/theme"
import { PunishListItem } from "../../../types/chat"

interface Props {
    open: boolean
    onClose: () => void
    punishments?: PunishListItem[]
}

export const PunishmentList = ({ open, onClose, punishments }: Props) => {
    const theme = useTheme()

    if (!punishments || punishments.length <= 0) return null

    return (
        <Modal open={open} onClose={onClose} BackdropProps={{ sx: { opacity: "0.1 !important" } }}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "40rem",
                    border: "none",
                    boxShadow: 6,
                    outline: "none",
                }}
            >
                <ClipThing
                    clipSize="8px"
                    border={{
                        borderColor: colors.red,
                        borderThickness: ".3rem",
                    }}
                    sx={{ position: "relative" }}
                    backgroundColor={theme.factionTheme.background}
                >
                    <Box sx={{ position: "relative", px: "1rem", py: "1.6rem" }}>
                        <Typography variant="h6" sx={{ mb: "1rem", px: "1rem", fontFamily: fonts.nostromoBlack }}>
                            YOU&apos;VE BEEN PUNISHED!
                        </Typography>

                        <Stack spacing=".6rem">
                            {punishments.map((p) => {
                                let banFrom = "PUNISH VOTE"
                                if (p.ban_from === "SYSTEM") {
                                    banFrom = "SYSTEM BAN"
                                } else {
                                    banFrom = "ADMIN BAN"
                                }

                                return (
                                    <Stack key={p.id} spacing=".5rem" sx={{ px: "1.2rem", py: ".8rem", backgroundColor: "#FFFFFF08" }}>
                                        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing="1rem">
                                            <Typography sx={{ color: colors.lightNeonBlue }}>
                                                <strong>{banFrom}</strong>
                                            </Typography>
                                            <Typography sx={{ color: colors.lightNeonBlue }}>
                                                <strong>UNTIL:</strong> {dateFormatter(p.end_at)}
                                            </Typography>
                                        </Stack>
                                        <Typography sx={{ strong: { color: colors.offWhite } }}>
                                            <strong>REASON:</strong> {p.reason}
                                        </Typography>
                                        <Typography sx={{ strong: { color: colors.offWhite } }}>
                                            <strong>INITIATED BY:</strong> {p.ban_by_user.username}
                                            <span style={{ marginLeft: ".2rem", opacity: 0.7 }}>#{p.ban_by_user.gid}</span>
                                        </Typography>
                                        <Typography sx={{ strong: { color: colors.offWhite } }}>
                                            <strong>RESTRICTION{p.restrictions.length === 1 ? "" : "S"}:</strong>
                                        </Typography>
                                        <Box>
                                            {p.restrictions.map((res, i) => (
                                                <Typography key={res + i} sx={{ pl: 1.5 }}>
                                                    • {res}
                                                </Typography>
                                            ))}
                                        </Box>
                                    </Stack>
                                )
                            })}
                        </Stack>
                    </Box>

                    <IconButton size="small" onClick={onClose} sx={{ position: "absolute", top: ".5rem", right: ".5rem" }}>
                        <SvgClose size="1.9rem" sx={{ opacity: 0.1, ":hover": { opacity: 0.6 } }} />
                    </IconButton>
                </ClipThing>
            </Box>
        </Modal>
    )
}
