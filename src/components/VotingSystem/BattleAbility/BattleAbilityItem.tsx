import { Box, Collapse, Fade, Stack, Typography } from "@mui/material"
import BigNumber from "bignumber.js"
import { useCallback, useMemo, useState } from "react"
import { BattleAbilityCountdown, ClipThing, FancyButton } from "../.."
import { SvgDropdownArrow } from "../../../assets"
import { BribeStageResponse, useGame, useAuth, useSupremacy } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { shadeColor } from "../../../helpers"
import { useToggle } from "../../../hooks"
import { useGameServerCommandsFaction, useGameServerSubscription } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors } from "../../../theme/theme"
import { BattleAbility as BattleAbilityType, BattleAbilityProgress, Faction } from "../../../types"
import { BattleAbilityTextTop } from "./BattleAbilityTextTop"
import { SupsBarStack } from "./SupsBarStack"
import { VotingButtons } from "./VotingButtons"

export interface BattleAbilityProgressBigNum {
    faction_id: string
    sups_cost: BigNumber
    current_sups: BigNumber
}

export const BattleAbilityItem = () => {
    const theme = useTheme()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const { bribeStage } = useGame()

    const [fadeEffect, toggleFadeEffect] = useToggle()
    const [battleAbility, setBattleAbility] = useState<BattleAbilityType>()
    const [battleAbilityProgress, setBattleAbilityProgress] = useState<BattleAbilityProgressBigNum[]>([])

    // Subscribe to battle ability updates
    useGameServerSubscription<BattleAbilityType>(
        {
            URI: "/public/battle_ability",
            key: GameServerKeys.SubBattleAbility,
        },
        (payload) => {
            if (!payload) return
            setBattleAbility(payload)
            toggleFadeEffect()
        },
    )

    // Listen on the progress of the votes
    useGameServerSubscription<BattleAbilityProgress[] | undefined>(
        {
            URI: "/public/live_data",
            key: GameServerKeys.SubBattleAbilityProgress,
        },
        (payload) => {
            if (!payload) return

            setBattleAbilityProgress(
                payload
                    .sort((a, b) => a.faction_id.localeCompare(b.faction_id))
                    .map((a) => ({
                        faction_id: a.faction_id,
                        sups_cost: new BigNumber(a.sups_cost).dividedBy("1000000000000000000"),
                        current_sups: new BigNumber(a.current_sups).dividedBy("1000000000000000000"),
                    })),
            )
        },
    )

    const onBribe = useCallback(
        async (amount: BigNumber, percentage: number) => {
            if (!battleAbility) return

            if (!send || percentage > 1 || percentage < 0) return

            try {
                await send<boolean, { ability_offering_id: string; percentage: number }>(GameServerKeys.BribeBattleAbility, {
                    ability_offering_id: battleAbility.ability_offering_id,
                    percentage: percentage,
                })
            } catch (e) {
                console.error(e)
            }
        },
        [battleAbility, send],
    )

    const isVoting = useMemo(
        () => bribeStage?.phase == "OPT_IN" && battleAbilityProgress && battleAbilityProgress.length > 0,
        [battleAbilityProgress, bribeStage],
    )

    if (!battleAbility) {
        return (
            <Typography
                sx={{
                    mt: ".5rem",
                    lineHeight: 1,
                    color: colors.text,
                    opacity: 0.6,
                    fontWeight: "fontWeightBold",
                }}
            >
                LOADING BATTLE ABILITY...
            </Typography>
        )
    }

    return (
        <BattleAbilityItemInner
            key={battleAbility.ability_offering_id}
            bribeStage={bribeStage}
            battleAbility={battleAbility}
            isVoting={isVoting}
            fadeEffect={fadeEffect}
            buttonColor={theme.factionTheme.primary}
            buttonTextColor={theme.factionTheme.secondary}
        />
    )
}

interface InnerProps {
    bribeStage?: BribeStageResponse
    battleAbility: BattleAbilityType
    isVoting: boolean
    fadeEffect: boolean
    buttonColor: string
    buttonTextColor: string
}

const BattleAbilityItemInner = ({ bribeStage, battleAbility, fadeEffect, isVoting }: InnerProps) => {
    const { label, colour, image_url, description } = battleAbility
    const { factionID } = useAuth()

    const [isCollapsed, setIsCollapsed] = useState(localStorage.getItem("isBattleAbilitiesCollapsed") === "true")

    const backgroundColor = useMemo(() => shadeColor(colour, -75), [colour])

    return (
        <Fade in={true}>
            <Box>
                <FancyButton
                    clipThingsProps={{
                        clipSize: "0",
                        backgroundColor: "#FFFFFF",
                        opacity: 0.05,
                        sx: { position: "relative" },
                    }}
                    sx={{ px: "1rem", py: ".4rem", color: "#FFFFFF" }}
                    onClick={() => {
                        setIsCollapsed((prev) => {
                            localStorage.setItem("isBattleAbilitiesCollapsed", (!prev).toString())
                            return !prev
                        })
                    }}
                >
                    <Stack direction="row">
                        <BattleAbilityCountdown bribeStage={bribeStage} />
                        <SvgDropdownArrow size="1.3rem" sx={{ ml: "auto !important", transform: isCollapsed ? "scaleY(-1) translateY(2px)" : "unset" }} />
                    </Stack>
                </FancyButton>

                <Collapse in={isCollapsed}>
                    <Stack key={fadeEffect.toString()} spacing="1.04rem" sx={{ my: "1rem" }}>
                        <Fade in={true}>
                            <Box>
                                <ClipThing
                                    clipSize="6px"
                                    border={{
                                        borderColor: colour,
                                        borderThickness: ".3rem",
                                    }}
                                    backgroundColor={backgroundColor}
                                    opacity={0.7}
                                >
                                    <Stack
                                        spacing=".8rem"
                                        alignItems="flex-start"
                                        sx={{
                                            flex: 1,
                                            minWidth: "32.5rem",
                                            px: "1.6rem",
                                            pt: "1.12rem",
                                            pb: "1.28rem",
                                            opacity: isVoting ? 1 : 0.7,
                                        }}
                                    >
                                        <BattleAbilityTextTop
                                            label={label}
                                            description={description}
                                            image_url={image_url}
                                            colour={colour}
                                            showButton={!!factionID && bribeStage?.phase === "OPT_IN"}
                                        />
                                    </Stack>
                                </ClipThing>
                            </Box>
                        </Fade>
                    </Stack>
                </Collapse>
            </Box>
        </Fade>
    )
}
