import { Box, IconButton, Modal, Stack, Typography } from "@mui/material"
import { ReactNode, useMemo } from "react"
import { ClipThing } from "../../.."
import { SvgClose } from "../../../../assets"
import { useTheme } from "../../../../containers/theme"
import { getRarityDeets } from "../../../../helpers"
import { fonts, siteZIndex } from "../../../../theme/theme"
import { MechDetails } from "../../../../types"

export const MechModal = ({
    mechDetails,
    onClose,
    width,
    children,
}: {
    mechDetails: MechDetails
    onClose: () => void
    width?: string
    children: ReactNode
}) => {
    const theme = useTheme()

    const { name, label, tier } = mechDetails
    const rarityDeets = useMemo(() => getRarityDeets(tier || ""), [tier])
    const skin = mechDetails ? mechDetails.chassis_skin || mechDetails.default_chassis_skin : undefined
    const imageUrl = skin?.image_url || mechDetails.image_url

    return (
        <Modal open onClose={onClose} sx={{ zIndex: siteZIndex.Modal }}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: width || "43rem",
                    boxShadow: 6,
                }}
            >
                <ClipThing
                    clipSize="8px"
                    border={{
                        borderColor: theme.factionTheme.primary,
                        borderThickness: ".3rem",
                    }}
                    corners={{
                        topLeft: true,
                        topRight: true,
                        bottomLeft: true,
                        bottomRight: true,
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
                            maxHeight: "calc(100vh - 5rem)",
                            overflow: "hidden",
                        }}
                    >
                        <Box
                            sx={{
                                position: "relative",
                                px: ".6rem",
                                py: "1rem",
                                borderRadius: 1,
                                boxShadow: "inset 0 0 12px 6px #00000040",
                                background: `radial-gradient(#FFFFFF20 10px, ${theme.factionTheme.background})`,
                                border: "#00000060 1px solid",
                            }}
                        >
                            <Box
                                sx={{
                                    width: "100%",
                                    height: "19rem",
                                    backgroundImage: `url(${imageUrl})`,
                                    backgroundRepeat: "no-repeat",
                                    backgroundPosition: "top center",
                                    backgroundSize: "contain",
                                }}
                            />
                        </Box>

                        <Box>
                            <Typography sx={{ fontFamily: fonts.nostromoBlack, letterSpacing: "1px" }}>{name || label}</Typography>

                            <Typography
                                variant="body2"
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

                        {children}
                    </Stack>

                    <IconButton size="small" onClick={onClose} sx={{ position: "absolute", top: ".5rem", right: ".5rem" }}>
                        <SvgClose size="1.9rem" sx={{ opacity: 0.1, ":hover": { opacity: 0.6 } }} />
                    </IconButton>
                </ClipThing>
            </Box>
        </Modal>
    )
}
