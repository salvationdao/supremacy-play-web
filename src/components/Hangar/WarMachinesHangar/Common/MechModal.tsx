import { Box, IconButton, Modal, Stack, Typography } from "@mui/material"
import { ReactNode } from "react"
import { ClipThing } from "../../.."
import { SvgClose } from "../../../../assets"
import { useTheme } from "../../../../containers/theme"
import { fonts, siteZIndex } from "../../../../theme/theme"
import { MechDetails } from "../../../../types"
import { MediaPreview } from "../../../Common/MediaPreview/MediaPreview"
import { MechLoadoutIcons } from "./MechLoadoutIcons"

export const MechModal = ({
    open,
    mechDetails,
    onClose,
    width,
    children,
}: {
    open: boolean
    mechDetails: MechDetails
    onClose: () => void
    width?: string
    children: ReactNode
}) => {
    const theme = useTheme()

    const { name, label } = mechDetails
    const skin = mechDetails ? mechDetails.chassis_skin || mechDetails.default_chassis_skin : undefined
    const avatarUrl = skin?.avatar_url || mechDetails.avatar_url
    const imageUrl = skin?.image_url || mechDetails.image_url
    const cardAnimationUrl = skin?.card_animation_url || mechDetails.card_animation_url

    return (
        <Modal open={open} onClose={onClose} sx={{ zIndex: siteZIndex.Modal }}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: width || "43rem",
                    boxShadow: 6,
                    outline: "none",
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
                        <Box sx={{ height: "19rem" }}>
                            <MediaPreview imageUrl={imageUrl || avatarUrl} videoUrls={[cardAnimationUrl]} />
                        </Box>

                        <Stack spacing=".8rem">
                            <MechLoadoutIcons mechDetails={mechDetails} />

                            <Typography sx={{ fontFamily: fonts.nostromoBlack, letterSpacing: "1px" }}>{name || label}</Typography>
                        </Stack>

                        {children}
                    </Stack>

                    <IconButton size="small" onClick={onClose} sx={{ position: "absolute", top: ".5rem", right: ".5rem" }}>
                        <SvgClose size="2.6rem" sx={{ opacity: 0.1, ":hover": { opacity: 0.6 } }} />
                    </IconButton>
                </ClipThing>
            </Box>
        </Modal>
    )
}
