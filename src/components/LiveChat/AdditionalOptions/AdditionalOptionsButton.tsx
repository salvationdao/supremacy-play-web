import { Button, Popover, Stack, Typography } from "@mui/material"
import { useRef } from "react"
import { UserBanForm } from "../.."
import { SvgFastRepair } from "../../../assets"
import { RIGHT_DRAWER_WIDTH, LIVE_CHAT_DRAWER_BUTTON_WIDTH } from "../../../constants"
import { usePassportServerAuth } from "../../../containers"
import { useToggle } from "../../../hooks"
import { colors } from "../../../theme/theme"

export const AdditionalOptionsButton = () => {
    const { user } = usePassportServerAuth()
    const popoverRef = useRef(null)
    const [isPopoverOpen, toggleIsPopoverOpen] = useToggle()

    const [banModalOpen, toggleBanModalOpen] = useToggle()

    if (!user) return null

    return (
        <>
            <Button
                ref={popoverRef}
                onClick={() => toggleIsPopoverOpen()}
                sx={{
                    backgroundColor: colors.darkerNavy,
                    height: "2rem",
                    width: "100%",
                    borderRadius: 0,
                    "*": {
                        opacity: isPopoverOpen ? 1 : 0.6,
                    },
                    ":hover": {
                        backgroundColor: colors.darkerNavy,
                        "*": {
                            opacity: 1,
                        },
                    },
                }}
            >
                <SvgFastRepair size="1.08rem" sx={{ mr: ".6rem" }} />
            </Button>

            <Popover
                open={isPopoverOpen}
                anchorEl={popoverRef.current}
                onClose={() => {
                    toggleIsPopoverOpen(false)
                }}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
                transformOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
                sx={{
                    zIndex: 10000,
                    ".MuiPaper-root": {
                        ml: 2,
                        width: `${RIGHT_DRAWER_WIDTH - LIVE_CHAT_DRAWER_BUTTON_WIDTH}rem`,
                        background: "none",
                        backgroundColor: colors.darkerNavy,
                        borderRadius: 0.2,
                        boxShadow: 10,
                    },
                }}
            >
                <Stack spacing=".32rem" sx={{ px: ".8rem", py: "1rem" }}>
                    <Button
                        onClick={() => {
                            toggleIsPopoverOpen(false)
                            toggleBanModalOpen(true)
                        }}
                        sx={{ backgroundColor: "#00000050" }}
                    >
                        <Typography variant="body2">Report a player</Typography>
                    </Button>
                </Stack>
            </Popover>

            <UserBanForm user={user} open={banModalOpen} onClose={() => toggleBanModalOpen(false)} />
        </>
    )
}
