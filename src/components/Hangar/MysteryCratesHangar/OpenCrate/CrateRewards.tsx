import { Box, Button, IconButton, Stack, Typography } from "@mui/material"
import { useLocation } from "react-router-dom"
import { SvgClose, SvgPowerCore } from "../../../../assets"
import { useTheme } from "../../../../containers/theme"
import { colors, fonts } from "../../../../theme/theme"
import { ClipThing } from "../../../Common/ClipThing"
import { FancyButton } from "../../../Common/FancyButton"
import { OpenCrateResponse } from "../../../../types"
import { useEffect, useState } from "react"
import { getRarityDeets } from "../../../../helpers"
import { LoadoutItem } from "../../WarMachinesHangar/WarMachineHangarItem/MechLoadout"

interface CrateRewardsProps {
    rewards: OpenCrateResponse
    onClose?: () => void
}

interface ArrayItem {
    id: string | undefined
    imageUrl: string | undefined
    type: string | undefined
    animationUrl: string | undefined
    avatarUrl: string | undefined
    label: string | undefined
    rarity?: string | undefined
}

export const CrateRewards = ({ rewards, onClose }: CrateRewardsProps) => {
    const theme = useTheme()
    const location = useLocation()
    const [arrayItems, setArrayItems] = useState<ArrayItem[]>([])

    useEffect(() => {
        let newArr = [...arrayItems]
        if (rewards.mech) {
            const mech: ArrayItem = {
                id: rewards.mech.id,
                imageUrl: rewards.mech.image_url,
                type: rewards.mech.item_type,
                animationUrl: rewards.mech.animation_url,
                avatarUrl: rewards.mech.avatar_url,
                label: rewards.mech.label,
            }

            newArr = [...arrayItems, mech]
        }

        if (rewards.mech_skin) {
            const mechSkin: ArrayItem = {
                id: rewards.mech_skin.id,
                imageUrl: rewards.mech_skin.image_url,
                type: rewards.mech_skin.item_type,
                animationUrl: rewards.mech_skin.animation_url,
                avatarUrl: rewards.mech_skin.avatar_url,
                label: rewards.mech_skin.label,
            }

            newArr = [...newArr, mechSkin]
        }

        if (rewards.weapon) {
            rewards.weapon.map((w) => {
                const weapon: ArrayItem = {
                    id: w.id,
                    imageUrl: w.image_url,
                    type: w.item_type,
                    animationUrl: w.animation_url,
                    avatarUrl: w.avatar_url,
                    label: w.label,
                }

                newArr = [...newArr, weapon]
            })
        }

        if (rewards.weapon_skin) {
            const weaponSkin: ArrayItem = {
                id: rewards.weapon_skin?.id,
                imageUrl: rewards.weapon_skin?.image_url,
                type: rewards.weapon_skin?.item_type,
                animationUrl: rewards.weapon_skin?.animation_url,
                avatarUrl: rewards.weapon_skin?.avatar_url,
                label: rewards.weapon_skin?.label,
            }

            newArr = [...newArr, weaponSkin]
        }

        // if (rewards.power_core) {
        // const powercore: ArrayItem = {
        //      id: rewards.power_core?.id,
        //     imageUrl: rewards.power_core?.image_url,
        //     type: rewards.power_core?.item_type,
        //     animationUrl: rewards.power_core?.animation_url,
        //     avatarUrl: rewards.power_core?.avatar_url,
        //     label: rewards.power_core?.label,
        // }
        //
        // newArr = [...newArr, powercore]
        //
        // }

        setArrayItems(newArr)
    }, [rewards])

    return (
        <ClipThing
            clipSize="10px"
            corners={{
                topRight: true,
                bottomLeft: true,
            }}
            border={{
                borderColor: theme.factionTheme.primary,
                borderThickness: ".3rem",
            }}
            sx={{ m: "4rem", width: "100%", height: "100%" }}
            backgroundColor={theme.factionTheme.background}
        >
            <Stack spacing="3rem" justifyContent="center" alignItems="center" sx={{ py: "5rem", px: "5.5rem", textAlign: "center" }}>
                <Typography variant={"h1"} sx={{ fontFamily: fonts.nostromoBlack, fontSize: "3rem" }}>
                    You have received:
                </Typography>

                {rewards.mech ? (
                    <MechCrateRewards items={arrayItems} />
                ) : (
                    <Stack direction={"row"} justifyContent={"space-between"} sx={{ mt: "1rem" }}>
                        {arrayItems.map((item) => (
                            <CrateItem key={item.id} sizeCI={"large"} item={item} />
                        ))}
                    </Stack>
                )}
                {/*<Carousel array={arrayItems} />*/}

                <FancyButton
                    clipThingsProps={{
                        clipSize: "9px",
                        backgroundColor: theme.factionTheme.primary,
                        opacity: 1,
                        border: { isFancy: true, borderColor: theme.factionTheme.primary, borderThickness: "2px" },
                        sx: { position: "relative", width: "32rem", mt: "auto" },
                    }}
                    sx={{ width: "100%", py: "1rem", color: theme.factionTheme.secondary }}
                    to={`/fleet/mystery-crates${location.hash}`}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            color: theme.factionTheme.secondary,
                            fontFamily: fonts.nostromoBlack,
                        }}
                    >
                        View in Hangar
                    </Typography>
                </FancyButton>
            </Stack>

            {onClose && (
                <IconButton size="small" onClick={onClose} sx={{ position: "absolute", top: "1rem", right: "1rem" }}>
                    <SvgClose size="3rem" sx={{ opacity: 0.1, ":hover": { opacity: 0.6 } }} />
                </IconButton>
            )}
        </ClipThing>
    )
}

const MechCrateRewards = ({ items }: { items: ArrayItem[] }) => {
    const largeItem = items.find((item) => (item.type = "mech"))
    return (
        <Stack direction={"row"}>
            <CrateItem sizeCI="large" item={largeItem} />
            <Stack>
                {items.map((item) => (
                    <CrateItem key={item.id} sizeCI="small" item={item} />
                ))}
            </Stack>
        </Stack>
    )
}

interface CrateItemLargeProps {
    item: ArrayItem | undefined
    sizeCI: "large" | "small"
}

const CrateItem = ({ item, sizeCI }: CrateItemLargeProps) => {
    const [rarityDeets, setRarityDeets] = useState<{
        label: string
        color: string
    }>()
    const theme = useTheme()
    const primaryColor = theme.factionTheme.primary
    useEffect(() => {
        setRarityDeets(item?.rarity ? getRarityDeets(item?.rarity) : undefined)
    }, [setRarityDeets, getRarityDeets, item?.rarity])

    return (
        <Stack direction={sizeCI === "large" ? "column" : "row"} alignItems={"center"} spacing="1rem" sx={{ flex: 1, my: "5rem" }}>
            {sizeCI === "large" ? (
                <Box
                    component={"img"}
                    src={sizeCI === "large" ? item?.imageUrl : item?.avatarUrl}
                    alt={item?.label}
                    sx={{ width: sizeCI === "large" ? "20rem" : "5rem", height: "auto", objectFit: "contain", objectPosition: "center" }}
                />
            ) : (
                <LoadoutItem
                    imageUrl={item?.avatarUrl}
                    videoUrl={item?.animationUrl}
                    Icon={<SvgPowerCore fill={colors.powerCore} size="1.3rem" />}
                    primaryColor={primaryColor}
                    tooltipText={item?.label}
                />
            )}

            <Stack>
                <Typography variant="h5" sx={{ fontFamily: fonts.nostromoBlack }}>
                    {item?.label}
                </Typography>
                {rarityDeets && (
                    <Typography
                        variant="body2"
                        sx={{
                            color: rarityDeets.color,
                            fontFamily: fonts.nostromoBlack,
                            display: "-webkit-box",
                            overflow: "hidden",
                            overflowWrap: "anywhere",
                            textOverflow: "ellipsis",
                            WebkitBoxOrient: "vertical",
                        }}
                    >
                        {rarityDeets.label}
                    </Typography>
                )}
            </Stack>
        </Stack>
    )
}

// interface CarouselProps<T> {
//     array: T[]
// }
// const Carousel = <T>({ array }: CarouselProps) => {
//     const maxIndex = array.length - 1
//     const [currentIndex, setCurrentIndex] = useState(0)
//     const [nextIndex, setNextIndex] = useState(1)
//     const [prevIndex, setPrevIndex] = useState(maxIndex)
//
//     useEffect(() => {
//         if (currentIndex === maxIndex) {
//             setNextIndex(0)
//             setPrevIndex(currentIndex - 1)
//         } else if (currentIndex === 0) {
//             setNextIndex(currentIndex + 1)
//             setPrevIndex(maxIndex)
//         } else {
//             setNextIndex(currentIndex + 1)
//             setPrevIndex(currentIndex - 1)
//         }
//     }, [currentIndex, maxIndex])
//
//     const handleNext = () => {
//         setCurrentIndex(nextIndex)
//     }
//     const handlePrev = () => {
//         setCurrentIndex(prevIndex)
//     }
//     console.log(array[prevIndex], array[currentIndex], array[nextIndex])
//
//     if (!array[prevIndex] || !array[currentIndex] || !array[nextIndex]) return null
//     return (
//         <Stack direction={"row"}>
//             <Button onClick={() => handlePrev()}>Prev</Button>
//             <CrateItem sizeCI={"large"} label={array[prevIndex].label} />
//             <CrateItem sizeCI={"large"} label={array[currentIndex].label} />
//             <CrateItem sizeCI={"large"} label={array[nextIndex].label} />
//             <Button onClick={() => handleNext()}>Next</Button>
//         </Stack>
//     )
// }
