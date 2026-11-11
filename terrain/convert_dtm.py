"""
Red Station One - one-time terrain converter
Turns a HiRISE DTM (.IMG, PDS3 format) into a small 16-bit PNG heightmap
plus a JSON file with the real-world scale, ready for the Three.js scene.

Usage (needs Python 3 with numpy and pillow):
    pip install numpy pillow
    python convert_dtm.py DTEEC_060706_2195_060416_2195_A01.IMG

Optional:
    --size 4000      width/height of the cut-out in metres (default 4000)
    --res 1024       output heightmap resolution in pixels (default 1024)

Output (next to the script):
    arcadia_height.png   16-bit greyscale heightmap (a few MB)
    arcadia_height.json  metres per pixel, min/max elevation in metres
Upload both files to the chat.
"""
import argparse, json, re, sys
import numpy as np
from PIL import Image


def read_label(path):
    """Read the plain-text PDS3 label at the start of the file."""
    with open(path, "rb") as f:
        raw = f.read(200_000).decode("latin-1")
    end = re.search(r"^\s*END\s*$", raw, re.M)
    return raw[: end.end()] if end else raw


def label_value(label, key, default=None, block=None):
    text = label
    if block:
        m = re.search(rf"OBJECT\s*=\s*{block}(.*?)END_OBJECT\s*=\s*{block}", label, re.S)
        if m:
            text = m.group(1)
    m = re.search(rf"^\s*{key}\s*=\s*(.+?)\s*$", text, re.M)
    return m.group(1).strip().strip('"') if m else default


def load_dtm(path):
    label = read_label(path)
    record_bytes = int(label_value(label, "RECORD_BYTES"))
    pointer = label_value(label, r"\^IMAGE")
    m = re.match(r"\(?\s*\"?[^,\"]*\"?\s*,?\s*(\d+)\s*(<BYTES>)?\)?", pointer)
    num = int(re.findall(r"\d+", pointer)[-1])
    offset = num - 1 if "<BYTES>" in pointer else (num - 1) * record_bytes

    lines = int(label_value(label, "LINES", block="IMAGE"))
    samples = int(label_value(label, "LINE_SAMPLES", block="IMAGE"))
    stype = label_value(label, "SAMPLE_TYPE", block="IMAGE")
    bits = int(label_value(label, "SAMPLE_BITS", block="IMAGE"))
    if bits != 32 or "REAL" not in stype:
        sys.exit(f"Unexpected sample format: {stype} {bits} bit")
    dtype = "<f4" if stype.startswith("PC") else ">f4"

    scale = label_value(label, "MAP_SCALE", block="IMAGE_MAP_PROJECTION") or label_value(label, "MAP_SCALE")
    mpp = float(re.findall(r"[\d.]+", scale)[0]) if scale else 1.0

    data = np.memmap(path, dtype=dtype, mode="r", offset=offset, shape=(lines, samples))
    return data, mpp


def best_window(data, win):
    """Find the square window with the most relief (and few gaps)."""
    step = max(win // 4, 1)
    best, best_score = (0, 0), -1
    for y in range(0, max(data.shape[0] - win, 1), step):
        for x in range(0, max(data.shape[1] - win, 1), step):
            tile = np.array(data[y : y + win : 16, x : x + win : 16], dtype=np.float32)
            valid = tile > -1e30
            if valid.mean() < 0.97:
                continue
            score = float(np.std(tile[valid]))
            if score > best_score:
                best, best_score = (y, x), score
    if best_score < 0:
        sys.exit("No window without large data gaps found. Try a smaller --size.")
    return best


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("img")
    ap.add_argument("--size", type=int, default=4000, help="cut-out size in metres")
    ap.add_argument("--res", type=int, default=1024, help="output resolution in pixels")
    a = ap.parse_args()

    data, mpp = load_dtm(a.img)
    win = min(int(a.size / mpp), data.shape[0], data.shape[1])
    y, x = best_window(data, win)
    crop = np.array(data[y : y + win, x : x + win], dtype=np.float32)

    crop[crop < -1e30] = np.nan
    if np.isnan(crop).any():
        crop[np.isnan(crop)] = np.nanmedian(crop)

    img = Image.fromarray(crop).resize((a.res, a.res), Image.BILINEAR)
    h = np.asarray(img, dtype=np.float32)
    lo, hi = float(h.min()), float(h.max())
    norm = ((h - lo) / max(hi - lo, 1e-6) * 65535).astype(np.uint16)
    Image.fromarray(norm).save("arcadia_height.png")

    meta = {
        "source": a.img,
        "crop_origin_px": [int(x), int(y)],
        "size_m": round(win * mpp, 1),
        "metres_per_pixel": round(win * mpp / a.res, 3),
        "min_elevation_m": round(lo, 2),
        "max_elevation_m": round(hi, 2),
        "relief_m": round(hi - lo, 2),
    }
    with open("arcadia_height.json", "w") as f:
        json.dump(meta, f, indent=2)
    print(json.dumps(meta, indent=2))
    print("Done: upload arcadia_height.png and arcadia_height.json to the chat.")


if __name__ == "__main__":
    main()
