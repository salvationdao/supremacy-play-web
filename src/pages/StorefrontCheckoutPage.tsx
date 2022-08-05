import { useCallback, useEffect } from "react"
import { useHistory, useParams } from "react-router-dom"
import { Stack, Typography } from "@mui/material"
import { HangarBg, SvgBack } from "../assets"
import { fonts, siteZIndex } from "../theme/theme"
import { STOREFRONT_TABS } from "./StorefrontPage"
import { FancyButton } from "../components"
import { PackageStoreCheckout } from "../components/Storefront/PackagesStore/PackageStoreCheckout/PackageStoreCheckout"

export const StorefrontCheckoutPage = () => {
    const { type, id } = useParams<{ type: STOREFRONT_TABS; id: string }>()
    const history = useHistory()

    const goBack = useCallback(() => {
        history.goBack()
    }, [history])

    useEffect(() => {
        if (!id || !Object.values(STOREFRONT_TABS).includes(type)) goBack()
    }, [goBack, type])

    return (
        <Stack
            alignItems="center"
            sx={{
                height: "100%",
                zIndex: siteZIndex.RoutePage,
                backgroundImage: `url(${HangarBg})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
                boxShadow: `inset 0 0 50px 60px #00000090`,
            }}
        >
            <Stack spacing=".6rem" sx={{ mt: "1.5rem", mb: "2rem", height: "100%", width: "calc(100% - 3rem)", maxWidth: "132rem" }}>
                <FancyButton
                    clipThingsProps={{
                        clipSize: "9px",
                        corners: { topLeft: true },
                        opacity: 1,
                        sx: { position: "relative", alignSelf: "flex-start", opacity: 0.5, ":hover": { opacity: 1 } },
                    }}
                    sx={{ px: "1.6rem", py: ".6rem", color: "#FFFFFF" }}
                    onClick={goBack}
                >
                    <Stack spacing=".6rem" direction="row" alignItems="center">
                        <SvgBack size="1.4rem" fill={"#FFFFFF"} />
                        <Typography
                            variant="caption"
                            sx={{
                                color: "#FFFFFF",
                                fontFamily: fonts.nostromoBlack,
                            }}
                        >
                            GO BACK
                        </Typography>
                    </Stack>
                </FancyButton>

                <StorefrontCheckoutPageInner />
            </Stack>
        </Stack>
    )
}

const StorefrontCheckoutPageInner = () => {
    const { type, id } = useParams<{ type: STOREFRONT_TABS; id: string }>()

    if (!!id && type === STOREFRONT_TABS.Packages) {
        return <PackageStoreCheckout id={id} />
    }

    return null
}
