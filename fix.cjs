const fs = require('fs');
const path = 'src/app/scurve/SCurveClient.jsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/✅ /g, '');
content = content.replace(/❌ /g, '');

if (!content.includes('Plus,')) {
  content = content.replace('Upload, FileSpreadsheet', 'Plus, Upload, FileSpreadsheet');
}

content = content.replace(
  'const [editingItem, setEditingItem] = useState(null);',
  'const [editingItem, setEditingItem] = useState(null);\n  const [isAddingItem, setIsAddingItem] = useState(false);\n  const [newItem, setNewItem] = useState({ code: "", description: "", totalPrice: "" });'
);

const handleDelete = `const handleDeleteBoqItem = async (item) => {
    const ok = await showConfirm(\`Yakin hapus \${item.code} - \${item.description}?\`, 'Hapus Item');
    if (!ok) return;
    try {
      const res = await fetch(\`/api/boq/item/\${item.id}\`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Gagal dari server');
      await showAlert('Item berhasil dihapus', 'Sukses');
      setUploadMsg(null);
      loadData();
    } catch(e) {
      await showAlert('Gagal hapus item', 'Error');
    }
  };`;
content = content.replace(/const handleDeleteBoqItem = async \([\S\s]*?catch\(e\) \{\n\s*setUploadMsg[\S\s]*?\n\s*\}\n\s*\};/, handleDelete);

const saveEdit = `const saveItemEdit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(\`/api/boq/item/\${editingItem.id}\`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: editingItem.code,
          description: editingItem.description,
          totalPrice: parseFloat(editingItem.totalPrice) || 0
        })
      });
      if (res.ok) {
        await showAlert('Item berhasil diperbarui', 'Sukses');
        setEditingItem(null);
        setUploadMsg(null);
        loadData();
      } else {
        throw new Error('Gagal update item');
      }
    } catch(err) {
      await showAlert(err.message, 'Error');
    }
  };`;
content = content.replace(/const saveItemEdit = async \([\S\s]*?catch\(err\) \{\n\s*setUploadMsg[\S\s]*?\n\s*\}\n\s*\};/, saveEdit);

const addFunc = `
  const saveNewItem = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/boq/item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: selectedProjectId,
          code: newItem.code,
          description: newItem.description,
          totalPrice: parseFloat(newItem.totalPrice) || 0
        })
      });
      if (res.ok) {
        await showAlert('Item baru berhasil ditambahkan', 'Sukses');
        setIsAddingItem(false);
        setNewItem({ code: '', description: '', totalPrice: '' });
        setUploadMsg(null);
        loadData();
      } else {
        throw new Error('Gagal menambah item');
      }
    } catch(err) {
      await showAlert(err.message, 'Error');
    }
  };
`;
content = content.replace('// └└└ Upload BOQ', addFunc + '\n  // └└└ Upload BOQ');

const targetHeader = `<div style={{ fontSize:13, color:'var(--gray-600)' }}>
                      Atur bulan mulai & selesai per item. Bobot akan didistribusikan linear.
                    </div>`;
const replacementHeader = `<div style={{ fontSize:13, color:'var(--gray-600)' }}>Atur bulan mulai & selesai per item.</div>
                    <div style={{ display:'flex', gap:12 }}>
                      <button className="btn btn-outline" onClick={() => setIsAddingItem(true)} style={{ height:36 }}>
                        <Plus size={14} style={{ marginRight:6 }} />
                        Tambah Item
                      </button>`;
content = content.replace(targetHeader, replacementHeader);

content = content.replace(
  '<button className="btn btn-primary" onClick={saveSchedule} disabled={savingSchedule} style={{ height:36 }}>',
  '</div>\n                    <button className="btn btn-primary" onClick={saveSchedule} disabled={savingSchedule} style={{ height:36 }}>'
);

const addModal = `
          {isAddingItem && (
            <div style={{ position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.5)', zIndex:999, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <div className="card" style={{ width: 400, padding: 24 }}>
                <h3 style={{ marginTop:0, color:'var(--navy-800)' }}>Tambah Item Baru</h3>
                <form onSubmit={saveNewItem} style={{ display:'flex', flexDirection:'column', gap: 12 }}>
                  <div>
                    <label style={{ fontSize:12, fontWeight:600 }}>Kode / Nomor</label>
                    <input type="text" className="form-input" value={newItem.code} onChange={e => setNewItem({...newItem, code: e.target.value})} placeholder="Misal: A.8" required />
                  </div>
                  <div>
                    <label style={{ fontSize:12, fontWeight:600 }}>Uraian Pekerjaan</label>
                    <textarea className="form-input" rows={3} value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} placeholder="Deskripsi pekerjaan" required />
                  </div>
                  <div>
                    <label style={{ fontSize:12, fontWeight:600 }}>Total Price (Rp)</label>
                    <input type="number" className="form-input" value={newItem.totalPrice} onChange={e => setNewItem({...newItem, totalPrice: e.target.value})} placeholder="0" />
                  </div>
                  <div style={{ display:'flex', justifyContent:'flex-end', gap: 8, marginTop: 12 }}>
                    <button type="button" className="btn btn-outline" onClick={() => setIsAddingItem(false)}>Batal</button>
                    <button type="submit" className="btn btn-primary">Tambahkan</button>
                  </div>
                </form>
              </div>
            </div>
          )}
</AnimatePresence>`;
content = content.replace('</AnimatePresence>', addModal);
fs.writeFileSync(path, content);
console.log('Script completed');
