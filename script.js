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
     ========== 2. FORM SUBMISSION HANDLING ==========
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
        alert("Form berhasil dikirim! (Ini hanya demo frontend)");

        submitButton.textContent = originalText;
        submitButton.disabled = false;

        if (form.id === "login-form") {
          window.location.href = "user.html";
        } else if (form.id === "register-form") {
          window.location.href = "user.html";
        } else if (form.id === "booking-form") {
          window.location.href = "user.html";
        } else if (form.id === "add-room-form") {
          form.reset();
          alert("Kamar berhasil ditambahkan!");
        }
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

    document.querySelector(
      ".flex.justify-between.mb-2 span:first-child"
    ).textContent = roomName[roomType];
    document.querySelector(
      ".flex.justify-between.mb-2 span:last-child"
    ).textContent = `Rp ${getRoomPrice(
      roomType
    ).toLocaleString()} x ${nights} malam`;
    document
      .querySelectorAll(".flex.justify-between.mb-2")[1]
      .querySelector("span:last-child").textContent = `Rp ${Math.round(
      taxAmount
    ).toLocaleString()}`;
    document
      .querySelectorAll(".flex.justify-between.mb-2")[2]
      .querySelector("span:last-child").textContent = `- Rp ${Math.round(
      discountAmount
    ).toLocaleString()}`;
    document.querySelector(
      ".flex.justify-between.text-lg span:last-child"
    ).textContent = `Rp ${Math.round(total).toLocaleString()}`;
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
});

document.addEventListener("DOMContentLoaded", () => {
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

  // Login admin check
  loginForm?.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value.trim();
    
    localStorage.clear(); // Hapus semua data lama
    if (email === "grandluxe@admin.com" && password === "admin1234") {
      alert("Selamat datang, Admin!");
      window.location.href = "admin.html";
    }
  });

  // Register dummy action
  registerForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Pendaftaran berhasil! Silakan login.");
    registerForm.classList.add("hidden");
    loginForm.classList.remove("hidden");
  });
});

