import json, glob, base64, sys, hashlib, os, tarfile

# 1. Apply fixes (format: file|offset|expected_substr|replacement_substr)
if os.path.exists('deploy.fixes'):
    for line in open('deploy.fixes'):
        line = line.strip()
        if not line:
            continue
        p, at, was, now = line.split('|')
        at = int(at)
        c = open(p).read()
        assert c[at:at+len(was)] == was, 'UNEXPECTED CONTENT at %d in %s: got %r expected %r' % (at, p, c[at:at+len(was)], was)
        open(p, 'w').write(c[:at] + now + c[at+len(was):])
        print('FIXED %s at %d: %r -> %r' % (p, at, was, now))

# 2. Verify blob SHAs
if os.path.exists('deploy.shas'):
    shas = json.load(open('deploy.shas'))
    for p, exp in sorted(shas.items()):
        data = open(p, 'rb').read()
        got = hashlib.sha1(b'blob ' + str(len(data)).encode() + b'\x00' + data).hexdigest()
        print(('OK   ' if got == exp else 'FAIL ') + p + ' ' + got)
        if got != exp:
            sys.exit('SHA MISMATCH for ' + p)

# 3. Assemble, decode, extract
parts = sorted(glob.glob('site_part*.b64'))
print('assembling parts:', parts)
b64 = ''.join(open(p).read().strip() for p in parts)
open('site.tar.gz', 'wb').write(base64.b64decode(b64, validate=True))
with tarfile.open('site.tar.gz') as t:
    t.extractall()
print('extracted OK')
