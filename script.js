const tombolTambahCatatan = document.querySelector("#btn-tambah-catatan");
const containerCatatan = document.querySelector("#container-catatan");

// url database
const URL_DATABASE = "https://latihan-buku-tamu-default-rtdb.asia-southeast1.firebasedatabase.app/stickynotes.json";

// listener tombol tambah catatan
tombolTambahCatatan.addEventListener("click", () => {
    // antisipasi bila tombol tambah catan diklik padahal formulis ada
    if (Boolean(document.querySelector(".catatan"))){
        return;
    }

    // === membuat elemen ===
    // buat elemen catatan baru
    const elemenCatatan = document.createElement("div");
    elemenCatatan.classList.add("catatan");

    // judul catatan
    const inputJudulCatatan = document.createElement("input");
    inputJudulCatatan.classList.add("input-judul-catatan");
    inputJudulCatatan.placeholder = "Judul Catatan..."

    // isi catatan
    const inputIsiCatatan = document.createElement("textarea");
    inputIsiCatatan.classList.add("input-isi-catatan");
    inputIsiCatatan.placeholder = "Isi catatan..."

    // tombol simpan
    const tombolSimpan = document.createElement("button");
    tombolSimpan.classList.add("btn-simpan");
    tombolSimpan.innerHTML = "Simpan";

    // tombol hapus catatan
    const tombolHapusCatatan = document.createElement("button");
    tombolHapusCatatan.classList.add("btn-hapus-catatan");
    tombolHapusCatatan.innerHTML = "X";

    // input warna
    const inputWarna = document.createElement("input");
    inputWarna.type = "color";
    inputWarna.classList.add("input-warna");
    inputWarna.value = "#ddd";

    // wadah judul dan tombol hapus
    const wadahJudulTombolHapus = document.createElement("div");
    wadahJudulTombolHapus.classList.add("wadah-judul-btn-hapus");

    // wadah input warna dan tombol simpan
    const wadahInputWarnaTombolSimpan = document.createElement("div");
    wadahInputWarnaTombolSimpan.classList.add("wadah-input-warna-btn-simpan")


    // === listener ===
    // simpan catatan
    tombolSimpan.addEventListener("click", async () => {
        // doubel click simpan cara saya wkwk
        // elemenCatatan.remove(); 

        if (inputIsiCatatan.value === "" || inputJudulCatatan.value === ""){
            console.log("Catatan belum lengkap");
            return;
        }

        // antisipasi double click, dengan melumpuhkan tomol
        tombolSimpan.disabled = true;
        tombolSimpan.innerHTML = "Menyimpan...";

        const judul = inputJudulCatatan.value;
        const isi = inputIsiCatatan.value;
        const warna = inputWarna.value;

        const catatanBaru = {judulCatatan: judul, isiCatatan: isi, warnaBackground: warna};

        // menyimpan ke database
        const respon = await fetch(URL_DATABASE,{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(catatanBaru)
        })

        if(respon){
            console.log("Catatan berhasil disimpan");
            menampilkanCatatan();
        }else{
            console.log("Gagal menyiman catatan");
        }
    })

    // color backgroun
    inputWarna.addEventListener("input", () => {
        elemenCatatan.style.backgroundColor = inputWarna.value;
    })

    // batal tambah catatan
    tombolHapusCatatan.addEventListener("click", () => {
        elemenCatatan.remove();
    })


    // === append ===
    // wadah judul dan tombol hapus
    wadahJudulTombolHapus.appendChild(inputJudulCatatan);
    wadahJudulTombolHapus.appendChild(tombolHapusCatatan);

    // wadah input warna dan tombol simpan
    wadahInputWarnaTombolSimpan.appendChild(inputWarna);
    wadahInputWarnaTombolSimpan.appendChild(tombolSimpan);

    // elmen catatan
    elemenCatatan.appendChild(wadahJudulTombolHapus);
    elemenCatatan.appendChild(inputIsiCatatan);
    elemenCatatan.appendChild(wadahInputWarnaTombolSimpan);

    // container catatan
    containerCatatan.appendChild(elemenCatatan);

    // kursor kedip di judul
    inputJudulCatatan.focus();
})


// Menampilkan catatan dari database ke brose
async function menampilkanCatatan() {
    try{
        // membersihkan wadah sebelum update tampilan
        containerCatatan.innerHTML = "";

        const respon = await fetch(URL_DATABASE);
        const dataHasil = await respon.json();

        for (const idUnik in dataHasil){
            const teksJudul = dataHasil[idUnik].judulCatatan;
            const teksIsi = dataHasil[idUnik].isiCatatan;
            const kodeWarna = dataHasil[idUnik].warnaBackground;

            // == membuat elemen ==
            // wadah catatan
            const elemenCatatan = document.createElement("div");
            elemenCatatan.classList.add("elemen-catatan");
            elemenCatatan.style.backgroundColor = kodeWarna;

            // wadah judul dan tombol hapus
            const wadahJudulTombolHapus = document.createElement("div");
            wadahJudulTombolHapus.classList.add("wadahJudulTombolHapus");

            // judul
            const judul = document.createElement("h3");
            judul.classList.add("judul");
            judul.innerHTML = teksJudul;

            // tombol hapus
            const tombolHapus = document.createElement("button");
            tombolHapus.classList.add("btn-hapus");
            tombolHapus.innerHTML = "X";

            // isi
            const isi = document.createElement("div");
            isi.classList.add("isi");
            isi.innerHTML = teksIsi;

            // == append ==
            wadahJudulTombolHapus.appendChild(judul);
            wadahJudulTombolHapus.appendChild(tombolHapus);

            elemenCatatan.appendChild(wadahJudulTombolHapus);
            elemenCatatan.appendChild(isi);

            containerCatatan.appendChild(elemenCatatan);

            // == listener ==
            tombolHapus.addEventListener("click", async () => {
                const responHapus = await fetch(`https://latihan-buku-tamu-default-rtdb.asia-southeast1.firebasedatabase.app/stickynotes/${idUnik}.json`, {method: "DELETE"});

                // console.log(responHapus);
                menampilkanCatatan();
            });

            // console.log(dataHasil);

        }
    }
    catch(error){
        console.log("Eror:", error);
    }   
}

menampilkanCatatan();