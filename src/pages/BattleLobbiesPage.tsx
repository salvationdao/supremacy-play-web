import { Stack } from "@mui/material"
import { siteZIndex } from "../theme/theme"
import { HangarBg } from "../assets"
import { MysteryCrateBanner } from "../components/Common/BannersPromotions/MysteryCrateBanner"
import { BattleLobbies } from "../components/Lobbies/BattleLobbies/BattleLobbies"

export const BattleLobbiesPage = () => {
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
            <Stack sx={{ mt: "1.5rem", mb: "2rem", height: "100%", width: "calc(100% - 3rem)", maxWidth: "145rem" }}>
                <Stack sx={{ minHeight: "6.65rem", mb: "1.1rem", gap: "1.2rem" }}>
                    <MysteryCrateBanner />
                </Stack>

                <BattleLobbies />
            </Stack>
        </Stack>
    )
}
