import { useShare } from '../hooks/useShare'
import { isWeChat } from '../utils/env'

interface ShareButtonProps {
  title: string
  text?: string
  url?: string
  disabled?: boolean
}

function ShareIcon() {
  return (
    <svg
      className="share-button__icon"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.59 13.51 15.42 17.49" />
      <path d="M15.41 6.51 8.59 10.49" />
    </svg>
  )
}

export function ShareButton({ title, text, url, disabled }: ShareButtonProps) {
  const { share, isSharing, showFallbackGuide, dismissFallbackGuide, lastResult } =
    useShare()

  const handleShare = () => {
    void share({ title, text, url })
  }

  return (
    <>
      <div className="share-actions">
        <button
          type="button"
          className="share-button"
          onClick={handleShare}
          disabled={disabled || isSharing}
        >
          <ShareIcon />
          {isSharing ? '分享中…' : '分享给朋友'}
        </button>

        {lastResult?.method === 'native' && (
          <p className="share-hint ok">已通过系统分享面板分享</p>
        )}
        {lastResult?.method === 'cancelled' && (
          <p className="share-hint">已取消分享</p>
        )}
        {lastResult?.method === 'error' && (
          <p className="share-hint error">{lastResult.error}</p>
        )}
      </div>

      {showFallbackGuide && (
        <div className="fallback-overlay" role="dialog" aria-modal="true">
          <div className="fallback-panel">
            <button
              type="button"
              className="fallback-close"
              onClick={dismissFallbackGuide}
              aria-label="关闭"
            >
              ×
            </button>

            <div className="fallback-panel__badge">链接已复制</div>
            <h2>分享给朋友</h2>
            <p className="fallback-lead">
              {isWeChat
                ? '微信内请用右上角菜单转发，好友点开即可体验'
                : '当前环境不支持原生分享，请用下方方式转发'}
            </p>

            <ol className="fallback-steps">
              <li>
                <span className="step-num">1</span>
                <span>链接已复制到剪贴板</span>
              </li>
              <li>
                <span className="step-num">2</span>
                <span>
                  点击右上角 <strong>···</strong> 菜单
                </span>
              </li>
              <li>
                <span className="step-num">3</span>
                <span>
                  选择 <strong>发送给朋友</strong> 或 <strong>分享到朋友圈</strong>
                </span>
              </li>
            </ol>

            <div className="fallback-mock" aria-hidden="true">
              <div className="mock-bar">
                <span className="mock-dots">···</span>
              </div>
              <div className="mock-menu">
                <span>发送给朋友</span>
                <span>分享到朋友圈</span>
              </div>
            </div>

            <button type="button" className="fallback-ok" onClick={dismissFallbackGuide}>
              知道了
            </button>
          </div>
        </div>
      )}
    </>
  )
}
