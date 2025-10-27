document.addEventListener("DOMContentLoaded", function () {
  // 1. NAVBAR HAMBURGER & SIDEBAR KANAN
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

 // 2. NAVBAR SCROLL EFFECT
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

 //3. FORM LAIN (BOOKING, ADD ROOM)
  const forms = document.querySelectorAll("form");
  forms.forEach((form) => {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Form login & register ditangani terpisah (abaikan di sini)
      if (form.id === "login-form" || form.id === "register-form") return;

      const submitButton = form.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;
      submitButton.innerHTML =
        '<i class="fas fa-spinner fa-spin mr-2"></i> Memproses...';
      submitButton.disabled = true;

      setTimeout(() => {
        alert("Form berhasil dikirim! (Demo frontend)");

        submitButton.textContent = originalText;
        submitButton.disabled = false;

        if (form.id === "booking-form") {
          window.location.href = "user.html";
        } else if (form.id === "add-room-form") {
          form.reset();
          alert("Kamar berhasil ditambahkan!");
        }
      }, 1200);
    });
  });

 //4. LOGIN & REGISTER HANDLING
  const registerForm = document.getElementById("register-form");
  const loginForm = document.getElementById("login-form");
  const showLogin = document.getElementById("show-login");
  const showRegister = document.getElementById("show-register");

  // Ganti tampilan form
  showLogin?.addEventListener("click", (e) => {
    e.preventDefault();
    registerForm?.classList.add("hidden");
    loginForm?.classList.remove("hidden");
  });

  showRegister?.addEventListener("click", (e) => {
    e.preventDefault();
    loginForm?.classList.add("hidden");
    registerForm?.classList.remove("hidden");
  });

  // Proses login
  loginForm?.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value.trim();

    localStorage.clear(); // Bersihkan sesi lama

    // Admin Login
    if (email === "grandluxe@admin.com" && password === "admin1234") {
      localStorage.setItem("role", "admin");
      alert("Login berhasil! Selamat datang, Administrator.");
      window.location.href = "admin.html";
      return;
    }

    // User Login
    if (email === "grandluxe@user.com" && password === "user1234") {
      localStorage.setItem("role", "user");
      alert("Login berhasil! Selamat datang di Grand Luxe Hotel.");
      window.location.href = "user.html";
      return;
    }  
  });

  // Proses register
  registerForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Pendaftaran berhasil! Silakan login menggunakan akun Anda.");
    registerForm.classList.add("hidden");
    loginForm.classList.remove("hidden");
  });

  //5. PEMESANAN (KALKULASI)
  const roomRadios = document.querySelectorAll('input[name="room-type"]');
  const calculateTotal = () => {
    const selectedRoom = document.querySelector('input[name="room-type"]:checked');
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

  const updateSummary = (roomType, nights, subtotal, taxAmount, discountAmount, total) => {
    const roomName = {
      deluxe: "Deluxe Room",
      executive: "Executive Suite",
      presidential: "Presidential Suite",
    };

    document.querySelector(".summary-room").textContent = roomName[roomType];
    document.querySelector(".summary-night").textContent =
      `Rp ${getRoomPrice(roomType).toLocaleString()} x ${nights} malam`;
    document.querySelector(".summary-tax").textContent =
      `Rp ${Math.round(taxAmount).toLocaleString()}`;
    document.querySelector(".summary-discount").textContent =
      `- Rp ${Math.round(discountAmount).toLocaleString()}`;
    document.querySelector(".summary-total").textContent =
      `Rp ${Math.round(total).toLocaleString()}`;
  };

  if (roomRadios.length > 0) {
    roomRadios.forEach((radio) => radio.addEventListener("change", calculateTotal));
    document.querySelectorAll("#check-in, #check-out").forEach((input) => {
      input.addEventListener("change", calculateTotal);
    });
  }

  //6. LOGOUT HANDLER (UNTUK DASHBOARD)
  const logoutBtn = document.getElementById("logout-btn");
  logoutBtn?.addEventListener("click", () => {
    localStorage.clear();
    alert("Anda telah keluar.");
    window.location.href = "login.html";
  });
});
