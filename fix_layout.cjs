const fs = require('fs');
const path = 'src/app/scurve/SCurveClient.jsx';
let content = fs.readFileSync(path, 'utf8');

const target = `                    <div style={{ display:'flex', gap:12 }}>
                      <button className="btn btn-outline" onClick={() => setIsAddingItem(true)} style={{ height:36 }}>
                        <Plus size={14} style={{ marginRight:6 }} />
                        Tambah Item
                      </button>
                    </div>
                    <button className="btn btn-primary" onClick={saveSchedule} disabled={savingSchedule} style={{ height:36 }}>
                      {savingSchedule ? <Loader2 size={14} style={{ animation:'spin 1s linear infinite', marginRight:6 }} /> : <Save size={14} style={{ marginTšYÚˆ_HÏŸBˆÚ[\[ˆ˜YØ[ˆØ]Û‚ˆÙ]˜Â‚˜ÛÛœÝ™\XÙ[Y[H]ˆÝ[O^ÞÈ\Ü^N‰Ù›^	ËØ\ŒL‹[YÛ’][\Î‰ØÙ[\‰È_O‚ˆ]ÛˆÛ\ÜÓ˜[YOH˜ˆ‹[Ý][™HˆÛÛXÚÏ^Ê
HOˆÙ]\ÐY[™Ò][JYJ_HÝ[O^ÞÈZYÚŒÍˆ_O‚ˆ\ÈÚ^™O^ÌMHÝ[O^ÞÈX\™Ú[•&–v‡C£b×Òóà¢FÖ&‚—FVÐ¢Âö'WGFöãà¢Æ'WGFöâ6Æ74æÖSÒ&'Fâ'Fâ×&–Ö'’"öä6Æ–6³×·6fU66†VGVÆWÒF—6&ÆVC×·6f–æu66†VGVÆWÒ7G–ÆS×·²†V–v‡C£3b×Óà¢·6f–æu66†VGVÆRòÄÆöFW#"6—¦S×³GÒ7G–ÆS×·²æ–ÖF–öã¢w7–â2Æ–æV"–æf–æ—FRrÂÖ&v–å&–v‡C£b×Òóâ¢Å6fR6—¦S×³GÒ7G–ÆS×·²Ö&v–å&–v‡C£b×ÒóçÐ¢6–×â¦GvÀ¢Âö'WGFöãà¢ÂöF—cà¢ÂöF—cæ° ¦6öçFVçBÒ6öçFVçBç&WÆ6R‡F&vWBÂ&WÆ6VÖVçB“°¦g2çw&—FTf–ÆU7–æ2‡F‚Â6öçFVçB“°¦6öç6öÆRæÆör‚tf—†VB'WGFöâÆ–÷WBr“° 