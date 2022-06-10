import { Button } from "@mui/material"
import { useCallback, useMemo, useState } from "react"
import { TooltipHelper } from "../.."
import { STAGING_OR_DEV_ONLY, TOKEN_SALE_PAGE } from "../../../constants"
import { dateFormatter } from "../../../helpers"
import { colors, fonts } from "../../../theme/theme"

export const BuySupsButton = () => {
    // const { send } = usePassportCommandsUser("xxxxxxxxx")
    const [timeTilNextClaim] = useState<Date>()

    const getFreeSups = useCallback(async () => {
        // try {
        //     const resp = await send<Date | boolean>(PassportServerKeys.GetFreeSups)
        //     if (resp instanceof Date) setTimeTilNextClaim(resp)
        // } catch (e) {
        //     console.error(e)
        // }
    }, [])

    const tooltipText = useMemo(() => {
        if (STAGING_OR_DEV_ONLY) {
            if (timeTilNextClaim && timeTilNextClaim < new Date()) {
                return `Time until next claim: ${dateFormatter(timeTilNextClaim)}`
            }

            return "Claim free SUPs!"
        }
        return ""
    }, [timeTilNextClaim])

    const openBuySupsPage = useCallback(() => {
        const width = 520
        const height = 690
        const top = window.screenY + (window.outerHeight - height) / 2.5
        const left = window.screenX + (window.outerWidth - width) / 2
        window.open(TOKEN_SALE_PAGE, "SUPS Token Sale", `width=${width},height=${height},left=${left},top=${top},popup=1`)
    }, [])

    return (
        <TooltipHelper placement="bottom" text={tooltipText}>
            <Button
                id="tutorial-purchase"
                sx={{
                    px: "1.2rem",
                    pt: ".32rem",
                    pb: ".16rem",
                    flexShrink: 0,
                    justifyContent: "flex-start",
                    color: STAGING_OR_DEV_ONLY ? colors.gold : colors.neonBlue,
                    whiteSpace: "nowrap",
                    borderRadius: 0.2,
                    border: `1px solid ${STAGING_OR_DEV_ONLY ? colors.gold : colors.neonBlue}`,
                    overflow: "hidden",
                    fontFamily: fonts.nostromoBold,
                }}
                onClick={STAGING_OR_DEV_ONLY ? getFreeSups : openBuySupsPage}
                disabled={STAGING_OR_DEV_ONLY && timeTilNextClaim && timeTilNextClaim < new Date()}
            >
                {STAGING_OR_DEV_ONLY ? "GET FREE SUPS" : "GET SUPS"}
            </Button>
        </TooltipHelper>
    )
}
