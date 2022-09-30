import { LoadingButton } from "@mui/lab"
import { Box, Button, Stack, Typography } from "@mui/material"
import { useCallback, useState } from "react"
import { SvgCheckMark, SvgPlus, SvgQuestionMark2 } from "../../../assets"
import { useAuth, useGlobalNotifications } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { useGameServerCommandsFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { scaleUpKeyframes } from "../../../theme/keyframes"
import { colors, fonts } from "../../../theme/theme"
import { Faction } from "../../../types"
import { BattleLobbiesMech } from "../../../types/battle_queue"

export interface BattleLobbyFaction {
    faction: Faction
    mechSlots: (BattleLobbiesMech | null)[] // null represents empty slot
}

interface MyFactionLobbySlotsProps {
    factionLobby: BattleLobbyFaction
    isLocked: boolean
    onSlotClick: () => void
}

export const MyFactionLobbySlots = ({ factionLobby, isLocked, onSlotClick }: MyFactionLobbySlotsProps) => {
    const theme = useTheme()
    const { userID } = useAuth()
    const { newSnackbarMessage } = useGlobalNotifications()

    // Leaving lobby
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const [isLoading, setIsLoading] = useState(false)

    const leaveLobby = useCallback(
        async (mechID: string) => {
            setIsLoading(true)
            try {
                await send(GameServerKeys.LeaveBattleLobby, {
                    mech_ids: [mechID],
                })
                newSnackbarMessage("Successfully removed mech from lobby.", "success")
            } catch (e) {
                newSnackbarMessage(typeof e === "string" ? e : "Failed to leave battle lobby.", "error")
            } finally {
                setIsLoading(false)
            }
        },
        [newSnackbarMessage, send],
    )

    return (
        <>
            {factionLobby.mechSlots.map((ms, index) => {
                if (!ms) {
                    return (
                        <Button
                            key={index}
                            onClick={() => onSlotClick()}
                            disabled={isLocked}
                            sx={{
                                flex: 1,
                                display: "flex",
                                flexDirection: "column",
                                padding: "1rem",
                                borderRadius: 0,
                                backgroundColor: `${colors.offWhite}10`,
                            }}
                        >
                            <SvgPlus size="60px" fill={`${colors.offWhite}20`} />
                            <Typography
                                display="block"
                                sx={{
                                    color: `${colors.offWhite}20`,
                                }}
                            >
                                DEPLOY MECH
                            </Typography>
                        </Button>
                    )
                }

                return (
                    <LoadingButton
                        key={index}
                        onClick={() => leaveLobby(ms.mech_id)}
                        disabled={isLocked || userID !== ms.owner?.id}
                        loading={isLoading}
                        sx={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "start",
                            justifyContent: "initial",
                            padding: "1rem",
                            borderRadius: 0,
                            backgroundColor: `${colors.offWhite}10`,
                        }}
                    >
                        <Box
                            component="img"
                            src={ms.avatar_url}
                            sx={{
                                maxHeight: "60px",
                            }}
                        />

                        {/* <ClipThing
                            border={{
                                borderColor: factionSlots.faction.primary_color,
                            }}
                            corners={{
                                bottomRight: true,
                            }}
                        >
                        </ClipThing> */}
                        <Typography
                            variant="h6"
                            sx={{
                                color: theme.factionTheme.primary,
                                fontWeight: "fontWeightBold",
                                display: "-webkit-box",
                                overflow: "hidden",
                                overflowWrap: "anywhere",
                                textOverflow: "ellipsis",
                                WebkitLineClamp: 1, // change to max number of lines
                                WebkitBoxOrient: "vertical",
                            }}
                        >
                            {ms.name || ms.label}
                        </Typography>
                        {ms.owner && (
                            <Typography
                                sx={{
                                    color: theme.factionTheme.primary,
                                    display: "-webkit-box",
                                    overflow: "hidden",
                                    overflowWrap: "anywhere",
                                    textOverflow: "ellipsis",
                                    WebkitLineClamp: 1, // change to max number of lines
                                    WebkitBoxOrient: "vertical",
                                }}
                            >
                                <i>{`@${ms.owner.username}#${ms.owner.gid}`}</i>
                            </Typography>
                        )}
                    </LoadingButton>
                )
            })}
        </>
    )
}

interface OtherFactionLobbySlotsProps {
    factionLobbies: BattleLobbyFaction[]
}

export const OtherFactionLobbySlots = ({ factionLobbies }: OtherFactionLobbySlotsProps) => {
    return (
        <>
            {factionLobbies.map((fl) => (
                <Box key={fl.faction.id}>
                    <Stack
                        direction="row"
                        sx={{
                            alignItems: "center",
                            mb: ".3rem",
                        }}
                    >
                        <Typography
                            sx={{
                                display: "-webkit-box",
                                fontSize: "1.2rem",
                                fontFamily: fonts.nostromoBlack,
                                color: fl.faction.primary_color,
                                overflow: "hidden",
                                overflowWrap: "anywhere",
                                textOverflow: "ellipsis",
                                WebkitLineClamp: 1, // change to max number of lines
                                WebkitBoxOrient: "vertical",
                            }}
                        >
                            {fl.faction.label}
                        </Typography>
                    </Stack>
                    <Stack direction="row" spacing=".5rem">
                        {fl.mechSlots.map((ms, index) => (
                            <Stack
                                key={index}
                                sx={{
                                    height: "30px",
                                    width: "30px",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    border: `1px solid ${fl.faction.primary_color}`,
                                    backgroundColor: fl.faction.background_color,
                                }}
                            >
                                {ms ? (
                                    <SvgCheckMark
                                        fill={`${colors.green}`}
                                        sx={{
                                            animation: `${scaleUpKeyframes} .5s ease-out`,
                                        }}
                                    />
                                ) : (
                                    <SvgQuestionMark2
                                        fill={`${colors.offWhite}20`}
                                        sx={{
                                            animation: `${scaleUpKeyframes} .5s ease-out`,
                                        }}
                                    />
                                )}
                            </Stack>
                        ))}
                    </Stack>
                </Box>
            ))}
        </>
    )
}
