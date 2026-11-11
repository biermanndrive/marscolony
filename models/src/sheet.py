import sys, glob, os
from PIL import Image, ImageDraw, ImageFont
d_, name, cols = sys.argv[1], sys.argv[2], int(sys.argv[3]); view = sys.argv[4] if len(sys.argv) > 4 else "hero"
fnt=ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",30)
keys=[os.path.basename(f)[:-4] for f in sorted(glob.glob(d_+"/*.glb"), key=os.path.getmtime)]
rows=(len(keys)+cols-1)//cols
S=Image.new("RGB",(cols*900,rows*570),(20,14,10)); d=ImageDraw.Draw(S)
for i,k in enumerate(keys):
    im=Image.open(f"{d_}/{k}_{view}.png").convert("RGB").resize((900,570)); x,y=(i%cols)*900,(i//cols)*570
    S.paste(im,(x,y)); l=k.replace("_"," "); d.rectangle((x+12,y+10,x+32+d.textlength(l,font=fnt),y+56),fill=(20,14,10)); d.text((x+22,y+16),l,fill=(245,235,220),font=fnt)
S.save(f"{d_}/{name}.png"); print(S.size)
