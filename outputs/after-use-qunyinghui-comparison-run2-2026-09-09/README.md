# Qunyinghui Run 2 isolated capture comparison

Run date: 9 September 2026

## Revision from Run 1

Run 1 used a photograph of both objects inside a transparent album sleeve. Reflections, overlaps and adjacent packaging entered the machine input. In Run 2 the artist removed the objects and photographed each separately against the same wall background. A third photograph preserves their side-by-side physical relation.

- `QYH-A`: cleaner and whiter object, confirmed by the artist as the one collected as a later reprint.
- `QYH-B`: worn and stained object, confirmed by the artist as the one collected as an older item.

The A/B mapping to the acquisition descriptions is now artist-confirmed. “Collected as” remains essential: the mapping does not authenticate or date either object.

## Machine operations actually run

- Manual four-corner perspective correction to 1280 x 800 pixels.
- Identical image-level measurements: brightness, tonal contrast, saturation, edge density, horizontal and vertical adjacent-pixel change, colourfulness, entropy, and dark/light pixel fractions.
- Apple Vision text recognition using Accurate recognition, Simplified Chinese, Traditional Chinese and US English, language correction enabled, and minimum text height 0.012.

## Run 2 OCR summary

| Observation | QYH-A cleaner/whiter | QYH-B worn/stained |
|---|---|---|
| Detected regions | 23 | 20 |
| Mean detected-region confidence | 0.5087 | 0.4300 |
| Main Roman name | `QUNYING` 1.0; `HUI` 1.0 | `QUNYING` 1.0; `HUI` 0.5 |
| Main Chinese name | returned as `群宾畲` and `群美會`, both 0.3 | returned twice as `群英會`, both 0.3 |
| English factory line | `NANYANG CIGARETTE / FACTORY HENAN`, both 0.5 | remains fragmented as `NANYA / CIGARE” / ASG` |
| Chinese factory line | `河南·南陽卷煙廠出品`, 0.5 | `南陽卷烟廠出品`, 1.0 |

Confidence values describe individual returned regions and are not calibrated correctness probabilities.

## Run 2 image measurements

| Measurement | QYH-A cleaner/whiter | QYH-B worn/stained |
|---|---:|---:|
| Mean brightness | 0.5911 | 0.5839 |
| Tonal standard deviation | 0.1387 | 0.1408 |
| 95th–5th percentile contrast | 0.4491 | 0.4533 |
| Mean saturation | 0.2217 | 0.1117 |
| Edge density | 0.0313 | 0.0373 |
| Entropy | 2.8093 | 3.2939 |

In these Run 2 photographs, A is only slightly brighter but has approximately twice B's mean saturation. B has higher measured edge density and entropy. These values describe the phone captures after geometric correction; they are not calibrated colour, paper-surface or ageing measurements.

## Run 1 to Run 2 comparison

- Removing the album context eliminated the adjacent `光榮`-related OCR string previously returned for QYH-A.
- QYH-A's mean detected-region confidence increased from 0.4500 to 0.5087, but its main Chinese name changed from one correct return in Run 1 to two altered returns in Run 2.
- QYH-B's mean detected-region confidence changed from 0.4500 to 0.4300, while its main Chinese name changed from altered forms in Run 1 to two returns of `群英會` in Run 2.
- QYH-B's worn English factory line remained fragmented after isolation.

Input isolation therefore reduced contextual contamination but did not produce uniform OCR improvement. OCR behaviour changed by object and text region.

## Artist evidence from V7

The artist previously recorded that one object, collected as an older item, felt rougher and had a cream-coloured ground and finer colour relationships. The other, collected as a later reprint, felt smoother, appeared whiter and had more saturated imagery. Lettering and layout also differ, so the pair is not a controlled comparison in which age alone changes.

The artist has now confirmed the mapping: QYH-A is the object collected as the later reprint, and QYH-B is the object collected as the older item. The artist also confirms a visible inscription difference: A includes `河南·南阳卷烟厂出品`, while B reads `南阳卷烟厂出品` without the initial place term.

## What the two-run experiment supports

- Input preparation changes what enters a machine record.
- Removing visible contextual material can reduce contamination without guaranteeing better transcription across all fields.
- Machine image measurements can describe captured visual differences but cannot identify tactile difference, authenticity, age or printing process.
- Artist verification is required to connect visible machine records with physical surface observations and uncertain acquisition labels.

## What it does not support

- Authentication or dating of either object.
- Identification of old-item/reprint status from the images.
- A claim that isolation always improves OCR.
- A causal claim that ageing produced the measured differences.
- A claim that the machine measured roughness or paper composition.

## Artist confirmation completed

On 9 September 2026, the artist confirmed both the A/B acquisition-description mapping and the factory-line difference recorded above.
