import { Box, IconButton, Modal, Stack, Typography } from "@mui/material"
import { SvgClose } from "../../../../assets"
import { useTheme } from "../../../../containers/theme"
import { fonts } from "../../../../theme/theme"
import { ClipThing } from "../../../Common/ClipThing"
import { NotificationPreferences } from "./NotificationPreferences"
import { DevicePreferences } from "./DevicePreferences"
import { useAuth } from "../../../../containers"
import { STAGING_OR_DEV_ONLY } from "../../../../constants"

interface PreferencesModalProps {
    onClose: () => void
    setTelegramShortcode: (code: string) => void
    toggleAddDeviceModal: () => void
}

export const PreferencesModal = ({ onClose, setTelegramShortcode, toggleAddDeviceModal }: PreferencesModalProps) => {
    const theme = useTheme()
    const { factionID } = useAuth()

    return (
        <Modal open onClose={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "54rem",
                    boxShadow: 24,
                    outline: "none",
                }}
            >
                <ClipThing
                    clipSize="8px"
                    border={{
                        borderColor: theme.factionTheme.primary,
                        borderThickness: ".3rem",
                    }}
                    sx={{ position: "relative" }}
                    backgroundColor={theme.factionTheme.background}
                >
                    <Stack
                        spacing=".7rem"
                        sx={{
                            position: "relative",
                            px: "1.8rem",
                            py: "1.6rem",
                            pb: "1.6rem",
                        }}
                    >
                        <Typography variant="h6" sx={{ fontFamily: fonts.nostromoBlack }}>
                            PREFERENCES
                        </Typography>

                        <NotificationPreferences setTelegramShortcode={setTelegramShortcode} />

                        {/* Only display the device preferences if the user has selected a faction */}
                        {STAGING_OR_DEV_ONLY && factionID && <DevicePreferences toggleAddDeviceModal={toggleAddDeviceModal} />}
                    </Stack>

                    <IconButton size="small" onClick={onClose} sx={{ position: "absolute", top: ".5rem", right: ".5rem" }}>
                        <SvgClose size="1.9rem" sx={{ opacity: 0.1, ":hover": { opacity: 0.6 } }} />
                    </IconButton>
                </ClipThing>
            </Box>
        </Modal>
    )
}
