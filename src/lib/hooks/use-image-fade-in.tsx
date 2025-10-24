import { useRef, useCallback } from "react"

/**
 * Custom hook for handling image fade-in effect
 * @param opacityFrom - Starting opacity class (default: "opacity-0")
 * @param opacityTo - Target opacity class (default: "opacity-100")
 * @returns Object with imageRef and handleImageLoad function
 */
export const useImageFadeIn = (
  opacityFrom: string = "opacity-0",
  opacityTo: string = "opacity-100"
) => {
  const imageRef = useRef<HTMLImageElement>(null)

  const handleImageLoad = useCallback(() => {
    if (imageRef.current) {
      imageRef.current.classList.replace(opacityFrom, opacityTo)
    }
  }, [opacityFrom, opacityTo])

  return { imageRef, handleImageLoad }
}
