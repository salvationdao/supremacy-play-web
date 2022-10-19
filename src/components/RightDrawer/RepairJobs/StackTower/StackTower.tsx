import { Box, Stack, Typography } from "@mui/material"
import React, { useEffect, useRef, useState } from "react"
import { useTheme } from "../../../../containers/theme"
import { useGameServerCommandsUser, useGameServerSubscriptionSecuredUser } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { opacityEffect } from "../../../../theme/keyframes"
import { colors, fonts } from "../../../../theme/theme"
import { RepairAgent } from "../../../../types/jobs"
import { ProgressBar } from "../../../Common/ProgressBar"
import { blockConfig } from "./src/config"
import { Game } from "./src/game"
import { BlockServer, BlockType, GameState, NewStackInfo, PlayButton } from "./src/types"

interface StackTowerProps {
    primaryColor: string
    disableGame: boolean
    repairAgent?: RepairAgent
    onSubmitted: () => void
}

// Only thing that should cause re-render is when disableGame prop changes, the rest are fine and shouldn't change
const propsAreEqual = (prevProps: StackTowerProps, nextProps: StackTowerProps) => {
    return prevProps.disableGame === nextProps.disableGame
}

export const StackTower = React.memo(function StackTower({ primaryColor, disableGame, repairAgent, onSubmitted }: StackTowerProps) {
    const theme = useTheme()
    const { send } = useGameServerCommandsUser("/user_commander")
    const gameInstance = useRef<Game>()
    const [cumulativeScore, setCumulativeScore] = useState(0)
    const [gameState, setGameState] = useState<GameState>(GameState.Loading)
    const [score, setScore] = useState(0)
    const [activePlayButton, setActivePlayButton] = useState<string>("Spacebar")

    const onNewBlock = useRef((newBlock: BlockServer) => {
        // Game ends if the new block type is "END"
        if (newBlock.type === BlockType.End) {
            onSubmitted()
            return
        }

        // Else game continues and we add a new block
        setCumulativeScore(newBlock.total_score)
        gameInstance.current?.onNewBlock(newBlock)
    })

    // As the player plays the mini game, this will be the game updates
    const onPlaceBlock = useRef(async (newStackInfo: NewStackInfo) => {
        setScore(newStackInfo?.score)

        if (!repairAgent?.id) return

        try {
            await send(GameServerKeys.RepairAgentUpdate, {
                repair_agent_id: repairAgent.id,
                ...newStackInfo,
            })
        } catch (err) {
            console.error(err)
        }
    })

    // Initialize game
    useEffect(() => {
        gameInstance.current = new Game(theme.factionTheme.background, setGameState, onPlaceBlock, setActivePlayButton)
        setTimeout(() => {
            gameInstance.current?.start()
        }, 100)

        return () => {
            const instance = gameInstance.current
            instance?.destroy()
        }
    }, [onPlaceBlock, setGameState, theme.factionTheme.background])

    return (
        <Box
            sx={{
                height: "100%",
                p: "1.8rem 3rem",
                border: `${primaryColor}70 2px solid`,
                backgroundColor: `${primaryColor}30`,
                boxShadow: 2,
                borderRadius: 1.3,
            }}
        >
            {/* Will unmount and unsubscribe when game ends, and re-subscribe for new game what ready again */}
            {repairAgent?.id && gameState === GameState.Playing && (
                <SubscribeNewBlocks key={`tower-new-block-sub-${repairAgent.id}`} repairAgentID={repairAgent?.id} onNewBlock={onNewBlock} />
            )}

            <Stack
                spacing="1rem"
                sx={{
                    height: "100%",
                    transition: "all .1s",
                    filter: disableGame ? "blur(4px)" : "unset",
                    opacity: disableGame ? 0.15 : 1,
                    pointerEvents: disableGame ? "none" : "all",
                }}
            >
                <Stack spacing=".7rem" sx={{ pb: ".4rem" }}>
                    <Typography variant="h5" sx={{ fontWeight: "fontWeightBold", span: { color: colors.neonBlue } }}>
                        YOU NEED A TOTAL OF <span>{repairAgent?.required_stacks || "XXX"}</span> STACKS TO REPAIR A SINGLE BLOCK!
                    </Typography>

                    <Stack direction="row" alignItems="center" spacing="1rem">
                        <Stack sx={{ flex: 1 }}>
                            <ProgressBar
                                color={colors.green}
                                backgroundColor={colors.red}
                                orientation="horizontal"
                                thickness="12px"
                                percent={(100 * cumulativeScore) / (repairAgent?.required_stacks || 100)}
                            />
                        </Stack>

                        <Typography variant="h6" sx={{ lineHeight: 1, fontWeight: "fontWeightBold" }}>
                            {cumulativeScore}/{repairAgent?.required_stacks || "XXX"}
                        </Typography>
                    </Stack>
                </Stack>

                <Box sx={{ position: "relative", flex: 1, border: "#FFFFFF20 1px solid" }}>
                    <Box sx={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", userSelect: "none" }}>
                        <Box
                            id="tower-stack-game"
                            tabIndex={0}
                            sx={{
                                position: "absolute",
                                top: 0,
                                bottom: 0,
                                left: 0,
                                right: 0,
                                backgroundColor: theme.factionTheme.background,
                            }}
                        />

                        {/* Absolute positioned items that overlays on top of the game */}
                        {/* Score and button text */}
                        <Stack
                            alignItems="center"
                            sx={{
                                position: "absolute",
                                top: "16%",
                                left: 0,
                                right: 0,
                                transition: "all .4s ease",
                                transform:
                                    gameState === GameState.Playing || gameState === GameState.Resetting
                                        ? "translateY(50px) scale(1)"
                                        : gameState === GameState.Ended
                                        ? "translateY(-20px) scale(1.5)"
                                        : "translateY(-200px) scale(1)",
                                opacity: gameState === GameState.Playing || gameState === GameState.Resetting || gameState === GameState.Ended ? 1 : 0,
                                pointerEvents: "none",
                            }}
                        >
                            <Stack spacing=".6rem" alignItems="center">
                                <Box sx={{ p: ".2rem 1.2rem", backgroundColor: "#000000CD" }}>
                                    <Typography
                                        variant="h2"
                                        sx={{
                                            textAlign: "center",
                                            color: gameState === GameState.Ended ? colors.orange : "#FFFFFF",
                                            fontFamily: fonts.shareTech,
                                            fontWeight: "fontWeightBold",
                                        }}
                                    >
                                        {score}
                                    </Typography>
                                </Box>

                                {gameState !== GameState.Ended && (
                                    <Box
                                        key={`activePlayButton-${activePlayButton}`}
                                        sx={{ p: ".2rem 1.2rem", backgroundColor: "#000000CD", animation: `${opacityEffect} 1.5s` }}
                                    >
                                        <Typography variant="h6" sx={{ textAlign: "center", fontFamily: fonts.nostromoBlack, span: { color: colors.orange } }}>
                                            <span>[{activePlayButton}]</span>
                                        </Typography>
                                    </Box>
                                )}
                            </Stack>
                        </Stack>

                        {/* Game ready instructions */}
                        <Stack
                            spacing=".4rem"
                            alignItems="center"
                            sx={{
                                position: "absolute",
                                top: "30%",
                                left: 0,
                                right: 0,
                                transition: "all .2s ease",
                                transform: gameState === GameState.Ready ? "translateY(0)" : "translateY(-50px)",
                                opacity: gameState === GameState.Ready ? 1 : 0,
                                pointerEvents: "none",
                            }}
                        >
                            <Box sx={{ p: ".6rem 1rem", backgroundColor: "#000000CD" }}>
                                <Typography
                                    variant="h5"
                                    sx={{
                                        lineHeight: 1.7,
                                        textAlign: "center",
                                        fontFamily: fonts.nostromoBlack,
                                        span: { color: colors.orange },
                                    }}
                                >
                                    Press <span>{activePlayButton}</span>
                                    <br />
                                    to start repairing
                                </Typography>
                            </Box>
                        </Stack>

                        {/* Game over text */}
                        <Stack
                            alignItems="center"
                            sx={{
                                position: "absolute",
                                top: "28%",
                                left: 0,
                                right: 0,
                                transition: "all .2s ease",
                                transform: gameState === GameState.Ended ? "translateY(0)" : "translateY(-50px)",
                                opacity: gameState === GameState.Ended ? 1 : 0,
                                pointerEvents: "none",
                            }}
                        >
                            <Stack spacing=".4rem" sx={{ p: ".6rem 1rem", backgroundColor: "#000000CD" }}>
                                <Typography variant="h3" sx={{ textAlign: "center", fontFamily: fonts.nostromoHeavy }}>
                                    Stack Ended
                                </Typography>
                                <Typography variant="h6" sx={{ textAlign: "center", fontFamily: fonts.nostromoBlack, span: { color: colors.orange } }}>
                                    You did great citizen
                                    <br />
                                    <span>Click</span> to continue
                                </Typography>
                            </Stack>
                        </Stack>
                    </Box>
                </Box>

                <Typography sx={{ color: colors.lightGrey }}>
                    <i>
                        <strong>NOTE:</strong> Your submission will be rejected if there are too many failed attempts.
                    </i>
                </Typography>
            </Stack>
        </Box>
    )
}, propsAreEqual)

interface BlockServerStruct {
    id: string
    type: BlockType
    key: PlayButton
    dimension: {
        width: string
        depth: string
    }
    speed_multiplier: string
    total_score: number
}

// A component that subscribes to new blocks from server, having this allows me to unmount and
//  re-subscribe anytime to restart game.
const SubscribeNewBlocks = React.memo(function SubscribeNewBlocks({
    repairAgentID,
    onNewBlock,
}: {
    repairAgentID: string
    onNewBlock: React.MutableRefObject<(newBlock: BlockServer) => void>
}) {
    // Listeners to the server for new blocks
    useGameServerSubscriptionSecuredUser<BlockServerStruct>(
        {
            URI: `/repair_agent/${repairAgentID}/next_block`,
            key: GameServerKeys.SubRepairTowerNewBlocks,
        },
        (payload) => {
            if (!payload) return

            onNewBlock.current({
                id: payload.id,
                type: payload.type,
                key: payload.key,
                dimension: {
                    width: parseFloat(payload.dimension.width),
                    depth: parseFloat(payload.dimension.depth),
                    height: blockConfig.initHeight,
                },
                speed_multiplier: parseFloat(payload.speed_multiplier),
                total_score: payload.total_score,
            })
        },
    )

    return null
})
