import { Box, Grow, IconButton, Modal, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useState } from "react"
import { SvgClose } from "../../../assets"
import { useAuth, useGlobalNotifications, useSupremacy } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { useGameServerCommandsFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { fonts, siteZIndex } from "../../../theme/theme"
import { AssetItemType, MechSkin, MysteryCrate, MysteryCrateType, OpenCrateResponse, StorefrontMysteryCrate, WeaponSkin } from "../../../types"
import { ClipThing } from "../../Common/Deprecated/ClipThing"
import { FancyButton } from "../../Common/Deprecated/FancyButton"
import { OpeningCrate } from "../FleetCrates"
import { CrateRewardItemsLarge, CrateRewardItemsSmall } from "./CrateRewardItems"

interface CrateRewardsModalProps {
    openedRewards: OpenCrateResponse
    onClose?: () => void
    setOpeningCrate: React.Dispatch<React.SetStateAction<OpeningCrate | undefined>>
    setOpenedRewards: React.Dispatch<React.SetStateAction<OpenCrateResponse | undefined>>
    futureCratesToOpen: (StorefrontMysteryCrate | MysteryCrate)[]
    setFutureCratesToOpen: React.Dispatch<React.SetStateAction<(StorefrontMysteryCrate | MysteryCrate)[]>>
}

export interface ArrayItem {
    id?: string
    imageUrl?: string
    largeImageUrl?: string
    type?: AssetItemType
    animationUrl?: string
    cardAnimationUrl?: string
    avatarUrl?: string
    label?: string
    rarity?: string
    skin?: MechSkin | WeaponSkin
}

export const CrateRewardsModal = ({
    openedRewards,
    onClose,
    setOpeningCrate,
    setOpenedRewards,
    futureCratesToOpen,
    setFutureCratesToOpen,
}: CrateRewardsModalProps) => {
    const { getFaction } = useSupremacy()
    const { newSnackbarMessage } = useGlobalNotifications()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const { factionID } = useAuth()
    const theme = useTheme()
    const [loading, setLoading] = useState(false)
    const [arrayItems, setArrayItems] = useState<ArrayItem[]>([])

    const validFutureCrates = futureCratesToOpen.filter((c) => c.id !== openedRewards.id)
    const faction = useMemo(() => getFaction(factionID), [getFaction, factionID])

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            // Skip video on keyboard key press
            if (e.key === "Enter" || e.key === " ") {
                onClose && onClose()
                e.stopPropagation()
                e.preventDefault()
            }
        }

        const cleanup = () => {
            document.removeEventListener("keydown", onKeyDown)
        }

        cleanup()
        document.addEventListener("keydown", onKeyDown)

        return cleanup
    }, [onClose])

    const openNextCrate = useCallback(async () => {
        try {
            if (!validFutureCrates || validFutureCrates.length <= 0) return
            const crateToOpen = validFutureCrates[0]
            const remainCrates = validFutureCrates.slice(1)

            setOpeningCrate({
                factionID: crateToOpen.faction_id,
                crateType: crateToOpen.label.toLowerCase().includes("weapon") ? MysteryCrateType.Weapon : MysteryCrateType.Mech,
            })

            setLoading(true)

            const resp = await send<OpenCrateResponse>(GameServerKeys.OpenCrate, {
                id: crateToOpen.id,
            })

            if (!resp) return
            setOpenedRewards({ ...resp })
            setFutureCratesToOpen(remainCrates)
        } catch (e) {
            const message = typeof e === "string" ? e : "Failed to get mystery crates."
            newSnackbarMessage(message, "error")
            console.error(message)
        } finally {
            setLoading(false)
        }
    }, [validFutureCrates, setOpeningCrate, send, setOpenedRewards, setFutureCratesToOpen, newSnackbarMessage])

    useEffect(() => {
        let newArr: ArrayItem[] = []
        if (openedRewards.mech) {
            const skin = openedRewards.mech_skins?.find((s) => s.equipped_on === openedRewards.mech?.id)
            const mech: ArrayItem = {
                id: openedRewards.mech.id,
                imageUrl: openedRewards.mech.image_url,
                largeImageUrl: openedRewards.mech.large_image_url,
                type: openedRewards.mech.item_type,
                animationUrl: openedRewards.mech.animation_url,
                cardAnimationUrl: openedRewards.mech.card_animation_url,
                avatarUrl: openedRewards.mech.avatar_url,
                label: openedRewards.mech.label,
                rarity: openedRewards.mech.tier,
                skin,
            }

            newArr = [...newArr, mech]
        }

        if (openedRewards.weapon) {
            openedRewards.weapon.map((weapon) => {
                const skin = openedRewards.weapon_skins?.find((s) => s.equipped_on === weapon.id)
                const newItem: ArrayItem = {
                    id: weapon.id,
                    imageUrl: weapon.image_url,
                    largeImageUrl: weapon.large_image_url,
                    type: weapon.item_type,
                    animationUrl: weapon.animation_url,
                    cardAnimationUrl: weapon.card_animation_url,
                    avatarUrl: weapon.avatar_url,
                    label: weapon.label,
                    rarity: weapon.tier,
                    skin,
                }

                newArr = [...newArr, newItem]
            })
        }

        if (openedRewards.mech_skins) {
            openedRewards.mech_skins.map((mechSkin) => {
                if (mechSkin.equipped_on) return
                const newItem: ArrayItem = {
                    id: mechSkin.id,
                    imageUrl: mechSkin.image_url,
                    largeImageUrl: mechSkin.large_image_url,
                    type: mechSkin.item_type,
                    animationUrl: mechSkin.animation_url,
                    cardAnimationUrl: mechSkin.card_animation_url,
                    avatarUrl: mechSkin.avatar_url,
                    label: mechSkin.label,
                    rarity: mechSkin.tier,
                }

                newArr = [...newArr, newItem]
            })
        }

        if (openedRewards.weapon_skins) {
            openedRewards.weapon_skins.map((weaponSkin) => {
                if (weaponSkin.equipped_on) return
                const newItem: ArrayItem = {
                    id: weaponSkin.id,
                    imageUrl: weaponSkin.image_url,
                    largeImageUrl: weaponSkin.large_image_url,
                    type: weaponSkin.item_type,
                    animationUrl: weaponSkin.animation_url,
                    cardAnimationUrl: weaponSkin.card_animation_url,
                    avatarUrl: weaponSkin.avatar_url,
                    label: weaponSkin.label,
                    rarity: weaponSkin.tier,
                }

                newArr = [...newArr, newItem]
            })
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
                                        opacity: 0.08,
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

                                <Stack alignItems="center" spacing="1.4rem" sx={{ mt: "auto" }}>
                                    {validFutureCrates && validFutureCrates.length > 0 ? (
                                        <FancyButton
                                            loading={loading}
                                            clipThingsProps={{
                                                clipSize: "9px",
                                                backgroundColor: theme.factionTheme.primary,
                                                opacity: 1,
                                                border: { isFancy: true, borderColor: theme.factionTheme.primary, borderThickness: "2px" },
                                                sx: { position: "relative", width: "32rem" },
                                            }}
                                            sx={{ width: "100%", py: "1rem", color: theme.factionTheme.text }}
                                            onClick={openNextCrate}
                                        >
                                            <Typography
                                                sx={{
                                                    color: theme.factionTheme.text,
                                                    fontFamily: fonts.nostromoBlack,
                                                }}
                                            >
                                                OPEN NEXT CRATE
                                            </Typography>
                                        </FancyButton>
                                    ) : (
                                        <FancyButton
                                            loading={loading}
                                            clipThingsProps={{
                                                clipSize: "9px",
                                                backgroundColor: theme.factionTheme.primary,
                                                opacity: 1,
                                                border: { isFancy: true, borderColor: theme.factionTheme.primary, borderThickness: "2px" },
                                                sx: { position: "relative", width: "32rem" },
                                            }}
                                            sx={{ width: "100%", py: "1rem", color: theme.factionTheme.text }}
                                            to="/storefront/mystery-crates"
                                            onClick={onClose}
                                        >
                                            <Typography
                                                sx={{
                                                    color: theme.factionTheme.text,
                                                    fontFamily: fonts.nostromoBlack,
                                                }}
                                            >
                                                BUY CRATES
                                            </Typography>
                                        </FancyButton>
                                    )}

                                    <FancyButton
                                        clipThingsProps={{
                                            clipSize: "9px",
                                            backgroundColor: theme.factionTheme.background,
                                            opacity: 1,
                                            border: { borderColor: theme.factionTheme.primary, borderThickness: "2px" },
                                            sx: { position: "relative", width: "32rem" },
                                        }}
                                        sx={{ width: "100%", py: "1rem", color: theme.factionTheme.text }}
                                        onClick={onClose}
                                    >
                                        <Typography
                                            sx={{
                                                color: theme.factionTheme.primary,
                                                fontFamily: fonts.nostromoBlack,
                                            }}
                                        >
                                            CLOSE
                                        </Typography>
                                    </FancyButton>
                                </Stack>
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
    const mechs = items.filter((item) => item.type === "mech")
    const notMechs = items.filter((item) => item.type !== "mech")

    return (
        <Stack direction="row" spacing="2rem" alignItems={"center"}>
            {mechs.length > 0 && <CrateRewardItemsLarge item={mechs[0]} largerVersion />}
            <Stack spacing=".5rem">
                {[...mechs.slice(1), ...notMechs].map((item) => (
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
