# Xiaorensutang viewing conditions pilot

Run date: 9 September 2026

## Question

How does the same sweet wrapper enter machine reading when its support, handling and illumination change?

## Inputs

The artist confirmed four documented viewing states:

1. `XST-C1`: white backing / album page.
2. `XST-C2`: hand-held / ordinary indoor light.
3. `XST-C3`: held against the hand.
4. `XST-C4`: held toward strong light.

The source photographs are preserved unchanged in this folder. C1-C3 have complete visible object boundaries and were manually perspective-corrected to 1170 x 800 pixels. Two corners of the wrapper extend beyond the C4 photograph, so C4 is retained as qualitative evidence and is excluded from the quantitative image comparison.

## Machine operations actually run

- Manual four-corner perspective correction for C1-C3.
- Identical pixel-level measurements for C1-C3: brightness, tonal contrast, saturation, edge density, horizontal and vertical adjacent-pixel change, colourfulness, entropy, and dark/light pixel fractions.
- Apple Vision text recognition for all four images using Accurate recognition, Simplified Chinese, Traditional Chinese and US English, language correction enabled, and minimum text height 0.012.

The measurements describe the captured images, not paper composition or isolated causal effects.

## OCR results

| State | Recognised line 1 | Confidence | Recognised line 2 | Confidence |
|---|---|---:|---|---:|
| C1 | XIAORENSUTANG | 0.3 | 长春市第一食品厂 | 0.5 |
| C2 | XIAORENSUTANE | 0.5 | 长春市第一後品厂 | 0.5 |
| C3 | XIAORENSUTANE | 0.5 | 长春市第一食品厂 | 1.0 |
| C4 | XIADRENSUTTAME | 0.3 | 长春市第一食品厂 | 0.3 |

The central stylised Chinese product-name line was not returned in any of the four OCR outputs. The artist verifies that its final intended character is associated with 糖, but the visible printed glyph is incomplete/nonstandard: it shows 米 beside 广 rather than the full written structure of 糖. For evidence transcription it should therefore be recorded as `小人酥[米+广字形]`, with “小人酥糖” retained only as the working product name used in V7 and supported by the Roman-letter line `XIAORENSUTANG`. The omission is an OCR result; it is not evidence that the printed line is absent.

## Image measurements for the comparable states

| Measurement | C1 white backing | C2 ordinary hand-held | C3 against hand |
|---|---:|---:|---:|
| Mean brightness | 0.5001 | 0.5221 | 0.3984 |
| Tonal standard deviation | 0.1665 | 0.1274 | 0.1832 |
| 95th–5th percentile contrast | 0.4741 | 0.3876 | 0.6142 |
| Mean saturation | 0.4243 | 0.2631 | 0.3347 |
| Edge density | 0.0376 | 0.0316 | 0.0223 |
| Entropy | 4.1019 | 3.8594 | 4.4269 |

Within these captured and corrected images, C2 is brightest; C3 is darkest and has the widest tonal range; C1 has the highest saturation and edge-density values. These are image observations only. They do not establish that support or light alone caused the differences.

## Artist observations already documented in V7

- Against white paper, the blue and pale areas appear distinct.
- When lifted toward the light, the wrapper seems more translucent and its image less clear.
- Fine thread-like patterns become visible toward the light.
- The object feels very light, and its two sides differ in smoothness.
- The final glyph in the central Chinese product-name line is not a fully written 糖: its visible structure is 米 beside 广.

These are the artist's qualitative observations of this object. The thread-like appearance does not identify its material composition.

## What this pilot supports

- The same physical wrapper produces different captured images and non-identical OCR strings under the four documented viewing states.
- OCR behaviour changes by text region rather than improving or degrading uniformly: for example, C3 preserves the factory line at confidence 1.0 while still altering the English product line.
- Material experience includes translucency, touch and handling relations that are not represented by the OCR output.

## What this pilot does not support

- A causal claim about light, backing or handling as an isolated variable.
- Identification of paper fibres or chemical composition.
- OCR accuracy statistics beyond this one object and four captures.
- A claim that C4 is quantitatively comparable with C1-C3.
- Viewer-study or interaction-effectiveness claims.

## Source boundary

The research framing and artist observations are supported by `Mengruo_Wang_CUHK_AFTER_USE_RP_EN_V7 (4).docx`. The wrapper inscription names Changchun No. 1 Food Factory, but V7 treats the product-factory relation as an inscription-based lead awaiting external corroboration.
