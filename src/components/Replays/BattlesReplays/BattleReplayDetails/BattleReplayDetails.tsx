import { Stack, Typography } from "@mui/material"
import { useCallback } from "react"
import { HangarBg, SvgBack } from "../../../../assets"
import { useTheme } from "../../../../containers/theme"
import { fonts, siteZIndex } from "../../../../theme/theme"
import { ClipThing } from "../../../Common/ClipThing"
import { FancyButton } from "../../../Common/FancyButton"
import { BattleReplayPlayer } from "./BattleReplayPlayer"

export const BattleReplayDetails = ({
    gid,
    battleNumber,
    setBattleGID,
    setBattleNumber,
}: {
    gid: number
    battleNumber: number
    setBattleGID: React.Dispatch<React.SetStateAction<number>>
    setBattleNumber: React.Dispatch<React.SetStateAction<number>>
}) => {
    const theme = useTheme()

    const goBack = useCallback(() => {
        setBattleGID(-1)
        setBattleNumber(-1)
    }, [setBattleGID, setBattleNumber])

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
                    <Stack sx={{ height: "100%" }}>
                        <BattleReplayPlayer battleNumber={battleNumber} gid={gid} />
                    </Stack>
                </ClipThing>
            </Stack>
        </Stack>
    )
}
