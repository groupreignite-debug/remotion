import sys, numpy as np, soundfile as sf, sherpa_onnx, json
M, wav, out = sys.argv[1:4]
x, sr = sf.read(wav, dtype='float32')
hop = 160  # 10ms
n = len(x)//hop
rms = np.array([np.sqrt(np.mean(x[i*hop:(i+1)*hop]**2)+1e-12) for i in range(n)])
db = 20*np.log10(rms)
speech = db > -45
# segments: merge gaps < 0.3s, drop < 0.08s
segs=[]; i=0
while i<n:
    if speech[i]:
        j=i
        while j<n and speech[j]: j+=1
        segs.append([i,j]); i=j
    else: i+=1
merged=[]
for s in segs:
    if merged and s[0]-merged[-1][1] < 30: merged[-1][1]=s[1]
    else: merged.append(s)
merged=[s for s in merged if s[1]-s[0]>8]
rec = sherpa_onnx.OfflineRecognizer.from_whisper(encoder=f"{M}/medium-encoder.int8.onnx", decoder=f"{M}/medium-decoder.int8.onnx", tokens=f"{M}/medium-tokens.txt", language="ar", task="transcribe", num_threads=4)
res=[]
for a,b in merged:
    st=rec.create_stream(); st.accept_waveform(sr, x[max(0,a*hop-1600):b*hop+1600])
    rec.decode_stream(st)
    res.append({"start":a/100,"end":b/100,"text":st.result.text})
    print(f"{a/100:6.2f}-{b/100:6.2f} {st.result.text}", flush=True)
json.dump({"segments":res,"db":[round(float(v),1) for v in db]}, open(out,"w"), ensure_ascii=False)
