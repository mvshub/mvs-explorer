def parse_lock_height(script):
    import re
    lock_height = 0
    p = '\[([\\w| ]+)\] numequalverify dup hash160 \[[\\w| ]+\] equalverify checksig'
    m = re.match(p, script)
    if m and m.groups():
        def set_vch(h):
            import binascii
            data_chunk = binascii.unhexlify(h.encode('utf8'))
            # print(data_chunk)
            res = 0
            if not data_chunk:
                return res
            # print(enumerate(data_chunk))
            for i, d in enumerate(data_chunk):
                # print(i, d, ord(d))
                res = res | (ord(d) << (8*i) )
            print(d[-1])
            if ord(d[-1]) & 0x80:
                return -(res & ~(0x80 << (8*(len(data_chunk)-1))) )
            return res
        s_lock_height = m.groups()[0].strip()
        # print(s_lock_height)
        lock_height = set_vch(s_lock_height)
    return lock_height

s = '[ 7062 ] numequalverify dup hash160 [ 17c33fd450d417870f596f78a98bada7f245153c ] equalverify checksig'
print parse_lock_height(s)
