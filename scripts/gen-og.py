#!/usr/bin/env python3
"""Generate assets/og-image.png (1200x630 branded share image) for SREE ENGINEERING."""
import argparse
import os

from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
RED, ORANGE, CHARCOAL, GREY, WHITE = (215, 25, 32), (255, 106, 0), (22, 22, 28), (150, 150, 158), (245, 245, 247)


def main(fonts_dir, out):
    img = Image.new("RGB", (W, H), CHARCOAL)
    d = ImageDraw.Draw(img)

    # subtle top-right diagonal accent stripes
    for i in range(14):
        x = W - 40 - i * 46
        if x > W - 520:
            c = RED if i % 2 else ORANGE
            d.line([(x, 0), (x - 120, 120)], fill=c, width=10)

    # left vertical gradient bar (red -> orange)
    bar_h = 460
    for y in range(bar_h):
        t = y / bar_h
        r = int(RED[0] + (ORANGE[0] - RED[0]) * t)
        g = int(RED[1] + (ORANGE[1] - RED[1]) * t)
        b = int(RED[2] + (ORANGE[2] - RED[2]) * t)
        d.rectangle([70, 110, 82, 110 + y], fill=(r, g, b))

    mono_k = ImageFont.truetype(os.path.join(fonts_dir, "JetBrainsMono-Medium.ttf"), 22)
    xb = ImageFont.truetype(os.path.join(fonts_dir, "Poppins-ExtraBold.ttf"), 108)
    tag = ImageFont.truetype(os.path.join(fonts_dir, "Poppins-SemiBold.ttf"), 34)
    mono_s = ImageFont.truetype(os.path.join(fonts_dir, "JetBrainsMono-Medium.ttf"), 21)

    d.text((112, 118), "// EXTERNAL ELECTRICAL CONTRACTING COMPANY", font=mono_k, fill=GREY)
    d.text((104, 168), "SREE", font=xb, fill=WHITE)
    d.text((104, 278), "ENGINEERING", font=xb, fill=ORANGE)
    d.text((112, 412), "SMART POWER MANAGEMENT SYSTEMS", font=tag, fill=WHITE)
    d.text((112, 508), "400 KV \u2013 LT  \u00b7  GIS & AIS SUBSTATIONS  \u00b7  PAN-INDIA", font=mono_s, fill=GREY)
    d.text((112, 552), "sreeengineering.co.in", font=mono_s, fill=(110, 110, 120))

    img.save(out, optimize=True)
    print("generated", out, img.size)


if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--fonts-dir", required=True)
    p.add_argument("--out", default="assets/og-image.png")
    a = p.parse_args()
    main(a.fonts_dir, a.out)
