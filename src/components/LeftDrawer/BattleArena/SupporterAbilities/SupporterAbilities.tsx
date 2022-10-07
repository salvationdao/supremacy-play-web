import { Box, ButtonGroup, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import { SvgGlobal, SvgLine, SvgMicrochip, SvgTarget } from "../../../../assets"
import { useArena, useAuth, useGame, useSupremacy } from "../../../../containers"
import { useGameServerSubscription } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { colors } from "../../../../theme/theme"
import { BattleState, LocationSelectType, PlayerSupporterAbility } from "../../../../types"
import { SectionCollapsible } from "../Common/SectionCollapsible"
import { FilterButton } from "../PlayerAbilities/PlayerAbilities"
import { SupportAbilityCard } from "./SupportAbilityCard"

export interface PlayerSupportAbilitiesResponse {
    battle_id: string
    supporter_abilities: PlayerSupporterAbility[]
}

export const SupporterAbilities = () => {
    const { userID } = useAuth()
    const { battleState } = useGame()

    if (battleState !== BattleState.BattlingState || !userID) return null

    return (
        <Box sx={{ position: "relative" }}>
            <SectionCollapsible label={"SUPPORT ABILITIES"} tooltip="Your supporter abilities" initialExpanded={true} localStoragePrefix="supportAbility">
                <Box sx={{ pointerEvents: battleState === BattleState.BattlingState ? "all" : "none" }}>
                    <SupporterAbilitiesInner />
                </Box>

                {battleState !== BattleState.BattlingState && (
                    <Box sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "#000000AA" }} />
                )}
            </SectionCollapsible>
        </Box>
    )
}

const SupporterAbilitiesInner = () => {
    const { userID } = useAuth()
    const { currentArenaID } = useArena()
    const { battleID } = useSupremacy()
    const [supportAbilities, setSupportAbilities] = useState<PlayerSupporterAbility[]>([])
    const [filteredSupportAbilities, setFilteredSupportAbilities] = useState<PlayerSupporterAbility[]>([])
    const [locationSelectTypes, setLocationSelectTypes] = useState<LocationSelectType[]>([])

    useEffect(() => {
        if (locationSelectTypes.length > 0) {
            setFilteredSupportAbilities(supportAbilities.filter((p) => locationSelectTypes.includes(p.location_select_type)))
        } else {
            setFilteredSupportAbilities(supportAbilities)
        }
    }, [supportAbilities, locationSelectTypes])

    // subscription for users supporter abilities
    // need battle? lobby? arena? id, then we have a subscription to get the users support abilities
    useGameServerSubscription<PlayerSupportAbilitiesResponse>(
        {
            URI: `/user/${userID}/battle/${battleID}/supporter_abilities`,
            key: GameServerKeys.PlayerSupportAbilities,
            ready: !!currentArenaID,
        },
        (payload) => {
            if (battleID !== payload.battle_id) {
                setSupportAbilities([])
                return
            }
            setSupportAbilities(payload.supporter_abilities || [])
        },
    )

    const onLocationSelectTypeChange = useCallback((l: LocationSelectType[]) => {
        setLocationSelectTypes(l)
    }, [])

    return (
        <Stack spacing="1rem">
            <ButtonGroup
                size="small"
                sx={(theme) => ({
                    width: "100%",
                    "& .MuiButton-root": {
                        flex: 1,
                        height: "3rem",
                        borderWidth: "2px",
                        borderRadius: 0.8,
                        transition: "none",
                        "&:hover": {
                            opacity: 0.9,
                            backgroundColor: theme.factionTheme.primary,
                        },
                    },
                })}
            >
                <FilterButton
                    value={[LocationSelectType.Global]}
                    currentSelectedValue={locationSelectTypes}
                    onChange={onLocationSelectTypeChange}
                    icon={<SvgGlobal size="1.4rem" />}
                />

                <FilterButton
                    value={[LocationSelectType.LocationSelect]}
                    currentSelectedValue={locationSelectTypes}
                    onChange={onLocationSelectTypeChange}
                    icon={<SvgTarget size="1.4rem" />}
                />

                <FilterButton
                    value={[LocationSelectType.MechSelect, LocationSelectType.MechSelectAllied, LocationSelectType.MechSelectOpponent]}
                    currentSelectedValue={locationSelectTypes}
                    onChange={onLocationSelectTypeChange}
                    icon={<SvgMicrochip size="1.4rem" />}
                />

                <FilterButton
                    value={[LocationSelectType.LineSelect]}
                    currentSelectedValue={locationSelectTypes}
                    onChange={onLocationSelectTypeChange}
                    icon={<SvgLine size="1.4rem" />}
                />
            </ButtonGroup>

            {filteredSupportAbilities && filteredSupportAbilities.length > 0 ? (
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(70px, 1fr))",
                        gap: ".6rem",
                    }}
                >
                    {filteredSupportAbilities.map((ab) => (
                        <SupportAbilityCard key={`${ab.id}`} supportAbility={ab} />
                    ))}
                </Box>
            ) : (
                <Typography
                    sx={{
                        px: "1.28rem",
                        pt: "1.28rem",
                        mb: ".56rem",
                        color: colors.grey,
                        opacity: 0.8,
                    }}
                >
                    Supporter abilities appear here, opt in to be a supporter in the pre-battle screen.
                </Typography>
            )}
        </Stack>
    )
}
