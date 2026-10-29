/**
 * The Open Graph (share preview) image, drawn with next/og and written to
 * src/app/opengraph-image.png by scripts/generate-icons.ts. A static PNG keeps
 * its .png name in the static export, so hosts serve it as an image.
 */
import { ImageResponse } from "next/og";
import { APP_NAME } from "../src/lib/constants";
import {
  LOGO_COLORS,
  LOGO_RADIUS,
  LOGO_SIZE,
  logoShapes,
  WORDMARK_HEIGHTS,
  WORDMARK_TONES,
} from "../src/lib/logo";

/** The one line above the name, broken where it reads best; short so it holds at thumbnail size. */
const LINES = ["SQLite, edited", "in your browser"];

export const OG_ALT = `${APP_NAME}: ${LINES.join(" ")}.`;
export const OG_SIZE = { width: 1200, height: 630 };

const PAD = 64;
const BAND = 330;
const GAP = 10;

/**
 * DM Sans Bold, subset to the characters drawn. The build already fetches
 * Google Fonts for next/font; asked without a browser user agent, the CSS
 * points at TrueType, which the image renderer needs.
 */
async function dmSansBold(text: string): Promise<ArrayBuffer> {
  const query = `family=DM+Sans:wght@700&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(`https://fonts.googleapis.com/css2?${query}`)).text();
  const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
  if (!url) throw new Error("Couldn't load DM Sans for the Open Graph image.");
  return (await fetch(url)).arrayBuffer();
}

/** The share preview as PNG bytes: the line and the mark above the block wordmark. */
export async function renderOgImage(): Promise<Uint8Array> {
  const letters = APP_NAME.toUpperCase().replace(/\s/g, "").split("");
  const font = await dmSansBold(`${LINES.join("")}${letters.join("")}`);

  const image = new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: LOGO_COLORS.ground,
        color: LOGO_COLORS.ink,
        fontFamily: "DM Sans",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 48,
          padding: `${PAD - 8}px ${PAD}px 0`,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 76,
            fontWeight: 700,
            lineHeight: 1.02,
            letterSpacing: "-0.035em",
            maxWidth: 820,
          }}
        >
          {LINES.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </div>
        <svg width={120} height={120} viewBox={`0 0 ${LOGO_SIZE} ${LOGO_SIZE}`}>
          <rect
            width={LOGO_SIZE}
            height={LOGO_SIZE}
            rx={LOGO_RADIUS}
            fill={LOGO_COLORS.ground}
            stroke={LOGO_COLORS.ink}
            strokeOpacity={0.12}
            strokeWidth={8}
          />
          {logoShapes().map((shape) => (
            <path key={shape.d} d={shape.d} fill={shape.fill} />
          ))}
        </svg>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: GAP,
          height: BAND,
          padding: `0 ${GAP}px`,
        }}
      >
        {letters.map((letter, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              height: `${WORDMARK_HEIGHTS[i % WORDMARK_HEIGHTS.length] * 100}%`,
              background: LOGO_COLORS[WORDMARK_TONES[i % WORDMARK_TONES.length]],
              borderRadius: "16px 16px 0 0",
              color: LOGO_COLORS.ground,
              fontSize: 200,
              fontWeight: 700,
              lineHeight: 0.8,
              paddingBottom: 20,
            }}
          >
            {letter}
          </div>
        ))}
      </div>
    </div>,
    { ...OG_SIZE, fonts: [{ name: "DM Sans", data: font, weight: 700, style: "normal" }] },
  );
  return new Uint8Array(await image.arrayBuffer());
}
