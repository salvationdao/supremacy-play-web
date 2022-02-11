import './global.css'
import { createTheme, FactionTheme } from '@mui/material/styles'
import { red } from '@mui/material/colors'

// had to keep the declare in this file for it to work
declare module '@mui/material/styles' {
    interface Theme {
        factionTheme: FactionTheme
    }

    interface ThemeOptions {
        factionTheme?: FactionTheme
    }

    export interface FactionTheme {
        primary: string
        secondary: string
        background: string
    }
    // allow configuration using `createTheme`
    interface FactionThemeOptions {
        primary?: string
        secondary?: string
        background?: string
    }
}

export const colors = {
    text: '#D4FFFF',
    offWhite: '#F8F8F8',
    red: '#C24242',
    green: '#30B07D',
    yellow: '#FFE200',

    neonBlue: '#00FFFF',
    darkNeonBlue: '#176969',
    darkerNeonBlue: '#073339',
    darkNavyBlue: '#070719',
    darkNavy: '#101019',

    health: '#BFF600',
    shield: '#00F7F7',
}

const factionTheme: FactionTheme = {
    primary: '#00FFFF',
    secondary: '#00FFFF',
    background: '#050c12',
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
            default: '#FFFFFF',
        },
        text: {
            primary: colors.text,
            secondary: colors.offWhite,
        },
    },
    typography: {
        htmlFontSize: 19,
        h1: {
            fontFamily: ['Nostromo Regular Black', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
        },
        h2: {
            fontFamily: ['Nostromo Regular Bold', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
        },
        h3: {
            fontFamily: ['Share Tech', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
        },
        h4: {
            fontFamily: ['Share Tech', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
        },
        h5: {
            fontFamily: ['Share Tech', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
        },
        h6: {
            fontFamily: ['Share Tech', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
        },
        body1: {
            fontFamily: ['Share Tech', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
        },
        body2: {
            fontFamily: ['Share Tech', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
        },
        subtitle1: {
            fontFamily: ['Share Tech', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
            textAlign: 'center',
        },
        subtitle2: {
            fontFamily: ['Share Tech', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
        },
        caption: {
            fontFamily: ['Share Tech', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
        },
    },
    components: {
        MuiButtonBase: {
            defaultProps: {
                disableRipple: false,
            },
            styleOverrides: {
                root: {
                    transition: 'all .1s',
                    ':hover': {
                        opacity: 0.76,
                    },
                },
            },
        },
        MuiTypography: {
            defaultProps: {
                color: 'text.primary',
            },
            styleOverrides: {
                caption: {
                    display: 'block',
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
        },
        MuiLink: {
            defaultProps: {
                underline: 'none',
                color: 'text.primary',
            },
            styleOverrides: {
                root: {
                    display: 'inline-flex',
                    alignItems: 'center',
                    transition: 'all .1s',
                    '& *': {
                        transition: 'all .1s',
                    },
                    ':hover, :hover > *': {
                        color: '#136ED6',
                    },
                },
            },
        },
        MuiSkeleton: {
            defaultProps: {
                animation: 'wave',
            },
        },
        MuiPagination: {
            styleOverrides: {
                root: {
                    marginTop: '17px',
                    '.MuiPagination-ul': {
                        justifyContent: 'center',
                    },
                },
            },
        },
    },
    factionTheme,
})
