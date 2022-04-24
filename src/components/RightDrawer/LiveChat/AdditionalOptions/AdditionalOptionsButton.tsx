import { Button, Popover, Stack, Typography } from "@mui/material"
import { MutableRefObject, useEffect, useRef } from "react"
import { UserBanForm } from "../../.."
import { RIGHT_DRAWER_WIDTH } from "../../../../constants"
import { useGameServerAuth } from "../../../../containers"
import { useToggle } from "../../../../hooks"
import { colors } from "../../../../theme/theme"

export const AdditionalOptionsButton = () => {
    const { user } = useGameServerAuth()
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
                <Typography>MORE OPTIONS</Typography>
            </Button>

            {isPopoverOpen && (
                <OptionsPopover
                    open={isPopoverOpen}
                    popoverRef={popoverRef}
                    onClose={() => toggleIsPopoverOpen(false)}
                    toggleBanModalOpen={toggleBanModalOpen}
                />
            )}

            {banModalOpen && <UserBanForm user={user} open={banModalOpen} onClose={() => toggleBanModalOpen(false)} />}
        </>
    )
}

const OptionsPopover = ({
    open,
    popoverRef,
    onClose,
    toggleBanModalOpen,
}: {
    open: boolean
    popoverRef: MutableRefObject<null>
    onClose: () => void
    toggleBanModalOpen: (value?: boolean | undefined) => void
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
                    width: `${RIGHT_DRAWER_WIDTH}rem`,
                    background: "none",
                    backgroundColor: colors.darkerNavy,
                    borderRadius: 0.2,
                    boxShadow: 10,
                },
            }}
        >
            <Stack spacing=".32rem" sx={{ px: ".8rem", py: "1.1rem" }}>
                <Button
                    onClick={() => {
                        toggleLocalOpen(false)
                        toggleBanModalOpen(true)
                    }}
                    sx={{ pt: "1.1rem", pb: ".8rem", backgroundColor: "#00000050", borderRadius: 0.1 }}
                >
                    <Typography variant="body2" sx={{ fontWeight: "fontWeightBold" }}>
                        PROPOSE TO PUNISH A PLAYER
                    </Typography>
                </Button>
                <Button
                    onClick={() => {
                        window.open("https://supremacyhelp.zendesk.com/")
                    }}
                    sx={{ pt: "1.1rem", pb: ".8rem", backgroundColor: "#00000050", borderRadius: 0.1 }}
                >
                    <Typography variant="body2" sx={{ fontWeight: "fontWeightBold" }}>
                        SUPPORT
                    </Typography>
                </Button>
            </Stack>
        </Popover>
    )
}
