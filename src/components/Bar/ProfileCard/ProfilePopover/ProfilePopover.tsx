import { Popover, Stack } from "@mui/material"
import { MutableRefObject, useEffect } from "react"
import { SvgAssets, SvgProfile, SvgShop, SvgSupport } from "../../../../assets"
import { PASSPORT_WEB } from "../../../../constants"
import { useToggle } from "../../../../hooks"
import { UserData } from "../../../../types/passport"
import { LogoutButton } from "./LogoutButton"
import { NavButton } from "./NavButton"

export const ProfilePopover = ({
    open,
    popoverRef,
    onClose,
    user,
}: {
    open: boolean
    popoverRef: MutableRefObject<null>
    onClose: () => void
    user: UserData
}) => {
    const [localOpen, toggleLocalOpen] = useToggle(open)

    useEffect(() => {
        if (!localOpen) {
            const timeout = setTimeout(() => {
                onClose()
            }, 300)

            return () => clearTimeout(timeout)
        }
    }, [localOpen])

    return (
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
                zIndex: 10000,
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
                <LogoutButton />
            </Stack>
        </Popover>
    )
}
