import struct, sys
def chunks(p):
    d = open(p, 'rb').read(); i = 12; out = []
    while i + 8 <= len(d):
        cid = d[i:i+4]; sz = struct.unpack('<I', d[i+4:i+8])[0]
        extra = d[i+8:i+12].decode('latin1') if cid == b'LIST' else ''
        body = d[i+8:i+8+min(sz, 120)] if cid in (b'LIST',) else b''
        out.append(f"{cid.decode('latin1')}({sz}){extra} {body[4:] if body else ''}")
        i += 8 + sz + (sz & 1)
    return out
def variant(src, dst, mode):
    """Rebuild a WAV with the id3/INFO chunks in a different case/position."""
    d = open(src, 'rb').read(); i = 12; ch = []
    while i + 8 <= len(d):
        cid = d[i:i+4]; sz = struct.unpack('<I', d[i+4:i+8])[0]
        ch.append([cid, d[i+8:i+8+sz]]); i += 8 + sz + (sz & 1)
    id3 = [c for c in ch if c[0].lower() == b'id3 ']
    info = [c for c in ch if c[0] == b'LIST']
    core = [c for c in ch if c not in id3 and c not in info]
    if 'lower' in mode:
        for c in id3: c[0] = b'id3 '
    fmt = [c for c in core if c[0] == b'fmt ']; data = [c for c in core if c[0] == b'data']
    if 'before' in mode: order = fmt + info + id3 + data
    else: order = fmt + info + data + id3
    body = b''.join(c[0] + struct.pack('<I', len(c[1])) + c[1] + (b'\0' if len(c[1]) & 1 else b'') for c in order)
    open(dst, 'wb').write(b'RIFF' + struct.pack('<I', len(body) + 4) + b'WAVE' + body)
if __name__ == '__main__':
    if sys.argv[1] == 'dump': print(' | '.join(chunks(sys.argv[2])))
    else: variant(sys.argv[2], sys.argv[3], sys.argv[1])
