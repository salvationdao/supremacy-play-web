import { Box, Grow, IconButton, Modal, Stack, Typography } from "@mui/material"
import { SvgClose } from "../../../../assets"
import { useTheme } from "../../../../containers/theme"
import { fonts, siteZIndex } from "../../../../theme/theme"
import { ClipThing } from "../../../Common/ClipThing"
import { FancyButton } from "../../../Common/FancyButton"
import { OpenCrateResponse } from "../../../../types"
import { useEffect, useState } from "react"
import { CrateRewardItemsLarge, CrateRewardItemsSmall } from "./CrateRewardItems"

interface CrateRewardsModalProps {
    rewards: OpenCrateResponse
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

export const CrateRewardsModal = ({ rewards, onClose }: CrateRewardsModalProps) => {
    const theme = useTheme()
    const [arrayItems, setArrayItems] = useState<ArrayItem[]>([])

    useEffect(() => {
        let newArr: ArrayItem[] = []
        if (rewards.mech) {
            const mech: ArrayItem = {
                id: rewards.mech.id,
                imageUrl: rewards.mech.image_url,
                type: rewards.mech.item_type,
                animationUrl: rewards.mech.animation_url,
                avatarUrl: rewards.mech.avatar_url,
                label: rewards.mech.label,
                rarity: rewards.mech.tier,
            }

            newArr = [...newArr, mech]
        }

        if (rewards.mech_skin) {
            const mechSkin: ArrayItem = {
                id: rewards.mech_skin.id,
                imageUrl: rewards.mech_skin.image_url,
                type: rewards.mech_skin.item_type,
                animationUrl: rewards.mech_skin.animation_url,
                avatarUrl: rewards.mech_skin.avatar_url,
                label: rewards.mech_skin.label,
                rarity: rewards.mech_skin.tier,
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
                    rarity: w.tier,
                }

                newArr = [...newArr, weapon]
            })
        }

        if (rewards.weapon_skin) {
            const weaponSkin: ArrayItem = {
                id: rewards.weapon_skin.id,
                imageUrl: rewards.weapon_skin.image_url,
                type: rewards.weapon_skin.item_type,
                animationUrl: rewards.weapon_skin.animation_url,
                avatarUrl: rewards.weapon_skin.avatar_url,
                label: rewards.weapon_skin.label,
                rarity: rewards.weapon_skin.tier,
            }

            newArr = [...newArr, weaponSkin]
        }

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
                            <Stack spacing="3rem" justifyContent="center" alignItems="center" sx={{ py: "5rem", px: "5.5rem" }}>
                                <Typography variant={"h4"} sx={{ fontFamily: fonts.nostromoBlack }}>
                                    You have received:
                                </Typography>

                                {rewards.mech ? <MechCrateRewards items={arrayItems} /> : <WeaponCrateRewards items={arrayItems} />}

                                <FancyButton
                                    clipThingsProps={{
                                        clipSize: "9px",
                                        backgroundColor: theme.factionTheme.primary,
                                        opacity: 1,
                                        border: { isFancy: true, borderColor: theme.factionTheme.primary, borderThickness: "2px" },
                                        sx: { position: "relative", width: "32rem", mt: "auto" },
                                    }}
                                    sx={{ width: "100%", py: "1rem", color: theme.factionTheme.secondary }}
                                    to={`/fleet/${rewards.mech ? "war-machines" : "weapons"}`}
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
