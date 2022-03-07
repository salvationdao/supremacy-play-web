import { Box, Stack, Button } from "@mui/material"
import { useRef } from "react"
import { EnlistDetailsPopover } from "../.."
import { SvgPlus } from "../../../assets"
import { PASSPORT_SERVER_HOST_IMAGES } from "../../../constants"
import { useToggle } from "../../../hooks"
import { FactionGeneralData } from "../../../types/passport"

export const EnlistButton = ({ faction }: { faction: FactionGeneralData }) => {
    const popoverRef = useRef(null)
    const [popoverOpen, togglePopoverOpen] = useToggle()

    const {
        id,
        label,
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
                    px: 1.2,
                    py: 0.5,
                    backgroundColor: "transparent",
                    borderRadius: 0.2,
                    border: `1px solid ${primary}`,
                    "& .MuiTouchRipple-child": {
                        backgroundColor: `${primary || "#FFFFFF"} !important`,
                    },
                }}
                onClick={() => togglePopoverOpen()}
            >
                <Box sx={{ position: "absolute", left: "50%", bottom: -21 }} ref={popoverRef} />

                <Stack direction="row" spacing={1.2} alignItems="center">
                    <Box
                        sx={{
                            width: 24,
                            height: 24,
                            backgroundImage: `url(${PASSPORT_SERVER_HOST_IMAGES}/api/files/${logo_blob_id})`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            backgroundSize: "cover",
                        }}
                    />
                    <SvgPlus size="10px" fill={primary || "#FFFFFF"} sx={{ pb: 0 }} />
                </Stack>
            </Button>

            {popoverOpen && (
                <EnlistDetailsPopover
                    popoverRef={popoverRef}
                    popoverOpen={popoverOpen}
                    togglePopoverOpen={togglePopoverOpen}
                    factionID={id}
                    factionData={faction}
                />
            )}
        </>
    )
}
