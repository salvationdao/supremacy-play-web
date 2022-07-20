import { Box, Grow, IconButton, Modal, Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { SvgClose } from "../../../../assets"
import { useAuth, useSupremacy } from "../../../../containers"
import { useTheme } from "../../../../containers/theme"
import { fonts, siteZIndex } from "../../../../theme/theme"
import { OpenCrateResponse } from "../../../../types"
import { ClipThing } from "../../../Common/ClipThing"
import { FancyButton } from "../../../Common/FancyButton"
import { CrateRewardItemsLarge, CrateRewardItemsSmall } from "./CrateRewardItems"

interface CrateRewardsModalProps {
    openedRewards: OpenCrateResponse
    onClose?: () => void
}

export interface ArrayItem {
    id: string | undefined
    imageUrl: string | undefined
    type: string | undefined
    animationUrl: string | undefined
    avatarUrl: string | undefined
    label: string | undefined
    rarity?: string | undefined
}

export const CrateRewardsModal = ({ openedRewards, onClose }: CrateRewardsModalProps) => {
    const { getFaction } = useSupremacy()
    const { factionID } = useAuth()
    const theme = useTheme()
    const [arrayItems, setArrayItems] = useState<ArrayItem[]>([])

    const faction = useMemo(() => getFaction(factionID), [getFaction, factionID])

    useEffect(() => {
        let newArr: ArrayItem[] = []
        if (openedRewards.mech) {
            const mech: ArrayItem = {
                id: openedRewards.mech.id,
                imageUrl: openedRewards.mech.image_url,
                type: openedRewards.mech.item_type,
                animationUrl: openedRewards.mech.animation_url,
                avatarUrl: openedRewards.mech.avatar_url,
                label: openedRewards.mech.label,
                rarity: openedRewards.mech.tier,
            }

            newArr = [...newArr, mech]
        }

        if (openedRewards.mech_skin) {
            const mechSkin: ArrayItem = {
                id: openedRewards.mech_skin.id,
                imageUrl: openedRewards.mech_skin.image_url,
                type: openedRewards.mech_skin.item_type,
                animationUrl: openedRewards.mech_skin.animation_url,
                avatarUrl: openedRewards.mech_skin.avatar_url,
                label: openedRewards.mech_skin.label,
                rarity: openedRewards.mech_skin.tier,
            }

            newArr = [...newArr, mechSkin]
        }

        if (openedRewards.weapon) {
            openedRewards.weapon.map((w) => {
                const weapon: ArrayItem = {
                    id: w.id,
                    imageUrl: w.image_url,
                    type: w.item_type,
                    animationUrl: w.animation_url,
                    avatarUrl: w.avatar_url,
                    label: w.label,
                    rarity: w.tier,
                }

                newArr = [...newArr, weapon]
            })
        }

        if (openedRewards.weapon_skin) {
            const weaponSkin: ArrayItem = {
                id: openedRewards.weapon_skin.id,
                imageUrl: openedRewards.weapon_skin.image_url,
                type: openedRewards.weapon_skin.item_type,
                animationUrl: openedRewards.weapon_skin.animation_url,
                avatarUrl: openedRewards.weapon_skin.avatar_url,
                label: openedRewards.weapon_skin.label,
                rarity: openedRewards.weapon_skin.tier,
            }

            newArr = [...newArr, weaponSkin]
        }

        setArrayItems(newArr)
    }, [openedRewards, setArrayItems])

    return (
        <Modal open onClose={onClose} sx={{ zIndex: siteZIndex.Modal }}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    maxWidth: "110rem",
                    boxShadow: 6,
                    outline: "none",
                }}
            >
                <Grow in>
                    <Box>
                        <ClipThing
                            clipSize="8px"
                            border={{
                                borderColor: theme.factionTheme.primary,
                                borderThickness: ".3rem",
                            }}
                            sx={{ m: "4rem", width: "100%" }}
                            backgroundColor={theme.factionTheme.background}
                        >
                            <Stack spacing="3rem" justifyContent="center" alignItems="center" sx={{ position: "relative", py: "5rem", px: "5.5rem" }}>
                                {/* Background image */}
                                <Box
                                    sx={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        width: "100%",
                                        height: "100%",
                                        opacity: 0.2,
                                        background: `url(${faction.background_url})`,
                                        backgroundRepeat: "no-repeat",
                                        backgroundPosition: "center",
                                        backgroundSize: "cover",
                                        zIndex: -1,
                                    }}
                                />

                                <Typography variant={"h4"} sx={{ fontFamily: fonts.nostromoBlack }}>
                                    You have received:
                                </Typography>

                                {openedRewards.mech ? <MechCrateRewards items={arrayItems} /> : <WeaponCrateRewards items={arrayItems} />}

                                <FancyButton
                                    clipThingsProps={{
                                        clipSize: "9px",
                                        backgroundColor: theme.factionTheme.primary,
                                        opacity: 1,
                                        border: { isFancy: true, borderColor: theme.factionTheme.primary, borderThickness: "2px" },
                                        sx: { position: "relative", width: "32rem", mt: "auto" },
                                    }}
                                    sx={{ width: "100%", py: "1rem", color: theme.factionTheme.secondary }}
                                    to={`/fleet/${openedRewards.mech ? "war-machines" : "weapons"}`}
                                >
                                    <Typography
                                        sx={{
                                            color: theme.factionTheme.secondary,
                                            fontFamily: fonts.nostromoBlack,
                                        }}
                                    >
                                        VIEW IN FLEET
                                    </Typography>
                                </FancyButton>
                            </Stack>

                            {onClose && (
                                <IconButton size="small" onClick={onClose} sx={{ position: "absolute", top: "1rem", right: "1rem" }}>
                                    <SvgClose size="2.6rem" sx={{ opacity: 0.1, ":hover": { opacity: 0.6 } }} />
                                </IconButton>
                            )}
                        </ClipThing>
                    </Box>
                </Grow>
            </Box>
        </Modal>
    )
}

const MechCrateRewards = ({ items }: { items: ArrayItem[] }) => {
    const largeItem = items.find((item) => (item.type = "mech"))

    return (
        <Stack direction="row" spacing="2.2rem" alignItems={"center"}>
            <CrateRewardItemsLarge item={largeItem} />
            <Stack spacing={"1rem"}>
                {items.map((item) => (
                    <CrateRewardItemsSmall key={item.id} item={item} />
                ))}
            </Stack>
        </Stack>
    )
}

const WeaponCrateRewards = ({ items }: { items: ArrayItem[] }) => {
    return (
        <Stack direction="row" spacing="2.2rem" justifyContent={"space-between"} sx={{ mt: "1rem" }}>
            {items.map((item) => (
                <Box key={item.id} sx={{ flex: "1 0 0" }}>
                    <CrateRewardItemsLarge item={item} />
                </Box>
            ))}
        </Stack>
    )
}
