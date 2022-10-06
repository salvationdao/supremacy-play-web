import { Box, Fade, Typography } from "@mui/material"
import { useEffect, useImperativeHandle, useRef, useState } from "react"
import { Unity, useUnityContext } from "react-unity-webgl"
import { DEV_ONLY, WEBGL_BASE_URL } from "../../../../../constants"
import { useTheme } from "../../../../../containers/theme"
import { pulseEffect } from "../../../../../theme/keyframes"
import { fonts } from "../../../../../theme/theme"
import { ClipThing } from "../../../../Common/ClipThing"
import { LoadoutMechSkin, LoadoutPowerCore, LoadoutWeapon } from "../MechLoadout/MechLoadout"
import { MechViewerProps } from "./MechViewer"

export type UnityHandle = {
    handleWeaponUpdate: (wu: LoadoutWeapon) => void
    handlePowerCoreUpdate: (pcu: LoadoutPowerCore) => void
    handleMechSkinUpdate: (msu: LoadoutMechSkin) => void
}

export interface HangarSilo {
    faction: string
    silos?: SiloType[]
}

export interface SiloObject {
    type: string
    ownership_id?: string
    static_id?: string
    skin?: SiloSkin
}

export interface SiloType extends SiloObject {
    accessories?: SiloObject[]
    can_open_on?: Date
}

export interface SiloSkin {
    type: string
    static_id?: string
    ownership_id?: string
}

let baseUrl = WEBGL_BASE_URL
if (DEV_ONLY) {
    baseUrl += `staging/`
} else {
    baseUrl += process.env.REACT_APP_ENVIRONMENT + "/"
}

export interface UnityParams {
    unityRef: React.ForwardedRef<UnityHandle>
    onUnlock: () => void
}

interface UnityViewerProps extends MechViewerProps {
    unity: UnityParams
}

export const UnityViewer = ({ mechDetails, unity }: UnityViewerProps) => {
    const theme = useTheme()
    const { unityProvider, sendMessage, addEventListener, removeEventListener, isLoaded } = useUnityContext({
        loaderUrl: `${baseUrl}WebGL.loader.js`,
        dataUrl: `${baseUrl}/WebGL.data.br`,
        frameworkUrl: `${baseUrl}/WebGL.framework.js.br`,
        codeUrl: `${baseUrl}/WebGL.wasm.br`,
        streamingAssetsUrl: `${baseUrl}/StreamingAssets`,
    })
    const sent = useRef(false)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [siloReady, setSiloReady] = useState(false)
    const [isPendingChange, setIsPendingChange] = useState(false)
    const [showClickToLoadOverlay, setShowClickToLoadOverlay] = useState(true)

    // todo: unload unity viewer when this bug is fixed https://react-unity-webgl.dev/docs/api/unload

    useImperativeHandle(unity.unityRef, () => ({
        handleWeaponUpdate: (wu: LoadoutWeapon) => {
            const weapon = wu.weapon
            if (wu.unequip) {
                console.log("cleared", wu.slot_number)
                sendMessage("SceneContext", "ClearSelectedSlots", `[${wu.slot_number}]`)
            } else if (weapon) {
                const obj = {
                    type: "weapon",
                    ownership_id: weapon.id,
                    static_id: weapon.blueprint_id,
                    skin: weapon.weapon_skin
                        ? {
                              type: "skin",
                              static_id: weapon.weapon_skin.blueprint_id,
                          }
                        : undefined,
                } as SiloObject
                if (wu.inherit_skin && mechDetails.chassis_skin?.blueprint_weapon_skin_id) {
                    obj.skin = {
                        type: "skin",
                        static_id: mechDetails.chassis_skin.blueprint_weapon_skin_id,
                    }
                }
                sendMessage("SceneContext", "SetSlotIndexToChange", wu.slot_number)
                sendMessage("SceneContext", "ChangeSlotValue", JSON.stringify(obj))
            }
            setIsPendingChange(true)
        },
        handlePowerCoreUpdate: (pcu: LoadoutPowerCore) => {
            if (!pcu.power_core) return
            const powerCore = pcu.power_core
            const obj = {
                type: "power_core",
                ownership_id: powerCore.owner_id,
                static_id: powerCore.blueprint_id,
            } as SiloObject
            setIsPendingChange(true)
            console.log(obj)
        },
        handleMechSkinUpdate: (msu: LoadoutMechSkin) => {
            if (!msu.mech_skin) return
            const obj = {
                type: "skin",
                ownership_id: msu.mech_skin_id,
                static_id: msu.mech_skin.blueprint_id,
            } as SiloObject
            sendMessage("SceneContext", "ChangeMechSkin", JSON.stringify(obj))
            setIsPendingChange(true)
        },
    }))

    useEffect(() => {
        const handleMouseClick = () => {
            setShowClickToLoadOverlay(false)
        }
        window.addEventListener("click", handleMouseClick)
        return () => window.removeEventListener("click", handleMouseClick)
    }, [])

    useEffect(() => {
        const onSiloReady = () => setSiloReady(true)
        addEventListener("SiloReady", onSiloReady)
        return () => removeEventListener("SiloReady", onSiloReady)
    }, [addEventListener, removeEventListener])

    useEffect(() => {
        const onSlotLoaded = () => {
            console.log("slot unlocked")
            unity.onUnlock()
            setIsPendingChange(false)
        }
        addEventListener("SlotLoaded", onSlotLoaded)
        return () => removeEventListener("SlotLoaded", onSlotLoaded)
    }, [addEventListener, removeEventListener, unity])

    const isMouseDown = useRef(false)
    useEffect(() => {
        if (!isLoaded || !canvasRef.current) return

        const handleMouseUp = (event: MouseEvent) => {
            console.log("mouse up")
            if (event.button == 0 && isMouseDown.current) {
                isMouseDown.current = false
                sendMessage("FittingRoomPlayer", "OnMouseClick")
            }
        }
        const handleMouseDown = (event: MouseEvent) => {
            console.log("mouse down")
            if (event.button == 0) {
                isMouseDown.current = !isMouseDown.current
                sendMessage("FittingRoomPlayer", "OnMouseClick")
            }
        }
        const handleMouseWheel = (event: WheelEvent) => {
            console.log("mouse wheel")
            sendMessage("FittingRoomPlayer", "OnZoomChange", event.deltaY / -100)
        }

        const canvas = canvasRef.current
        canvas.addEventListener("mouseup", handleMouseUp)
        canvas.addEventListener("mousedown", handleMouseDown)
        canvas.addEventListener("wheel", handleMouseWheel)

        return () => {
            canvas.removeEventListener("mouseup", handleMouseUp)
            canvas.removeEventListener("mousedown", handleMouseDown)
            canvas.removeEventListener("wheel", handleMouseWheel)
        }
    }, [isLoaded, sendMessage])

    useEffect(() => {
        if (!isLoaded || !siloReady || sent.current) return

        const accessories: SiloObject[] = []
        for (let i = 0; i < mechDetails.weapon_hardpoints; i++) {
            accessories.push({
                type: "weapon",
            })
        }
        if (mechDetails.weapons) {
            mechDetails.weapons.forEach((w) => {
                if (w.slot_number == null) return
                // if (w.weapon_type === WeaponType.MissileLauncher) {
                //     accessories.splice(w.slot_number, 1)
                //     return
                // }
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
                if (w.inherit_skin && mechDetails.chassis_skin?.blueprint_weapon_skin_id) {
                    accessories[w.slot_number].skin = {
                        type: "skin",
                        static_id: mechDetails.chassis_skin.blueprint_weapon_skin_id,
                    }
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

        const mech: SiloType = {
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
        }
        const inventory: HangarSilo = {
            faction: mechDetails.faction_id,
            silos: [mech],
        }
        sendMessage("ProjectContext(Clone)", "GetPlayerInventoryFromPage", JSON.stringify(inventory))
        sendMessage("ProjectContext(Clone)", "FittingRoom")
        sent.current = true
    }, [
        sendMessage,
        isLoaded,
        siloReady,
        mechDetails.weapons,
        mechDetails.power_core,
        mechDetails.faction_id,
        mechDetails.owner_id,
        mechDetails.blueprint_id,
        mechDetails.chassis_skin,
        mechDetails.weapon_hardpoints,
        mechDetails.utility,
        mechDetails.utility_slots,
        mechDetails.id,
    ])

    return (
        <Box
            sx={{
                position: "relative",
                height: "100%",
                width: "100%",
            }}
        >
            <Unity
                ref={canvasRef}
                unityProvider={unityProvider}
                style={{
                    width: "100%",
                    height: "100%",
                }}
            />
            {showClickToLoadOverlay && (
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: theme.factionTheme.background,
                    }}
                >
                    <Typography
                        sx={{
                            fontFamily: fonts.nostromoBlack,
                            fontSize: "3rem",
                            textTransform: "uppercase",
                            color: "white",
                        }}
                    >
                        Click here to load 3D viewer
                    </Typography>
                </Box>
            )}
            <Fade in={isPendingChange} mountOnEnter unmountOnExit>
                <Box
                    sx={{
                        position: "absolute",
                        left: "5rem",
                        bottom: "5rem",
                    }}
                >
                    <ClipThing
                        border={{
                            borderColor: theme.factionTheme.primary,
                        }}
                        corners={{
                            topLeft: true,
                            bottomRight: true,
                        }}
                        backgroundColor={theme.factionTheme.background}
                        sx={{
                            animation: `${pulseEffect} 3s infinite`,
                            padding: "1rem",
                        }}
                    >
                        <Typography
                            sx={{
                                fontFamily: fonts.nostromoBlack,
                                fontSize: "3rem",
                            }}
                        >
                            Modifications In Progress
                        </Typography>
                    </ClipThing>
                </Box>
            </Fade>
        </Box>
    )
}
