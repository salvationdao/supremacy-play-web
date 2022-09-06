import { Button } from "@mui/material"
import { useCallback } from "react"
import { IS_TESTING_MODE, TOKEN_SALE_PAGE } from "../../../constants"
import { colors, fonts } from "../../../theme/theme"

export const BuySupsButton = () => {
    const openBuySupsPage = useCallback(() => {
        const width = 520
        const height = 690
        const top = window.screenY + (window.outerHeight - height) / 2.5
        const left = window.screenX + (window.outerWidth - width) / 2
        window.open(TOKEN_SALE_PAGE, "SUPS Token Sale", `width=${width},height=${height},left=${left},top=${top},popup=1`)
    }, [])

    if (IS_TESTING_MODE) return null

    return (
        <Button
            sx={{
                px: "1.2rem",
                pt: ".32rem",
                pb: ".16rem",
                flexShrink: 0,
                justifyContent: "flex-start",
                color: colors.neonBlue,
                whiteSpace: "nowrap",
                borderRadius: 0.2,
                border: `1px solid ${colors.neonBlue}`,
                overflow: "hidden",
                fontFamily: fonts.nostromoBold,
            }}
            onClick={openBuySupsPage}
        >
            GET SUPS
        </Button>
    )
}
