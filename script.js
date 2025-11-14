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
        mobileMenu.classList.replace("right-0", "right-[-250px]");
        overlay?.classList.add("hidden");
        icon?.classList.replace("fa-xmark", "fa-bars");
      } else {
        mobileMenu.classList.replace("right-[-250px]", "right-0");
        overlay?.classList.remove("hidden");
        icon?.classList.replace("fa-bars", "fa-xmark");
      }
    });

    overlay?.addEventListener("click", () => {
      mobileMenu.classList.replace("right-0", "right-[-250px]");
      overlay.classList.add("hidden");
      icon?.classList.replace("fa-xmark", "fa-bars");
    });
  }

  // 2. NAVBAR SCROLL EFFECT
  window.addEventListener("scroll", function () {
    const navbar = document.getElementById("navbar");
    if (!navbar) return;
    if (window.scrollY > 100) {
      navbar.classList.add("shadow-lg", "py-3");
      navbar.classList.remove("py-4");
    } else {
      navbar.classList.remove("shadow-lg", "py-3");
      navbar.classList.add("py-4");
    }
  });

  // 3. FORM LAIN (BOOKING, ADD ROOM)
  const forms = document.querySelectorAll("form");
  forms.forEach((form) => {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (form.id === "login-form" || form.id === "register-form") return;

      const submitButton = form.querySelector('button[type="submit"]');
      if (!submitButton) return;
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

  // 4. LOGIN & REGISTER HANDLING
  const registerForm = document.getElementById("register-form");
  const loginForm = document.getElementById("login-form");
  const showLogin = document.getElementById("show-login");
  const showRegister = document.getElementById("show-register");

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

  // LOGIN PROCESS
  loginForm?.addEventListener("submit", (e) => {
    e.preventDefault();

    const emailElem = document.getElementById("login-email");
    const passwordElem = document.getElementById("login-password");
    if (!emailElem || !passwordElem) return;

    const email = emailElem.value.trim();
    const password = passwordElem.value.trim();

    // Clear previous session keys (keputusan awal kamu). Jika tidak ingin clear semua, ganti sesuai kebutuhan.
    localStorage.clear();

    if (email === "grandluxe@admin.com" && password === "admin1234") {
      localStorage.setItem("role", "admin");
      localStorage.setItem("isLoggedIn", "true");
      alert("Login berhasil! Selamat datang, Administrator.");
      window.location.href = "admin.html";
      return;
    }

    if (email === "grandluxe@user.com" && password === "user1234") {
      localStorage.setItem("role", "user");
      localStorage.setItem("isLoggedIn", "true");
      alert("Login berhasil! Selamat datang di Grand Luxe Hotel.");
      window.location.href = "user.html";
      return;
    }

    alert("Email atau password salah!");
  });

  // REGISTER PROCESS
  registerForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Pendaftaran berhasil! Silakan login menggunakan akun Anda.");
    registerForm.classList.add("hidden");
    loginForm.classList.remove("hidden");
  });

  // 5. PEMESANAN (KALKULASI)
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

    const q = (sel) => document.querySelector(sel);
    if (q(".summary-room")) q(".summary-room").textContent = roomName[roomType];
    if (q(".summary-night"))
      q(".summary-night").textContent = `Rp ${getRoomPrice(
        roomType
      ).toLocaleString()} x ${nights} malam`;
    if (q(".summary-tax"))
      q(".summary-tax").textContent = `Rp ${Math.round(taxAmount).toLocaleString()}`;
    if (q(".summary-discount"))
      q(".summary-discount").textContent = `- Rp ${Math.round(discountAmount).toLocaleString()}`;
    if (q(".summary-total"))
      q(".summary-total").textContent = `Rp ${Math.round(total).toLocaleString()}`;
  };

  if (roomRadios.length > 0) {
    roomRadios.forEach((radio) => radio.addEventListener("change", calculateTotal));
    document.querySelectorAll("#check-in, #check-out").forEach((input) => {
      input.addEventListener("change", calculateTotal);
    });
  }

  // 6. LOGOUT HANDLER
  const logoutBtn = document.getElementById("logout-btn");
  logoutBtn?.addEventListener("click", () => {
    localStorage.clear();
    alert("Anda telah keluar.");
    window.location.href = "login.html";
  });

  // === ⭐ FITUR BARU TAMBAHAN SESUAI PERMINTAAN === //

  // A. TOGGLE SHOW/HIDE PASSWORD (aman - tidak double-wrap)
  const togglePasswordFields = () => {
    const passwordInputs = Array.from(document.querySelectorAll("#reg-password, #login-password"));

    passwordInputs.forEach((input) => {
      if (!input) return;
      // jika parent sudah wrapper dengan class 'js-pwd-wrap' jangan bungkus lagi
      if (input.parentElement && input.parentElement.classList.contains("js-pwd-wrap")) return;

      const wrapper = document.createElement("div");
      wrapper.classList.add("relative", "js-pwd-wrap");

      input.parentNode.insertBefore(wrapper, input);
      wrapper.appendChild(input);

      const toggle = document.createElement("i");
      toggle.className = "fa-solid fa-eye absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer";
      wrapper.appendChild(toggle);

      toggle.addEventListener("click", () => {
        if (input.type === "password") {
          input.type = "text";
          toggle.classList.replace("fa-eye", "fa-eye-slash");
        } else {
          input.type = "password";
          toggle.classList.replace("fa-eye-slash", "fa-eye");
        }
      });
    });
  };

  togglePasswordFields();

  // B. VALIDASI HALAMAN PEMESANAN (lebih robust)
  const protectedPages = ["pemesanan.html"];
  const currentPage = window.location.pathname.split("/").pop() || "";

  const isProtected = protectedPages.some((p) => {
    return currentPage.includes(p) || window.location.href.includes(p);
  });

  if (isProtected) {
    const role = localStorage.getItem("role");
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (!isLoggedIn || !role) {
      alert("Silakan login terlebih dahulu untuk melakukan pemesanan.");
      window.location.href = "login.html";
    } else if (role === "admin") {
      alert("Admin tidak dapat melakukan pemesanan.");
      window.location.href = "admin.html";
    }
  }

  // C. VALIDASI "PESAN SEKARANG" DI HALAMAN KAMAR
  // Tangkap anchor yang menuju pemesanan.html dan juga tombol dengan class .btn-pesan
  const pesanSelectors = "a[href='pemesanan.html'], .btn-pesan";
  const pesanButtons = document.querySelectorAll(pesanSelectors);

  pesanButtons.forEach((el) => {
    el.addEventListener("click", (event) => {
      const role = localStorage.getItem("role");
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

      // belum login -> prevent navigation
      if (!isLoggedIn || !role) {
        event.preventDefault();
        alert("Anda harus login terlebih dahulu sebelum memesan.");
        window.location.href = "login.html";
        return;
      }

      // jika admin -> prevent navigation
      if (role === "admin") {
        event.preventDefault();
        alert("Admin tidak dapat melakukan pemesanan.");
        window.location.href = "admin.html";
        return;
      }

      // jika user dan elemen bukan anchor, arahkan manual
      if (el.tagName.toLowerCase() !== "a") {
        event.preventDefault();
        window.location.href = "pemesanan.html";
      }
      // jika anchor dan user, biarkan navigasi default
    });
  });
});


