"""Convert heavy page images to WebP, add a phone-size variant, intrinsic sizes and lazy loading.
Run from the site repo root. Prints a summary; writes a JSON log next to this script."""
import re, os, glob, json, subprocess
from PIL import Image

ROOT = os.getcwd()
PAGES = sorted([f for f in glob.glob('*.dc.html') if not f.startswith('_')] + ['index.html'])
LOG = {'converted': [], 'variants': [], 'tags': 0, 'pages': {}, 'deleted': []}
BIG = 60 * 1024
SMALL_W = 800

def webp_path(src):
    stem, ext = os.path.splitext(src)
    return stem + '.webp'

def convert(src):
    """PNG/JPG above BIG bytes -> WebP at the same stem. Returns the path to use."""
    ext = os.path.splitext(src)[1].lower()
    if ext not in ('.png', '.jpg', '.jpeg') or os.path.getsize(src) <= BIG:
        return src
    out = webp_path(src)
    if not os.path.exists(out):
        im = Image.open(src)
        if im.mode in ('P', 'LA'):
            im = im.convert('RGBA')
        has_alpha = im.mode == 'RGBA' and im.getchannel('A').getextrema()[0] < 255
        if not has_alpha:
            im = im.convert('RGB')
        im.save(out, 'WEBP', quality=82, method=6)
        if os.path.getsize(out) > os.path.getsize(src) * 0.9:
            os.remove(out)
            return src
        LOG['converted'].append((src, os.path.getsize(src), out, os.path.getsize(out)))
    return out

def small_variant(path, w):
    if w <= 1200:
        return None
    stem, ext = os.path.splitext(path)
    out = stem + '-800.webp'
    if not os.path.exists(out):
        im = Image.open(path)
        if im.mode not in ('RGB', 'RGBA'):
            im = im.convert('RGBA' if 'A' in im.mode or im.mode == 'P' else 'RGB')
        h = round(im.size[1] * SMALL_W / im.size[0])
        im.resize((SMALL_W, h), Image.LANCZOS).save(out, 'WEBP', quality=80, method=6)
        LOG['variants'].append((out, os.path.getsize(out)))
    return out

TAG = re.compile(r'<img\b[^>]*>')
ATTR = re.compile(r'(\w[\w-]*)="([^"]*)"')

for page in PAGES:
    s = open(page, encoding='utf-8').read()
    first = [True]
    count = [0]
    def fix(m):
        tag = m.group(0)
        attrs = dict(ATTR.findall(tag))
        src = attrs.get('src', '')
        if not src.startswith('work-images/') or not os.path.exists(src) or src.lower().endswith('.svg'):
            return tag
        new_src = convert(src)
        im = Image.open(new_src)
        w, h = im.size
        small = small_variant(new_src, w)
        tag2 = tag.replace('src="%s"' % src, 'src="%s"' % new_src)
        extra = []
        if small and 'srcset=' not in tag2:
            extra.append('srcset="%s %dw, %s %dw"' % (small, SMALL_W, new_src, w))
            extra.append('sizes="(max-width: 760px) 100vw, %dpx"' % min(w, 1040))
        if 'width=' not in tag2 and 'height=' not in tag2:
            extra.append('width="%d" height="%d"' % (w, h))
        if 'loading=' not in tag2:
            if first[0]:
                extra.append('fetchpriority="high"')
            else:
                extra.append('loading="lazy"')
        if 'decoding=' not in tag2:
            extra.append('decoding="async"')
        first[0] = False
        count[0] += 1
        if extra:
            tag2 = tag2[:-1].rstrip() + ' ' + ' '.join(extra) + '>'
        return tag2
    s2 = TAG.sub(fix, s)
    if s2 != s:
        open(page, 'w', encoding='utf-8').write(s2)
    if count[0]:
        LOG['pages'][page] = count[0]
    LOG['tags'] += count[0]

# delete originals no longer referenced anywhere (text files only)
text_files = subprocess.run(['git', 'ls-files'], capture_output=True, text=True).stdout.split('\n')
text_files = [f for f in text_files if f and os.path.splitext(f)[1] in ('.html', '.js', '.json', '.md', '.css', '.jsx')]
corpus = '\n'.join(open(f, encoding='utf-8', errors='ignore').read() for f in text_files if os.path.exists(f))
for src, _, out, _ in LOG['converted']:
    if os.path.basename(src) not in corpus:
        os.remove(src)
        LOG['deleted'].append(src)

json.dump(LOG, open(os.path.join(ROOT, '.optimize_images.log.json'), 'w'), indent=1)
before = sum(x[1] for x in LOG['converted']); after = sum(x[3] for x in LOG['converted'])
print('tags rewritten', LOG['tags'], 'pages', len(LOG['pages']))
print('converted', len(LOG['converted']), 'files: %.1f MB -> %.1f MB' % (before / 1e6, after / 1e6))
print('phone variants', len(LOG['variants']), 'deleted originals', len(LOG['deleted']))
