import { Box, IconButton, Popover, Stack, Typography } from "@mui/material"
import { SvgClose } from "../../../../assets"
import { colors } from "../../../../theme/theme"
import { shadeColor } from "../../../../helpers"
import { BattleMultipliers, User } from "../../../../types"
import { useEffect, MutableRefObject } from "react"
import { useToggle } from "../../../../hooks"
import { MultipliersBattle } from "./MultipliersBattle"

export const MultipliersPopover = ({
    user,
    open,
    multipliers,
    onClose,
    popoverRef,
}: {
    user: User
    open: boolean
    multipliers: BattleMultipliers[]
    onClose: () => void
    popoverRef: MutableRefObject<null>
}) => {
    const [localOpen, toggleLocalOpen] = useToggle(open)
    const actualMultipliers = multipliers.filter((m) => m.multipliers.length > 0)

    useEffect(() => {
        if (!localOpen) {
            setTimeout(() => {
                onClose()
            }, 300)
        }
    }, [localOpen])

    return (
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
                mt: ".8rem",
                zIndex: 10000,
                ".MuiPaper-root": {
                    mt: ".8rem",
                    background: "none",
                    backgroundColor: user && user.faction ? shadeColor(user.faction.theme.primary, -95) : colors.darkNavy,
                    border: "#FFFFFF50 1px solid",
                },
            }}
        >
            <Stack spacing="1.2rem" sx={{ position: "relative", width: "35rem", px: "2rem", py: "1.4rem" }}>
                {actualMultipliers && actualMultipliers.length > 0 ? (
                    <Box>
                        <Typography sx={{ mb: ".24rem", fontWeight: "bold", color: colors.offWhite }} variant="h6">
                            ACTIVE MULTIPLIERS:
                        </Typography>
                        <Stack spacing=".4rem">
                            {actualMultipliers.map((bm) => {
                                return <MultipliersBattle key={`bmv-key-${bm.battle_number}`} bm={bm} />
                            })}
                        </Stack>
                    </Box>
                ) : (
                    <Typography>
                        <i>
                            You don&apos;t have any multipliers.
                            <br />
                            Participate in battles to earn multipliers.
                        </i>
                    </Typography>
                )}

                <IconButton size="small" onClick={() => toggleLocalOpen(false)} sx={{ position: "absolute", top: "-1rem", right: ".2rem" }}>
                    <SvgClose size="1.6rem" sx={{ opacity: 0.1, ":hover": { opacity: 0.6 } }} />
                </IconButton>
            </Stack>
        </Popover>
    )
}
