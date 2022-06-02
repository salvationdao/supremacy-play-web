import { Popover, Stack } from "@mui/material"
import { MutableRefObject, useEffect, useState } from "react"
import { SvgAssets, SvgProfile, SvgSettings, SvgShop, SvgSupport } from "../../../../assets"
import { PASSPORT_WEB } from "../../../../constants"
import { useToggle } from "../../../../hooks"
import { siteZIndex } from "../../../../theme/theme"
import { User } from "../../../../types"
import { PreferencesModal } from "../PreferencesModal/PreferencesModal"
import { TelegramRegisterModal } from "../PreferencesModal/TelegramRegisterModal"
import { LogoutButton } from "./LogoutButton"
import { NavButton } from "./NavButton"

export const ProfilePopover = ({ open, popoverRef, onClose, user }: { open: boolean; popoverRef: MutableRefObject<null>; onClose: () => void; user: User }) => {
    const [localOpen, toggleLocalOpen] = useToggle(open)
    const [preferencesModalOpen, togglePreferencesModalOpen] = useToggle()
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
                    horizontal: "left",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
                sx={{
                    mt: ".8rem",
                    zIndex: siteZIndex.Popover,
                    ".MuiPaper-root": {
                        background: "none",
                        backgroundColor: (theme) => theme.factionTheme.background,
                        border: "#FFFFFF50 1px solid",
                    },
                }}
            >
                <Stack spacing=".32rem" sx={{ p: ".8rem" }}>
                    <NavButton href={`${PASSPORT_WEB}collections/${user.username}`} startIcon={<SvgAssets sx={{ pb: ".5rem" }} size="1.6rem" />}>
                        My Inventory
                    </NavButton>
                    <NavButton href={`${PASSPORT_WEB}stores`} startIcon={<SvgShop sx={{ pb: ".5rem" }} size="1.6rem" />}>
                        Purchase Assets
                    </NavButton>
                    <NavButton href={`${PASSPORT_WEB}profile/${user.username}/edit`} startIcon={<SvgProfile sx={{ pb: ".5rem" }} size="1.6rem" />}>
                        Edit Profile
                    </NavButton>
                    <NavButton href="https://supremacyhelp.zendesk.com/" startIcon={<SvgSupport sx={{ pb: ".5rem" }} size="1.6rem" />}>
                        SUPPORT
                    </NavButton>

                    <NavButton
                        onClick={() => {
                            togglePreferencesModalOpen(true)
                        }}
                        startIcon={<SvgSettings sx={{ pb: ".5rem" }} size="1.6rem" />}
                    >
                        Preferences
                    </NavButton>
                    <LogoutButton />
                </Stack>
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

            {/* telegram register modal */}
            {!!telegramShortcode && <TelegramRegisterModal code={telegramShortcode} onClose={() => setTelegramShortcode("")} />}
        </>
    )
}
