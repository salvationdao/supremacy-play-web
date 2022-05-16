import { Box, Stack, Button } from "@mui/material"
import { useRef } from "react"
import { EnlistDetailsPopover } from "../.."
import { SvgPlus } from "../../../assets"
import { useToggle } from "../../../hooks"
import { colors, fonts } from "../../../theme/theme"
import { Faction } from "../../../types"

export const EnlistButton = ({ faction }: { faction: Faction }) => {
    const popoverRef = useRef(null)
    const [popoverOpen, togglePopoverOpen] = useToggle()

    const { id, primary_color, logo_url } = faction

    return (
        <>
            <Button
                onClick={() => togglePopoverOpen(true)}
                sx={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    px: ".96rem",
                    py: ".4rem",
                    fontFamily: fonts.nostromoBold,
                    backgroundColor: "transparent",
                    borderRadius: 0.2,
                    border: `1px solid ${primary_color}`,
                    "& .MuiTouchRipple-child": {
                        backgroundColor: `${primary_color || "#FFFFFF"} !important`,
                    },
                }}
            >
                <Box sx={{ position: "absolute", left: "50%", bottom: "-2.1rem" }} ref={popoverRef} />

                <Stack direction="row" spacing=".96rem" alignItems="center">
                    <Box
                        sx={{
                            width: "2.4rem",
                            height: "2.4rem",
                            backgroundImage: `url(${logo_url})`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            backgroundSize: "contain",
                        }}
                    />
                    <SvgPlus size="1rem" fill={primary_color || colors.text} sx={{ pb: 0 }} />
                </Stack>
            </Button>

            {popoverOpen && (
                <EnlistDetailsPopover popoverRef={popoverRef} open={popoverOpen} onClose={() => togglePopoverOpen(false)} faction_id={id} faction={faction} />
            )}
        </>
    )
}
