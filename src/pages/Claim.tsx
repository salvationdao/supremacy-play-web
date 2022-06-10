import { Claims } from "../components/Claims/Claims"
import { Box } from "@mui/system"
import { siteZIndex } from "../theme/theme"
import { ClaimsBg } from "../assets"

export const ClaimsPage = () => {
    return (
        <Box sx={{ height: "100%" }}>
            <ClaimsPageInner />
        </Box>
    )
}

const ClaimsPageInner = () => {
    return (
        <Box
            sx={{
                height: "100%",
                zIndex: siteZIndex.RoutePage,
                backgroundImage: `url(${ClaimsBg})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
            }}
        >
            <Claims />
        </Box>
    )
}
