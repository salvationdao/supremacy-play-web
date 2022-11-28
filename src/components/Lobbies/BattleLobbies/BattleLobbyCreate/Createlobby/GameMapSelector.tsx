import { Box, Typography } from "@mui/material"
import { useMemo, useRef, useState } from "react"
import { useFormContext } from "react-hook-form"
import { useTheme } from "../../../../../containers/theme"
import { useGameServerSubscriptionSecured } from "../../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../../keys"
import { fonts } from "../../../../../theme/theme"
import { GameMap } from "../../../../../types"
import { NicePopover } from "../../../../Common/Nice/NicePopover"

export const GameMapSelector = () => {
    const { factionTheme } = useTheme()
    const [gameMaps, setGameMaps] = useState<GameMap[]>([])
    const { watch, setValue } = useFormContext()

    const gameMapID = watch("game_map_id")

    const popoverRef = useRef(null)
    const [openMapSelector, setOpenMapSelector] = useState(false)

    useGameServerSubscriptionSecured<GameMap[]>(
        {
            URI: "/game_map_list",
            key: GameServerKeys.SubGameMapList,
        },
        (payload) => {
            if (!payload) return
            setGameMaps(payload)
        },
    )

    const selectedGameMap = useMemo(() => gameMaps.find((gm) => gm.id === gameMapID), [gameMaps, gameMapID])
    const randomOption = useMemo(
        () => (
            <>
                {gameMaps.length > 0 && (
                    <Box
                        sx={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            position: "absolute",
                        }}
                    >
                        {gameMaps.map((gm) => (
                            <Box
                                key={gm.id}
                                sx={{
                                    width: `${100 / gameMaps.length}%`,
                                    height: "100%",
                                    backgroundImage: `url(${gm.background_url})`,
                                    backgroundRepeat: "no-repeat",
                                    backgroundPosition: "bottom center",
                                    backgroundSize: "cover",
                                }}
                            />
                        ))}
                    </Box>
                )}
                <Typography variant="h3" fontFamily={fonts.nostromoBlack} sx={{ zIndex: 100 }}>
                    RANDOM
                </Typography>
            </>
        ),
        [gameMaps],
    )
    return (
        <>
            <Box
                ref={popoverRef}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "10rem",
                    width: "70rem",
                    backgroundColor: factionTheme.background,
                    backgroundImage: selectedGameMap ? `url(${selectedGameMap.background_url})` : undefined,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    position: "relative",
                    border: `${factionTheme.primary} 2px solid`,
                    cursor: "pointer",
                }}
                onClick={() => setOpenMapSelector(true)}
            >
                {!selectedGameMap ? (
                    <>{randomOption}</>
                ) : (
                    <Box
                        sx={{
                            width: "calc(100% - 4rem)",
                            height: "calc(100% - 2rem)",
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: `translate(-50%, -50%)`,
                            backgroundImage: `url(${selectedGameMap.logo_url})`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "bottom center",
                            backgroundSize: "contain",
                        }}
                    />
                )}
            </Box>

            {openMapSelector && (
                <NicePopover
                    id={"map-popover"}
                    open={!!popoverRef.current}
                    anchorEl={popoverRef.current}
                    onClose={() => setOpenMapSelector(false)}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center",
                    }}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "center",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            width: "70rem",
                        }}
                    >
                        {gameMaps.map((gm) => (
                            <Box
                                key={gm.id}
                                sx={{
                                    position: "relative",
                                    width: "50%",
                                    height: "10rem",
                                    cursor: "pointer",
                                    backgroundRepeat: "no-repeat",
                                    backgroundPosition: "center",
                                    backgroundSize: "cover",
                                    backgroundImage: `url(${gm.background_url})`,
                                    border: `${factionTheme.primary}${selectedGameMap?.id === gm.id ? "" : "30"} 2px solid`,
                                    opacity: selectedGameMap?.id === gm.id ? 1 : 0.4,
                                    "&:hover": {
                                        opacity: 1,
                                    },
                                }}
                                onClick={() => {
                                    setValue("game_map_id", gm.id)
                                    setOpenMapSelector(false)
                                }}
                            >
                                {/* logo */}
                                <Box
                                    sx={{
                                        width: "calc(100% - 4rem)",
                                        height: "calc(100% - 2rem)",
                                        position: "absolute",
                                        top: "50%",
                                        left: "50%",
                                        transform: `translate(-50%, -50%)`,
                                        backgroundImage: `url(${gm.logo_url})`,
                                        backgroundRepeat: "no-repeat",
                                        backgroundPosition: "bottom center",
                                        backgroundSize: "contain",
                                    }}
                                />
                            </Box>
                        ))}
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "100%",
                                height: "10rem",
                                cursor: "pointer",
                                position: "relative",
                                border: `${factionTheme.primary}${!selectedGameMap ? "" : "30"} 2px solid`,
                                opacity: !selectedGameMap ? 1 : 0.4,
                                "&:hover": {
                                    opacity: 1,
                                },
                            }}
                            onClick={() => {
                                setValue("game_map_id", "")
                                setOpenMapSelector(false)
                            }}
                        >
                            {randomOption}
                        </Box>
                    </Box>
                </NicePopover>
            )}
        </>
    )
}
