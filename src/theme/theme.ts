import { FactionTheme } from "@mui/material"
import { red } from "@mui/material/colors"
import { createTheme } from "@mui/material/styles"
import "./global.css"

// Had to keep the declare in this file for it to work
declare module "@mui/material/styles" {
    interface Theme {
        factionTheme: FactionTheme
    }

    interface ThemeOptions {
        factionTheme?: FactionTheme
    }

    export interface FactionTheme {
        primary: string
        text: string
        background: string
        contrast_primary: string
        contrast_background: string
        s100: string
        s200: string
        s300: string
        s400: string
        s500: string
        s600: string
        s700: string
        s800: string
        s900: string
        u700: string
        u800: string
        u900: string
    }
    // allow configuration using `createTheme`
    interface FactionThemeOptions {
        primary?: string
        text?: string
        background?: string
        contrast_primary?: string
        contrast_background?: string
        s100?: string
        s200?: string
        s300?: string
        s400?: string
        s500?: string
        s600?: string
        s700?: string
        s800?: string
        s900?: string
        u700?: string
        u800?: string
        u900?: string
    }
}

export const colors = {
    text: "#FFFFFF",
    offWhite: "#D4FFFF",
    red: "#D93434",
    niceRed: "#FF2C14",
    lightRed: "#E83200",
    darkRed: "#BA1300",
    green: "#2BA172",
    yellow: "#FFC800",
    orange: "#E04F00",
    gold: "#FFC400",
    silver: "#C1F3F7",
    bronze: "#CB7431",
    blue: "#0074D9",
    blue2: "#309FFF",
    purple: "#9A73F5",
    black2: "#13161B",
    notStaked: "#50B1DE",

    lightNeonBlue: "#8DE9FF",
    neonBlue: "#3DE0E0",
    darkerNeonBlue: "#073339",
    darkestNeonBlue: "#050c12",
    darkNavyBlue: "#0C0C1A",

    navy: "#2A2A40",
    darkNavy: "#101019",
    darkerNavy: "#08080C",

    health: "#BFF600",
    shield: "#00F7F7",

    lightGrey: "#999999",
    grey: "#777777",
    darkGrey: "#444444",

    // Transactions
    supsCredit: "#01FF70",
    supsDebit: "#FF4136",

    // Market
    buyout: "#309FFF",
    auction: "#E04F00",
    dutchAuction: "#D98D00",
    marketSold: "#2BA172",
    marketCreate: "#E6C85C",
    marketBidReturned: "#CC3F3F",

    repair: "#EA8622",

    // Mech loadout
    chassisSkin: "#D4AA13",
    introAnimation: "#B63DD4",
    outroAnimation: "#B63DD4",
    weapons: "#EB2300",
    utilities: "#5DC437",
    powerCore: "#009CBF",

    universal: {
        u700: "#251B30",
        u800: "#0D0415",
        u900: "#010001",
    },

    rarity: {
        MEGA: "#e84234",
        COLOSSAL: "#b43328",
        RARE: "#4d90fa",
        LEGENDARY: "#fabd4d",
        ELITE_LEGENDARY: "#ffcc4e",
        ULTRA_RARE: "#4e57ff",
        EXOTIC: "#824dff",
        GUARDIAN: "#4dcfff",
        MYTHIC: "#a1e6ff",
        DEUS_EX: "#fffa4e",
        TITAN: "#5eff75",
    },
}

const factionTheme: FactionTheme = {
    primary: "#00FAFA",
    text: "#ffffff",
    background: "#001919",
    contrast_primary: "#00FAFA",
    contrast_background: "#001919",
    s100: "#ccfefe",
    s200: "#80fdfd",
    s300: "#33fbfb",
    s400: "#00fafa",
    s500: "#00c8c8",
    s600: "#006464",
    s700: "#004b4b",
    s800: "#003232",
    s900: "#001919",
    u700: colors.universal.u700,
    u800: colors.universal.u800,
    u900: colors.universal.u900,
}

export const fonts = {
    nostromoHeavy: ["Nostromo Regular Heavy", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
    nostromoBlack: ["Nostromo Regular Black", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
    nostromoBold: ["Nostromo Regular Bold", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
    nostromoMedium: ["Nostromo Regular Medium", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
    nostromoLight: ["Nostromo Regular Light", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
    shareTech: ["Share Tech", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
    shareTechMono: ["Share Tech Mono", "monospace"].join(","),
    rajdhaniLight: ["Rajdhani Light", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
    rajdhaniRegular: ["Rajdhani Regular", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
    rajdhaniMedium: ["Rajdhani Medium", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
    rajdhaniSemibold: ["Rajdhani Semibold", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
    rajdhaniBold: ["Rajdhani Bold", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
}

export enum siteZIndex {
    // Shows on top of everything
    Tooltip = 900,
    TopBar = 800,
    MainMenuModal = 700,
    Popover = 500,
    Modal = 500,
    Drawer = 400,

    // Stream site top elements
    RoutePage = 101,

    // Battle areana
    Controls = 70,
    BattleHistory = 70,
    Trailer = 69,
    MoveableResizableHover = 51,
    MoveableResizable = 42,
    Notifications = 40,
    MechStats = 30,
    Stream = 5,
}

export const theme = createTheme({
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1536,
        },
    },
    palette: {
        mode: "dark",
        secondary: {
            main: colors.darkerNeonBlue,
        },
        success: {
            main: colors.yellow,
        },
        error: {
            main: red.A400,
        },
        background: {
            default: "#FFFFFF",
        },
        text: {
            primary: colors.text,
            secondary: colors.offWhite,
        },
    },
    typography: {
        htmlFontSize: 16,
        h1: {
            fontFamily: fonts.nostromoBlack,
            fontSize: "8.18rem",
            lineHeight: 1.5,
        },
        h2: {
            fontFamily: fonts.nostromoBold,
            fontSize: "5.15rem",
            lineHeight: 1.5,
        },
        h3: {
            fontFamily: fonts.rajdhaniMedium,
            letterSpacing: ".8px",
            fontSize: "4.13rem",
            lineHeight: 1.5,
        },
        h4: {
            fontFamily: fonts.rajdhaniMedium,
            letterSpacing: ".8px",
            fontSize: "2.96rem",
            lineHeight: 1.5,
        },
        h5: {
            fontFamily: fonts.rajdhaniMedium,
            letterSpacing: ".8px",
            fontSize: "2.13rem",
            lineHeight: 1.5,
        },
        h6: {
            fontFamily: fonts.rajdhaniMedium,
            letterSpacing: ".8px",
            fontSize: "1.82rem",
            lineHeight: 1.5,
        },
        body1: {
            // this is the default variant
            fontFamily: fonts.rajdhaniMedium,
            letterSpacing: ".8px",
            fontSize: "1.7rem",
            lineHeight: 1.5,
        },
        body2: {
            fontFamily: fonts.rajdhaniMedium,
            letterSpacing: ".8px",
            fontSize: "1.5rem",
            lineHeight: 1.5,
        },
        subtitle1: {
            fontFamily: fonts.rajdhaniMedium,
            letterSpacing: ".8px",
            fontSize: "1.34rem",
            lineHeight: 1.5,
        },
        subtitle2: {
            fontFamily: fonts.rajdhaniMedium,
            letterSpacing: ".8px",
            fontSize: "1.18rem",
            lineHeight: 1.5,
        },
        caption: {
            fontFamily: fonts.rajdhaniMedium,
            letterSpacing: "1px",
            fontSize: "1.25rem",
            lineHeight: 1.5,
        },
    },
    components: {
        MuiButtonBase: {
            defaultProps: {
                disableRipple: true,
            },
            styleOverrides: {
                root: {
                    fontSize: "1.18013rem",
                    transition: "all .1s",
                    ":hover": {
                        opacity: 0.76,
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    fontSize: "1.18013rem",
                },
            },
        },
        MuiTypography: {
            defaultProps: {
                color: "text.primary",
            },
            styleOverrides: {
                caption: {
                    display: "block",
                },
            },
        },
        MuiDialog: {
            defaultProps: {
                disablePortal: false,
            },
        },
        MuiPopover: {
            defaultProps: {
                disablePortal: false,
            },
            styleOverrides: {
                root: {
                    zIndex: siteZIndex.Popover,

                    ".MuiPaper-root": {
                        backgroundImage: "unset",
                        boxShadow: 0,
                        borderRadius: 0,
                    },
                },
            },
        },
        MuiLink: {
            defaultProps: {
                color: colors.neonBlue,
            },
            styleOverrides: {
                root: {
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                },
            },
        },
        MuiSkeleton: {
            defaultProps: {
                animation: "wave",
            },
        },
        MuiPagination: {
            defaultProps: {
                size: "medium",
                showFirstButton: true,
                showLastButton: true,
            },
            styleOverrides: {
                root: {
                    ".MuiPagination-ul": {
                        justifyContent: "center",
                    },
                    ".MuiButtonBase-root": {
                        fontFamily: fonts.nostromoBold,
                        minWidth: "25px",
                        height: "25px",
                    },
                    ".MuiSvgIcon-root": {
                        fontSize: "1.8rem",
                    },
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    fontFamily: fonts.nostromoBlack,
                    color: "white",
                },
            },
        },
        MuiCheckbox: {
            defaultProps: {
                size: "small",
            },
            styleOverrides: {
                root: {
                    width: "fit-content",
                    padding: "0 !important",
                    color: "#FFFFFF90",
                    borderRadius: 0,
                    "& > .MuiSvgIcon-root": { width: "2.6rem", height: "2.6rem" },
                    ".MuiSvgIcon-root": { transform: "scale(1.1)", transformOrigin: "left" },
                    "&.Mui-checked > .MuiSvgIcon-root": { fill: `${colors.neonBlue}` },
                    ".Mui-checked+.MuiSwitch-track": { backgroundColor: `${colors.neonBlue}50` },
                    "&.MuiCheckbox-indeterminate > .MuiSvgIcon-root": { color: colors.neonBlue },
                },
            },
        },
        MuiSwitch: {
            defaultProps: {
                size: "small",
                focusVisibleClassName: ".Mui-focusVisible",
                disableRipple: true,
            },
            styleOverrides: {
                root: {
                    width: 30,
                    height: 15,
                    padding: 0,
                    "& .MuiSwitch-switchBase": {
                        padding: 0,
                        margin: "2px",
                        transitionDuration: "300ms",
                        "&.Mui-checked": {
                            transform: "translateX(15px)",
                            color: colors.neonBlue,
                            "& + .MuiSwitch-track": {
                                backgroundColor: `${colors.neonBlue}44`,
                                opacity: 1,
                                border: 0,
                            },
                            "&.Mui-disabled + .MuiSwitch-track": {
                                opacity: 0.5,
                            },
                        },
                        "&.Mui-focusVisible .MuiSwitch-thumb": {
                            color: colors.neonBlue,
                            border: "6px solid #fff",
                        },
                        "&.Mui-disabled .MuiSwitch-thumb": {
                            color: colors.lightGrey,
                        },
                        "&.Mui-disabled + .MuiSwitch-track": {
                            opacity: 0.7,
                        },
                    },
                    "& .MuiSwitch-thumb": {
                        boxSizing: "border-box",
                        width: 11,
                        height: 11,
                    },
                    "& .MuiSwitch-track": {
                        borderRadius: 15 / 2,
                        backgroundColor: colors.grey,
                        opacity: 1,
                        transition: `all .5s`,
                    },
                },
            },
        },
        MuiCircularProgress: {
            defaultProps: {
                size: "3rem",
            },
        },
        MuiModal: {
            styleOverrides: {
                root: {
                    zIndex: siteZIndex.Modal,
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                root: {
                    zIndex: siteZIndex.Drawer,
                },
            },
        },
        MuiTooltip: {
            styleOverrides: {
                popper: {
                    zIndex: siteZIndex.Tooltip,
                },
            },
        },
        MuiSlider: {
            styleOverrides: {
                root: {
                    height: "1px",
                    borderRadius: 0,
                    ".MuiSlider-thumb": {
                        width: "12px",
                        height: "12px",
                        ":after": {
                            width: "100%",
                            height: "100%",
                        },
                        borderRadius: 0,
                    },
                },
            },
        },
        MuiBadge: {
            styleOverrides: {
                root: {
                    ".MuiBadge-badge": {
                        pointerEvents: "none",
                    },
                },
            },
        },
    },
    factionTheme,
})
