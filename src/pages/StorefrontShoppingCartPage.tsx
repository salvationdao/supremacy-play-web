import { useCallback } from "react"
import { useHistory, useParams } from "react-router-dom"
import { Stack, Typography } from "@mui/material"
import { HangarBg, SvgBack } from "../assets"
import { fonts, siteZIndex } from "../theme/theme"
import { ClipThing, FancyButton } from "../components"
import { useFiat } from "../containers/fiat"
import { ShoppingCartTable } from "../components/Bar/ShoppingCart/ShoppingCartListing/ShoppingCartTable"
import { useTheme } from "../containers/theme"

export const StorefrontShoppingCartPage = () => {
    const history = useHistory()

    const goBack = useCallback(() => {
        history.goBack()
    }, [history])

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

                <StorefrontShoppingCartPageInner />
            </Stack>
        </Stack>
    )
}

const StorefrontShoppingCartPageInner = () => {
    const { loading, shoppingCart } = useFiat()
    const theme = useTheme()

    const primaryColor = theme.factionTheme.primary
    const backgroundColor = theme.factionTheme.background

    return (
        <ClipThing
            clipSize="10px"
            border={{
                borderColor: theme.factionTheme.primary,
                borderThickness: ".3rem",
            }}
            corners={{
                topRight: true,
                bottomLeft: true,
                bottomRight: true,
            }}
            opacity={0.7}
            backgroundColor={theme.factionTheme.background}
            sx={{ height: "100%" }}
        >
            <Stack sx={{ height: "100%", p: "1rem" }}>
                <ShoppingCartTable fullPage shoppingCart={shoppingCart} loading={loading} primaryColor={primaryColor} backgroundColor={backgroundColor} />
            </Stack>
        </ClipThing>
    )
}
