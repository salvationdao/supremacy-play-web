import { Box, Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useRef, useState } from "react"
import { useTraining } from "../../../containers"
import { colors, fonts } from "../../../theme/theme"
import { LocationSelectType, PlayerAbilityStages, SaleAbility } from "../../../types"
import { SectionCollapsibleBT } from "../SectionCollapsibleBT"
import { QuickPlayerAbilitiesItemBT } from "./QuickPlayerAbilitiesItemBT"

export const QuickPlayerAbilitiesBT = () => {
    return <QuickPlayerAbilitiesInner />
}

const QuickPlayerAbilitiesInner = () => {
    const { trainingStage, setTutorialRef } = useTraining()
    const ref = useRef<HTMLDivElement>(null)
    const saleAbilities = TRAINING_PLAYER_ABILITIES
    const [purchaseError, setPurchaseError] = useState<string>()

    useEffect(() => {
        if (
            trainingStage === PlayerAbilityStages.SalePeriodPA ||
            trainingStage === PlayerAbilityStages.ClaimPA ||
            trainingStage === PlayerAbilityStages.ShowPurchasePA
        ) {
            setTutorialRef(ref)
            ref.current?.scrollIntoView()
        }
    }, [trainingStage, setTutorialRef])

    const timeLeft = useMemo(() => {
        return <Typography sx={{ color: colors.lightNeonBlue, fontFamily: fonts.shareTech, textTransform: "uppercase" }}>10 Minutes</Typography>
    }, [])

    return (
        <div ref={ref}>
            <SectionCollapsibleBT
                label="PURCHASE ABILITIES"
                tooltip="Purchase abilities that are currently on sale."
                initialExpanded={true}
                localStoragePrefix="quickPlayerAbility"
            >
                <Stack sx={{ minHeight: "12rem" }}>
                    <Stack>
                        <Stack direction="row" spacing=".6rem" alignItems="center">
                            <Typography sx={{ fontWeight: "fontWeightBold", textTransform: "uppercase" }}>Next refresh in:</Typography>
                            {timeLeft}
                        </Stack>
                        {purchaseError && (
                            <Typography variant="body2" sx={{ color: colors.red }}>
                                {purchaseError}
                            </Typography>
                        )}
                    </Stack>

                    {saleAbilities && saleAbilities.length > 0 && (
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
                                gridTemplateRows: "repeat(1, fr)",
                                gap: "1rem",
                                justifyContent: "center",
                                px: "2rem",
                                py: "1rem",
                                width: "100%",
                            }}
                        >
                            {saleAbilities.map((s, index) => (
                                <QuickPlayerAbilitiesItemBT
                                    key={`${s.id}-${index}`}
                                    saleAbility={s}
                                    amount={
                                        trainingStage in PlayerAbilityStages &&
                                        trainingStage !== PlayerAbilityStages.ExplainPA &&
                                        trainingStage !== PlayerAbilityStages.SalePeriodPA &&
                                        trainingStage !== PlayerAbilityStages.NullPA &&
                                        trainingStage !== PlayerAbilityStages.ClaimPA &&
                                        s.ability.label === "EMP"
                                            ? 1
                                            : 0
                                    }
                                    setError={setPurchaseError}
                                />
                            ))}
                        </Box>
                    )}

                    {saleAbilities && saleAbilities.length <= 0 && (
                        <Stack alignItems="center" justifyContent="center" sx={{ flex: 1 }}>
                            <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", maxWidth: "40rem" }}>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        px: "1.28rem",
                                        color: colors.grey,
                                        fontFamily: fonts.nostromoBold,
                                        textAlign: "center",
                                    }}
                                >
                                    NO ABILITIES ARE ON SALE AT THE MOMENT.
                                </Typography>
                            </Stack>
                        </Stack>
                    )}
                </Stack>
            </SectionCollapsibleBT>
        </div>
    )
}

export const TRAINING_PLAYER_ABILITIES: SaleAbility[] = [
    {
        id: "187b8482-0123-4da3-944d-18f8dde435f4",
        blueprint_id: "4c90fe44-f2d2-4b39-ade5-2a65cff33707",
        amount_sold: 0,
        current_price: "10000000000000000000",
        ability: {
            id: "4c90fe44-f2d2-4b39-ade5-2a65cff33707",
            game_client_ability_id: 13,
            label: "Hacker Drone",
            colour: "#FF5861",
            image_url: "https://afiles.ninja-cdn.com/supremacy-stream-site/assets/img/ability-hacker-drone.png",
            description: "Deploy a drone onto the battlefield that hacks into the nearest War Machine and disrupts their targeting systems.",
            text_colour: "#FF5861",
            location_select_type: LocationSelectType.LocationSelect,
            created_at: new Date("2022-08-12T11:38:53.275945+08:00"),
            inventory_limit: 10,
            cooldown_seconds: 120,
        },
    },
    {
        id: "f2ae1ab6-acaf-4762-a510-9b9cf78a12e6",
        blueprint_id: "531c4e08-89d1-4d44-b952-cf1a4db16b83",
        amount_sold: 0,
        current_price: "10000000000000000000",
        ability: {
            id: "531c4e08-89d1-4d44-b952-cf1a4db16b83",
            game_client_ability_id: 15,
            label: "Incognito",
            colour: "#006600",
            image_url: "https://afiles.ninja-cdn.com/supremacy-stream-site/assets/img/ability-incognito.png",
            description: "Block GABs radar technology from locating a War Machine's position, hiding it from the minimap.",
            text_colour: "#006600",
            location_select_type: LocationSelectType.MechSelect,
            created_at: new Date("2022-08-12T11:38:53.275945+08:00"),
            inventory_limit: 8,
            cooldown_seconds: 360,
        },
    },
    {
        id: "d348e52b-f16d-4304-b9a8-9d0047779b6e",
        blueprint_id: "763509dc-1c84-43a5-a068-46aaa1f47c53",
        amount_sold: 0,
        current_price: "10000000000000000000",
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
