import { Box, Stack, Typography } from "@mui/material"
import { Link } from "react-router-dom"
import { fonts } from "../../../theme/theme"
import { BattleReplay } from "../../../types"
import { NiceBoxThing } from "../../Common/Nice/NiceBoxThing"

export const BattleReplayItem = ({ battleReplay }: { battleReplay: BattleReplay }) => {
    if (!battleReplay.battle.ended_at) return null

    const { arena } = battleReplay
    const { battle_number, ended_at } = battleReplay.battle

    return (
        <Link to={`/replay?gid=${arena.gid}&battleNumber=${battle_number}`}>
            <NiceBoxThing
                border={{
                    color: "#FFFFFF20",
                    thickness: "very-lean",
                }}
                background={{ colors: ["#FFFFFF", "#FFFFFF"], opacity: 0.06 }}
                sx={{ width: "100%", height: "100%", overflow: "hidden" }}
            >
                <Stack spacing="1rem" sx={{ height: "100%" }}>
                    {/* Thumbnail */}
                    <Box sx={{ position: "relative" }}>
                        <Box
                            sx={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                height: "100%",
                                width: "90%",
                                background: `url(${battleReplay.game_map?.logo_url})`,
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "center",
                                backgroundSize: "contain",
                                zIndex: 1,
                            }}
                        />

                        <Box
                            sx={{
                                height: "15rem",
                                width: "100%",
                                background: `url(${battleReplay.game_map?.background_url})`,
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "center",
                                backgroundSize: "cover",
                            }}
                        />
                    </Box>

                    {/* Info */}
                    <Box>
                        <Typography sx={{ fontFamily: fonts.nostromoBlack }}>BATTLE #{battle_number}</Typography>
                        <Typography>{ended_at.toLocaleDateString()}</Typography>
                    </Box>
                </Stack>
            </NiceBoxThing>
        </Link>
    )
}
