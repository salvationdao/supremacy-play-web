import { Stack } from "@mui/material"
import { VoidFunctionComponent } from "react"
import { SvgWrapperProps } from "../../../../assets"
import { RarityEnum } from "../../../../types"

export interface LoadoutItem {
    name: string
    imageUrl: string
    tier?: RarityEnum
}

export const MechLoadout = ({ items, title, icon }: { items: LoadoutItem[]; title: string; icon: VoidFunctionComponent<SvgWrapperProps> }) => {
    return <Stack></Stack>
}
