import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function App() {
  const [nama, setNama] = useState('');
  const [peserta, setPeserta] = useState([]);
  const [formPesanan, setFormPesanan] = useState([]);
  const [pajak, setPajak] = useState('');
  const [biayaTambahan, setBiayaTambahan] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('splitData');
    if (stored) {
      const parsed = JSON.parse(stored);
      setPeserta(parsed.peserta || []);
      setPajak(parsed.pajak || '');
      setBiayaTambahan(parsed.biayaTambahan || '');
      setFormPesanan((parsed.peserta || []).map(() => ({ namaMenu: '', harga: '' })));
    }
  }, []);

  const tambahPeserta = () => {
    if (nama.trim() !== '' && !peserta.find(p => p.nama === nama)) {
      setPeserta([...peserta, { nama, pesanan: [] }]);
      setFormPesanan([...formPesanan, { namaMenu: '', harga: '' }]);
      setNama('');
    }
  };

  const hapusPeserta = (index) => {
    const newPeserta = [...peserta];
    const newForm = [...formPesanan];
    newPeserta.splice(index, 1);
    newForm.splice(index, 1);
    setPeserta(newPeserta);
    setFormPesanan(newForm);
  };

  const tambahMenu = (index) => {
    const { namaMenu, harga } = formPesanan[index];
    if (!namaMenu || isNaN(harga) || harga <= 0) return;

    const pesertaClone = [...peserta];
    pesertaClone[index].pesanan.push({
      namaMenu,
      harga: parseFloat(harga)
    });
    setPeserta(pesertaClone);

    const formClone = [...formPesanan];
    formClone[index] = { namaMenu: '', harga: '' };
    setFormPesanan(formClone);
  };

  const hapusMenu = (pesertaIndex, menuIndex) => {
    const clone = [...peserta];
    clone[pesertaIndex].pesanan.splice(menuIndex, 1);
    setPeserta(clone);
  };

  const hitungSplit = () => {
    localStorage.setItem('splitData', JSON.stringify({
      peserta,
      pajak,
      biayaTambahan
    }));
    navigate('/hasil');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Sticky Header */}
      <div className="sticky top-0 bg-gray-50 z-10 pt-4 pb-2 shadow-sm">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-1">BayarBayaran 🍽️</h1>
        <p className="text-xs italic text-center text-gray-500 max-w-xs mx-auto leading-tight">
          “Semua dosa orang yang mati syahid diampuni kecuali hutang” (HR. Muslim no. 1886)
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-4">
        {/* Tambah Peserta */}
        <div className="max-w-md mx-auto bg-white p-4 rounded-xl shadow mb-6">
          <h2 className="text-lg font-semibold mb-2">Tambah Peserta</h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Nama peserta"
              className="flex-1 border rounded-lg px-3 py-2"
            />
            <button
              onClick={tambahPeserta}
              className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 w-full sm:w-auto"
            >
              Tambah
            </button>
          </div>
        </div>

        {/* Daftar Peserta */}
        {peserta.map((p, index) => (
          <div
            key={index}
            className="max-w-md mx-auto bg-white p-4 rounded-xl shadow-md mb-4"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-md font-bold text-gray-800">{p.nama}</h3>
              <button
                onClick={() => hapusPeserta(index)}
                className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded hover:bg-red-200"
              >
                Hapus Peserta
              </button>
            </div>

            {/* Daftar Menu */}
            {p.pesanan.length > 0 ? (
              <ul className="mb-3 text-sm text-gray-700">
                {p.pesanan.map((item, i) => (
                  <li key={i} className="flex justify-between items-center mb-1">
                    <span>
                      • {item.namaMenu} – Rp{item.harga.toLocaleString()}
                    </span>
                    <button
                      onClick={() => hapusMenu(index, i)}
                      className="bg-red-50 text-red-500 text-xs px-2 py-0.5 rounded hover:bg-red-100"
                    >
                      Hapus
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 text-sm mb-3">Belum ada pesanan.</p>
            )}

            {/* Total */}
            <p className="text-right font-semibold text-sm text-gray-700 mb-2">
              Total: Rp{p.pesanan.reduce((total, item) => total + item.harga, 0).toLocaleString()}
            </p>

            {/* Form Tambah Menu */}
            <div className="flex flex-col sm:flex-row gap-2 text-sm">
              <input
                type="text"
                placeholder="Nama menu"
                value={formPesanan[index]?.namaMenu || ''}
                onChange={(e) => {
                  const clone = [...formPesanan];
                  clone[index].namaMenu = e.target.value;
                  setFormPesanan(clone);
                }}
                className="flex-1 border px-2 py-1 rounded"
              />
              <input
                type="number"
                placeholder="Harga"
                value={formPesanan[index]?.harga || ''}
                onChange={(e) => {
                  const clone = [...formPesanan];
                  clone[index].harga = e.target.value;
                  setFormPesanan(clone);
                }}
                className="w-full sm:w-24 border px-2 py-1 rounded"
              />
              <button
                onClick={() => tambahMenu(index)}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 w-full sm:w-auto"
              >
                Tambah
              </button>
            </div>
          </div>
        ))}

        {/* Pajak & Biaya */}
        <div className="max-w-md mx-auto bg-white p-4 rounded-xl shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-2">Pajak & Biaya Tambahan</h2>
          <div className="flex flex-col gap-2">
            <input
              type="number"
              placeholder="Pajak (%)"
              value={pajak}
              onChange={(e) => setPajak(e.target.value)}
              className="border px-3 py-2 rounded"
            />
            <input
              type="number"
              placeholder="Biaya Tambahan"
              value={biayaTambahan}
              onChange={(e) => setBiayaTambahan(e.target.value)}
              className="border px-3 py-2 rounded"
            />
          </div>
        </div>

        {/* Tombol Hitung */}
        <div className="max-w-md mx-auto text-center mb-6">
          <button
            onClick={hitungSplit}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl shadow hover:bg-indigo-700 w-full sm:w-auto"
          >
            Hitung Split 💰
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-400 mt-2 mb-4">
        by nafih
      </footer>
    </div>
  );
}

export default App;
