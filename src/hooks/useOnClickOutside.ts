import { useEffect, RefObject } from "react"
type Event = MouseEvent | TouchEvent
function useOnClickOutside<T extends HTMLElement = HTMLElement>(ref: RefObject<T>, handler: (event: Event) => void) {
    useEffect(() => {
        const callback = (event: Event) => {
            const el = ref?.current
            // Do nothing if clicking ref's element or descendent elements
            if (!el || el.contains((event?.target as Node) || null)) {
                return
            }
            handler(event)
        }

        document.addEventListener(`mousedown`, callback)
        document.addEventListener(`touchstart`, callback)

        return () => {
            document.removeEventListener(`mousedown`, callback)
            document.removeEventListener(`touchstart`, callback)
        }
        // Reload only if ref or handler changes
    }, [ref, handler])
}
export default useOnClickOutside
