import { Stack, Typography } from "@mui/material"
import { useState } from "react"
import { ClipThing } from "../.."
import { Gabs } from "../../../assets"
import { useArena } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { fonts } from "../../../theme/theme"
import { Arena } from "../../../types"
import { PageHeader } from "../../Common/PageHeader"
import { ArenaTypeSelect } from "./ArenaTypeSelect"

export const BattlesReplays = () => {
    const theme = useTheme()
    const { arenaList } = useArena()
    const [selectedArenaType, setSelectedArenaType] = useState<Arena>()

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
            opacity={0.9}
            backgroundColor={theme.factionTheme.background}
            sx={{ height: "100%" }}
        >
            <Stack sx={{ position: "relative", height: "100%" }}>
                <Stack sx={{ flex: 1 }}>
                    <PageHeader
                        title={
                            <Typography variant="h5" sx={{ fontFamily: fonts.nostromoBlack }}>
                                BATTLE REPLAYS
                            </Typography>
                        }
                        description={<Typography sx={{ fontSize: "1.85rem" }}>Share epic moments and learn strategies behind the battles.</Typography>}
                        imageUrl={Gabs}
                    ></PageHeader>

                    <Stack spacing="2.6rem" direction="row" alignItems="center" sx={{ p: ".8rem 1.8rem" }}>
                        <Stack spacing="1rem" direction="row" alignItems="center">
                            <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBlack }}>
                                BATTLE MODE:
                            </Typography>
                            <ArenaTypeSelect arenaTypeOptions={arenaList} selectedArenaType={selectedArenaType} setSelectedArenaType={setSelectedArenaType} />
                        </Stack>
                    </Stack>

                    <Stack spacing="2rem" sx={{ pb: "1rem", flex: 1 }}>
                        <></>
                    </Stack>
                </Stack>
            </Stack>
        </ClipThing>
    )
}
