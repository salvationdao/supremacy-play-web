import { Box, Checkbox, Collapse, FormControlLabel, InputAdornment, Modal, Stack, TextField, Typography } from "@mui/material"
import { useCallback, useState } from "react"
import { SvgMail } from "../../assets"
import { useAuth, useGlobalNotifications } from "../../containers"
import { useGameServerCommandsUser } from "../../hooks/useGameServer"
import { GameServerKeys } from "../../keys"
import { colors, fonts } from "../../theme/theme"
import { ClipThing } from "../Common/Deprecated/ClipThing"
import { FancyButton } from "../Common/Deprecated/FancyButton"

export const MarketingModal = () => {
    const { user, userFromPassport } = useAuth()
    const { newSnackbarMessage } = useGlobalNotifications()
    const [showMarketingPopup, setShowMarketingPopup] = useState(!!user.id && user.accepts_marketing == null && user.faction_id != null)

    const { send } = useGameServerCommandsUser("/user_commander")
    const [isLoading, setIsLoading] = useState(false)
    const [acceptMarketing, setAcceptMarketing] = useState(false)
    const [newEmail, setNewEmail] = useState<string>()

    const updateMarketingPreferences = useCallback(async () => {
        setIsLoading(true)
        try {
            console.log(newEmail)
            await send<null, { accepts_marketing: boolean; new_email?: string }>(GameServerKeys.UpdateMarketingPreferences, {
                accepts_marketing: acceptMarketing,
                new_email: newEmail,
            })
            setShowMarketingPopup(false)
            newSnackbarMessage("Successfully updated marketing preferences.", "success")
        } catch (e) {
            newSnackbarMessage(typeof e === "string" ? e : "Failed to update marketing preferences.", "error")
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }, [acceptMarketing, newEmail, newSnackbarMessage, send])

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
                        <form
                            onSubmit={(e) => {
                                e.preventDefault()
                                updateMarketingPreferences()
                            }}
                        >
                            <Stack>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            disabled={isLoading}
                                            checked={acceptMarketing}
                                            onChange={(e) => {
                                                setAcceptMarketing(e.currentTarget.checked)
                                            }}
                                        />
                                    }
                                    label="Subscribe to Supremacy news and updates"
                                />
                                <Collapse in={!userFromPassport?.email && acceptMarketing} unmountOnExit>
                                    <TextField
                                        variant="outlined"
                                        placeholder="Your email"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SvgMail fill={colors.yellow} size="2.4rem" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            mb: "1rem",
                                        }}
                                        type="email"
                                        value={newEmail || ""}
                                        onChange={(e) => setNewEmail(e.target.value)}
                                        disabled={isLoading}
                                        required
                                        fullWidth
                                    />
                                </Collapse>
                                <FancyButton
                                    clipThingsProps={{
                                        clipSize: "9px",
                                        backgroundColor: colors.yellow,
                                        opacity: 1,
                                        border: { borderColor: colors.yellow, borderThickness: "2.5px" },
                                        sx: {},
                                    }}
                                    sx={{ px: "2rem", py: ".6rem", color: "#000000" }}
                                    type="submit"
                                >
                                    <Typography sx={{ fontFamily: fonts.nostromoHeavy, color: "#000000" }}>UPDATE MARKETING PREFERENCES</Typography>
                                </FancyButton>
                            </Stack>
                        </form>
                    </Stack>
                </ClipThing>
            </Box>
        </Modal>
    )
}
