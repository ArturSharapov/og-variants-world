import { getQueries, InvalidParamsError } from 'https://deno.land/x/requery@0.1.0/mod.ts'
import React from 'https://esm.sh/react@18.2.0'
import { ImageResponse } from 'https://deno.land/x/og_edge@0.0.6/mod.ts'

const bg = new URL('poster-bg.png', import.meta.url).href
const fonts = await Promise.all(
  ['medium', 'bold'].map(async name => ({
    data: await fetch(new URL(`${name}.ttf`, import.meta.url)).then(res => res.arrayBuffer()),
    name,
  }))
)
const size = 1200
const ratio = size / 1024
const COLORS = { ur: '#2b99ea', pending: '#cdbf27', accepted: '#61ad14', declined: '#cd2740' }

Deno.serve((request: Request) => {
  try {
    const { type, title, status, fen } = getQueries(request, 'type', 'title', 'status', 'fen')
    const statusColor = COLORS[status as keyof typeof COLORS] ?? '#2d2d32'
    return new ImageResponse(
      (
        <>
          <img src={bg} width={1024 * ratio} height={576 * ratio} />
          <img
            src={`https://assets.variants.studio/image?quadratic&size=550&fen=${fen}`}
            style={{
              position: 'absolute',
              width: 417 * ratio,
              height: 417 * ratio,
              borderRadius: 20 * ratio,
              top: 118 * ratio,
              left: 302 * ratio,
            }}
          />
          <div
            style={{
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 48 * ratio,
              color: 'white',
              top: 12 * ratio,
              left: '50%',
              transform: 'translateX(-50%)',
              gap: 16 * ratio,
            }}
          >
            <div
              style={{
                fontSize: 36 * ratio,
                fontFamily: 'bold',
                color: '#e7e4e4',
                backgroundColor: '#1e1e20',
                padding: `${7 * ratio}px ${17 * ratio}px ${7 * ratio}px ${20 * ratio}px`,
                borderRadius: 16 * ratio,
              }}
            >
              {type}
            </div>
            {title}
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: 22 * ratio,
              right: 24 * ratio,
              borderRadius: 32 * ratio,
              width: 31 * ratio,
              height: 31 * ratio,
              backgroundColor: statusColor,
              opacity: 0.3,
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 31.5 * ratio,
              right: 33 * ratio,
              borderRadius: 14 * ratio,
              width: 12 * ratio,
              height: 12 * ratio,
              backgroundColor: statusColor,
            }}
          />
        </>
      ),
      {
        width: 1024 * ratio,
        height: 576 * ratio,
        fonts,
      }
    )
  } catch (e) {
    if (e instanceof InvalidParamsError) return new Response(e.message, { status: 403 })
    throw e
  }
})
