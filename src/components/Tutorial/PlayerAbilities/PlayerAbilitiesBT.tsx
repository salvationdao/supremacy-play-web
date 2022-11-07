import { Box, Button, ButtonGroup, Pagination, Stack, Typography } from "@mui/material"
import { ReactNode, useCallback, useEffect, useRef, useState } from "react"
import { SvgGlobal, SvgLine, SvgMicrochip, SvgTarget } from "../../../assets"
import { useTraining } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { usePagination } from "../../../hooks"
import { glowEffect } from "../../../theme/keyframes"
import { colors } from "../../../theme/theme"
import { LocationSelectType, PlayerAbility, PlayerAbilityPrePurchase, PlayerAbilityStages } from "../../../types"
import { SectionCollapsibleBT } from "../SectionCollapsibleBT"
import { PlayerAbilityCardBT } from "./PlayerAbilityCardBT"

const EMP_ABILITY: PlayerAbility[] = [
    {
        id: "d348e52b-f16d-4304-b9a8-9d0047779b6e",
        blueprint_id: "763509dc-1c84-43a5-a068-46aaa1f47c53",
        count: 1,
        last_purchased_at: new Date(),
        cooldown_expires_on: new Date(),
        ability: {
            id: "763509dc-1c84-43a5-a068-46aaa1f47c53",
            game_client_ability_id: 12,
            label: "EMP",
            colour: "#2e8cff",
            image_url: "https://afiles.ninja-cdn.com/supremacy-stream-site/assets/img/ability-emp.png",
            description: "Create a short burst of electromagnetic energy that will disrupt War Machine operations in an area for a brief period of time.",
            text_colour: "#2e8cff",
            location_select_type: LocationSelectType.LocationSelect,
            created_at: new Date("2022-08-12T11:38:53.275945+08:00"),
            inventory_limit: 8,
            cooldown_seconds: 240,
        },
    },
]
export const PlayerAbilitiesBT = () => {
    const { setTutorialRef, trainingStage } = useTraining()
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (trainingStage === PlayerAbilityStages.ExplainPA || trainingStage === PlayerAbilityStages.UseAbilityPA) {
            setTutorialRef(ref)
            ref.current?.scrollIntoView()
        }
    }, [trainingStage, setTutorialRef])
    return (
        <Box
            ref={ref}
            sx={{
                position: "relative",
                animation:
                    trainingStage === PlayerAbilityStages.ExplainPA || trainingStage === PlayerAbilityStages.UseAbilityPA
                        ? (theme) => `${glowEffect(theme.factionTheme.primary)} 2s infinite`
                        : "unset",
            }}
        >
            <SectionCollapsibleBT label="OWNED ABILITIES" tooltip="Launch your own abilities." initialExpanded={true} localStoragePrefix="playerAbility">
                <PlayerAbilitiesInner />
            </SectionCollapsibleBT>
        </Box>
    )
}

const PlayerAbilitiesInner = () => {
    const { trainingStage, setUpdater } = useTraining()
    const [shownPlayerAbilities, setShownPlayerAbilities] = useState<PlayerAbility[]>([])

    const { page, changePage, totalPages } = usePagination({
        pageSize: 8,
        page: 1,
    })
    const [locationSelectTypes, setLocationSelectTypes] = useState<LocationSelectType[]>([])

    useEffect(() => {
        if (trainingStage in PlayerAbilityPrePurchase || !(trainingStage in PlayerAbilityStages)) {
            return
        } else {
            setShownPlayerAbilities(EMP_ABILITY)
            setUpdater([])
        }
    }, [setUpdater, trainingStage])

    const onLocationSelectTypeChange = useCallback(
        (l: LocationSelectType[]) => {
            changePage(1)
            setLocationSelectTypes(l)
        },
        [changePage],
    )

    return (
        <Stack spacing="1rem">
            <ButtonGroup
                size="small"
                sx={(theme) => ({
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

            {shownPlayerAbilities && shownPlayerAbilities.length > 0 ? (
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(70px, 1fr))",
                        gap: ".6rem",
                    }}
                >
                    {shownPlayerAbilities.map((p) => (
                        <PlayerAbilityCardBT key={p.ability.id} playerAbility={p} />
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
                    {locationSelectTypes ? (
                        <>
                            No results,&nbsp;
                            <strong style={{ color: colors.gold, textDecoration: "underline" }} onClick={() => setLocationSelectTypes([])}>
                                click here to clear filters.
                            </strong>
                        </>
                    ) : (
                        <>You don&apos;t have any player abilities,&nbsp;</>
                    )}
                </Typography>
            )}

            {totalPages > 1 && (
                <Box
                    sx={{
                        px: "1rem",
                        py: ".7rem",
                        borderTop: (theme) => `${theme.factionTheme.primary}70 1.5px solid`,
                        backgroundColor: "#00000070",
                    }}
                >
                    <Pagination count={totalPages} page={page} onChange={(e, p) => changePage(p)} />
                </Box>
            )}
        </Stack>
    )
}

const FilterButton = ({
    value,
    currentSelectedValue,
    onChange: setLocationSelectTypes,
    icon,
}: {
    value: LocationSelectType[]
    currentSelectedValue: LocationSelectType[]
    onChange: (l: LocationSelectType[]) => void
    icon: ReactNode
}) => {
    const theme = useTheme()

    const isSame = value.join("||") === currentSelectedValue.join("||")

    return (
        <Button
            sx={{
                "&&": {
                    backgroundColor: isSame ? theme.factionTheme.primary : "unset",
                    border: `1px solid ${theme.factionTheme.primary}`,
                },
                svg: {
                    fill: isSame ? theme.factionTheme.secondary : "#FFFFFF",
                },
            }}
            onClick={() => {
                setLocationSelectTypes(isSame ? [] : value)
            }}
        >
            {icon}
        </Button>
    )
}
