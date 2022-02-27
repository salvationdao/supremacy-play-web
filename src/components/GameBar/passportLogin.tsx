import { Box } from "@mui/system"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useAuth } from "./containers"

interface LoginButtonRenderProps {
    onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
    isDisabled: boolean
    isProcessing: boolean
}

interface PassportLoginProps {
    buttonStyle?: React.CSSProperties
    containerStyle?: React.CSSProperties
    cssClass?: string
    icon?: React.ReactNode
    isDisabled?: boolean

    onClick?(event: React.MouseEvent<HTMLDivElement>): void

    scope?: string
    textButton?: string
    typeButton?: string
    tag?: Node | React.Component<any>
    state?: string
    responseType?: string

    render?: (props: LoginButtonRenderProps) => JSX.Element

    passportWeb: string
}

export const PassportLogin: React.FC<PassportLoginProps> = (props) => {
    const { sessionID } = useAuth()
    const [isProcessing, setIsProcessing] = useState(false)
    const [passportPopup, setPassportPopup] = useState<Window | null>(null)
    const { isDisabled, onClick, render, passportWeb } = props

    const href = `${passportWeb}/nosidebar/login?omitSideBar=true&&sessionID=${sessionID}`

    const click = useCallback(
        async (e) => {
            if (isProcessing || isDisabled) {
                return
            }

            setIsProcessing(true)
            if (typeof onClick === "function") {
                onClick(e)
                if (e.defaultPrevented) {
                    setIsProcessing(false)
                    return
                }
            }

            const width = 520
            const height = 730
            const top = window.screenY + (window.outerHeight - height) / 2.5
            const left = window.screenX + (window.outerWidth - width) / 2
            const popup = window.open(
                href,
                "Connect Gamebar to XSYN Passport",
                `width=${width},height=${height},left=${left},top=${top},popup=1`,
            )
            if (!popup) {
                setIsProcessing(false)
                return
            }

            setPassportPopup(popup)
        },
        [isProcessing, isDisabled, onClick, sessionID, passportWeb],
    )

    const propsForRender = useMemo(
        () => ({
            onClick: click,
            isDisabled: !!isDisabled,
            isProcessing,
        }),
        [click, isDisabled, isProcessing],
    )

    useEffect(() => {
        if (!passportPopup) return

        const popupCheckTimer = setInterval(() => {
            if (!passportPopup) {
                return
            }

            if (passportPopup.closed) {
                popupCheckTimer && clearInterval(popupCheckTimer)
                setIsProcessing(false)
                setPassportPopup(null)
            }
        }, 1000)

        return () => clearInterval(popupCheckTimer)
    }, [passportPopup])

    if (!render) {
        throw new Error("Passport login requires a render prop to render!")
    }

    return (
        <>
            {render(propsForRender)}
            <Box sx={{ display: "none" }}>
                <iframe src={href}></iframe>
            </Box>
        </>
    )
}
