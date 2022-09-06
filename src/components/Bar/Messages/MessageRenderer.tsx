/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Link, Typography } from "@mui/material"
import MDEditor from "@uiw/react-md-editor"
import { useEffect, useRef } from "react"
import rehypeSanitize from "rehype-sanitize"
import { fonts } from "../../../theme/theme"

export interface MessageRendererProps {
    markdown?: string
}

const InternalMessageRenderer = ({ markdown }: MessageRendererProps) => {
    const containerEl = useRef<HTMLDivElement>()

    const props = options
    props.style = {
        fontFamily: fonts.shareTech,
        backgroundColor: "transparent",
    }

    useEffect(() => {
        if (!containerEl.current) return

        containerEl.current.setAttribute("data-color-mode", "dark")
    }, [])

    return (
        <Box ref={containerEl}>
            <MDEditor.Markdown {...props} source={markdown} />
        </Box>
    )
}

const options: any = {
    rehypePlugins: [[rehypeSanitize]],
    components: {
        a: Link,
        p: Typography,
        h1: (props: any) => <Typography variant="h1" {...props} />,
        h2: (props: any) => <Typography variant="h2" {...props} />,
        h3: (props: any) => <Typography variant="h3" {...props} />,
        h4: (props: any) => <Typography variant="h4" {...props} />,
        h5: (props: any) => <Typography variant="h5" {...props} />,
        h6: (props: any) => <Typography variant="h6" {...props} />,
        code: (props: any) => (
            <Box
                component="code"
                sx={{
                    fontFamily: `${fonts.shareTechMono} !important`,
                    "& *": {
                        fontFamily: `${fonts.shareTechMono} !important`,
                    },
                }}
                {...props}
            />
        ),
    },
}

type MessageRenderer = typeof InternalMessageRenderer & {
    generateOptions: (backgroundColor: string) => any
}
;(InternalMessageRenderer as MessageRenderer).generateOptions = (backgroundColor: string) => ({
    ...options,
    style: {
        fontFamily: fonts.shareTech,
        backgroundColor: backgroundColor,
    },
})

export default InternalMessageRenderer as MessageRenderer
