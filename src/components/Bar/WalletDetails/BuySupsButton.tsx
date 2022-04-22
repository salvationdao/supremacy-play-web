import { Button } from "@mui/material"
import { useCallback, useMemo, useState } from "react"
import { TooltipHelper } from "../.."
import { TOKEN_SALE_PAGE } from "../../../constants"
import { usePassportServerWebsocket } from "../../../containers"
import { dateFormatter } from "../../../helpers"
import { PassportServerKeys } from "../../../keys"
import { colors } from "../../../theme/theme"
import { UserData } from "../../../types/passport"

export const BuySupsButton = ({ user }: { user?: UserData }) => {
    const { send, state } = usePassportServerWebsocket()
    const [timeTilNextClaim, setTimeTilNextClaim] = useState<Date>()

    // Free sups button
    const isFreeSupsEnabled = useMemo(
        () => process.env.REACT_APP_SENTRY_ENVIRONMENT === "staging" || process.env.REACT_APP_SENTRY_ENVIRONMENT === "development",
        [],
    )

    const getFreeSups = useCallback(async () => {
        if (state !== WebSocket.OPEN || !send || !user) return

        try {
            const resp = await send<Date | boolean>(PassportServerKeys.GetFreeSups)
            if (resp instanceof Date) setTimeTilNextClaim(resp)
        } catch (e) {
            console.debug(e)
        }
    }, [state, send, user])

    const tooltipText = useMemo(() => {
        if (isFreeSupsEnabled) {
            if (timeTilNextClaim && timeTilNextClaim < new Date()) {
                return `Time until next claim: ${dateFormatter(timeTilNextClaim)}`
            }

            return "Claim free SUPs!"
        }
        return ""
    }, [isFreeSupsEnabled, timeTilNextClaim])

    const openBuySupsPage = () => {
        const width = 520
        const height = 690
        const top = window.screenY + (window.outerHeight - height) / 2.5
        const left = window.screenX + (window.outerWidth - width) / 2
        window.open(TOKEN_SALE_PAGE, "SUPS Token Sale", `width=${width},height=${height},left=${left},top=${top},popup=1`)
    }

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
                    color: isFreeSupsEnabled ? colors.gold : colors.neonBlue,
                    whiteSpace: "nowrap",
                    borderRadius: 0.2,
                    border: `1px solid ${isFreeSupsEnabled ? colors.gold : colors.neonBlue}`,
                    overflow: "hidden",
                    fontFamily: "Nostromo Regular Bold",
                }}
                onClick={isFreeSupsEnabled ? getFreeSups : openBuySupsPage}
                disabled={isFreeSupsEnabled && timeTilNextClaim && timeTilNextClaim < new Date()}
            >
                {isFreeSupsEnabled ? "GET FREE SUPS" : "GET SUPS"}
            </Button>
        </TooltipHelper>
    )
}
