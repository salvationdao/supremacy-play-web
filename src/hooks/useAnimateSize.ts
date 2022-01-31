import { useCallback, useRef } from "react"

interface AnimateOptions {
	transition?: string
	width?: boolean
	height?: boolean
}

function getAbsoluteHeight(el: HTMLElement): number {
	const styles = window.getComputedStyle(el)
	const margin = parseFloat(styles["marginTop"]) + parseFloat(styles["marginBottom"])
	return Math.ceil(el.offsetHeight + margin)
}

function getAbsoluteWidth(el: HTMLElement): number {
	const styles = window.getComputedStyle(el)
	const margin = parseFloat(styles["marginRight"]) + parseFloat(styles["marginLeft"])
	return Math.ceil(el.offsetWidth + margin)
}

function useAnimateSize<T extends HTMLElement>(
	opts: AnimateOptions = {
		width: true,
		height: true,
		transition: "all 300ms ease",
	}
): (node: T) => void {
	const ref = useRef<T | undefined>()
	const observerRef = useRef<MutationObserver>()
	const setRef = useCallback(
		(node: T) => {
			ref.current = node

			if (!node) return
			if (opts.height) node.style.height = `${node.offsetHeight}px`
			if (opts.width) node.style.width = `${node.offsetWidth}px`

			if (!node.style.transition) {
				node.style.transition = opts ? opts.transition || "all 300ms ease" : "all 300ms ease"
			}

			const doSize = () => {
				if (!node) return
				const height = parseInt(node.style.height, 10)

				if (opts.height) {
					let realHeight = 0
					for (let i = 0; i < node.children.length; i++) {
						realHeight += getAbsoluteHeight(node.children[i] as HTMLElement)
					}
					if (height !== realHeight) {
						node.style.height = `${realHeight}px`
					}
				}
				if (opts.width) {
					let realWidth = 0
					for (let i = 0; i < node.children.length; i++) {
						realWidth += getAbsoluteWidth(node.children[i] as HTMLElement)
					}
					if (height !== realWidth) {
						node.style.width = `${realWidth}px`
					}
				}
			}
			doSize()

			observerRef.current = new MutationObserver(doSize)
			observerRef.current.observe(node, { childList: true })
		},
		[opts]
	)

	return setRef
}
export default useAnimateSize
