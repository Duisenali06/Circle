export default async function handler(_request, response) {
  try {
    const upstream = await fetch('https://funapi.dev/api/coffee/v1/drinks', {
      signal: AbortSignal.timeout(8000),
    })
    const body = await upstream.text()
    response
      .status(upstream.status)
      .setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json')
      .setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
      .send(body)
  } catch {
    response.status(502).json({ error: 'Coffee menu source is temporarily unavailable' })
  }
}
