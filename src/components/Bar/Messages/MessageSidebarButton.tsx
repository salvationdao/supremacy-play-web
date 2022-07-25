import { Button } from "@mui/material"
import React from "react"

export interface MessageSidebarButtonProps {
    children: React.ReactNode
    onSelect: () => void
    selected: boolean
}

export const MessageSidebarButton = ({ onSelect, selected, children }: MessageSidebarButtonProps) => {
    return <Button onClick={() => onSelect()}>{children}</Button>
}
