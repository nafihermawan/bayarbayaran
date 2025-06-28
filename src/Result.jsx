import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Result() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('splitData');
    if (stored) {
      setData(JSON.parse(stored));
    } else {
      navigate('/');
    }
  }, [navigate]);

  if (!data) return null;

  const totalPesanan = data.peserta.reduce((sum, p) => sum + p.rincian.menu, 0);
  const totalPajak = data.peserta.reduce((sum, p) => sum + p.rincian.pajak, 0);
  const totalBiaya = data.peserta.reduce((sum, p) => sum + p.rincian.biaya, 0);
  const totalKeseluruhan = data.peserta.reduce((sum, p) => sum + p.total, 0);

  return (
    <div className="min-h-screen bg-white py-6 px-4 text-gray-800">
      <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">Hasil Split Bill</h1>

      <div className="max-w-md mx-auto">
        {/* Ringkasan Total di atas */}
        <div className="text-sm bg-yellow-50 border border-yellow-200 rounded-xl p-4 shadow-inner mb-6">
          <div className="flex justify-between mb-1">
            <span>Total pesanan</span>
            <strong>Rp{totalPesanan.toLocaleString()}</strong>
          </div>
          <div className="flex justify-between mb-1">
            <span>Pajak</span>
            <strong>{data.pajak}% (Rp{totalPajak.toLocaleString()})</strong>
          </div>
          <div className="flex justify-between mb-1">
            <span>Biaya tambahan</span>
            <strong>Rp{totalBiaya.toLocaleString()}</strong>
          </div>
          <hr className="my-2 border-t border-yellow-300" />
          <div className="flex justify-between mt-2 font-semibold">
            <span>Total akhir</span>
            <strong>Rp{totalKeseluruhan.toLocaleString()}</strong>
          </div>
        </div>

        {data.peserta.map((p, i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-xl p-4 mb-4 shadow-sm"
          >
            <h2 className="text-lg font-semibold mb-1 text-indigo-700">{p.nama}</h2>
            <hr className="mb-3 border-t border-gray-200" />
            <ul className="text-sm text-gray-700 mb-3 space-y-1">
              {p.pesanan.map((menu, idx) => (
                <li key={idx}>
                  • {menu.namaMenu} – Rp{menu.harga.toLocaleString()}
                </li>
              ))}
            </ul>
            <div className="text-sm text-gray-700 space-y-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rp{p.rincian.menu.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Pajak</span>
                <span>Rp{p.rincian.pajak.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Biaya Tambahan</span>
                <span>Rp{p.rincian.biaya.toLocaleString()}</span>
              </div>
            </div>
            <hr className="my-3 border-t border-gray-200" />
            <p className="font-bold text-right text-indigo-600">
              Total: Rp{p.total.toLocaleString()}
            </p>
          </div>
        ))}

        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
          >
            Kembali
          </button>
        </div>
      </div>

      <footer className="text-center text-xs text-gray-400 mt-12">
        by nafih
      </footer>
    </div>
  );
}

export default Result;
