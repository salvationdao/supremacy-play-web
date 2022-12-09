import { Box, Stack } from "@mui/material"
import { SvgLoadoutSkin } from "../../../../assets"
import { getRarityDeets } from "../../../../helpers"
import { Weapon } from "../../../../types"
import { MechLoadoutItem } from "../../WarMachinesHangar/Common/MechLoadoutItem"

export const WeaponLoadout = ({ weaponDetails }: { weaponDetails: Weapon }) => {
    const skin = weaponDetails.weapon_skin

    return (
        <Box
            sx={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                overflow: "hidden",
                zIndex: 6,
            }}
        >
            {/* Left side */}
            <Stack
                flexWrap="wrap"
                sx={{
                    position: "absolute",
                    top: "5rem",
                    bottom: "5rem",
                    left: "6rem",
                }}
            >
                {skin ? (
                    <MechLoadoutItem
                        backgroundImageUrl={weaponDetails.brand?.logo_url}
                        imageUrl={skin.image_url || skin.avatar_url}
                        label={skin.label}
                        Icon={SvgLoadoutSkin}
                        rarity={getRarityDeets(skin.tier)}
                    />
                ) : (
                    <MechLoadoutItem label="SKIN" onClick={() => console.log("AAAAA")} isEmpty disabled />
                )}
            </Stack>
        </Box>
    )
}
