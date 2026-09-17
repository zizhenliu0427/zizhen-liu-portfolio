"""Export only the fixed opening phrases as outlined graphic artwork.

Full font export requires Pillow and fonttools==4.59.2. Supply licensed OTFs; neither
the fonts nor a reusable character/font table are included in the output.
Example:
  python scripts/make-boot-lettering.py --fonts .tools/font-comparison/fonts
Existing fixed-art phrases can be recomposed without source fonts:
  python scripts/make-boot-lettering.py --reuse-art --phrases identity permission
"""
import argparse
import hashlib
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / '.tools/font-comparison/python'))

PHRASES = [
    ('brand', 'ZL ARCHIVE', 'DemiBold'),
    ('access', 'ACCESS PERMISSION REQUIRED', 'Normal'),
    ('identity', 'ID CONFIRMED : GUEST VISITOR', 'Normal'),
    ('request', 'REQUEST RECEIVED', 'Normal'),
    ('processing', 'START PROCESSING...', 'Normal'),
    ('processingGlitch', '              SING...', 'Normal'),
    ('permission', 'PERMISSION AUTHORISED', 'Normal'),
    ('welcome', 'WELCOME TO', 'Bold'),
    ('company', 'ZIZHEN LIU', 'Bold'),
    ('database', 'PERSONAL ARCHIVE', 'Bold'),
]

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    source = parser.add_mutually_exclusive_group(required=True)
    source.add_argument('--fonts', type=Path)
    source.add_argument('--reuse-art', action='store_true', help='Recompose named phrases from existing outlined letters; emits no font files')
    parser.add_argument('--phrases', nargs='+', choices=[key for key, _, _ in PHRASES])
    args = parser.parse_args()
    target = ROOT / 'src/boot-lettering-art.json'
    if args.reuse_art:
        if not args.phrases:
            parser.error('--reuse-art requires explicit --phrases')
        art = json.loads(target.read_text(encoding='utf-8'))
        glyphs = {}
        for phrase in art.values():
            for char, cell in zip(phrase['text'], phrase['letters']):
                identity = (phrase['weight'], char)
                if identity in glyphs and glyphs[identity] != cell:
                    raise ValueError(f'Ambiguous letter metrics for {identity}; use the licensed source font')
                glyphs[identity] = cell
        for key, text, weight in PHRASES:
            if key not in args.phrases:
                continue
            art[key] = {**art[key], 'text': text, 'letters': [glyphs[(weight, char)].copy() for char in text]}
        target.write_text(json.dumps(art, ensure_ascii=False, separators=(',', ':')) + '\n', encoding='utf-8')
        print(f'Recomposed {args.phrases} using existing fixed artwork; no font files emitted.')
        return
    from fontTools.ttLib import TTFont
    from fontTools.pens.svgPathPen import SVGPathPen
    from fontTools.pens.transformPen import TransformPen
    from PIL import ImageFont
    art, sources = {}, {}
    for weight in ('Normal', 'DemiBold', 'Bold'):
        path = args.fonts / f'Novecentosanswide-{weight}.otf'
        font = TTFont(path)
        units = font['head'].unitsPerEm
        glyphs, cmap = font.getGlyphSet(), font.getBestCmap()
        layout = ImageFont.truetype(str(path), units)
        sources[weight] = {
            'filename': path.name,
            'sha256': hashlib.sha256(path.read_bytes()).hexdigest(),
            'version': font['name'].getDebugName(5),
        }
        for key, text, phrase_weight in PHRASES:
            if weight != phrase_weight:
                continue
            letters = []
            for i, char in enumerate(text):
                pen = SVGPathPen(glyphs)
                # A fixed graphic cell, with its baseline 0.8 em from the top.
                glyphs[cmap[ord(char)]].draw(TransformPen(pen, (1, 0, 0, -1, 0, units * .8)))
                advance = layout.getlength(char)
                if i + 1 < len(text):
                    advance += layout.getlength(text[i:i+2]) - layout.getlength(char) - layout.getlength(text[i+1])
                letters.append({'width': round(advance / units, 6), 'path': pen.getCommands()})
            art[key] = {'text': text, 'weight': weight, 'units': units, 'letters': letters}
        font.close()
    target = ROOT / 'src/boot-lettering-art.json'
    target.write_text(json.dumps(art, ensure_ascii=False, separators=(',', ':')) + '\n', encoding='utf-8')
    (ROOT / 'verification/boot-lettering').mkdir(parents=True, exist_ok=True)
    (ROOT / 'verification/boot-lettering/sources.json').write_text(json.dumps(sources, indent=2) + '\n', encoding='utf-8')
    print(f'{len(art)} fixed phrases: {target.stat().st_size} bytes. No font files emitted.')

if __name__ == '__main__':
    main()
