import { Box, Checkbox, FormControlLabel, Modal, Stack, Typography } from "@mui/material"
import { useCallback, useState } from "react"
import { useAuth, useGlobalNotifications } from "../../containers"
import { useGameServerCommandsUser } from "../../hooks/useGameServer"
import { GameServerKeys } from "../../keys"
import { colors, fonts } from "../../theme/theme"
import { ClipThing } from "../Common/ClipThing"
import { FancyButton } from "../Common/FancyButton"

export const MarketingPopup = () => {
    const { user } = useAuth()
    const { newSnackbarMessage } = useGlobalNotifications()
    const [showMarketingPopup, setShowMarketingPopup] = useState(!!user.id && user.accepts_marketing == null && user.faction_id != null)

    const { send } = useGameServerCommandsUser("/user_commander")
    const [isLoading, setIsLoading] = useState(false)
    const [acceptMarketing, setAcceptMarketing] = useState(false)

    const updateMarketingPreferences = useCallback(async () => {
        setIsLoading(true)
        try {
            await send<null, { accepts_marketing: boolean }>(GameServerKeys.UpdateMarketingPreferences, { accepts_marketing: acceptMarketing })
            newSnackbarMessage("Successfully updated mearketing preferences.", "success")
        } catch (e) {
            newSnackbarMessage(typeof e === "string" ? e : "Failed to update marketing preferences.", "error")
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }, [acceptMarketing, newSnackbarMessage, send])

    return (
        <Modal open={showMarketingPopup}>
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
                        borderColor: "#FFFFFF",
                        borderThickness: ".3rem",
                    }}
                    backgroundColor={colors.darkNavyBlue}
                >
                    <Stack
                        sx={{
                            position: "relative",
                            width: "100%",
                            height: "100%",
                            padding: "2rem",
                        }}
                    >
                        <Typography variant="body1">
                            Please check the box below if you would like to receive updates, special offers and newsletters from Supremacy. All promotional
                            content will be sent to your registered email on XSYN.
                        </Typography>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    disabled={isLoading}
                                    size="small"
                                    checked={acceptMarketing}
                                    onChange={(e) => {
                                        setAcceptMarketing(e.currentTarget.checked)
                                    }}
                                    sx={{
                                        color: colors.yellow,
                                        "& > .MuiSvgIcon-root": { width: "2.8rem", height: "2.8rem" },
                                        ".Mui-checked, .MuiSvgIcon-root": { color: `${colors.yellow} !important` },
                                        ".Mui-checked+.MuiSwitch-track": { backgroundColor: `${colors.yellow}50 !important` },
                                    }}
                                />
                            }
                            label="Opt-in to marketing emails"
                        />
                        <FancyButton
                            clipThingsProps={{
                                clipSize: "9px",
                                backgroundColor: colors.yellow,
                                opacity: 1,
                                border: { borderColor: colors.yellow, borderThickness: "2.5px" },
                                sx: {},
                            }}
                            sx={{ px: "2rem", py: ".6rem", color: "#000000" }}
                            onClick={() => {
                                updateMarketingPreferences()
                                setShowMarketingPopup(false)
                            }}
                        >
                            <Typography sx={{ fontFamily: fonts.nostromoHeavy, color: "#000000" }}>UPDATE MARKETING PREFERENCES</Typography>
                        </FancyButton>
                    </Stack>
                </ClipThing>
            </Box>
        </Modal>
    )
}
