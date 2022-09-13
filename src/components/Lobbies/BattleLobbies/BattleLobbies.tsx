import { useTheme } from "../../../containers/theme"
import { useBattleLobby } from "../../../containers/battleLobby"
import { Box, Stack, Typography } from "@mui/material"
import { BattleLobbyItem } from "./BattleLobbyItem"
import { useEffect, useMemo, useState } from "react"
import { PageHeader } from "../../Common/PageHeader"
import { fonts } from "../../../theme/theme"
import { ThreeMechsJPG } from "../../../assets"
import { TotalAndPageSizeOptions } from "../../Common/TotalAndPageSizeOptions"
import { SearchBattle } from "../../Replays/BattlesReplays/SearchBattle"
import { ClipThing } from "../../Common/ClipThing"
import { useDebounce } from "../../../hooks"
import { SortTypeLabel } from "../../../types/marketplace"
import FlipMove from "react-flip-move"
import { BattleLobby } from "../../../types/battle_queue"

const sortOptions = [
    { label: SortTypeLabel.CreateTimeNewestFirst, value: SortTypeLabel.CreateTimeNewestFirst },
    { label: SortTypeLabel.CreateTimeOldestFirst, value: SortTypeLabel.CreateTimeOldestFirst },
]

export const BattleLobbies = () => {
    const theme = useTheme()
    const { battleLobbies } = useBattleLobby()
    const [list, setList] = useState<BattleLobby[]>([])

    // Search, sort, filters
    const [searchValue, setSearchValue, searchValueInstant] = useDebounce("", 300)
    const [sort, setSort] = useState<string>(SortTypeLabel.CreateTimeNewestFirst)

    // Apply sorting
    useEffect(() => {
        let sorted = [...battleLobbies]

        // sorting
        if (sort === SortTypeLabel.CreateTimeNewestFirst) sorted = sorted.sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
        else if (sort === SortTypeLabel.CreateTimeOldestFirst) sorted = sorted.sort((a, b) => (a.created_at > b.created_at ? 1 : -1))

        if (searchValue !== "") {
            sorted = sorted.filter((s) =>
                `${s.game_map.name} ${s.number} ${s.host_by.username} ${s.host_by.gid}`.toLowerCase().includes(searchValue.toLowerCase()),
            )
        }
        setList(sorted)
    }, [sort, setList, battleLobbies, searchValue])

    console.log(list)

    const content = useMemo(() => {
        return (
            <Box sx={{ direction: "ltr", height: 0 }}>
                <Stack>
                    <FlipMove>
                        {list.map((battleLobby) => {
                            return (
                                <div key={`repair-job-${battleLobby.id}`} style={{ marginBottom: "1.3rem" }}>
                                    <BattleLobbyItem battleLobby={battleLobby} />
                                </div>
                            )
                        })}
                    </FlipMove>
                </Stack>
            </Box>
        )
    }, [list])

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
                                BATTLE LOBBIES
                            </Typography>
                        }
                        description={<Typography sx={{ fontSize: "1.85rem" }}>Join lobby to enter battles.</Typography>}
                        imageUrl={ThreeMechsJPG}
                    ></PageHeader>

                    <TotalAndPageSizeOptions countItems={battleLobbies.length} sortOptions={sortOptions} selectedSort={sort} onSetSort={setSort} />

                    <Stack
                        spacing="2.6rem"
                        direction="row"
                        alignItems="center"
                        sx={{ p: ".8rem 1.8rem", borderBottom: (theme) => `${theme.factionTheme.primary}70 1.5px solid` }}
                    >
                        <Stack spacing="1rem" direction="row" alignItems="center">
                            <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBlack }}>
                                SEARCH:
                            </Typography>
                            <SearchBattle searchValueInstant={searchValueInstant} setSearchValue={setSearchValue} />
                        </Stack>

                        <Box sx={{ flex: 1 }} />
                    </Stack>

                    <Stack sx={{ px: "1rem", py: "1rem", flex: 1 }}>
                        <Box
                            sx={{
                                ml: "1.9rem",
                                mr: ".5rem",
                                pr: "1.4rem",
                                my: "1rem",
                                flex: 1,
                                overflowY: "auto",
                                overflowX: "hidden",
                                direction: "ltr",

                                "::-webkit-scrollbar": {
                                    width: ".4rem",
                                },
                                "::-webkit-scrollbar-track": {
                                    background: "#FFFFFF15",
                                    borderRadius: 3,
                                },
                                "::-webkit-scrollbar-thumb": {
                                    background: theme.factionTheme.primary,
                                    borderRadius: 3,
                                },
                            }}
                        >
                            {content}
                        </Box>
                    </Stack>
                </Stack>
            </Stack>
        </ClipThing>
    )
}
