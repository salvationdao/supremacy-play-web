import { colors, fonts } from "../../../../theme/theme"
import { Box, Stack, Typography } from "@mui/material"
import { EmptyWarMachinesPNG } from "../../../../assets"
import { useTheme } from "../../../../containers/theme"
import { getRarityDeets } from "../../../../helpers"
import { MechBasicWithQueueStatus } from "../../../../types"

interface MechSlotProps {
    battleLobbyMech: MechBasicWithQueueStatus | null
}

export const MechSlot = ({ battleLobbyMech }: MechSlotProps) => {
    const { factionTheme } = useTheme()

    if (!battleLobbyMech) {
        return (
            <Stack
                direction="column"
                alignItems="center"
                justifyContent="center"
                sx={{
                    flex: 1,
                    padding: "1rem",
                    borderRadius: 0,
                    backgroundColor: `${colors.offWhite}20`,
                }}
            >
                <Box
                    sx={{
                        width: "80%",
                        height: "16rem",
                        opacity: 0.7,
                        filter: "grayscale(100%)",
                        background: `url(${EmptyWarMachinesPNG})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "bottom center",
                        backgroundSize: "contain",
                    }}
                />
                <Typography
                    display="block"
                    sx={{
                        mt: "1rem",
                        color: `${colors.offWhite}30`,
                    }}
                >
                    DEPLOYED MECH
                </Typography>
            </Stack>
        )
    }

    const rarity = getRarityDeets(battleLobbyMech.tier)
    return (
        <Stack
            sx={{
                flex: 1,
                padding: "1rem",
                alignItems: "start",
                textAlign: "initial",
                borderRadius: 0,
                backgroundColor: `${colors.offWhite}20`,
            }}
        >
            <Stack direction="row" spacing="1rem" mb=".5rem">
                <Box
                    sx={{
                        position: "relative",
                        height: "70px",
                        width: "70px",
                    }}
                >
                    <Box
                        component="img"
                        src={battleLobbyMech.avatar_url}
                        sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                        }}
                    />
                    <Box
                        sx={{
                            position: "absolute",
                            left: "50%",
                            bottom: 0,
                            width: "100%",
                            transform: "translate(-50%, 0)",
                            backgroundColor: `${factionTheme.background}dd`,
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: "1.2rem",
                                fontFamily: fonts.nostromoMedium,
                                textTransform: "uppercase",
                                textAlign: "center",
                                color: rarity.color,
                            }}
                        >
                            {rarity.label}
                        </Typography>
                    </Box>
                </Box>
                <Box>
                    {/*<Stack direction="row" spacing=".5rem" mb=".5rem">*/}
                    {/*    {battleLobbyMech.weapon_slots.map((ws, index) => (*/}
                    {/*        <Box*/}
                    {/*            key={index}*/}
                    {/*            sx={{*/}
                    {/*                display: "flex",*/}
                    {/*                alignItems: "center",*/}
                    {/*                justifyContent: "center",*/}
                    {/*                width: "25px",*/}
                    {/*                height: "25px",*/}
                    {/*                border: `1px solid ${factionTheme.primary}66`,*/}
                    {/*                backgroundColor: `${factionTheme.background}`,*/}
                    {/*            }}*/}
                    {/*        >*/}
                    {/*            {ws.weapon ? (*/}
                    {/*                <Box*/}
                    {/*                    key={ws.weapon.avatar_url}*/}
                    {/*                    component="img"*/}
                    {/*                    src={ws.weapon.avatar_url}*/}
                    {/*                    sx={{*/}
                    {/*                        width: "100%",*/}
                    {/*                        height: "100%",*/}
                    {/*                        objectFit: "cover",*/}
                    {/*                        animation: `${scaleUpKeyframes} .5s ease-out`,*/}
                    {/*                    }}*/}
                    {/*                />*/}
                    {/*            ) : (*/}
                    {/*                <SvgWeapons />*/}
                    {/*            )}*/}
                    {/*        </Box>*/}
                    {/*    ))}*/}
                    {/*</Stack>*/}
                    <Typography
                        variant="h6"
                        sx={{
                            display: "-webkit-box",
                            overflow: "hidden",
                            overflowWrap: "anywhere",
                            textOverflow: "ellipsis",
                            WebkitLineClamp: 1, // change to max number of lines
                            WebkitBoxOrient: "vertical",
                            textTransform: "uppercase",
                            fontWeight: "fontWeightBold",
                            color: `#ffffff`,
                            letterSpacing: 1.1,
                        }}
                    >
                        {battleLobbyMech.name || battleLobbyMech.label}
                    </Typography>
                    {/*{battleLobbyMech.owner && (*/}
                    {/*    <Typography*/}
                    {/*        sx={{*/}
                    {/*            display: "-webkit-box",*/}
                    {/*            overflow: "hidden",*/}
                    {/*            overflowWrap: "anywhere",*/}
                    {/*            textOverflow: "ellipsis",*/}
                    {/*            WebkitLineClamp: 1, // change to max number of lines*/}
                    {/*            WebkitBoxOrient: "vertical",*/}
                    {/*            color: `#ffffffaa`,*/}
                    {/*        }}*/}
                    {/*    >*/}
                    {/*        {`@${battleLobbyMech.owner.username}#${battleLobbyMech.owner.gid}`}{" "}*/}
                    {/*    </Typography>*/}
                    {/*)}*/}
                </Box>
            </Stack>
        </Stack>
    )
}
