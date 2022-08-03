import { MaskStylesObj } from "@reactour/mask"
import { PopoverStylesObj } from "@reactour/popover"
import { Styles, StylesObj } from "@reactour/tour/dist/styles"
import { colors, fonts, siteZIndex } from "../../../theme/theme"

export const tourStyles: (PopoverStylesObj & StylesObj & MaskStylesObj & Partial<Styles>) | undefined = {
    maskWrapper: (base) => ({
        ...base,
        zIndex: siteZIndex.Modal - 1,
        opacity: 0.9,
    }),
    popover: (base) => ({
        ...base,
        color: "#FFFFFF",
        backgroundColor: `${colors.navy}D9`,
        borderRadius: "5px",
        fontSize: "1.5rem",
        fontFamily: fonts.shareTech,
        lineHeight: 1.5,
        padding: "2.8rem 3rem",
        zIndex: siteZIndex.Modal,
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
