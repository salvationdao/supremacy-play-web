import { Box } from "@mui/material"
import React, { useEffect, useImperativeHandle, useRef, useState } from "react"
import { Unity, useUnityContext } from "react-unity-webgl"
import { DEV_ONLY, WEBGL_BASE_URL } from "../../../../constants"
import { useTheme } from "../../../../containers/theme"
import { MechDetails } from "../../../../types"
import { MediaPreview } from "../../../Common/MediaPreview/MediaPreview"
import { LoadoutMechSkin, LoadoutPowerCore, LoadoutWeapon } from "./MechLoadout"
import { HangarSilo, SiloObject } from "./MechViewer/UnityViewer"

let baseUrl = WEBGL_BASE_URL
if (DEV_ONLY) {
    baseUrl += `staging/`
} else {
    baseUrl += process.env.REACT_APP_ENVIRONMENT + "/"
}

export type UnityHandle = {
    handleWeaponUpdate: (wu: LoadoutWeapon) => void
    handlePowerCoreUpdate: (pcu: LoadoutPowerCore) => void
    handleMechSkinUpdate: (msu: LoadoutMechSkin) => void
}
interface MechViewerProps {
    mechDetails: MechDetails
    unity?: {
        onUnlock: () => void
    }
}

export const MechViewer = React.forwardRef<UnityHandle, MechViewerProps>(function MechViewer({ mechDetails, unity }, ref) {
    const theme = useTheme()
    const { unityProvider, sendMessage, addEventListener, removeEventListener, isLoaded } = useUnityContext({
        loaderUrl: `${baseUrl}WebGL.loader.js`,
        dataUrl: `${baseUrl}/WebGL.data.br`,
        frameworkUrl: `${baseUrl}/WebGL.framework.js.br`,
        codeUrl: `${baseUrl}/WebGL.wasm.br`,
        streamingAssetsUrl: `${baseUrl}/StreamingAssets`,
    })
    const sent = useRef(false)
    const [siloReady, setSiloReady] = useState(false)

    const backgroundColor = theme.factionTheme.background

    const skin = mechDetails.chassis_skin && mechDetails.default_chassis_skin
    const avatarUrl = skin?.avatar_url || mechDetails.avatar_url
    const imageUrl = skin?.image_url || mechDetails.image_url
    const largeImageUrl = skin?.large_image_url || mechDetails.large_image_url
    const animationUrl = skin?.animation_url || mechDetails.animation_url
    const cardAnimationUrl = skin?.card_animation_url || mechDetails.card_animation_url

    useImperativeHandle(ref, () => ({
        handleWeaponUpdate: (wu: LoadoutWeapon) => {
            const weapon = wu.weapon
            let obj = {
                type: "weapon",
                ownership_id: "",
                static_id: "",
                skin: {
                    type: "skin",
                    static_id: "",
                },
            } as SiloObject
            if (!wu.unequip && weapon) {
                obj = {
                    type: "weapon",
                    ownership_id: weapon.id,
                    static_id: weapon.blueprint_id,
                    skin: weapon.weapon_skin
                        ? {
                              type: "skin",
                              static_id: weapon.weapon_skin.blueprint_id,
                          }
                        : undefined,
                }
            }
            console.log(obj)
            sendMessage("SceneContext", "SetSlotIndexToChange", wu.slot_number)
            sendMessage("SceneContext", "ChangeSlotValue", JSON.stringify(obj))
        },
        handlePowerCoreUpdate: (pcu: LoadoutPowerCore) => {
            if (!pcu.power_core) return
            const powerCore = pcu.power_core
            const obj = {
                type: "power_core",
                ownership_id: powerCore.owner_id,
                static_id: powerCore.blueprint_id,
            } as SiloObject
            console.log(obj)
        },
        handleMechSkinUpdate: (msu: LoadoutMechSkin) => {
            if (!msu.mech_skin) return
        },
    }))

    useEffect(() => {
        const onSiloReady = () => setSiloReady(true)
        addEventListener("SiloReady", onSiloReady)
        return () => removeEventListener("SiloReady", onSiloReady)
    }, [addEventListener, removeEventListener])

    useEffect(() => {
        const onSlotLoaded = () => {
            console.log("slot unlocked")
            unity?.onUnlock()
        }
        addEventListener("SlotLoaded", onSlotLoaded)
        return () => removeEventListener("SlotLoaded", onSlotLoaded)
    }, [addEventListener, removeEventListener, unity])

    useEffect(() => {
        if (!isLoaded || !siloReady || sent.current) return

        const accessories: SiloObject[] = []
        for (let i = 0; i < mechDetails.weapon_hardpoints; i++) {
            accessories.push({
                type: "weapon",
                ownership_id: "",
                static_id: "",
                skin: {
                    type: "skin",
                    static_id: "",
                },
            })
        }
        if (mechDetails.weapons) {
            mechDetails.weapons.forEach((w) => {
                if (w.slot_number == null) return

                accessories[w.slot_number] = {
                    type: "weapon",
                    ownership_id: w.id,
                    static_id: w.blueprint_id,
                    skin: w.weapon_skin
                        ? {
                              type: "skin",
                              static_id: w.weapon_skin.blueprint_id,
                          }
                        : undefined,
                }
            })
        }
        // for (let i = 0; i < mechDetails.utility_slots; i++) {
        //     accessories.push({
        //         type: "utility",
        //         ownership_id: "",
        //         static_id: "",
        //     })
        // }
        // if (mechDetails.utility) {
        //     mechDetails.utility.forEach((u) => {
        //         if (u.slot_number == null) return

        //         accessories[mechDetails.weapon_hardpoints + u.slot_number] = {
        //             type: "utility",
        //             ownership_id: u.id,
        //             static_id: u.blueprint_id,
        //         }
        //     })
        // }
        accessories.push({
            type: "power_core",
            ownership_id: "",
            static_id: "",
        })
        if (mechDetails.power_core) {
            accessories[accessories.length - 1] = {
                type: "power_core",
                ownership_id: mechDetails.power_core.id,
                static_id: mechDetails.power_core.blueprint_id,
            }
        }

        const siloItems: HangarSilo = {
            faction: mechDetails.faction_id,
            silos: [
                {
                    type: "mech",
                    ownership_id: mechDetails.id,
                    static_id: mechDetails.blueprint_id,
                    skin: mechDetails.chassis_skin
                        ? {
                              type: "skin",
                              ownership_id: mechDetails.chassis_skin.owner_id,
                              static_id: mechDetails.chassis_skin.blueprint_id,
                          }
                        : undefined,
                    accessories,
                },
            ],
        }
        console.log(siloItems)
        sendMessage("ProjectContext(Clone)", "GetPlayerInventoryFromPage", JSON.stringify(siloItems))
        sendMessage("ProjectContext(Clone)", "FittingRoom", "")
        sent.current = true
    }, [sendMessage, isLoaded, siloReady, mechDetails.weapons, mechDetails.power_core, mechDetails.faction_id, mechDetails.owner_id, mechDetails.blueprint_id, mechDetails.chassis_skin, mechDetails.weapon_hardpoints, mechDetails.utility, mechDetails.utility_slots, mechDetails.id])

    return (
        <Box
            sx={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                overflow: "hidden",
                zIndex: 5,
            }}
        >
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    boxShadow: `inset 0 0 40px 40px ${backgroundColor}`,
                    zIndex: 2,
                }}
            />

            <Box
                sx={{
                    position: "absolute",
                    zIndex: 3,
                    aspectRatio: "1.1",
                    height: "80%",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    overflow: "hidden",
                }}
            >
                <FeatherFade color={backgroundColor} />
                {unity ? (
                    <Unity
                        unityProvider={unityProvider}
                        style={{
                            width: "100%",
                            height: "100%",
                            visibility: isLoaded ? "visible" : "hidden",
                        }}
                    />
                ) : (
                    <MediaPreview
                        imageUrl={largeImageUrl || imageUrl || avatarUrl}
                        videoUrls={[animationUrl, cardAnimationUrl]}
                        objectFit="cover"
                        blurBackground
                    />
                )}
            </Box>
        </Box>
    )
})

interface FeatherFadeProps {
    color: string
    featherSize?: string
    featherBlur?: string
}
export const FeatherFade = ({ color, featherBlur = "60px", featherSize = "50px" }: FeatherFadeProps) => {
    return (
        <Box
            sx={{
                position: "absolute",
                top: -1,
                bottom: -1,
                left: -1,
                right: -1,
                boxShadow: `0 0 ${featherBlur} ${featherSize} ${color}`,
                zIndex: 9,
            }}
        >
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    width: "100%",
                    height: "15rem",
                    background: `linear-gradient(to top, transparent 50%, ${color})`,
                }}
            />

            <Box
                sx={{
                    position: "absolute",
                    bottom: 0,
                    width: "100%",
                    height: "15rem",
                    background: `linear-gradient(to bottom, transparent 50%, ${color})`,
                }}
            />

            <Box
                sx={{
                    position: "absolute",
                    width: "15rem",
                    height: "100%",
                    background: `linear-gradient(to left, transparent 50%, ${color})`,
                }}
            />

            <Box
                sx={{
                    position: "absolute",
                    right: 0,
                    width: "15rem",
                    height: "100%",
                    background: `linear-gradient(to right, transparent 50%, ${color})`,
                }}
            />
        </Box>
    )
}
