import { Box, Typography } from "@mui/material"
import { Link } from "react-router-dom"
import { BCBuyFactionPassPNG, BCFactionPassPNG, RMBuyFactionPassPNG, RMFactionPassPNG, ZHIBuyFactionPassPNG, ZHIFactionPassPNG } from "../../assets"
import { DEV_ONLY, FactionIDs } from "../../constants"
import { useAuth } from "../../containers"
import { colors } from "../../theme/theme"
import { NiceTooltip } from "../Common/Nice/NiceTooltip"

const images: {
    [factionID: string]: {
        buy: string
        valid: string
    }
} = {
    [FactionIDs.BC]: {
        buy: BCBuyFactionPassPNG,
        valid: BCFactionPassPNG,
    },
    [FactionIDs.RM]: {
        buy: RMBuyFactionPassPNG,
        valid: RMFactionPassPNG,
    },
    [FactionIDs.ZHI]: {
        buy: ZHIBuyFactionPassPNG,
        valid: ZHIFactionPassPNG,
    },
}

export const GetFactionPass = () => {
    const { factionID, factionPassExpiryDate } = useAuth()

    if (localStorage.getItem("ivan") !== "cool" && !DEV_ONLY) {
        return null
    }

    const isFactionPassValid = factionPassExpiryDate && factionPassExpiryDate > new Date()

    return (
        <Link style={{ margin: "0 1rem", height: "100%" }} to="/faction-pass/buy">
            <Box sx={{ height: "100%" }}>
                <NiceTooltip
                    placement="bottom-start"
                    renderNode={
                        <Typography sx={{ p: ".5rem 1.2rem" }}>
                            {isFactionPassValid ? (
                                <>
                                    Your current Faction Pass is valid until:{" "}
                                    <span style={{ color: colors.neonBlue }}>{factionPassExpiryDate.toLocaleDateString()}</span>
                                </>
                            ) : (
                                "You don't have a Faction Pass."
                            )}
                        </Typography>
                    }
                    parentSx={{ mt: "-2rem" }}
                >
                    <Box
                        sx={{
                            width: "15rem",
                            height: "100%",
                            background: `url(${isFactionPassValid ? images[factionID].valid : images[factionID].buy})`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "left center",
                            backgroundSize: "contain",
                            transition: "all .2s",

                            ":hover": {
                                transform: "scale(1.04)",
                            },
                        }}
                    />
                </NiceTooltip>
            </Box>
        </Link>
    )
}
