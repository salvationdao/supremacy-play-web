import { Button, Stack, Typography } from "@mui/material"
import { MutableRefObject, useEffect, useRef } from "react"
import { RIGHT_DRAWER_WIDTH, UserBanForm } from "../../.."
import { useAuth } from "../../../../containers"
import { useToggle } from "../../../../hooks"
import { fonts } from "../../../../theme/theme"
import { NiceButton } from "../../../Common/Nice/NiceButton"
import { NicePopover } from "../../../Common/Nice/NicePopover"

export const AdditionalOptionsButton = () => {
    const { userID } = useAuth()
    const popoverRef = useRef(null)
    const [isPopoverOpen, toggleIsPopoverOpen] = useToggle()
    const [banModalOpen, toggleBanModalOpen] = useToggle()

    if (!userID) return null

    return (
        <>
            <Button
                ref={popoverRef}
                onClick={() => toggleIsPopoverOpen()}
                sx={{
                    backgroundColor: "#00000090",
                    height: "3rem",
                    width: "100%",
                    borderRadius: 0,
                    "*": {
                        opacity: isPopoverOpen ? 1 : 0.6,
                    },
                    ":hover": {
                        backgroundColor: "#00000090",
                        "*": {
                            opacity: 1,
                        },
                    },
                }}
            >
                <Typography variant="subtitle1" fontFamily={fonts.nostromoBold}>
                    MORE OPTIONS
                </Typography>
            </Button>

            {isPopoverOpen && (
                <OptionsPopover
                    open={isPopoverOpen}
                    popoverRef={popoverRef}
                    onClose={() => toggleIsPopoverOpen(false)}
                    toggleBanModalOpen={toggleBanModalOpen}
                />
            )}

            {banModalOpen && <UserBanForm open={banModalOpen} onClose={() => toggleBanModalOpen(false)} />}
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
    }, [localOpen, onClose])

    return (
        <NicePopover
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
                mt: "-.4rem",
                ".MuiPaper-root": {
                    ml: 2,
                    width: `${RIGHT_DRAWER_WIDTH}rem`,
                    my: 0,
                },
            }}
        >
            <Stack spacing=".32rem">
                <NiceButton
                    onClick={() => {
                        toggleLocalOpen(false)
                        toggleBanModalOpen(true)
                    }}
                    sx={{ pt: "1.1rem", pb: ".8rem", backgroundColor: "#00000050" }}
                >
                    <Typography sx={{ fontWeight: "bold" }}>PROPOSE TO PUNISH A PLAYER</Typography>
                </NiceButton>
            </Stack>
        </NicePopover>
    )
}
