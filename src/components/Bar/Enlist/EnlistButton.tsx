import { Box, Stack, Button } from "@mui/material"
import { useRef } from "react"
import { EnlistDetailsPopover } from "../.."
import { SvgPlus } from "../../../assets"
import { PASSPORT_SERVER_HOST_IMAGES } from "../../../constants"
import { useToggle } from "../../../hooks"
import { colors } from "../../../theme/theme"
import { FactionGeneralData } from "../../../types/passport"

export const EnlistButton = ({ faction }: { faction: FactionGeneralData }) => {
    const popoverRef = useRef(null)
    const [popoverOpen, togglePopoverOpen] = useToggle()

    const {
        id,
        theme: { primary },
        logo_blob_id,
    } = faction

    return (
        <>
            <Button
                sx={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    px: ".96rem",
                    py: ".4rem",
                    fontFamily: "Nostromo Regular Bold",
                    backgroundColor: "transparent",
                    borderRadius: 0.2,
                    border: `1px solid ${primary}`,
                    "& .MuiTouchRipple-child": {
                        backgroundColor: `${primary || "#FFFFFF"} !important`,
                    },
                }}
                onClick={() => togglePopoverOpen()}
            >
                <Box sx={{ position: "absolute", left: "50%", bottom: "-2.1rem" }} ref={popoverRef} />

                <Stack direction="row" spacing=".96rem" alignItems="center">
                    <Box
                        sx={{
                            width: "2.4rem",
                            height: "2.4rem",
                            backgroundImage: `url(${PASSPORT_SERVER_HOST_IMAGES}/api/files/${logo_blob_id})`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            backgroundSize: "cover",
                        }}
                    />
                    <SvgPlus size="1rem" fill={primary || colors.text} sx={{ pb: 0 }} />
                </Stack>
            </Button>

            {popoverOpen && (
                <EnlistDetailsPopover
                    popoverRef={popoverRef}
                    popoverOpen={popoverOpen}
                    togglePopoverOpen={togglePopoverOpen}
                    faction_id={id}
                    factionData={faction}
                />
            )}
        </>
    )
}
