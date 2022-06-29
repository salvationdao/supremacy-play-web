import { Box, IconButton, Modal, Stack, Typography } from "@mui/material"
import { useLocation } from "react-router-dom"
import { SvgClose } from "../../../../assets"
import { useTheme } from "../../../../containers/theme"
import { colors, fonts, siteZIndex } from "../../../../theme/theme"
import { ClipThing } from "../../../Common/ClipThing"
import { FancyButton } from "../../../Common/FancyButton"
import { OpenCrateResponse } from "../../../../types"
import { useEffect, useState } from "react"
import { getRarityDeets } from "../../../../helpers"
import { MediaPreview } from "../../../Common/MediaPreview/MediaPreview"

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
        console.log(arrayItems)
        let newArr: ArrayItem[] = []
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
    }, [rewards, setArrayItems])

    return (
        <Modal open onClose={onClose} sx={{ zIndex: siteZIndex.Modal }}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "70vw",
                    boxShadow: 6,
                    outline: "none",
                }}
            >
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
                    sx={{ m: "4rem", width: "100%" }}
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
                                    <CrateItemLarge key={item.id} item={item} />
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
            </Box>
        </Modal>
    )
}

const MechCrateRewards = ({ items }: { items: ArrayItem[] }) => {
    const largeItem = items.find((item) => (item.type = "mech"))

    return (
        <Stack direction={"row"} spacing={"2rem"}>
            <Box sx={{ minWidth: "40%" }}>
                <CrateItemLarge item={largeItem} />
            </Box>
            <Stack spacing={"1rem"} sx={{ height: "fit-content" }}>
                {items.map((item) => (
                    <CrateItemSmall key={item.id} item={item} />
                ))}
            </Stack>
        </Stack>
    )
}

interface CrateItemProps {
    item: ArrayItem | undefined
}

const CrateItemLarge = ({ item }: CrateItemProps) => {
    const [rarityDeets, setRarityDeets] = useState<{
        label: string
        color: string
    }>()

    const theme = useTheme()

    useEffect(() => {
        setRarityDeets(item?.rarity ? getRarityDeets(item?.rarity) : undefined)
    }, [setRarityDeets, getRarityDeets, item])

    return (
        <ClipThing
            clipSize="6px"
            border={{
                borderColor: theme.factionTheme.primary,
                isFancy: true,
                borderThickness: ".2rem",
            }}
            opacity={0.8}
            backgroundColor={colors.black3}
        >
            <Stack alignItems={"center"} spacing="1rem" sx={{ flex: 1, my: "5rem" }}>
                <Box sx={{ width: "100%", height: "auto" }}>
                    <MediaPreview imageUrl={item?.imageUrl || ""} videoUrls={[item?.animationUrl]} />
                </Box>

                <Stack>
                    <Typography variant="h5" sx={{ fontFamily: fonts.nostromoBlack }}>
                        {item?.label} {item?.type === "mech_skin" || item?.type === "weapon_skin" ? "Submodel" : ""}
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
        </ClipThing>
    )
}

const CrateItemSmall = ({ item }: CrateItemProps) => {
    const [rarityDeets, setRarityDeets] = useState<{
        label: string
        color: string
    }>()

    useEffect(() => {
        setRarityDeets(item?.rarity ? getRarityDeets(item?.rarity) : undefined)
    }, [setRarityDeets, getRarityDeets, item?.rarity])

    if (!item?.avatarUrl) return null
    return (
        <Stack direction={"row"} alignItems={"center"}>
            <Box sx={{ width: "7rem", height: "7rem" }}>
                <MediaPreview imageUrl={item?.avatarUrl || ""} videoUrls={[item?.animationUrl]} />
            </Box>

            <Stack>
                <Typography variant="h5" sx={{ fontFamily: fonts.nostromoBlack, textAlign: "left" }}>
                    {item?.label} {item?.type === "mech_skin" || item?.type === "weapon_skin" ? "Submodel" : ""}
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
