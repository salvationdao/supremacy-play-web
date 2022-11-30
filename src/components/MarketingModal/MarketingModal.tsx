import { Checkbox, Collapse, Modal, Stack, Typography } from "@mui/material"
import { useCallback, useState } from "react"
import { SvgMail } from "../../assets"
import { useAuth, useGlobalNotifications } from "../../containers"
import { useGameServerCommandsUser } from "../../hooks/useGameServer"
import { GameServerKeys } from "../../keys"
import { colors, fonts } from "../../theme/theme"
import { NiceBoxThing } from "../Common/Nice/NiceBoxThing"
import { NiceButton } from "../Common/Nice/NiceButton"
import { NiceTextField } from "../Common/Nice/NiceTextField"

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
            <NiceBoxThing
                border={{ color: "#FFFFFF" }}
                background={{ colors: [colors.darkNavy] }}
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
                <Stack
                    sx={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                        padding: "2rem",
                    }}
                >
                    <Typography variant="h5" sx={{ fontFamily: fonts.nostromoBlack, mb: "1.2rem" }}>
                        Subscribe to our newsletter
                    </Typography>

                    <Typography>
                        Please check the box below if you would like to receive updates, special offers and newsletters from Supremacy. All promotional content
                        will be sent to your registered email on XSYN.
                    </Typography>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            updateMarketingPreferences()
                        }}
                    >
                        <Stack spacing=".5rem">
                            <Stack direction="row" spacing=".8rem" alignItems="center" sx={{ my: "1rem" }}>
                                <Checkbox
                                    disabled={isLoading}
                                    checked={acceptMarketing}
                                    onChange={(e) => {
                                        setAcceptMarketing(e.currentTarget.checked)
                                    }}
                                />

                                <Typography>Subscribe to Supremacy news and updates</Typography>
                            </Stack>

                            <Collapse in={!userFromPassport?.email && acceptMarketing} unmountOnExit>
                                <NiceTextField
                                    required
                                    disabled={isLoading}
                                    primaryColor={colors.yellow}
                                    value={newEmail || ""}
                                    onChange={(value) => setNewEmail(value)}
                                    placeholder="Your email..."
                                    type="email"
                                    InputProps={{
                                        startAdornment: <SvgMail size="1.5rem" sx={{ opacity: 0.5 }} />,
                                    }}
                                    sx={{
                                        mb: "2rem",
                                    }}
                                />
                            </Collapse>

                            <NiceButton type="submit" corners sheen={{ sheenSpeedFactor: 0.8 }} buttonColor={colors.yellow}>
                                UPDATE
                            </NiceButton>
                        </Stack>
                    </form>
                </Stack>
            </NiceBoxThing>
        </Modal>
    )
}
