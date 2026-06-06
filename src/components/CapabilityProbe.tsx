import { useState } from 'react'
import { canNativeShare, getEnvironmentInfo } from '../utils/env'

export function CapabilityProbe() {
  const [open, setOpen] = useState(false)
  const info = getEnvironmentInfo()

  return (
    <section className="capability-probe">
      <button
        type="button"
        className="probe-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {open ? '收起' : '展开'} 分享能力探测
      </button>

      {open && (
        <dl className="probe-list">
          <div>
            <dt>navigator.share</dt>
            <dd className={info.hasNativeShare ? 'ok' : 'no'}>
              {info.hasNativeShare ? '可用' : '不可用'}
            </dd>
          </div>
          <div>
            <dt>navigator.canShare</dt>
            <dd className={info.hasCanShare ? 'ok' : 'no'}>
              {info.hasCanShare ? '可用' : '不可用'}
            </dd>
          </div>
          <div>
            <dt>canShare(示例数据)</dt>
            <dd className={canNativeShare({ title: 'test', url: info.url }) ? 'ok' : 'no'}>
              {canNativeShare({ title: 'test', url: info.url }) ? '通过' : '未通过'}
            </dd>
          </div>
          <div>
            <dt>微信内置浏览器</dt>
            <dd className={info.isWeChat ? 'warn' : 'ok'}>
              {info.isWeChat ? '是（大概率需降级）' : '否'}
            </dd>
          </div>
          <div>
            <dt>HTTPS</dt>
            <dd className={info.isHttps ? 'ok' : 'no'}>
              {info.isHttps ? '是' : '否'}
            </dd>
          </div>
          <div>
            <dt>剪贴板 API</dt>
            <dd className={info.hasClipboard ? 'ok' : 'no'}>
              {info.hasClipboard ? '可用' : '不可用（有 execCommand 兜底）'}
            </dd>
          </div>
          <div className="probe-ua">
            <dt>User-Agent</dt>
            <dd>{info.userAgent}</dd>
          </div>
        </dl>
      )}
    </section>
  )
}
