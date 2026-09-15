import json, glob, base64, sys, hashlib, os, tarfile

# 1. Apply single-character fixes to parts (format: file|offset|expected|replacement)
if os.path.exists('deploy.partfixes'):
    for line in open('deploy.partfixes'):
        line = line.strip()
        if not line:
            continue
        p, at, was, now = line.split('|')
        at = int(at)
        c = open(p).read()
        assert len(was) == len(now), 'length mismatch in fix'
        assert c[at:at+len(was)] == was, 'UNEXPECTED at %d in %s: got %r expected %r' % (at, p, c[at:at+len(was)], was)
        open(p, 'w').write(c[:at] + now + c[at+len(was):])
        print('FIXED %s at %d: %r -> %r' % (p, at, was, now))

# 2. Assemble parts -> site.tar.gz
parts = sorted(glob.glob('site_part*.b64'))
print('assembling parts:', parts)
b64 = ''.join(open(p).read().strip() for p in parts)
open('site.tar.gz', 'wb').write(base64.b64decode(b64, validate=True))

# 3. Extract (overwrites existing files with V8 content)
with tarfile.open('site.tar.gz') as t:
    t.extractall()
print('extracted OK')

# 4. Verify blob SHAs of extracted files (post-extraction check)
if os.path.exists('deploy.shas'):
    shas = json.load(open('deploy.shas'))
    bad = 0
    for p, exp in sorted(shas.items()):
        if not os.path.exists(p):
            print('MISS ' + p); bad += 1; continue
        data = open(p, 'rb').read()
        got = hashlib.sha1(b'blob ' + str(len(data)).encode() + b'\x00' + data).hexdigest()
        print(('OK   ' if got == exp else 'FAIL ') + p + ' ' + got)
        if got != exp: bad += 1
    if bad:
        sys.exit('SHA MISMATCH count=' + str(bad))
print('all SHAs verified')
