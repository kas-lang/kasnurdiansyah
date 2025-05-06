// membuat wadah sebuah button dulu
const submit = document.querySelector('.btn.btn-primary.button-right');

// setelah itu lanjut eksekusi getdata nya agar tidak selalu merefresh saat menekan tombol submit
submit.addEventListener('click', function(event) {
    event.preventDefault();

// membuat wadah setiap id dan mengambil data dihtml menggunakan id
    let name = document.getElementById("name").value
    let email = document.getElementById("email").value
    let phone = document.getElementById("phone").value
    let subject = document.getElementById("subject").value
    let message = document.getElementById("message").value

    // menampilkan popup ketika menekan tombol submit
    alert(`nama saya ${name} email saya ${email} nomor hp saya ${phone} dan saya ingin belajar ${subject} dan pesan saya ${message}`)

})
