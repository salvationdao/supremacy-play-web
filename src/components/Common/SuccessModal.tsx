import { Box, Modal, Stack, Typography } from "@mui/material"
import { ReactNode } from "react"
import { ClipThing, FancyButton } from ".."
import { useTheme } from "../../containers/theme"
import { colors, fonts, siteZIndex } from "../../theme/theme"

interface SuccessModalProps {
    title: string
    children: ReactNode

    // Right button
    rightLabel: string
    rightColor?: string
    onRightButton: () => void

    // Left button
    leftLabel: string
    leftColor?: string
    onLeftButton: () => void
}

export const SuccessModal = ({
    title,
    children,
    onRightButton,
    onLeftButton,
    rightLabel,
    leftLabel,
    rightColor = colors.green,
    leftColor = colors.red,
}: SuccessModalProps) => {
    const theme = useTheme()

    return (
        <Modal open sx={{ zIndex: siteZIndex.Modal }}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "60rem",
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
                                fontWeight: "fontWeightBold",
                            },
                        }}
                    >
                        <Typography variant="h5" sx={{ lineHeight: 1, fontFamily: fonts.nostromoBlack }}>
                            {title}
                        </Typography>

                        {children}

                        <Stack direction="row" spacing="1rem" sx={{ pt: ".4rem" }}>
                            <FancyButton
                                excludeCaret
                                clipThingsProps={{
                                    clipSize: "5px",
                                    backgroundColor: leftColor,
                                    border: { borderColor: leftColor, borderThickness: "2px" },
                                    sx: { flex: 2, position: "relative" },
                                }}
                                sx={{ pt: 0, pb: 0, minWidth: "5rem" }}
                                onClick={onLeftButton}
                            >
                                <Typography variant="h6" sx={{ fontWeight: "fontWeightBold" }}>
                                    {leftLabel}
                                </Typography>
                            </FancyButton>

                            <FancyButton
                                excludeCaret
                                clipThingsProps={{
                                    clipSize: "5px",
                                    backgroundColor: rightColor,
                                    border: { borderColor: rightColor, borderThickness: "2px" },
                                    sx: { flex: 2, position: "relative" },
                                }}
                                sx={{ pt: 0, pb: 0, minWidth: "5rem" }}
                                onClick={onRightButton}
                            >
                                <Typography variant="h6" sx={{ fontWeight: "fontWeightBold" }}>
                                    {rightLabel}
                                </Typography>
                            </FancyButton>
                        </Stack>
                    </Stack>
                </ClipThing>
            </Box>
        </Modal>
    )
}
