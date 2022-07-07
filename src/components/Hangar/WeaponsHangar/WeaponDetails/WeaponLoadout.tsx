import { Box, Stack } from "@mui/material"
import { SvgSkin } from "../../../../assets"
import { getRarityDeets } from "../../../../helpers"
import { colors } from "../../../../theme/theme"
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
                        imageUrl={skin.image_url}
                        label={skin.label}
                        primaryColor={colors.chassisSkin}
                        Icon={SvgSkin}
                        rarity={getRarityDeets(skin.tier)}
                    />
                ) : (
                    <MechLoadoutItem label="WEAPON SUBMODEL" primaryColor={colors.chassisSkin} onClick={() => console.log("AAAAA")} isEmpty />
                )}
            </Stack>
        </Box>
    )
}
