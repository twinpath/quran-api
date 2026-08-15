const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, 'surah');
const targetDir = path.join(__dirname, 'surah-3digit');

// Pastikan folder sumber ada
if (!fs.existsSync(sourceDir)) {
  console.error(`Error: Folder sumber '${sourceDir}' tidak ditemukan.`);
  process.exit(1);
}

// Buat folder target jika belum ada
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
  console.log(`Folder target '${targetDir}' berhasil dibuat.`);
}

console.log('Mulai menyalin file...');

let successCount = 0;

for (let i = 1; i <= 114; i++) {
  const sourceFileName = `${i}.json`;
  const sourcePath = path.join(sourceDir, sourceFileName);

  // Buat format 3 digit (misal: 1 -> "001", 12 -> "012", 114 -> "114")
  const targetFileName = `${String(i).padStart(3, '0')}.json`;
  const targetPath = path.join(targetDir, targetFileName);

  if (fs.existsSync(sourcePath)) {
    try {
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`Menyalin: ${sourceFileName} -> ${targetFileName}`);
      successCount++;
    } catch (err) {
      console.error(`Gagal menyalin file ${sourceFileName}:`, err.message);
    }
  } else {
    console.warn(`Peringatan: File ${sourceFileName} tidak ditemukan di folder sumber.`);
  }
}

// - [x] Membuat file script `copy_surah_3digit.js`
// - [x] Menjalankan script penyalinan file
// - [x] Memverifikasi hasil penyalinan di folder `surah-3digit`

console.log(`\nSelesai! Berhasil menyalin ${successCount} dari 114 surah.`);
