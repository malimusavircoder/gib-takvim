#!/usr/bin/env python3

from __future__ import annotations

import argparse
import re
from pathlib import Path

from pypdf import PdfReader


MONTHS = {
    "Ocak": 1,
    "Şubat": 2,
    "Mart": 3,
    "Nisan": 4,
    "Mayıs": 5,
    "Haziran": 6,
    "Temmuz": 7,
    "Ağustos": 8,
    "Eylül": 9,
    "Ekim": 10,
    "Kasım": 11,
    "Aralık": 12,
}

TYPE_ORDER = ["kdv", "muhtasar", "gv", "kv", "otv", "gecici", "diger"]
DATE_RE = re.compile(r"^(\d{1,2})\s+([A-Za-zÇĞİÖŞÜçğıöşü]+)\s+2026$")


def normalize_text(text: str) -> str:
    return " ".join(text.split())


def shorten_title(text: str, max_len: int = 78) -> str:
    cleaned = text.replace(" Dönemine Ait ", " ").replace(" Yılına İlişkin ", " ")
    if len(cleaned) <= max_len:
        return cleaned
    return cleaned[: max_len - 1].rstrip() + "…"


def detect_types(items: list[str]) -> list[str]:
    found: list[str] = []

    def add(type_key: str) -> None:
        if type_key not in found:
            found.append(type_key)

    for item in items:
        lower = item.lower()
        if "katma değer vergisi" in lower or "kdv" in lower:
            add("kdv")
        if "muhtasar" in lower or "tevkifatların muhtasar ve prim hizmet" in lower:
            add("muhtasar")
        if "gelir vergisi" in lower or "gvk" in lower:
            add("gv")
        if "kurumlar vergisi" in lower or "kvk" in lower or "kurum geçici" in lower:
            add("kv")
        if "özel tüketim vergisi" in lower or "ötv" in lower:
            add("otv")
        if "geçici vergi" in lower:
            add("gecici")

    if not found:
        found.append("diger")

    return sorted(found, key=TYPE_ORDER.index)


def extract_groups(pdf_path: Path) -> list[dict[str, object]]:
    reader = PdfReader(str(pdf_path))
    bullets: list[str] = []

    for page in reader.pages:
        text = page.extract_text() or ""
        for raw_line in text.splitlines():
            line = normalize_text(raw_line)
            if not line:
                continue
            if "VERGi TAKViMi" in line or "VERGİ TAKVİMİ" in line or "VERGI TAKVIMI" in line:
                continue
            if line.startswith("•"):
                bullets.append(line[1:].strip())
            elif bullets:
                bullets[-1] += f" {line}"

    groups: list[dict[str, object]] = []
    current: dict[str, object] | None = None

    for bullet in bullets:
        match = DATE_RE.match(bullet)
        if match:
            day = int(match.group(1))
            month = MONTHS[match.group(2)]
            current = {"date": f"2026-{month:02d}-{day:02d}", "items": []}
            groups.append(current)
            continue

        if current is not None:
            current["items"].append(bullet)

    return groups


def render_ts(groups: list[dict[str, object]], source_name: str) -> str:
    lines = [
        "// This file is generated from the official 2026 TURMOB tax calendar PDF.",
        f"// Source: {source_name}",
        "// Run: python3 scripts/generate_deadlines_from_pdf.py --input <pdf-path>",
        "",
        "export type DeadlineType = 'kdv' | 'muhtasar' | 'gv' | 'kv' | 'otv' | 'gecici' | 'diger';",
        "",
        "export interface Deadline {",
        "  id: string;",
        "  date: string; // YYYY-MM-DD",
        "  title: string;",
        "  type: DeadlineType;",
        "  types: DeadlineType[];",
        "  note: string;",
        "  items: string[];",
        "}",
        "",
        "export const DEADLINES: Deadline[] = [",
    ]

    for index, group in enumerate(groups, start=1):
        items = list(group["items"])
        types = detect_types(items)
        title = shorten_title(items[0])
        if len(items) > 1:
            title = f"{title} +{len(items) - 1} diğer"
        note = "\\n".join(f"• {item}" for item in items)

        lines.extend(
            [
                "  {",
                f"    id: 'd{index:03d}',",
                f"    date: '{group['date']}',",
                f"    title: {title!r},",
                f"    type: '{types[0]}',",
                f"    types: {types!r},",
                f"    note: {note!r},",
                f"    items: {items!r},",
                "  },",
            ]
        )

    lines.extend(
        [
            "];",
            "",
            "export const TYPE_LABELS: Record<DeadlineType, string> = {",
            "  kdv: 'KDV',",
            "  muhtasar: 'Muhtasar',",
            "  gv: 'Gelir V.',",
            "  kv: 'Kurumlar V.',",
            "  otv: 'ÖTV',",
            "  gecici: 'Geçici V.',",
            "  diger: 'Diğer',",
            "};",
            "",
            "export const MONTHS_TR = ['', 'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];",
            "export const DAYS_TR = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];",
            "",
        ]
    )

    return "\n".join(lines)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True, help="Path to the source PDF")
    parser.add_argument(
        "--output",
        default="src/data/deadlines.ts",
        help="Path to the generated TypeScript file",
    )
    args = parser.parse_args()

    input_path = Path(args.input).expanduser().resolve()
    output_path = Path(args.output).resolve()

    groups = extract_groups(input_path)
    output_path.write_text(render_ts(groups, input_path.name), encoding="utf-8")
    print(f"Generated {output_path} with {len(groups)} deadline dates from {input_path.name}")


if __name__ == "__main__":
    main()
