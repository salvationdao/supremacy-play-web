import { Box, IconButton, Modal, Stack, Typography } from "@mui/material"
import { ClipThing } from "../.."
import { SvgClose } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { dateFormatter, snakeToTitle } from "../../../helpers"
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
                    outline: "none",
                    boxShadow: 6,
                }}
            >
                <ClipThing
                    clipSize="8px"
                    border={{
                        borderColor: colors.red,
                        borderThickness: ".2rem",
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
                                if (p.related_punish_vote.status !== "PASSED") return null
                                return (
                                    <Stack key={p.id} spacing=".5rem" sx={{ px: "1.2rem", py: ".8rem", backgroundColor: "#FFFFFF08" }}>
                                        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing="1rem">
                                            <Typography sx={{ color: colors.lightNeonBlue }}>
                                                <strong>{snakeToTitle(p.punish_option.key).toUpperCase()}</strong>
                                            </Typography>
                                            <Typography sx={{ color: colors.lightNeonBlue }}>
                                                <strong>UNTIL:</strong> {dateFormatter(p.punish_until)}
                                            </Typography>
                                        </Stack>
                                        <Typography sx={{ strong: { color: colors.offWhite } }}>
                                            <strong>DURATION:</strong> {p.punish_option.punish_duration_hours} hours
                                        </Typography>
                                        <Typography sx={{ strong: { color: colors.offWhite } }}>
                                            <strong>DESCRIPTION:</strong> {p.punish_option.description}
                                        </Typography>
                                        <Typography sx={{ strong: { color: colors.offWhite } }}>
                                            <strong>INITIATED BY:</strong> {p.related_punish_vote.issued_by_username}
                                            <span style={{ marginLeft: ".2rem", opacity: 0.7 }}>#{p.related_punish_vote.issued_by_gid}</span>
                                        </Typography>
                                        <Typography sx={{ strong: { color: colors.offWhite } }}>
                                            <strong>REASON:</strong> {p.related_punish_vote.reason}
                                        </Typography>
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
