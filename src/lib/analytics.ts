/**
 * 占位：后续接入 Umami / GA 时在此集中管理上报逻辑。
 */
export function track(event: string, payload?: Record<string, unknown>) {
  if (process.env.NODE_ENV === 'development') {
    console.info('[analytics]', event, payload);
  }
}
