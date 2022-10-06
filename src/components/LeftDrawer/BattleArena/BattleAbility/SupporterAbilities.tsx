import { Box, ButtonGroup, Stack, Typography } from "@mui/material"
import { useArena, useAuth, useMiniMapPixi, useSupremacy } from "../../../../containers"
import { SectionCollapsible } from "../Common/SectionCollapsible"
import { useGameServerSubscription } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { LocationSelectType } from "../../../../types"
import { SvgGlobal, SvgLine, SvgMicrochip, SvgQuestionMark, SvgTarget } from "../../../../assets"
import { TooltipHelper } from "../../../Common/TooltipHelper"
import { FancyButton } from "../../../Common/FancyButton"
import { colors } from "../../../../theme/theme"
import { FilterButton } from "../PlayerAbilities/PlayerAbilities"

export interface PlayerSupportAbilitiesResponse {
    battle_id: string
    supporter_abilities: PlayerSupporterAbility[]
}

export interface PlayerSupporterAbility {
    id: string
    label: string
    colour: string
    image_url: string
    description: string
    text_colour: string
    location_select_type: LocationSelectType
    mech_hash: string
}

export const SupporterAbilities = () => {
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
            console.log(payload.supporter_abilities)
            setSupportAbilities(payload.supporter_abilities || [])
        },
    )

    const onLocationSelectTypeChange = useCallback((l: LocationSelectType[]) => {
        setLocationSelectTypes(l)
    }, [])

    return (
        <Box sx={{ position: "relative" }}>
            <SectionCollapsible label={"SUPPORT ABILITIES"} tooltip="Your supporter abilities" initialExpanded={true} localStoragePrefix="supportAbility">
                <Box
                    sx={{
                        display: "flex",
                        flex: 1,
                        flexDirection: "column",
                    }}
                >
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
                    {(!supportAbilities || supportAbilities.length === 0) && (
                        <Typography>Supporter abilities appear here, opt in to be a supporter in the pre battle screen.</Typography>
                    )}
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
                </Box>
            </SectionCollapsible>
        </Box>
    )
}

export const SupportAbilityCard = ({ supportAbility }: { supportAbility: PlayerSupporterAbility }) => {
    const { useSupportAbility } = useMiniMapPixi()
    // const [disabled, setDisabled] = useState(false)

    const abilityTypeIcon = useMemo(() => {
        switch (supportAbility.location_select_type) {
            case LocationSelectType.Global:
                return <SvgGlobal size="1.5rem" />
            case LocationSelectType.LocationSelect:
                return <SvgTarget size="1.5rem" />
            case LocationSelectType.MechSelect:
                return <SvgMicrochip size="1.5rem" />
            case LocationSelectType.MechSelectAllied:
                return <SvgMicrochip size="1.5rem" />
            case LocationSelectType.MechSelectOpponent:
                return <SvgMicrochip size="1.5rem" />
            case LocationSelectType.LineSelect:
                return <SvgLine size="1.5rem" />
        }
        return <SvgQuestionMark size="1.5rem" />
    }, [supportAbility])

    const onActivate = useCallback(() => {
        useSupportAbility.current(supportAbility)
    }, [supportAbility, useSupportAbility])

    return (
        <TooltipHelper color={supportAbility.colour} text={supportAbility.description} placement="bottom">
            <FancyButton
                clipThingsProps={{
                    clipSize: "6px",
                    clipSlantSize: "0px",
                    corners: {
                        topLeft: true,
                        topRight: true,
                        bottomLeft: true,
                        bottomRight: true,
                    },
                    backgroundColor: colors.darkNavy,
                    opacity: 1,
                    border: { borderColor: supportAbility.colour, borderThickness: "1.5px" },
                    sx: { position: "relative", px: ".4rem", py: ".3rem" },
                }}
                sx={{
                    color: supportAbility.colour,
                    p: 0,
                    minWidth: 0,
                    height: "100%",
                }}
                onClick={onActivate}
            >
                <Stack
                    spacing=".3rem"
                    sx={{
                        height: "100%",
                        ":hover img": {
                            transform: "scale(1.2)",
                            filter: "brightness(2)",
                        },
                    }}
                >
                    <Box
                        sx={{
                            position: "relative",
                            width: "100%",
                            pt: "100%", // 1:1 width-height ratio
                            overflow: "hidden",
                        }}
                    >
                        <Box
                            sx={{
                                position: "absolute",
                                top: ".5rem",
                                left: ".5rem",
                                zIndex: 2,
                            }}
                        >
                            {abilityTypeIcon}
                        </Box>
                        <Box
                            component="img"
                            src={supportAbility.image_url}
                            alt={`Thumbnail image for ${supportAbility.label}`}
                            sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                transformOrigin: "center",
                                transition: "transform .1s ease-out, filter .1s ease-out",
                            }}
                        />
                    </Box>

                    <Typography
                        variant="body2"
                        sx={{
                            lineHeight: 1.2,
                            display: "-webkit-box",
                            overflow: "hidden",
                            overflowWrap: "anywhere",
                            textOverflow: "ellipsis",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            fontWeight: "fontWeightBold",
                        }}
                    >
                        {supportAbility.label}
                    </Typography>
                </Stack>
            </FancyButton>
        </TooltipHelper>
    )
}
