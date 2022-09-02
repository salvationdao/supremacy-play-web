import { Stack, Typography } from "@mui/material"
import { useCallback } from "react"
import { HangarBg, SvgBack } from "../../../../assets"
import { useUrlQuery } from "../../../../hooks"
import { fonts, siteZIndex } from "../../../../theme/theme"
import { FancyButton } from "../../../Common/FancyButton"

export const BattleReplayDetails = ({ gid, battleNumber }: { gid: number; battleNumber: number }) => {
    const [, updateQuery] = useUrlQuery()

    const goBack = useCallback(() => {
        updateQuery({
            gid: `${gid}`,
            battleNumber: undefined,
        })
    }, [gid, updateQuery])

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

                <Typography>{`TODO: get video for gid: <${gid}> and battle number: <${battleNumber}>`}</Typography>
            </Stack>
        </Stack>
    )
}
