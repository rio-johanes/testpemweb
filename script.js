// JavaScript for Grand Luxe Hotel

document.addEventListener("DOMContentLoaded", function () {
  /* ==========================================================
     ========== 1. NAVBAR HAMBURGER & SIDEBAR KANAN ==========
  ========================================================== */
  const menuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");
  const overlay = document.getElementById("overlay");

  if (menuButton && mobileMenu) {
    const icon = menuButton.querySelector("i");

    menuButton.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.contains("right-0");

      if (isOpen) {
        // Tutup sidebar
        mobileMenu.classList.replace("right-0", "right-[-250px]");
        overlay?.classList.add("hidden");
        icon?.classList.replace("fa-xmark", "fa-bars");
      } else {
        // Buka sidebar
        mobileMenu.classList.replace("right-[-250px]", "right-0");
        overlay?.classList.remove("hidden");
        icon?.classList.replace("fa-bars", "fa-xmark");
      }
    });

    // Tutup sidebar saat klik overlay
    overlay?.addEventListener("click", () => {
      mobileMenu.classList.replace("right-0", "right-[-250px]");
      overlay.classList.add("hidden");
      icon?.classList.replace("fa-xmark", "fa-bars");
    });
  }

  /* ==========================================================
     ========== 1.5. LOGIN/REGISTER FORM TOGGLE (DIPINDAH) ==========
  ========================================================== */
  const registerForm = document.getElementById("register-form");
  const loginForm = document.getElementById("login-form");
  const showLogin = document.getElementById("show-login");
  const showRegister = document.getElementById("show-register");

  // Toggle form
  showLogin?.addEventListener("click", (e) => {
    e.preventDefault();
    registerForm.classList.add("hidden");
    loginForm.classList.remove("hidden");
  });

  showRegister?.addEventListener("click", (e) => {
    e.preventDefault();
    loginForm.classList.add("hidden");
    registerForm.classList.remove("hidden");
  });

  /* ==========================================================
     ========== 2. FORM SUBMISSION HANDLING (DIPERBAIKI) ==========
  ========================================================== */
  const forms = document.querySelectorAll("form");
  forms.forEach((form) => {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const submitButton = form.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;
      submitButton.innerHTML =
        '<i class="fas fa-spinner fa-spin mr-2"></i> Memproses...';
      submitButton.disabled = true;

      setTimeout(() => {
        // === LOGIKA BARU YANG DIGABUNGKAN ===
        if (form.id === "login-form") {
          const email = document
            .getElementById("login-email")
            .value.trim()
            .toLowerCase(); // <-- DITAMBAH .toLowerCase()
          const password = document.getElementById("login-password").value.trim();
          if (email === "grandluxe@admin.com" && password === "admin1234") {
            // LOGIN ADMIN
            alert("Selamat datang, Admin!");
            localStorage.setItem("statusLogin", "admin"); // <-- WAJIB
            window.location.href = "admin.html";
          } else {
            // LOGIN USER BIASA (atau login salah)
            // Anda bisa tambahkan cek user biasa di sini jika perlu
            alert("Selamat datang, Pengguna!");
            localStorage.setItem("statusLogin", "user"); // <-- WAJIB
            window.location.href = "user.html";
          }
        } else if (form.id === "register-form") {
          // LOGIKA REGISTER DIPINDAH KE SINI
          alert("Pendaftaran berhasil! Silakan login.");
          registerForm.classList.add("hidden");
          loginForm.classList.remove("hidden");
        } else if (form.id === "booking-form") {
          alert("Pemesanan berhasil! (Demo)");
          window.location.href = "user.html";
        } else if (form.id === "add-room-form") {
          form.reset();
          alert("Kamar berhasil ditambahkan!");
        } else {
          // Fallback untuk form lain
          alert("Form berhasil dikirim! (Ini hanya demo frontend)");
        }
        
        // Hanya kembalikan tombol jika form tidak pindah halaman
        if (form.id === "register-form" || form.id === "add-room-form") {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
        // Untuk form login/booking, halaman akan pindah jadi tidak perlu
        // mengembalikan tombol.
        
      }, 1500);
    });
  });

  /* ==========================================================
     ========== 3. NAVBAR SCROLL EFFECT ==========
  ========================================================== */
  window.addEventListener("scroll", function () {
    const navbar = document.getElementById("navbar");
    if (window.scrollY > 100) {
      navbar.classList.add("shadow-lg", "py-3");
      navbar.classList.remove("py-4");
    } else {
      navbar.classList.remove("shadow-lg", "py-3");
      navbar.classList.add("py-4");
    }
  });

  /* ==========================================================
     ========== 4. DATE INPUTS ==========
  ========================================================== */
  const today = new Date().toISOString().split("T")[0];
  const checkInInputs = document.querySelectorAll('input[type="date"]');
  checkInInputs.forEach((input) => {
    input.setAttribute("min", today);
  });

  /* ==========================================================
     ========== 5. BOOKING CALCULATION ==========
  ========================================================== */
  const roomRadios = document.querySelectorAll('input[name="room-type"]');
  const calculateTotal = () => {
    const selectedRoom = document.querySelector(
      'input[name="room-type"]:checked'
    );
    const checkIn = document.getElementById("check-in");
    const checkOut = document.getElementById("check-out");

    if (selectedRoom && checkIn?.value && checkOut?.value) {
      const pricePerNight = getRoomPrice(selectedRoom.value);
      const nights = calculateNights(checkIn.value, checkOut.value);
      const tax = 0.1;
      const discount = 0.05;

      if (nights > 0) {
        const subtotal = pricePerNight * nights;
        const taxAmount = subtotal * tax;
        const discountAmount = subtotal * discount;
        const total = subtotal + taxAmount - discountAmount;

        updateSummary(
          selectedRoom.value,
          nights,
          subtotal,
          taxAmount,
          discountAmount,
          total
        );
      }
    }
  };

  const getRoomPrice = (roomType) => {
    const prices = {
      deluxe: 1500000,
      executive: 2800000,
      presidential: 5500000,
    };
    return prices[roomType] || 0;
  };

  const calculateNights = (checkIn, checkOut) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const timeDiff = end.getTime() - start.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const updateSummary = (
    roomType,
    nights,
    subtotal,
    taxAmount,
    discountAmount,
    total
  ) => {
    const roomName = {
      deluxe: "Deluxe Room",
      executive: "Executive Suite",
      presidential: "Presidential Suite",
    };

    // Perlu di-check apakah elemen ini ada sebelum diubah
    const summaryContainer = document.querySelector(".lg\\:col-span-1 .sticky");
    if (summaryContainer) {
        summaryContainer.querySelector(
          ".flex.justify-between.mb-2 span:first-child"
        ).textContent = roomName[roomType];
        summaryContainer.querySelector(
          ".flex.justify-between.mb-2 span:last-child"
        ).textContent = `Rp ${getRoomPrice(
          roomType
        ).toLocaleString()} x ${nights} malam`;
        summaryContainer
          .querySelectorAll(".flex.justify-between.mb-2")[1]
          .querySelector("span:last-child").textContent = `Rp ${Math.round(
          taxAmount
        ).toLocaleString()}`;
        summaryContainer
          .querySelectorAll(".flex.justify-between.mb-2")[2]
          .querySelector("span:last-child").textContent = `- Rp ${Math.round(
          discountAmount
        ).toLocaleString()}`;
        summaryContainer.querySelector(
          ".flex.justify-between.text-lg span:last-child"
        ).textContent = Rp ${Math.round(total).toLocaleString()};
    }
  };

  if (roomRadios.length > 0) {
    roomRadios.forEach((radio) => {
      radio.addEventListener("change", calculateTotal);
    });

    const dateInputs = document.querySelectorAll("#check-in, #check-out");
    dateInputs.forEach((input) => {
      input.addEventListener("change", calculateTotal);
    });

    calculateTotal();
  }

  /* ==========================================================
     ========== 6. IMAGE LAZY LOADING ==========
  ========================================================== */
  const lazyImages = document.querySelectorAll("img[data-src]");
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove("lazy");
        imageObserver.unobserve(img);
      }
    });
  });

  lazyImages.forEach((img) => imageObserver.observe(img));

  /* ==========================================================
     ========== 7. LOGOUT BUTTON (BARU) ==========
  ========================================================== */
  // Tambahkan ID "logout-button" pada semua tombol/link logout Anda di HTML
  const logoutButtons = document.querySelectorAll("#logout-button");
  logoutButtons.forEach(button => {
    button.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("statusLogin");
        alert("Anda telah logout.");
        window.location.href = "login.html"; // Arahkan ke halaman login
    });
  });

}); // <-- HANYA ADA SATU "DOMContentLoaded" PENUTUP

