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

    document.querySelector(".summary-room").textContent = roomName[roomType];
    document.querySelector(".summary-night").textContent = `Rp ${getRoomPrice(
      roomType
    ).toLocaleString()} x ${nights} malam`;
    document.querySelector(".summary-tax").textContent = `Rp ${Math.round(
      taxAmount
    ).toLocaleString()}`;
    document.querySelector(
      ".summary-discount"
    ).textContent = `- Rp ${Math.round(discountAmount).toLocaleString()}`;
    document.querySelector(".summary-total").textContent = `Rp ${Math.round(
      total
    ).toLocaleString()}`;
  };

  if (roomRadios.length > 0) {
    roomRadios.forEach((radio) =>
      radio.addEventListener("change", calculateTotal)
    );
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

// 7. ADMIN SIDEBAR NAVIGATION - DIPERBARUI
document.addEventListener("DOMContentLoaded", function () {
  // Data storage (simulasi database)
  let roomsData = [
    { id: 1, type: "Deluxe Room", price: "1500000", status: "Tersedia", description: "Kamar mewah dengan pemandangan kota", facilities: "WiFi, AC, TV" },
    { id: 2, type: "Executive Suite", price: "2800000", status: "Tersedia", description: "Suite eksklusif dengan ruang tamu terpisah", facilities: "WiFi, AC, TV, Mini Bar" },
    { id: 3, type: "Presidential Suite", price: "5500000", status: "Tidak Tersedia", description: "Akomodasi paling mewah dengan fasilitas terbaik", facilities: "WiFi, AC, TV, Jacuzzi, Butler Service" },
    { id: 4, type: "Family Suite", price: "3200000", status: "Tersedia", description: "Suite luas dengan dua kamar tidur", facilities: "WiFi, AC, TV, 2 Kamar Tidur" }
  ];

  let bookingsData = [
    { id: "GLH-20231115-001", name: "Sarah Johnson", checkin: "2023-11-15", checkout: "2023-11-18", status: "Aktif", roomType: "Executive Suite" },
    { id: "GLH-20231112-002", name: "Michael Chen", checkin: "2023-11-12", checkout: "2023-11-14", status: "Selesai", roomType: "Deluxe Room" },
    { id: "GLH-20231110-003", name: "Lisa Williams", checkin: "2023-11-10", checkout: "2023-11-12", status: "Dibatalkan", roomType: "Presidential Suite" },
    { id: "GLH-20231108-004", name: "Robert Brown", checkin: "2023-11-08", checkout: "2023-11-10", status: "Pending", roomType: "Family Suite" }
  ];

  let usersData = [
    { id: 1, name: "Sarah Johnson", email: "sarah.j@example.com", role: "User", status: "Aktif" },
    { id: 2, name: "Michael Chen", email: "michael.c@example.com", role: "User", status: "Aktif" },
    { id: 3, name: "Admin User", email: "admin@example.com", role: "Admin", status: "Aktif" },
    { id: 4, name: "Lisa Williams", email: "lisa.w@example.com", role: "User", status: "Nonaktif" }
  ];

  // Variabel untuk menyimpan data yang sedang diedit
  let currentEditingRoom = null;
  let currentEditingBooking = null;
  let currentEditingUser = null;

  // Fungsi untuk menampilkan konten yang sesuai
  function showContent(contentId) {
    // Sembunyikan semua konten
    const contents = [
      "dashboard-content",
      "kelola-kamar-content",
      "kelola-pemesanan-content",
      "kelola-pengguna-content",
      "laporan-content",
      "pengaturan-content"
    ];
    
    contents.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.classList.add("hidden");
      }
    });
    
    // Tampilkan konten yang dipilih
    const selectedContent = document.getElementById(contentId);
    if (selectedContent) {
      selectedContent.classList.remove("hidden");
    }
    
    // Update menu aktif
    const menuItems = document.querySelectorAll(".lg\\:col-span-1 a");
    menuItems.forEach(item => {
      item.classList.remove("bg-primary", "text-white");
      item.classList.add("hover:bg-gray-100");
    });
    
    // Highlight menu aktif
    const activeMenuItem = document.querySelector(`.${contentId.replace("-content", "")}`);
    if (activeMenuItem) {
      activeMenuItem.classList.add("bg-primary", "text-white");
      activeMenuItem.classList.remove("hover:bg-gray-100");
    }
  }
  
  // Event listeners untuk menu sidebar
  document.querySelector(".kelola-kamar")?.addEventListener("click", function(e) {
    e.preventDefault();
    showContent("kelola-kamar-content");
    loadRoomsData();
  });
  
  document.querySelector(".kelola-pemesanan")?.addEventListener("click", function(e) {
    e.preventDefault();
    showContent("kelola-pemesanan-content");
    loadBookingsData();
  });
  
  document.querySelector(".kelola-pengguna")?.addEventListener("click", function(e) {
    e.preventDefault();
    showContent("kelola-pengguna-content");
    loadUsersData();
  });
  
  document.querySelector(".laporan")?.addEventListener("click", function(e) {
    e.preventDefault();
    showContent("laporan-content");
  });
  
  document.querySelector(".pengaturan")?.addEventListener("click", function(e) {
    e.preventDefault();
    showContent("pengaturan-content");
  });
  
  // ========== FUNGSI KAMAR ==========
  
  // Fungsi untuk memuat data kamar
  function loadRoomsData() {
    const roomsTable = document.getElementById("rooms-table");
    if (!roomsTable) return;
    
    roomsTable.innerHTML = "";
    
    roomsData.forEach(room => {
      const row = document.createElement("tr");
      row.className = "border-b hover:bg-gray-50";
      row.innerHTML = `
        <td class="py-3 px-4">${room.type}</td>
        <td class="py-3 px-4">Rp ${parseInt(room.price).toLocaleString('id-ID')}</td>
        <td class="py-3 px-4">
          <span class="${getStatusClass(room.status)} px-2 py-1 rounded-full text-xs">
            ${room.status}
          </span>
        </td>
        <td class="py-3 px-4">
          <button class="text-primary hover:underline mr-2 edit-room" data-id="${room.id}">Edit</button>
          <button class="text-red-600 hover:underline delete-room" data-id="${room.id}">Hapus</button>
        </td>
      `;
      roomsTable.appendChild(row);
    });
    
    // Event listeners untuk tombol edit dan hapus kamar
    document.querySelectorAll(".edit-room").forEach(button => {
      button.addEventListener("click", function() {
        const roomId = parseInt(this.getAttribute("data-id"));
        openEditRoomModal(roomId);
      });
    });
    
    document.querySelectorAll(".delete-room").forEach(button => {
      button.addEventListener("click", function() {
        const roomId = parseInt(this.getAttribute("data-id"));
        deleteRoom(roomId);
      });
    });
  }
  
  // Fungsi untuk membuka modal edit kamar
  function openEditRoomModal(roomId) {
    const room = roomsData.find(r => r.id === roomId);
    if (!room) return;
    
    currentEditingRoom = room;
    
    document.getElementById("edit-room-id").value = room.id;
    document.getElementById("edit-room-type").value = room.type;
    document.getElementById("edit-room-price").value = room.price;
    document.getElementById("edit-room-status").value = room.status;
    
    document.getElementById("edit-room-modal").classList.remove("hidden");
  }
  
  // Fungsi untuk menghapus kamar
  function deleteRoom(roomId) {
    if (confirm("Apakah Anda yakin ingin menghapus kamar ini?")) {
      roomsData = roomsData.filter(room => room.id !== roomId);
      loadRoomsData();
      showNotification("Kamar berhasil dihapus!", "success");
    }
  }
  
  // Event listener untuk form edit kamar
  document.getElementById("edit-room-form")?.addEventListener("submit", function(e) {
    e.preventDefault();
    
    const roomId = parseInt(document.getElementById("edit-room-id").value);
    const roomType = document.getElementById("edit-room-type").value;
    const roomPrice = document.getElementById("edit-room-price").value;
    const roomStatus = document.getElementById("edit-room-status").value;
    
    const roomIndex = roomsData.findIndex(room => room.id === roomId);
    if (roomIndex !== -1) {
      roomsData[roomIndex] = {
        ...roomsData[roomIndex],
        type: roomType,
        price: roomPrice,
        status: roomStatus
      };
      
      loadRoomsData();
      closeEditRoomModal();
      showNotification("Data kamar berhasil diperbarui!", "success");
    }
  });
  
  // Event listener untuk tombol batal edit kamar
  document.getElementById("cancel-edit-room")?.addEventListener("click", function() {
    closeEditRoomModal();
  });
  
  // Fungsi untuk menutup modal edit kamar
  function closeEditRoomModal() {
    document.getElementById("edit-room-modal").classList.add("hidden");
    currentEditingRoom = null;
  }
  
  // ========== FUNGSI PEMESANAN ==========
  
  // Fungsi untuk memuat data pemesanan
  function loadBookingsData() {
    const bookingsTable = document.getElementById("bookings-table");
    if (!bookingsTable) return;
    
    bookingsTable.innerHTML = "";
    
    bookingsData.forEach(booking => {
      const row = document.createElement("tr");
      row.className = "border-b hover:bg-gray-50";
      row.innerHTML = `
        <td class="py-3 px-4">${booking.id}</td>
        <td class="py-3 px-4">${booking.name}</td>
        <td class="py-3 px-4">${formatDateRange(booking.checkin, booking.checkout)}</td>
        <td class="py-3 px-4">
          <span class="${getStatusClass(booking.status)} px-2 py-1 rounded-full text-xs">
            ${booking.status}
          </span>
        </td>
        <td class="py-3 px-4">
          <button class="text-primary hover:underline mr-2 edit-booking" data-id="${booking.id}">Edit</button>
          <button class="text-red-600 hover:underline delete-booking" data-id="${booking.id}">Hapus</button>
        </td>
      `;
      bookingsTable.appendChild(row);
    });
    
    // Event listeners untuk tombol edit dan hapus pemesanan
    document.querySelectorAll(".edit-booking").forEach(button => {
      button.addEventListener("click", function() {
        const bookingId = this.getAttribute("data-id");
        openEditBookingModal(bookingId);
      });
    });
    
    document.querySelectorAll(".delete-booking").forEach(button => {
      button.addEventListener("click", function() {
        const bookingId = this.getAttribute("data-id");
        deleteBooking(bookingId);
      });
    });
  }
  
  // Fungsi untuk membuka modal edit pemesanan
  function openEditBookingModal(bookingId) {
    const booking = bookingsData.find(b => b.id === bookingId);
    if (!booking) return;
    
    currentEditingBooking = booking;
    
    document.getElementById("edit-booking-id").value = booking.id;
    document.getElementById("edit-booking-name").value = booking.name;
    document.getElementById("edit-booking-checkin").value = booking.checkin;
    document.getElementById("edit-booking-checkout").value = booking.checkout;
    document.getElementById("edit-booking-status").value = booking.status;
    
    document.getElementById("edit-booking-modal").classList.remove("hidden");
  }
  
  // Fungsi untuk menghapus pemesanan
  function deleteBooking(bookingId) {
    if (confirm("Apakah Anda yakin ingin menghapus pemesanan ini?")) {
      bookingsData = bookingsData.filter(booking => booking.id !== bookingId);
      loadBookingsData();
      showNotification("Pemesanan berhasil dihapus!", "success");
    }
  }
  
  // Event listener untuk form edit pemesanan
  document.getElementById("edit-booking-form")?.addEventListener("submit", function(e) {
    e.preventDefault();
    
    const bookingId = document.getElementById("edit-booking-id").value;
    const bookingName = document.getElementById("edit-booking-name").value;
    const bookingCheckin = document.getElementById("edit-booking-checkin").value;
    const bookingCheckout = document.getElementById("edit-booking-checkout").value;
    const bookingStatus = document.getElementById("edit-booking-status").value;
    
    const bookingIndex = bookingsData.findIndex(booking => booking.id === bookingId);
    if (bookingIndex !== -1) {
      bookingsData[bookingIndex] = {
        ...bookingsData[bookingIndex],
        name: bookingName,
        checkin: bookingCheckin,
        checkout: bookingCheckout,
        status: bookingStatus
      };
      
      loadBookingsData();
      closeEditBookingModal();
      showNotification("Data pemesanan berhasil diperbarui!", "success");
    }
  });
  
  // Event listener untuk tombol batal edit pemesanan
  document.getElementById("cancel-edit-booking")?.addEventListener("click", function() {
    closeEditBookingModal();
  });
  
  // Fungsi untuk menutup modal edit pemesanan
  function closeEditBookingModal() {
    document.getElementById("edit-booking-modal").classList.add("hidden");
    currentEditingBooking = null;
  }
  
  // ========== FUNGSI PENGGUNA ==========
  
  // Fungsi untuk memuat data pengguna
  function loadUsersData() {
    const usersTable = document.getElementById("users-table");
    if (!usersTable) return;
    
    usersTable.innerHTML = "";
    
    usersData.forEach(user => {
      const row = document.createElement("tr");
      row.className = "border-b hover:bg-gray-50";
      row.innerHTML = `
        <td class="py-3 px-4">${user.name}</td>
        <td class="py-3 px-4">${user.email}</td>
        <td class="py-3 px-4">
          <span class="${user.role === 'Admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'} px-2 py-1 rounded-full text-xs">
            ${user.role}
          </span>
        </td>
        <td class="py-3 px-4">
          <span class="${user.status === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} px-2 py-1 rounded-full text-xs">
            ${user.status}
          </span>
        </td>
        <td class="py-3 px-4">
          <button class="text-primary hover:underline mr-2 edit-user" data-id="${user.id}">Edit</button>
          <button class="text-red-600 hover:underline delete-user" data-id="${user.id}">Hapus</button>
        </td>
      `;
      usersTable.appendChild(row);
    });
    
    // Event listeners untuk tombol edit dan hapus pengguna
    document.querySelectorAll(".edit-user").forEach(button => {
      button.addEventListener("click", function() {
        const userId = parseInt(this.getAttribute("data-id"));
        openEditUserModal(userId);
      });
    });
    
    document.querySelectorAll(".delete-user").forEach(button => {
      button.addEventListener("click", function() {
        const userId = parseInt(this.getAttribute("data-id"));
        deleteUser(userId);
      });
    });
  }
  
  // Fungsi untuk membuka modal edit pengguna
  function openEditUserModal(userId) {
    const user = usersData.find(u => u.id === userId);
    if (!user) return;
    
    currentEditingUser = user;
    
    document.getElementById("edit-user-id").value = user.id;
    document.getElementById("edit-user-name").value = user.name;
    document.getElementById("edit-user-email").value = user.email;
    document.getElementById("edit-user-role").value = user.role;
    document.getElementById("edit-user-status").value = user.status;
    
    document.getElementById("edit-user-modal").classList.remove("hidden");
  }
  
  // Fungsi untuk menghapus pengguna
  function deleteUser(userId) {
    if (confirm("Apakah Anda yakin ingin menghapus pengguna ini?")) {
      usersData = usersData.filter(user => user.id !== userId);
      loadUsersData();
      showNotification("Pengguna berhasil dihapus!", "success");
    }
  }
  
  // Event listener untuk form edit pengguna
  document.getElementById("edit-user-form")?.addEventListener("submit", function(e) {
    e.preventDefault();
    
    const userId = parseInt(document.getElementById("edit-user-id").value);
    const userName = document.getElementById("edit-user-name").value;
    const userEmail = document.getElementById("edit-user-email").value;
    const userRole = document.getElementById("edit-user-role").value;
    const userStatus = document.getElementById("edit-user-status").value;
    
    const userIndex = usersData.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
      usersData[userIndex] = {
        ...usersData[userIndex],
        name: userName,
        email: userEmail,
        role: userRole,
        status: userStatus
      };
      
      loadUsersData();
      closeEditUserModal();
      showNotification("Data pengguna berhasil diperbarui!", "success");
    }
  });
  
  // Event listener untuk tombol batal edit pengguna
  document.getElementById("cancel-edit-user")?.addEventListener("click", function() {
    closeEditUserModal();
  });
  
  // Fungsi untuk menutup modal edit pengguna
  function closeEditUserModal() {
    document.getElementById("edit-user-modal").classList.add("hidden");
    currentEditingUser = null;
  }
  
  // ========== FUNGSI BANTUAN ==========
  
  // Fungsi untuk mendapatkan class CSS berdasarkan status
  function getStatusClass(status) {
    switch(status) {
      case "Tersedia":
      case "Aktif":
      case "Selesai":
      case "Dikonfirmasi":
        return "bg-green-100 text-green-800";
      case "Tidak Tersedia":
      case "Nonaktif":
      case "Dibatalkan":
        return "bg-red-100 text-red-800";
      case "Dalam Perawatan":
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }
  
  // Fungsi untuk memformat tanggal
  function formatDateRange(checkin, checkout) {
    const checkinDate = new Date(checkin);
    const checkoutDate = new Date(checkout);
    
    const options = { day: 'numeric', month: 'short' };
    return `${checkinDate.toLocaleDateString('id-ID', options)} - ${checkoutDate.toLocaleDateString('id-ID', options)} ${checkoutDate.getFullYear()}`;
  }
  
  // Fungsi untuk menampilkan notifikasi
  function showNotification(message, type = "info") {
    // Hapus notifikasi sebelumnya jika ada
    const existingNotification = document.querySelector(".custom-notification");
    if (existingNotification) {
      existingNotification.remove();
    }
    
    // Buat elemen notifikasi
    const notification = document.createElement("div");
    notification.className = `custom-notification fixed top-4 right-4 px-6 py-3 rounded-md shadow-lg z-50 ${
      type === "success" ? "bg-green-500 text-white" :
      type === "error" ? "bg-red-500 text-white" :
      "bg-blue-500 text-white"
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Hapus notifikasi setelah 3 detik
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
  
  // Event listener untuk form tambah kamar
  const addRoomForm = document.getElementById("add-room-form");
  if (addRoomForm) {
    addRoomForm.addEventListener("submit", function(e) {
      e.preventDefault();
      
      const roomType = document.getElementById("room-type").value;
      const roomPrice = document.getElementById("room-price").value;
      const roomDescription = document.getElementById("room-description").value;
      const roomFacilities = document.getElementById("room-facilities").value;
      
      if (roomType && roomPrice) {
        const newRoom = {
          id: roomsData.length > 0 ? Math.max(...roomsData.map(r => r.id)) + 1 : 1,
          type: roomType,
          price: roomPrice,
          status: "Tersedia",
          description: roomDescription,
          facilities: roomFacilities
        };
        
        roomsData.push(newRoom);
        addRoomForm.reset();
        loadRoomsData();
        showNotification(`Kamar ${roomType} berhasil ditambahkan!`, "success");
      }
    });
  }
  
  // Event listener untuk form pengaturan
  const settingsForm = document.getElementById("settings-form");
  if (settingsForm) {
    settingsForm.addEventListener("submit", function(e) {
      e.preventDefault();
      showNotification("Pengaturan berhasil disimpan!", "success");
    });
  }
  
  // Event listener untuk generate laporan
  const generateReportBtn = document.getElementById("generate-report");
  if (generateReportBtn) {
    generateReportBtn.addEventListener("click", function() {
      const reportType = document.getElementById("report-type").value;
      const reportPeriod = document.getElementById("report-period").value;
      showNotification(`Laporan ${reportType} untuk periode ${reportPeriod} berhasil digenerate!`, "success");
    });
  }
  
  // Event listener untuk filter pemesanan
  const filterStatus = document.getElementById("filter-status");
  const filterDateFrom = document.getElementById("filter-date-from");
  const filterDateTo = document.getElementById("filter-date-to");
  
  if (filterStatus && filterDateFrom && filterDateTo) {
    [filterStatus, filterDateFrom, filterDateTo].forEach(element => {
      element.addEventListener("change", function() {
        showNotification("Filter diterapkan! Data akan diperbarui sesuai dengan filter yang dipilih.", "info");
        // Di sini Anda bisa menambahkan logika filter yang lebih kompleks
      });
    });
  }
  
  // Tutup modal saat klik di luar modal
  window.addEventListener("click", function(e) {
    const editRoomModal = document.getElementById("edit-room-modal");
    const editBookingModal = document.getElementById("edit-booking-modal");
    const editUserModal = document.getElementById("edit-user-modal");
    
    if (e.target === editRoomModal) {
      closeEditRoomModal();
    }
    if (e.target === editBookingModal) {
      closeEditBookingModal();
    }
    if (e.target === editUserModal) {
      closeEditUserModal();
    }
  });
});
