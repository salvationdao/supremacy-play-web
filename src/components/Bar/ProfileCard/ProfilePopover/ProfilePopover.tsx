import { Popover, Stack } from "@mui/material"
import { MutableRefObject, useEffect, useState } from "react"
import { SvgAdmin, SvgAssets, SvgFeedback, SvgProfile, SvgSettings, SvgSupport } from "../../../../assets"
import { DEV_ONLY, FEEDBACK_FORM_URL, PASSPORT_WEB, STAGING_OR_DEV_ONLY } from "../../../../constants"
import { useTheme } from "../../../../containers/theme"
import { useToggle } from "../../../../hooks"
import { RoleType, User } from "../../../../types"
import { NiceBoxThing } from "../../../Common/Nice/NiceBoxThing"
import { DeviceRegisterModal } from "../PreferencesModal/DeviceRegisterModal"
import { PreferencesModal } from "../PreferencesModal/PreferencesModal"
import { TelegramRegisterModal } from "../PreferencesModal/TelegramRegisterModal"
import { LogoutButton } from "./LogoutButton"
import { NavButton } from "./NavButton"

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
                    mt: "-.2rem",
                }}
            >
                <NiceBoxThing border={{ color: theme.factionTheme.primary }} background={{ colors: [theme.factionTheme.background] }} sx={{ height: "100%" }}>
                    <Stack spacing=".32rem" sx={{ p: ".8rem" }}>
                        <NavButton
                            linkProps={{
                                link: { href: `${PASSPORT_WEB}profile`, target: "_blank" },
                            }}
                            startIcon={<SvgAssets inline sx={{ pb: ".5rem" }} size="1.6rem" />}
                            text="My Inventory"
                        />

                        <NavButton
                            linkProps={{
                                route: { to: `/profile/${user.gid}` },
                            }}
                            startIcon={<SvgProfile inline sx={{ pb: ".5rem" }} size="1.6rem" />}
                            text="Profile"
                        />

                        {(user.role_type === RoleType.admin || user.role_type === RoleType.moderator) && (
                            <NavButton
                                linkProps={{
                                    route: { to: `/admin/lookup` },
                                }}
                                startIcon={<SvgAdmin inline sx={{ pb: ".5rem" }} size="1.6rem" />}
                                text="Admin"
                            />
                        )}

                        <NavButton
                            linkProps={{
                                link: { href: `${PASSPORT_WEB}profile/${user.username}/edit`, target: "_blank" },
                            }}
                            startIcon={<SvgProfile inline sx={{ pb: ".5rem" }} size="1.6rem" />}
                            text="XSYN Profile"
                        />

                        {STAGING_OR_DEV_ONLY && (
                            <NavButton
                                linkProps={{
                                    route: { to: "/billing-history" },
                                }}
                                startIcon={<SvgAssets inline sx={{ pb: ".5rem" }} size="1.6rem" />}
                                text="Billing History"
                            />
                        )}

                        <NavButton
                            linkProps={{
                                link: { href: "https://supremacyhelp.zendesk.com/", target: "_blank" },
                            }}
                            startIcon={<SvgSupport inline sx={{ pb: ".5rem" }} size="1.6rem" />}
                            text="SUPPORT"
                        />

                        <NavButton
                            linkProps={{
                                link: { href: FEEDBACK_FORM_URL, target: "_blank" },
                            }}
                            startIcon={<SvgFeedback inline sx={{ pb: ".5rem" }} size="1.6rem" />}
                            text="Feedback"
                        />

                        <NavButton
                            onClick={() => togglePreferencesModalOpen(true)}
                            startIcon={<SvgSettings inline sx={{ pb: ".5rem" }} size="1.6rem" />}
                            text="Preferences"
                        />

                        <LogoutButton />
                    </Stack>
                </NiceBoxThing>
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
            {DEV_ONLY && addDeviceModalOpen && (
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
