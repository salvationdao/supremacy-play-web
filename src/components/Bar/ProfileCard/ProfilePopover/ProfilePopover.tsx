import { Popover, Stack } from "@mui/material"
import { MutableRefObject, useEffect, useState } from "react"
import { ClipThing } from "../../.."
import { SvgAssets, SvgProfile, SvgSettings, SvgSupport } from "../../../../assets"
import { PASSPORT_WEB, STAGING_OR_DEV_ONLY } from "../../../../constants"
import { useTheme } from "../../../../containers/theme"
import { useToggle } from "../../../../hooks"
import { siteZIndex } from "../../../../theme/theme"
import { User } from "../../../../types"
import { PreferencesModal } from "../PreferencesModal/PreferencesModal"
import { TelegramRegisterModal } from "../PreferencesModal/TelegramRegisterModal"
import { LogoutButton } from "./LogoutButton"
import { NavButton } from "./NavButton"
import { DeviceRegisterModal } from "../PreferencesModal/DeviceRegisterModal"

export const ProfilePopover = ({ open, popoverRef, onClose, user }: { open: boolean; popoverRef: MutableRefObject<null>; onClose: () => void; user: User }) => {
    const theme = useTheme()

    const [localOpen, toggleLocalOpen] = useToggle(open)
    const [preferencesModalOpen, togglePreferencesModalOpen] = useToggle()
    const [addDeviceModalOpen, toggleAddDeviceModalOpen] = useToggle()

    const [telegramShortcode, setTelegramShortcode] = useState<string>("")

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
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
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

                        <NavButton to={`/profile/${user.gid}`} startIcon={<SvgProfile sx={{ pb: ".5rem" }} size="1.6rem" />} text="Profile" />

                        <NavButton
                            href={`${PASSPORT_WEB}profile/${user.username}/edit`}
                            startIcon={<SvgProfile sx={{ pb: ".5rem" }} size="1.6rem" />}
                            text="XSYN Profile"
                        />

                        <NavButton to="/billing-history" startIcon={<SvgAssets sx={{ pb: ".5rem" }} size="1.6rem" />} text="Billing History" />

                        <NavButton href="https://supremacyhelp.zendesk.com/" startIcon={<SvgSupport sx={{ pb: ".5rem" }} size="1.6rem" />} text="SUPPORT" />

                        <NavButton
                            onClick={() => {
                                togglePreferencesModalOpen(true)
                            }}
                            startIcon={<SvgSettings sx={{ pb: ".5rem" }} size="1.6rem" />}
                            text="Preferences"
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
                    toggleAddDeviceModal={() => toggleAddDeviceModalOpen(!addDeviceModalOpen)}
                />
            )}

            {/* telegram register modal */}
            {!!telegramShortcode && <TelegramRegisterModal code={telegramShortcode} onClose={() => setTelegramShortcode("")} />}

            {/* Add new device modal - supremacy companion app */}
            {STAGING_OR_DEV_ONLY && addDeviceModalOpen && (
                <DeviceRegisterModal
                    onClose={() => {
                        toggleAddDeviceModalOpen(false)
                        toggleLocalOpen(false)
                    }}
                />
            )}
        </>
    )
}
