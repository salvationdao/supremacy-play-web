import { Divider, Stack } from "@mui/material"
import { useCallback } from "react"
import { SvgSupToken } from "../../../assets"
import { STAGING_ONLY, PASSPORT_WEB, TOKEN_SALE_PAGE } from "../../../constants"
import { useAuth } from "../../../containers"
import { colors } from "../../../theme/theme"
import { NiceButton } from "../../Common/Nice/NiceButton"

export const BuySupsButton = () => {
    const { userID, setPassportPopup } = useAuth()

    const openBuySupsPage = useCallback(() => {
        const width = 520
        const height = 690
        const top = window.screenY + (window.outerHeight - height) / 2.5
        const left = window.screenX + (window.outerWidth - width) / 2
        const href = userID ? TOKEN_SALE_PAGE : `${PASSPORT_WEB}external/login?tenant=supremacy&redirectURL=${TOKEN_SALE_PAGE}`
        const popup = window.open(href, "SUPS Token Sale", `width=${width},height=${height},left=${left},top=${top},popup=1`)
        setPassportPopup(popup)
    }, [setPassportPopup, userID])

    if (STAGING_ONLY) return null

    return (
        <Stack
            direction="row"
            alignItems="center"
            sx={{
                mx: "1.2rem",
                height: "100%",
            }}
        >
            <NiceButton
                corners
                sheen={{ autoSheen: true, sheenSpeedFactor: 0.7 }}
                sx={{ px: "1rem", py: ".4rem", color: colors.gold }}
                onClick={openBuySupsPage}
                buttonColor={colors.gold}
            >
                <SvgSupToken inline fill={colors.gold} /> GET SUPS
            </NiceButton>

            <Divider
                orientation="vertical"
                flexItem
                sx={{
                    height: "2.3rem",
                    my: "auto !important",
                    ml: "2.4rem",
                    borderColor: "#494949",
                    borderRightWidth: 1.6,
                }}
            />
        </Stack>
    )
}
