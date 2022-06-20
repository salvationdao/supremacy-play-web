import { Box, IconButton, Popover, Stack, Typography } from "@mui/material"
import { MutableRefObject, useEffect } from "react"
import { ClipThing } from "../../.."
import { SvgClose } from "../../../../assets"
import { useTheme } from "../../../../containers/theme"
import { useToggle } from "../../../../hooks"
import { fonts, siteZIndex } from "../../../../theme/theme"
import { BattleMultipliers } from "../../../../types"
import { MultipliersBattle } from "./MultipliersBattle"

export const MultipliersPopover = ({
    open,
    multipliers,
    onClose,
    popoverRef,
}: {
    open: boolean
    multipliers: BattleMultipliers[]
    onClose: () => void
    popoverRef: MutableRefObject<null>
}) => {
    const theme = useTheme()
    const [localOpen, toggleLocalOpen] = useToggle(open)
    const actualMultipliers = multipliers.filter((m) => m.multipliers.length > 0)

    useEffect(() => {
        if (!localOpen) {
            const timeout = setTimeout(() => {
                onClose()
            }, 300)

            return () => clearTimeout(timeout)
        }
    }, [localOpen, onClose])

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
                zIndex: siteZIndex.Popover,
                ".MuiPaper-root": {
                    mt: ".8rem",
                    background: "none",
                    boxShadow: 0,
                },
            }}
        >
            <ClipThing
                clipSize="10px"
                border={{
                    isFancy: true,
                    borderColor: theme.factionTheme.primary,
                    borderThickness: ".3rem",
                }}
                backgroundColor={theme.factionTheme.background}
                sx={{ height: "100%" }}
            >
                <Stack spacing="1.2rem" sx={{ position: "relative", width: "35rem", px: "2rem", py: "1.4rem" }}>
                    {actualMultipliers && actualMultipliers.length > 0 ? (
                        <Box>
                            <Typography gutterBottom sx={{ fontFamily: fonts.nostromoBlack, color: theme.factionTheme.primary }}>
                                ACTIVE MULTIPLIERS
                            </Typography>

                            <Typography sx={{ mb: ".9rem", opacity: 0.7 }}>
                                The below are the active multipliers from each battle that are currently applied to your account.
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
                        <SvgClose size="1.9rem" sx={{ opacity: 0.1, ":hover": { opacity: 0.6 } }} />
                    </IconButton>
                </Stack>
            </ClipThing>
        </Popover>
    )
}
