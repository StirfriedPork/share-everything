import { useCallback, useState } from 'react'
import { canNativeShare } from '../utils/env'

export type ShareMethod = 'native' | 'fallback' | 'cancelled' | 'error'

export interface SharePayload {
  title: string
  text?: string
  url?: string
}

export interface ShareResult {
  method: ShareMethod
  error?: string
}

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(textarea)
    return ok
  }
}

export function useShare() {
  const [showFallbackGuide, setShowFallbackGuide] = useState(false)
  const [lastResult, setLastResult] = useState<ShareResult | null>(null)
  const [isSharing, setIsSharing] = useState(false)

  const dismissFallbackGuide = useCallback(() => {
    setShowFallbackGuide(false)
  }, [])

  const share = useCallback(async (payload: SharePayload): Promise<ShareResult> => {
    setIsSharing(true)
    setShowFallbackGuide(false)

    const url = payload.url ?? location.href
    const shareData: ShareData = {
      title: payload.title,
      text: payload.text,
      url,
    }

    if (canNativeShare(shareData)) {
      try {
        await navigator.share(shareData)
        const result: ShareResult = { method: 'native' }
        setLastResult(result)
        setIsSharing(false)
        return result
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          const result: ShareResult = { method: 'cancelled' }
          setLastResult(result)
          setIsSharing(false)
          return result
        }
      }
    }

    const copied = await copyToClipboard(url)
    if (!copied) {
      const result: ShareResult = {
        method: 'error',
        error: '无法复制链接，请手动复制地址栏链接',
      }
      setLastResult(result)
      setIsSharing(false)
      return result
    }

    const result: ShareResult = { method: 'fallback' }
    setLastResult(result)
    setShowFallbackGuide(true)
    setIsSharing(false)
    return result
  }, [])

  return {
    share,
    isSharing,
    showFallbackGuide,
    dismissFallbackGuide,
    lastResult,
  }
}
