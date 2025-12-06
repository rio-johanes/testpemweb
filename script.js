const API_BASE_URL = "https://backend-testpemweb.vercel.app/api";

// ============================================================
// NOTIFICATION SYSTEM - Custom Toast Notifications
// ============================================================
const NotificationSystem = {
  init() {
    // Create notification container dengan responsive positioning
    const container = document.createElement("div");
    container.id = "notification-container";
    container.className =
      "fixed z-[9999] flex flex-col gap-3 max-w-sm w-[90vw] md:w-auto sm:max-w-md";
    document.body.appendChild(container);

    // Responsive positioning
    this.updatePosition();
    window.addEventListener("resize", () => this.updatePosition());
  },

  updatePosition() {
    const container = document.getElementById("notification-container");
    if (!container) return;

    // Untuk mobile, posisi sedikit ke dalam dari tepi
    if (window.innerWidth < 768) {
      container.className = "fixed z-[9999] flex flex-col gap-3 w-[90vw] max-w-sm left-1/2 transform -translate-x-1/2 top-4";
    } else {
      container.className = "fixed z-[9999] flex flex-col gap-3 max-w-md w-auto right-6 top-6";
    }
  },

  show(message, type = "info", duration = 5000) {
    const container = document.getElementById("notification-container");
    if (!container) this.init();

    const notification = document.createElement("div");
    const id = "toast-" + Date.now();
    notification.id = id;

    // Base styling yang lebih compact untuk mobile
    const baseStyles =
      "rounded-xl shadow-xl p-3 pl-4 pr-12 transform transition-all duration-500 translate-y-[-100px] opacity-0 relative overflow-hidden backdrop-blur-sm border-l-4";

    // Type-based styling
    const typeStyles = {
      success:
        "bg-gradient-to-r from-green-50 to-green-100 text-green-800 border-green-500",
      error:
        "bg-gradient-to-r from-red-50 to-red-100 text-red-800 border-red-500",
      warning:
        "bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-800 border-yellow-500",
      info: "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 border-blue-500",
    };

    // Icons per type
    const icons = {
      success: '<i class="fas fa-check-circle text-green-500"></i>',
      error: '<i class="fas fa-exclamation-circle text-red-500"></i>',
      warning: '<i class="fas fa-exclamation-triangle text-yellow-500"></i>',
      info: '<i class="fas fa-info-circle text-blue-500"></i>',
    };

    // Title per type
    const titles = {
      success: "Berhasil!",
      error: "Error!",
      warning: "Peringatan!",
      info: "Info",
    };

    notification.className = `${baseStyles} ${typeStyles[type]} animate-toast-in`;
    notification.innerHTML = `
            <div class="flex items-start">
                <div class="text-lg mr-3 mt-0.5 flex-shrink-0">
                    ${icons[type]}
                </div>
                <div class="flex-1 min-w-0">
                    <div class="font-bold font-sans mb-1 truncate">${titles[type]}</div>
                    <div class="text-sm font-medium break-words line-clamp-2">${message}</div>
                </div>
            </div>
            <button onclick="NotificationSystem.close('${id}')" 
                    class="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors w-6 h-6 flex items-center justify-center">
                <i class="fas fa-times text-xs"></i>
            </button>
            <div class="absolute bottom-0 left-0 right-0 h-1 bg-current opacity-20">
                <div class="h-full bg-current progress-bar" style="width: 100%"></div>
            </div>
        `;

    container.appendChild(notification);

    // Trigger animation
    setTimeout(() => {
      notification.classList.remove("translate-y-[-100px]", "opacity-0");
      notification.classList.add("translate-y-0", "opacity-100");

      // Start progress bar animation
      const progressBar = notification.querySelector(".progress-bar");
      if (progressBar) {
        progressBar.style.transition = `width ${duration}ms linear`;
        progressBar.style.width = "0%";
      }
    }, 10);

    // Auto remove
    if (duration > 0) {
      setTimeout(() => this.close(id), duration);
    }

    return id;
  },

  close(id) {
    const notification = document.getElementById(id);
    if (notification) {
      notification.classList.remove("translate-y-0", "opacity-100");
      notification.classList.add("translate-y-[-100px]", "opacity-0");
      setTimeout(() => notification.remove(), 500);
    }
  },

  success(message, duration = 5000) {
    // Durasi lebih pendek untuk mobile
    const mobileDuration = window.innerWidth < 768 ? 3000 : duration;
    return this.show(message, "success", mobileDuration);
  },

  error(message, duration = 5000) {
    const mobileDuration = window.innerWidth < 768 ? 4000 : duration;
    return this.show(message, "error", mobileDuration);
  },

  warning(message, duration = 5000) {
    const mobileDuration = window.innerWidth < 768 ? 3500 : duration;
    return this.show(message, "warning", mobileDuration);
  },

  info(message, duration = 5000) {
    const mobileDuration = window.innerWidth < 768 ? 3000 : duration;
    return this.show(message, "info", mobileDuration);
  },
};

document.addEventListener("DOMContentLoaded", () => {
  NotificationSystem.init();

  const style = document.createElement("style");
  style.textContent = `
        @keyframes toastIn {
            from {
                transform: translateY(-100px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
        
        @keyframes toastOut {
            from {
                transform: translateY(0);
                opacity: 1;
            }
            to {
                transform: translateY(-100px);
                opacity: 0;
            }
        }
        
        .animate-toast-in {
            animation: toastIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
        }
        
        .animate-toast-out {
            animation: toastOut 0.3s ease-in forwards;
        }
        
        #notification-container {
            pointer-events: none;
        }
        
        #notification-container > div {
            pointer-events: auto;
        }
        
        /* Responsive text sizes */
        @media (max-width: 640px) {
            #notification-container > div {
                font-size: 14px;
            }
            #notification-container > div .text-lg {
                font-size: 16px;
            }
            #notification-container > div .text-sm {
                font-size: 12px;
            }
        }
        
        /* Untuk layar sangat kecil */
        @media (max-width: 360px) {
            #notification-container {
                width: 95vw !important;
                max-width: 95vw !important;
            }
            #notification-container > div {
                padding: 10px 12px !important;
            }
        }
        
        /* Pastikan notif di atas semua elemen */
        #notification-container {
            z-index: 99999 !important;
        }
    `;
  document.head.appendChild(style);
});

// method close untuk animation out
NotificationSystem.close = function(id) {
    const notification = document.getElementById(id);
    if (notification) {
        notification.classList.add("animate-toast-out");
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }
};

// ============================================================
// 1. NAVBAR & UI (Mobile Menu & Scroll)
// ============================================================
document.addEventListener("DOMContentLoaded", function () {
  const menuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");
  const overlay = document.getElementById("overlay");

  if (menuButton && mobileMenu) {
    const toggleMenu = () => {
      const isClosed = mobileMenu.classList.contains("right-[-250px]");
      if (isClosed) {
        mobileMenu.classList.replace("right-[-250px]", "right-0");
        overlay?.classList.remove("hidden");
      } else {
        mobileMenu.classList.replace("right-0", "right-[-250px]");
        overlay?.classList.add("hidden");
      }
    };
    menuButton.addEventListener("click", toggleMenu);
    overlay?.addEventListener("click", toggleMenu);
  }

  window.addEventListener("scroll", function () {
    const navbar = document.getElementById("navbar");
    if (navbar) {
      if (window.scrollY > 100) {
        navbar.classList.add("shadow-lg", "py-3");
        navbar.classList.remove("py-4");
      } else {
        navbar.classList.remove("shadow-lg", "py-3");
        navbar.classList.add("py-4");
      }
    }
  });

  // ============================================================
  // 2. AUTHENTICATION (LOGIN & REGISTER)
  // ============================================================
  const registerForm = document.getElementById("register-form");
  const loginForm = document.getElementById("login-form");
  const showLogin = document.getElementById("show-login");
  const showRegister = document.getElementById("show-register");

  if (showLogin) {
    showLogin.addEventListener("click", (e) => {
      e.preventDefault();
      registerForm?.classList.add("hidden");
      loginForm?.classList.remove("hidden");
    });
  }

  if (showRegister) {
    showRegister.addEventListener("click", (e) => {
      e.preventDefault();
      loginForm?.classList.add("hidden");
      registerForm?.classList.remove("hidden");
    });
  }

  // REGISTER
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = registerForm.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
      btn.disabled = true;

      const payload = {
        name: document.getElementById("reg-name").value,
        email: document.getElementById("reg-email").value,
        phone: document.getElementById("reg-phone").value,
        password: document.getElementById("reg-password").value,
      };

      try {
        const res = await fetch(`${API_BASE_URL}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();

        if (data.success) {
          NotificationSystem.success("Berhasil daftar! Silakan login.");
          registerForm.reset();
          registerForm.classList.add("hidden");
          loginForm.classList.remove("hidden");
        } else {
          NotificationSystem.error(data.message || "Gagal mendaftar");
        }
      } catch (err) {
        NotificationSystem.error("Error koneksi jaringan");
      } finally {
        btn.textContent = originalText;
        btn.disabled = false;
      }
    });
  }

  // LOGIN
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = loginForm.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Masuk...';
      btn.disabled = true;

      const payload = {
        email: document.getElementById("login-email").value,
        password: document.getElementById("login-password").value,
      };

      try {
        const res = await fetch(`${API_BASE_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();

        if (data.success) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("role", data.user.role);
          localStorage.setItem("userName", data.user.name);
          localStorage.setItem("userEmail", payload.email);

          NotificationSystem.success(`Selamat datang, ${data.user.name}!`);
          setTimeout(() => {
            window.location.href =
              data.user.role === "Admin" ? "admin.html" : "user.html";
          }, 1500);
        } else {
          NotificationSystem.error(data.message || "Login gagal");
        }
      } catch (err) {
        NotificationSystem.error("Error koneksi jaringan");
      } finally {
        btn.textContent = originalText;
        btn.disabled = false;
      }
    });
  }

  // LOGOUT
  const handleLogout = (e) => {
    e.preventDefault();
    NotificationSystem.info("Anda telah keluar dari sistem");
    localStorage.clear();
    setTimeout(() => {
      window.location.href = "login.html";
    }, 1000);
  };

  [
    "logout-btn",
    "logout-btn-admin",
    "logout-btn-user",
    "logout-mobile",
  ].forEach((id) => {
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener("click", handleLogout);
  });

  // CEK AVATAR NAVBAR
  const userAvatar = document.getElementById("user-avatar");
  if (userAvatar) {
    const isLogged = localStorage.getItem("isLoggedIn") === "true";
    const userRole = localStorage.getItem("role");
    userAvatar.href = isLogged
      ? userRole === "Admin"
        ? "admin.html"
        : "user.html"
      : "login.html";
  }

  // ============================================================
  // 3. BOOKING SYSTEM (USER)
  // ============================================================
  const bookingForm = document.getElementById("booking-form");
  const checkInInput = document.getElementById("check-in");
  const checkOutInput = document.getElementById("check-out");

  // Tangkap Data dari URL
  const urlParams = new URLSearchParams(window.location.search);
  const roomIdParam = urlParams.get("id");
  const roomTypeParam = urlParams.get("type");
  const roomPriceParam = urlParams.get("price");

  if (document.getElementById("display-room-type")) {
    if (!roomIdParam) {
      NotificationSystem.warning("Silakan pilih kamar terlebih dahulu!", 3000);
      setTimeout(() => {
        window.location.href = "kamar.html";
      }, 2000);
    } else {
      document.getElementById("display-room-type").textContent = roomTypeParam;
      document.getElementById(
        "display-room-price"
      ).textContent = `Rp ${parseInt(roomPriceParam).toLocaleString("id-ID")}`;

      document.getElementById("selected-room-id").value = roomIdParam;
      document.getElementById("selected-room-name").value = roomTypeParam;
      document.getElementById("selected-room-price").value = roomPriceParam;

      // Update Ringkasan Kanan
      document.querySelector(".summary-room-name").textContent = roomTypeParam;
      document.querySelector(
        ".summary-room-details"
      ).textContent = `Rp ${parseInt(roomPriceParam).toLocaleString(
        "id-ID"
      )} / malam`;
    }
  }

  // Proteksi Tanggal
  if (checkInInput && checkOutInput) {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    checkInInput.min = today.toISOString().split("T")[0];
    checkOutInput.disabled = true;

    checkInInput.addEventListener("change", function () {
      if (this.value) {
        checkOutInput.disabled = false;
        const minOut = new Date(this.value);
        minOut.setDate(minOut.getDate() + 1);
        const minOutString = minOut.toISOString().split("T")[0];
        checkOutInput.min = minOutString;
        if (checkOutInput.value && checkOutInput.value < minOutString)
          checkOutInput.value = "";
      }
    });
  }

  // Kalkulasi Total
  const calculateTotal = () => {
    const inDate = document.getElementById("check-in").value;
    const outDate = document.getElementById("check-out").value;
    const price = parseInt(
      document.getElementById("selected-room-price")?.value || 0
    );
    const name = document.getElementById("selected-room-name")?.value;

    if (price > 0 && inDate && outDate) {
      const d1 = new Date(inDate);
      const d2 = new Date(outDate);
      const days = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));

      if (days > 0) {
        const subtotal = price * days;
        const tax = subtotal * 0.1;
        const discount = subtotal * 0.05;
        const total = subtotal + tax - discount;

        document.querySelector(".summary-room-name").textContent = name;
        document.querySelector(
          ".summary-room-details"
        ).textContent = `Rp ${price.toLocaleString()} x ${days} malam`;
        document.querySelector(".summary-tax").textContent = `Rp ${Math.round(
          tax
        ).toLocaleString()}`;
        document.querySelector(
          ".summary-discount"
        ).textContent = `- Rp ${Math.round(discount).toLocaleString()}`;
        document.querySelector(".summary-total").textContent = `Rp ${Math.round(
          total
        ).toLocaleString()}`;
      }
    }
  };

  if (checkInInput) checkInInput.addEventListener("change", calculateTotal);
  if (checkOutInput) checkOutInput.addEventListener("change", calculateTotal);

  // Submit Booking
  if (bookingForm) {
    bookingForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const token = localStorage.getItem("token");
      if (!token) {
        NotificationSystem.warning("Silakan login terlebih dahulu!");
        setTimeout(() => {
          window.location.href = "login.html";
        }, 1500);
        return;
      }

      const inDate = document.getElementById("check-in").value;
      const outDate = document.getElementById("check-out").value;
      const roomId = document.getElementById("selected-room-id").value;
      const price = parseInt(
        document.getElementById("selected-room-price").value
      );
      const roomName = document.getElementById("selected-room-name").value;

      if (!inDate || !outDate) {
        NotificationSystem.error("Tanggal check-in dan check-out wajib diisi!");
        return;
      }

      const days = Math.ceil(
        (new Date(outDate) - new Date(inDate)) / (1000 * 60 * 60 * 24)
      );
      const btn = bookingForm.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.disabled = true;
      btn.textContent = "Memproses...";

      try {
        const res = await fetch(`${API_BASE_URL}/bookings`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            room_id: roomId,
            check_in: inDate,
            check_out: outDate,
            total_price: price * days,
          }),
        });
        const data = await res.json();

        if (data.success) {
          const nomorAdmin = "6282277158217";
          const userName = localStorage.getItem("userName") || "Tamu";
          const totalBayar = parseInt(price * days).toLocaleString("id-ID");
          const textChat = `Halo Admin Grand Luxe, konfirmasi pesanan baru.\n\n*Detail:*\n👤 ${userName}\n🏨 ${roomName}\n📅 ${inDate} s/d ${outDate}\n💰 Rp ${totalBayar}\n\nMohon diproses.`;

          NotificationSystem.success("Pesanan berhasil dibuat!");

          setTimeout(() => {
            if (confirm("Lanjut ke WhatsApp untuk konfirmasi?")) {
              window.open(
                `https://wa.me/${nomorAdmin}?text=${encodeURIComponent(
                  textChat
                )}`,
                "_blank"
              );
            }
            window.location.href = "user.html";
          }, 1000);
        } else {
          NotificationSystem.error(data.message || "Gagal membuat pesanan");
        }
      } catch (err) {
        NotificationSystem.error("Error koneksi jaringan");
      } finally {
        btn.disabled = false;
        btn.textContent = originalText;
      }
    });
  }

  // ============================================================
  // 4. LOAD PUBLIC ROOMS (Anti Putih)
  // ============================================================
  const roomsContainer = document.getElementById("rooms-container");
  if (roomsContainer) {
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/rooms`);
        const json = await res.json();
        if (json.success) {
          roomsContainer.innerHTML = "";
          json.data.forEach((room) => {
            const harga = parseInt(room.price).toLocaleString("id-ID");
            const facilities = room.facilities
              ? room.facilities
                  .split(",")
                  .map(
                    (f) =>
                      `<span class="bg-gray-100 px-2 py-1 rounded text-xs mr-1">${f}</span>`
                  )
                  .join("")
              : "";

            let btnAction = `
                            <button onclick="window.location.href='pemesanan.html?id=${
                              room.id
                            }&type=${encodeURIComponent(room.type)}&price=${
              room.price
            }'" 
                            class="btn-pesan w-full bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90 mt-4 transition">Pesan Sekarang</button>`;

            let statusBadge = "";
            if (room.status !== "Tersedia") {
              btnAction = `<button disabled class="w-full bg-gray-300 text-gray-500 px-4 py-2 rounded cursor-not-allowed mt-4">Tidak Tersedia</button>`;
              statusBadge = `<div class="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow z-10">${room.status}</div>`;
            }

            const defaultImg =
              "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800";
            const imageUrl = room.image_url ? room.image_url : defaultImg;

            roomsContainer.insertAdjacentHTML(
              "beforeend",
              `
                            <div class="room-card bg-white rounded-xl shadow-lg overflow-hidden relative h-full flex flex-col hover:shadow-2xl transition">
                                ${statusBadge}
                                <div class="h-64 w-full overflow-hidden bg-gray-200">
                                    <img 
                                        src="${imageUrl}" 
                                        alt="${room.type}" 
                                        class="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                        onerror="this.onerror=null; this.src='${defaultImg}';" 
                                    />
                                </div>
                                <div class="p-6 flex flex-col flex-grow">
                                    <h3 class="text-xl font-bold mb-2 font-serif">${
                                      room.type
                                    }</h3>
                                    <p class="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">${
                                      room.description || "Kamar nyaman."
                                    }</p>
                                    <div class="mb-4 flex flex-wrap gap-1">${facilities}</div>
                                    <div class="mt-auto pt-4 border-t">
                                        <div class="flex justify-between items-center">
                                            <span class="text-gray-500 text-sm">Mulai</span>
                                            <span class="text-primary font-bold text-lg">Rp ${harga}</span>
                                        </div>
                                        ${btnAction}
                                    </div>
                                </div>
                            </div>`
            );
          });
        } else {
          NotificationSystem.error("Gagal memuat data kamar");
        }
      } catch (err) {
        console.error(err);
        NotificationSystem.error("Error memuat data kamar");
      }
    })();
  }

  // Search Bar
  const searchInput = document.getElementById("search-room-input");
  if (searchInput) {
    searchInput.addEventListener("input", function (e) {
      const keyword = e.target.value.toLowerCase();
      document.querySelectorAll(".room-card").forEach((card) => {
        const title = card.querySelector("h3").textContent.toLowerCase();
        card.style.display = title.includes(keyword) ? "flex" : "none";
      });
    });
  }

  // ============================================================
  // 5. USER DASHBOARD
  // ============================================================
  const bookingHistoryBody = document.getElementById("booking-history-body");
  if (bookingHistoryBody) {
    (async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        NotificationSystem.warning("Silakan login terlebih dahulu");
        setTimeout(() => (window.location.href = "login.html(), 1500"));
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/bookings/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (json.success) {
          bookingHistoryBody.innerHTML = "";
          if (json.data.length === 0)
            bookingHistoryBody.innerHTML =
              '<tr><td colspan="4" class="text-center py-4">Belum ada riwayat pemesanan.</td></tr>';
          else {
            json.data.forEach((b) => {
              let badge = "bg-gray-100";
              if (b.status === "Dikonfirmasi")
                badge = "bg-blue-100 text-blue-800";
              if (b.status === "Aktif") badge = "bg-green-100 text-green-800";
              if (b.status === "Dibatalkan") badge = "bg-red-100 text-red-800";

              const dates = `${new Date(b.check_in).toLocaleDateString(
                "id-ID"
              )} - ${new Date(b.check_out).toLocaleDateString("id-ID")}`;
              bookingHistoryBody.innerHTML += `
                                <tr class="border-b hover:bg-gray-50">
                                    <td class="py-3 px-4 font-medium">${dates}</td>
                                    <td class="py-3 px-4">${
                                      b.room_type
                                    }<br><span class="text-xs text-gray-500">ID: ${
                b.id
              }</span></td>
                                    <td class="py-3 px-4"><span class="${badge} px-2 py-1 rounded text-xs font-bold">${
                b.status
              }</span></td>
                                    <td class="py-3 px-4 font-bold text-primary">Rp ${parseInt(
                                      b.total_price
                                    ).toLocaleString("id-ID")}</td>
                                </tr>`;
            });
          }
        } else {
          NotificationSystem.error("Gagal memuat riwayat pemesanan");
        }
      } catch (err) {
        console.error(err);
        NotificationSystem.error("Error memuat riwayat pemesanan");
      }
    })();
  }

  // ============================================================
  // 6. ADMIN DASHBOARD (LENGKAP + UPLOAD FOTO)
  // ============================================================
  if (window.location.pathname.includes("admin.html")) {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");
    if (!token || role !== "Admin") {
      NotificationSystem.error("Akses ditolak! Hanya admin yang dapat masuk.");
      setTimeout(() => (window.location.href = "login.html"), 1500);
      return;
    }

    // Nama Admin
    const sidebarName = document.querySelector("#admin-sidebar h3.text-lg");
    const sidebarEmail = document.getElementById("admin-email");
    if (sidebarName)
      sidebarName.innerText =
        localStorage.getItem("userName") || "Administrator";
    if (sidebarEmail)
      sidebarEmail.innerText =
        localStorage.getItem("userEmail") || "admin@grandluxe.com";

    // Load Bookings & Statistic
    const loadAdminBookings = async () => {
      const tbody = document.getElementById("bookings-table");
      if (!tbody) return;
      tbody.innerHTML =
        '<tr><td colspan="5" class="text-center py-4">Loading...</td></tr>';

      try {
        const res = await fetch(`${API_BASE_URL}/admin/bookings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (json.success) {
          const bookings = json.data;
          tbody.innerHTML = "";

          const total = bookings.length;
          const duit = bookings
            .filter((b) =>
              ["Selesai", "Aktif", "Dikonfirmasi"].includes(b.status)
            )
            .reduce((a, c) => a + parseInt(c.total_price), 0);
          const tamu = bookings.filter((b) => b.status === "Aktif").length;

          const statAngka = document.querySelectorAll(".bg-white h3.text-2xl");
          if (statAngka.length >= 3) {
            statAngka[0].innerText = total;
            statAngka[1].innerText = `Rp ${duit.toLocaleString("id-ID")}`;
            statAngka[2].innerText = tamu;
          }

          if (bookings.length === 0) {
            tbody.innerHTML =
              '<tr><td colspan="5" class="text-center py-8 text-gray-500">Belum ada pemesanan.</td></tr>';
          } else {
            bookings.forEach((b) => {
              let badge = "bg-gray-100";
              if (b.status === "Dikonfirmasi")
                badge = "bg-blue-100 text-blue-800";
              if (b.status === "Aktif") badge = "bg-green-100 text-green-800";
              if (b.status === "Dibatalkan") badge = "bg-red-100 text-red-800";

              tbody.innerHTML += `
                                <tr class="border-b hover:bg-gray-50">
                                    <td class="p-3 font-bold">#${b.id}</td>
                                    <td class="p-3">${
                                      b.guest_name
                                    }<br><span class="text-xs text-gray-500">${
                b.room_type
              }</span></td>
                                    <td class="p-3 text-sm">${new Date(
                                      b.check_in
                                    ).toLocaleDateString()}</td>
                                    <td class="p-3"><span class="${badge} px-2 py-1 rounded text-xs font-bold">${
                b.status
              }</span></td>
                                    <td class="p-3">
                                        <select onchange="updateStatus(${
                                          b.id
                                        }, this.value)" class="border rounded text-sm bg-white p-1">
                                            <option disabled selected>Aksi</option>
                                            <option value="Dikonfirmasi">Terima</option>
                                            <option value="Aktif">Check-In</option>
                                            <option value="Selesai">Check-Out</option>
                                            <option value="Dibatalkan">Tolak</option>
                                        </select>
                                    </td>
                                </tr>`;
            });
          }
        } else {
          NotificationSystem.error("Gagal memuat data pemesanan");
        }
      } catch (e) {
        tbody.innerHTML =
          '<tr><td colspan="5" class="text-center text-red-500">Error loading data.</td></tr>';
        NotificationSystem.error("Error memuat data pemesanan");
      }
    };
    loadAdminBookings();

    // Update Status Booking
    window.updateStatus = async (id, status) => {
      if (!confirm(`Ubah status pemesanan #${id} ke "${status}"?`)) return;

      try {
        const res = await fetch(`${API_BASE_URL}/admin/bookings/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        });
        const data = await res.json();

        if (data.success) {
          NotificationSystem.success(`Status berhasil diubah ke ${status}`);
          loadAdminBookings();
        } else {
          NotificationSystem.error(data.message || "Gagal mengubah status");
        }
      } catch (e) {
        NotificationSystem.error("Error mengubah status");
      }
    };

    // Navigation Tabs
    document.querySelectorAll("#admin-sidebar a").forEach((link) => {
      link.addEventListener("click", (e) => {
        if (link.classList.contains("kelola-kamar")) {
          e.preventDefault();
          document
            .querySelectorAll('[id$="-content"]')
            .forEach((el) => el.classList.add("hidden"));
          document
            .getElementById("kelola-kamar-content")
            .classList.remove("hidden");
          loadAdminRooms();
        } else if (link.classList.contains("kelola-pemesanan")) {
          e.preventDefault();
          document
            .querySelectorAll('[id$="-content"]')
            .forEach((el) => el.classList.add("hidden"));
          document
            .getElementById("kelola-pemesanan-content")
            .classList.remove("hidden");
          loadAdminBookings();
        } else if (link.getAttribute("href") === "admin.html") {
          document
            .querySelectorAll('[id$="-content"]')
            .forEach((el) => el.classList.add("hidden"));
          document
            .getElementById("dashboard-content")
            .classList.remove("hidden");
        }
      });
    });

    // Load Admin Rooms (DENGAN TOMBOL EDIT & HAPUS)
    window.loadAdminRooms = async () => {
      const tbody = document.getElementById("rooms-table");
      if (!tbody) return;

      try {
        const res = await fetch(`${API_BASE_URL}/rooms`);
        const json = await res.json();
        if (json.success) {
          tbody.innerHTML = "";

          // Update stat kamar
          const statAngka = document.querySelectorAll(".bg-white h3.text-2xl");
          const tersedia = json.data.filter(
            (r) => r.status === "Tersedia"
          ).length;
          if (statAngka.length >= 4) statAngka[3].innerText = tersedia;

          if (json.data.length === 0) {
            tbody.innerHTML =
              '<tr><td colspan="4" class="text-center py-8 text-gray-500">Belum ada kamar terdaftar.</td></tr>';
          } else {
            json.data.forEach((r) => {
              const bg =
                r.status === "Tersedia"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800";
              tbody.innerHTML += `
                                <tr class="border-b hover:bg-gray-50">
                                    <td class="p-3 font-medium">${r.type}</td>
                                    <td class="p-3">Rp ${parseInt(
                                      r.price
                                    ).toLocaleString("id-ID")}</td>
                                    <td class="p-3"><span class="${bg} px-2 py-1 rounded text-xs font-bold">${
                r.status
              }</span></td>
                                    <td class="p-3 flex gap-3">
                                        <button onclick="openEditModal(${
                                          r.id
                                        }, '${r.type}', ${r.price}, '${
                r.status
              }')" class="text-blue-600 hover:underline font-medium">Edit</button>
                                        <button onclick="deleteRoom(${
                                          r.id
                                        })" class="text-red-600 hover:underline font-medium">Hapus</button>
                                    </td>
                                </tr>`;
            });
          }
        } else {
          NotificationSystem.error("Gagal memuat data kamar");
        }
      } catch (e) {
        tbody.innerHTML =
          '<tr><td colspan="4" class="text-center text-red-500">Error loading data.</td></tr>';
        NotificationSystem.error("Error memuat data kamar");
      }
    };

    window.deleteRoom = async (id) => {
      if (!confirm("Hapus kamar ini secara permanen?")) return;

      try {
        const res = await fetch(`${API_BASE_URL}/rooms/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (json.success) {
          NotificationSystem.success("Kamar berhasil dihapus");
          loadAdminRooms();
        } else {
          NotificationSystem.error(json.message || "Gagal menghapus kamar");
        }
      } catch (e) {
        NotificationSystem.error("Error menghapus kamar");
      }
    };

    // Add Room (UPLOAD FOTO)
    const addForm = document.getElementById("add-room-form");
    if (addForm) {
      addForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const btn = addForm.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.innerHTML = "Mengupload...";
        btn.disabled = true;

        const formData = new FormData();
        formData.append("type", document.getElementById("add-room-type").value);
        formData.append(
          "price",
          document.getElementById("add-room-price").value
        );
        formData.append(
          "description",
          document.getElementById("add-room-desc").value
        );
        formData.append(
          "facilities",
          document.getElementById("add-room-facilities").value
        );
        formData.append("status", "Tersedia");

        const fileInput = document.getElementById("add-room-image");
        if (fileInput.files[0]) {
          formData.append("image", fileInput.files[0]);
        }

        try {
          const res = await fetch(`${API_BASE_URL}/rooms`, {
            method: "POST",
            body: formData,
          });
          const json = await res.json();
          if (res.ok) {
            NotificationSystem.success(
              "Kamar berhasil ditambahkan dengan foto!"
            );
            document.getElementById("add-room-modal").classList.add("hidden");
            addForm.reset();
            loadAdminRooms();
          } else {
            NotificationSystem.error(json.message || "Gagal menambahkan kamar");
          }
        } catch (e) {
          NotificationSystem.error("Error koneksi jaringan");
        } finally {
          btn.innerHTML = originalText;
          btn.disabled = false;
        }
      });
    }

    // Edit Room Logic
    window.openEditModal = (id, type, price, status) => {
      const modal = document.getElementById("edit-room-modal");
      if (modal) {
        modal.classList.remove("hidden");
        document.getElementById("edit-room-id").value = id;
        document.getElementById("edit-room-type").value = type;
        document.getElementById("edit-room-price").value = price;
        document.getElementById("edit-room-status").value = status;
      }
    };

    const editForm = document.getElementById("edit-room-form");
    if (editForm) {
      editForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const id = document.getElementById("edit-room-id").value;
        const body = {
          type: document.getElementById("edit-room-type").value,
          price: document.getElementById("edit-room-price").value,
          status: document.getElementById("edit-room-status").value,
        };
        const btn = editForm.querySelector('button[type="submit"]');
        btn.innerText = "Menyimpan...";
        btn.disabled = true;

        try {
          await fetch(`${API_BASE_URL}/rooms/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
          });
          document.getElementById("edit-room-modal").classList.add("hidden");
          NotificationSystem.success("Kamar berhasil diperbarui");
          loadAdminRooms();
        } catch (e) {
          NotificationSystem.error("Error memperbarui kamar");
        } finally {
          btn.innerText = "Simpan Perubahan";
          btn.disabled = false;
        }
      });

      const cancelEdit = document.getElementById("cancel-edit-room");
      if (cancelEdit)
        cancelEdit.addEventListener("click", () =>
          document.getElementById("edit-room-modal").classList.add("hidden")
        );
    }
  }
});

// Auto update copyright year
document.getElementById("current-year").textContent = new Date().getFullYear();

