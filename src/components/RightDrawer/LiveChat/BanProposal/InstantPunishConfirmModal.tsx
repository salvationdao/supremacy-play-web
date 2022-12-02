import { Box, Modal, Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { ClipThing, FancyButton } from "../../.."
import { SvgSupToken } from "../../../../assets"
import { useTheme } from "../../../../containers/theme"
import { getUserRankDeets, supFormatter } from "../../../../helpers"
import { colors, fonts, siteZIndex } from "../../../../theme/theme"

export const InstantPunishConfirmModal = ({
    submitInstantPunish,
    onClose,
    cost,
    punishPlayer,
}: {
    submitInstantPunish: () => void
    onClose: () => void
    cost: string
    punishPlayer: string
}) => {
    const theme = useTheme()

    const rankDeets = useMemo(() => getUserRankDeets("GENERAL", "1rem", "1.6rem"), [])

    return (
        <Modal open onClose={onClose} sx={{ zIndex: siteZIndex.Modal }}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "38rem",
                    boxShadow: 6,
                    outline: "none",
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
                        spacing="1.2rem"
                        sx={{
                            position: "relative",
                            px: "2.5rem",
                            py: "2.4rem",
                            span: {
                                color: colors.neonBlue,
                                fontWeight: "bold",
                            },
                        }}
                    >
                        <Stack spacing=".6rem" direction="row" alignItems="center">
                            {rankDeets?.icon}
                            <Typography variant="h6" sx={{ lineHeight: 1, fontFamily: fonts.nostromoBlack }}>
                                COMMAND OVERRIDE
                            </Typography>
                        </Stack>

                        <Typography>
                            To initiate command override, there needs to be <span> 5x GENERALs </span> to punish a player instantly. Do you wish to spend{" "}
                            <span>{supFormatter(cost, 0)}</span> SUPS to initiate the command override to punish player [{punishPlayer}]?
                        </Typography>

                        <Stack direction="row" spacing="1rem" sx={{ pt: ".4rem" }}>
                            <FancyButton
                                clipThingsProps={{
                                    clipSize: "5px",
                                    backgroundColor: colors.green,
                                    border: { borderColor: colors.green, borderThickness: "2px" },
                                    sx: { flex: 2, position: "relative" },
                                }}
                                sx={{ pt: ".2rem", pb: 0, minWidth: "5rem" }}
                                onClick={submitInstantPunish}
                            >
                                <Stack direction="row" justifyContent="center">
                                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                        CONFIRM (
                                    </Typography>
                                    <SvgSupToken size="1.4rem" />
                                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                        {supFormatter(cost, 0)})
                                    </Typography>
                                </Stack>
                            </FancyButton>

                            <FancyButton
                                clipThingsProps={{
                                    clipSize: "5px",
                                    backgroundColor: colors.red,
                                    border: { borderColor: colors.red, borderThickness: "2px" },
                                    sx: { flex: 2, position: "relative" },
                                }}
                                sx={{ pt: ".2rem", pb: 0, minWidth: "5rem" }}
                                onClick={onClose}
                            >
                                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                    CANCEL
                                </Typography>
                            </FancyButton>
                        </Stack>
                    </Stack>
                </ClipThing>
            </Box>
        </Modal>
    )
}
