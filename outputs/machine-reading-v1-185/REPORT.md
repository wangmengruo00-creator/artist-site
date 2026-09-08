# Machine Reading V1 — 185 Ticket Scans

> Diagnostic computational output. Not catalogue completion or historical evidence.

- Corpus processed: **185 / 185** published, non-duplicate ticket scans
- Visual clusters selected by silhouette score: **5**
- OCR records returned: **185 / 185**
- Records containing recognised text: **184**
- Mean OCR confidence: **0.523**
- Visually unstable cluster assignments (negative sample silhouette): **34 / 185**

## Protocol boundary

The machine measures image properties, proposes OCR transcriptions and forms temporary visual groups. It does not establish provenance, circulation, authenticity, use, or historical meaning. Every OCR string and cluster assignment remains reviewable.

## Cluster selection diagnostics

- k=4: silhouette 0.1166
- k=5: silhouette 0.1292
- k=6: silhouette 0.1069
- k=7: silhouette 0.1134
- k=8: silhouette 0.1155
- k=9: silhouette 0.1208
- k=10: silhouette 0.1282

The best score is low, so these groups should be treated as inspection aids rather than a stable taxonomy.

## OCR audit

- no_text_detected: 1
- low_confidence: 67
- medium_confidence: 98
- higher_confidence_not_verified: 19

Keyword-triggered candidate modes (overlapping and unverified):

- grain_or_food_allocation: 54
- commodity_or_ration: 24
- admission_or_event: 6
- service_or_payment: 4
- transport: 3

## Provisional visual clusters

### Cluster 01 — 9 records

Machine-visible tendencies: lower lighter overall field, higher darker border region, higher darker central region, lower greater tonal complexity.

Records: T-001, T-003, T-005, T-026, T-027, T-028, T-029, T-030, T-116

### Cluster 02 — 34 records

Machine-visible tendencies: higher larger pale-background area, higher stronger vertical structure, higher denser edges and printed detail, higher stronger horizontal structure.

Records: T-008, T-013, T-014, T-017, T-031, T-032, T-037, T-040, T-047, T-083, T-085, T-089, T-095, T-097, T-098, T-100, T-114, T-120, T-122, T-123, T-124, T-125, T-128, T-129, T-131, T-132, T-133, T-134, T-135, T-136, T-137, T-139, T-158, T-162

### Cluster 03 — 57 records

Machine-visible tendencies: lower lighter overall field, lower stronger vertical structure, lower denser edges and printed detail, lower larger pale-background area.

Records: T-004, T-010, T-016, T-021, T-024, T-034, T-036, T-038, T-041, T-044, T-045, T-046, T-048, T-049, T-051, T-054, T-059, T-061, T-062, T-063, T-064, T-065, T-069, T-070, T-072, T-073, T-084, T-086, T-088, T-090, T-091, T-096, T-103, T-107, T-110, T-111, T-113, T-115, T-130, T-148, T-149, T-150, T-152, T-154, T-159, T-167, T-168, T-169, T-171, T-174, T-175, T-177, T-178, T-180, T-181, T-183, T-185

### Cluster 04 — 2 records

Machine-visible tendencies: higher larger dark-print area, higher darker central region, higher higher colour saturation, higher stronger tonal contrast.

Records: T-006, T-007

### Cluster 05 — 83 records

Machine-visible tendencies: lower stronger tonal contrast, lower darker central region, higher lighter overall field, lower higher colour saturation.

Records: T-002, T-009, T-011, T-012, T-015, T-018, T-019, T-020, T-022, T-023, T-025, T-033, T-035, T-039, T-042, T-043, T-050, T-052, T-053, T-055, T-056, T-057, T-058, T-060, T-066, T-067, T-068, T-071, T-074, T-075, T-076, T-077, T-078, T-079, T-080, T-081, T-082, T-087, T-092, T-093, T-094, T-099, T-101, T-102, T-104, T-105, T-106, T-108, T-109, T-112, T-117, T-118, T-119, T-121, T-126, T-127, T-138, T-140, T-141, T-142, T-143, T-144, T-145, T-146, T-147, T-151, T-153, T-155, T-156, T-157, T-160, T-161, T-163, T-164, T-165, T-166, T-170, T-172, T-173, T-176, T-179, T-182, T-184

## First review queue

Lowest-confidence OCR or no detected text:

- T-027 — confidence 0.000 — no text detected
- T-001 — confidence 0.300 — 井飞终产终决齐源县饮食服务公司 專决再决决 / 理发票 黟 / 其方青产产共产产为一九七七午的肉內肉肉肉失內肉
- T-003 — confidence 0.300 — 许昌青社招待所 / 钱票 / Tmyz / 伍氟
- T-024 — confidence 0.300 — 中國心民銀村 / 冚入耀 / 晏分
- T-026 — confidence 0.300 — 一！
- T-028 — confidence 0.300 — 複食廳.
- T-029 — confidence 0.300 — 指食事
- T-030 — confidence 0.300 — H食廚 / 九 0平八月地制
- T-044 — confidence 0.300 — 05 / 安徽者地方瀛票 / 市两
- T-054 — confidence 0.300 — 贵州省地方積票 / 拾市斤 / 10
- T-074 — confidence 0.300 — 05 / 黑龙江省粮票 / 半市斤 / 05
- T-075 — confidence 0.300 — 黑龙江省粮票 / 飯析斤 / 1097 / 龙江炒 / 4970 / 壹市呀 / 01
- T-080 — confidence 0.300 — 使用送明 / 辣海食品然 / 高比德澀。 / 私 / 买卖、
- T-090 — confidence 0.300 — 10 / 山西省粮票 / 拾市斥A帮 / 197③ / A
- T-093 — confidence 0.300 — 所洲县干部下徐体点莠用祕票 / 翡溯县 / 参食 / 伍公厅 / 九一年三月三士而最表
- T-094 — confidence 0.300 — 郫县猪肉票 / 贰市斤
- T-097 — confidence 0.300 — 新洲易而部正多住点秦用银票 / 聰食局 / 伍石克 / 九〇年九月三士河最止
- T-100 — confidence 0.300 — ①。 / 新洲县购被美 / £借锵-签 / 九九 年日当月有效过期作废
- T-109 — confidence 0.300 — 辽宁省地方糗票 / 贰市点
- T-116 — confidence 0.300 — 稻賞品人民套員会 / 党粢油系 / （壹雨） / 彭点

## Visual anomaly queue

Highest nearest-neighbour distance in the measured feature space:

- T-006 — distance 11.276 — nearest: T-007, T-030, T-003
- T-007 — distance 11.276 — nearest: T-006, T-030, T-028
- T-137 — distance 9.933 — nearest: T-013, T-129, T-101
- T-089 — distance 7.193 — nearest: T-155, T-032, T-074
- T-132 — distance 6.706 — nearest: T-130, T-101, T-009
- T-004 — distance 6.602 — nearest: T-176, T-117, T-148
- T-130 — distance 6.586 — nearest: T-024, T-132, T-054
- T-131 — distance 6.531 — nearest: T-031, T-106, T-047
- T-026 — distance 6.368 — nearest: T-027, T-001, T-030
- T-135 — distance 6.325 — nearest: T-180, T-067, T-085
- T-013 — distance 6.303 — nearest: T-114, T-098, T-136
- T-138 — distance 6.180 — nearest: T-101, T-009, T-071
- T-133 — distance 6.036 — nearest: T-136, T-013, T-129
- T-136 — distance 6.036 — nearest: T-133, T-013, T-129
- T-158 — distance 6.013 — nearest: T-037, T-100, T-032
