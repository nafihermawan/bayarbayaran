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
      navigate('/'); // Redirect ke home jika tidak ada data
    }
  }, []);

  const hitungTotalPesanan = (pesanan) =>
    pesanan.reduce((total, item) => total + item.harga, 0);

  if (!data) return null;

  const { peserta, pajak, biayaTambahan } = data;
  const totalPesanan = peserta.reduce(
    (sum, p) => sum + hitungTotalPesanan(p.pesanan),
    0
  );
  const persenPajak = parseFloat(pajak) || 0;
  const biayaLain = parseFloat(biayaTambahan) || 0;
  const totalAkhir = totalPesanan + (totalPesanan * persenPajak) / 100 + biayaLain;

  const totalPerPeserta = peserta.map((p) => {
    const subtotal = hitungTotalPesanan(p.pesanan);
    const proporsi = subtotal / totalPesanan;
    const totalHarusBayar = proporsi * totalAkhir;
    return {
      nama: p.nama,
      pesanan: p.pesanan,
      subtotal,
      harusBayar: Math.round(totalHarusBayar),
    };
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-center text-indigo-600 mb-6">Hasil Pembagian</h1>

      <div className="max-w-md mx-auto bg-white p-4 rounded-xl shadow mb-4">
        <p>Total pesanan: <strong>Rp{totalPesanan.toLocaleString()}</strong></p>
        <p>Pajak: <strong>{persenPajak}%</strong></p>
        <p>Biaya tambahan: <strong>Rp{biayaLain.toLocaleString()}</strong></p>
        <p className="mt-2 border-t pt-2">Total akhir: <strong className="text-green-600">Rp{Math.round(totalAkhir).toLocaleString()}</strong></p>
      </div>

      {totalPerPeserta.map((p, idx) => (
        <div key={idx} className="max-w-md mx-auto bg-white p-4 rounded-xl shadow mb-4">
          <h2 className="font-semibold text-indigo-700 mb-2">{p.nama}</h2>
          {p.pesanan.length > 0 ? (
            <ul className="text-sm text-gray-800 mb-2 list-disc list-inside">
              {p.pesanan.map((item, i) => (
                <li key={i}>
                  {item.namaMenu} - Rp{item.harga.toLocaleString()}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 mb-2">Tidak ada pesanan</p>
          )}
          <p>Subtotal: Rp{p.subtotal.toLocaleString()}</p>
          <p className="font-bold text-green-700">
            Harus bayar: Rp{p.harusbBayar?.toLocaleString() ?? p.harusbBayar}
          </p>
        </div>
      ))}

      <div className="text-center mt-8">
        <button
          onClick={() => navigate('/')}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          ← Kembali ke Input
        </button>
      </div>
    </div>
  );
}

export default Result;
