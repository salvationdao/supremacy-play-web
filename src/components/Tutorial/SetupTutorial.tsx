import { MaskStylesObj } from "@reactour/mask"
import { PopoverStylesObj } from "@reactour/popover"
import { Styles, StylesObj } from "@reactour/tour/dist/styles"
import { colors, fonts, siteZIndex } from "../../theme/theme"

export const tourStyles: (PopoverStylesObj & StylesObj & MaskStylesObj & Partial<Styles>) | undefined = {
    maskWrapper: (base) => ({
        ...base,
        zIndex: siteZIndex.Modal - 1,
        opacity: 0.9,
    }),
    popover: (base, state) => ({
        ...base,
        ...doArrow(state?.position, state?.verticalAlign, state?.horizontalAlign),
        margin: "0 2rem",
        color: "#FFFFFF",
        backgroundColor: `${colors.navy}D9`,
        borderRadius: "5px",
        fontSize: "3rem",
        fontFamily: fonts.rajdhaniMedium,
        lineHeight: 1.5,
        padding: "2.8rem 3rem",
        zIndex: siteZIndex.Modal,
        userSelect: "none",
        "& button:hover, & svg:hover": {
            fill: "#FFFFFF",
            color: "#FFFFFF",
        },
    }),
    dot: (base) => ({
        ...base,
        backgroundColor: `${colors.lightGrey}`,
        borderColor: colors.darkNavy,
    }),
}

interface TourArrow {
    [key: string]: string
}
const opositeSide: TourArrow = {
    top: "bottom",
    bottom: "top",
    right: "left",
    left: "right",
}

function doArrow(position: string, verticalAlign: TourArrow, horizontalAlign: string) {
    if (!position || position === "custom") {
        return {}
    }

    const width = 16
    const height = 12
    const color = "white"
    const isVertical = position === "top" || position === "bottom"
    const spaceFromSide = 10

    const obj = {
        [`--rtp-arrow-${isVertical ? opositeSide[horizontalAlign] : verticalAlign}`]: height + spaceFromSide + "px",
        [`--rtp-arrow-${opositeSide[position]}`]: -height + 2 + "px",
        [`--rtp-arrow-border-${isVertical ? "left" : "top"}`]: `${width / 2}px solid transparent`,
        [`--rtp-arrow-border-${isVertical ? "right" : "bottom"}`]: `${width / 2}px solid transparent`,
        [`--rtp-arrow-border-${position}`]: `${height}px solid ${color}`,
    }
    return obj
}
