import { Popover, Stack } from "@mui/material"
import { MutableRefObject, useEffect, useState } from "react"
import { ClipThing } from "../../.."
import { SvgAssets, SvgProfile, SvgSettings, SvgSupport } from "../../../../assets"
import { PASSPORT_WEB } from "../../../../constants"
import { useAuth } from "../../../../containers"
import { useTheme } from "../../../../containers/theme"
import { useToggle } from "../../../../hooks"
import { siteZIndex } from "../../../../theme/theme"
import { FeatureName, User } from "../../../../types"
import { PreferencesModal } from "../PreferencesModal/PreferencesModal"
import { TelegramRegisterModal } from "../PreferencesModal/TelegramRegisterModal"
import { LogoutButton } from "./LogoutButton"
import { NavButton } from "./NavButton"
import { QrCodeModal } from "./QrCodeModal"

export const ProfilePopover = ({ open, popoverRef, onClose, user }: { open: boolean; popoverRef: MutableRefObject<null>; onClose: () => void; user: User }) => {
    const theme = useTheme()
    const { userHasFeature } = useAuth()

    const [localOpen, toggleLocalOpen] = useToggle(open)
    const [preferencesModalOpen, togglePreferencesModalOpen] = useToggle()
    const [qrModalOpen, toggleQRModalOpen] = useToggle()

    const [telegramShortcode, setTelegramShortcode] = useState<string>("")
    const canViewProfilePage = userHasFeature(FeatureName.publicProfilePage)

    useEffect(() => {
        if (!localOpen && !preferencesModalOpen) {
            const timeout = setTimeout(() => {
                onClose()
            }, 300)

            return () => clearTimeout(timeout)
        }
    }, [localOpen, onClose, preferencesModalOpen])

    return (
        <>
            <Popover
                open={localOpen}
                anchorEl={popoverRef.current}
                onClose={() => toggleLocalOpen(false)}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
                sx={{
                    mt: ".5rem",
                    zIndex: siteZIndex.Popover,
                    ".MuiPaper-root": {
                        background: "none",
                        boxShadow: 0,
                    },
                }}
            >
                <ClipThing
                    clipSize="10px"
                    border={{
                        borderColor: theme.factionTheme.primary,
                        borderThickness: ".3rem",
                    }}
                    backgroundColor={theme.factionTheme.background}
                    sx={{ height: "100%" }}
                >
                    <Stack spacing=".32rem" sx={{ p: ".8rem" }}>
                        <NavButton href={`${PASSPORT_WEB}profile`} startIcon={<SvgAssets sx={{ pb: ".5rem" }} size="1.6rem" />} text="My Inventory" />

                        {canViewProfilePage ? (
                            <NavButton href={`/profile/${user.gid}`} startIcon={<SvgProfile sx={{ pb: ".5rem" }} size="1.6rem" />} text="Profile" />
                        ) : (
                            <NavButton
                                href={`${PASSPORT_WEB}profile/${user.username}/edit`}
                                startIcon={<SvgProfile sx={{ pb: ".5rem" }} size="1.6rem" />}
                                text="Edit Profile"
                            />
                        )}

                        <NavButton href="https://supremacyhelp.zendesk.com/" startIcon={<SvgSupport sx={{ pb: ".5rem" }} size="1.6rem" />} text="SUPPORT" />

                        <NavButton
                            onClick={() => {
                                togglePreferencesModalOpen(true)
                            }}
                            startIcon={<SvgSettings sx={{ pb: ".5rem" }} size="1.6rem" />}
                            text="Preferences"
                        />

                        <NavButton
                            onClick={() => {
                                toggleQRModalOpen(true)
                            }}
                            startIcon={<SvgSettings sx={{ pb: ".5rem" }} size="1.6rem" />}
                            text="QR Code Generator"
                        />

                        <LogoutButton />
                    </Stack>
                </ClipThing>
            </Popover>

            {/* preferences modal */}
            {preferencesModalOpen && (
                <PreferencesModal
                    onClose={() => {
                        togglePreferencesModalOpen(false)
                        toggleLocalOpen(false)
                    }}
                    setTelegramShortcode={setTelegramShortcode}
                />
            )}

            {/* preferences modal */}
            {qrModalOpen && (
                <QrCodeModal
                    onClose={() => {
                        toggleQRModalOpen(false)
                        toggleLocalOpen(false)
                    }}
                />
            )}

            {/* telegram register modal */}
            {!!telegramShortcode && <TelegramRegisterModal code={telegramShortcode} onClose={() => setTelegramShortcode("")} />}
        </>
    )
}
