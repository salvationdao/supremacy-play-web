import { Box, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { ClipThing } from "../.."
import { ThreeMechsJPG } from "../../../assets"
import { useArena } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { useDebounce } from "../../../hooks"
import { fonts } from "../../../theme/theme"
import { Arena } from "../../../types"
import { PageHeader } from "../../Common/PageHeader"
import { ArenaTypeSelect } from "./ArenaTypeSelect"
import { SearchBattle } from "./SearchBattle"

export const BattlesReplays = () => {
    const theme = useTheme()
    const { arenaList } = useArena()
    const [selectedArenaType, setSelectedArenaType] = useState<Arena>()
    const [searchValue, setSearchValue, searchValueInstant] = useDebounce("", 300)

    useEffect(() => {
        console.log(searchValue)
    }, [searchValue])

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
                        imageUrl={ThreeMechsJPG}
                    ></PageHeader>

                    <Stack spacing="2.6rem" direction="row" alignItems="center" sx={{ p: ".8rem 1.8rem" }}>
                        <Stack spacing="1rem" direction="row" alignItems="center">
                            <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBlack }}>
                                SEARCH:
                            </Typography>
                            <SearchBattle searchValueInstant={searchValueInstant} setSearchValue={setSearchValue} />
                        </Stack>

                        <Box sx={{ flex: 1 }} />

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
