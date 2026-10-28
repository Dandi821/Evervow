// ==========================================
// EVERVOW — SCROLL REVEAL
// ==========================================

const revealElements = document.querySelectorAll(
  '.section--opening .container, .section--couple .container'
);

const revealObserver = new IntersectionObserver(
  (entries) => {

    entries.forEach((entry) => {

      if (entry.isIntersecting) {

        entry.target.classList.add('is-visible');

        revealObserver.unobserve(entry.target);
      }

    });

  },
  {
    threshold: 0.15
  }
);


revealElements.forEach((element) => {
  revealObserver.observe(element);
});
// ==========================================
// EVERVOW — COUNTDOWN
// ==========================================

const weddingDate = new Date(
  '2026-12-12T00:00:00+07:00'
).getTime();


function updateCountdown() {

  const now = new Date().getTime();

  const distance = weddingDate - now;


  if (distance <= 0) {

    document.getElementById('days').textContent = '00';
    document.getElementById('hours').textContent = '00';
    document.getElementById('minutes').textContent = '00';
    document.getElementById('seconds').textContent = '00';

    return;
  }


  const days = Math.floor(
    distance / (1000 * 60 * 60 * 24)
  );

  const hours = Math.floor(
    (distance / (1000 * 60 * 60)) % 24
  );

  const minutes = Math.floor(
    (distance / (1000 * 60)) % 60
  );

  const seconds = Math.floor(
    (distance / 1000) % 60
  );


  document.getElementById('days').textContent =
    String(days).padStart(2, '0');

  document.getElementById('hours').textContent =
    String(hours).padStart(2, '0');

  document.getElementById('minutes').textContent =
    String(minutes).padStart(2, '0');

  document.getElementById('seconds').textContent =
    String(seconds).padStart(2, '0');
}


updateCountdown();

setInterval(updateCountdown, 1000);
// ==========================================================
// EVERVOW — GALLERY SLIDER
// ==========================================================

const galleryTrack = document.querySelector(".gallery-track");
const gallerySlides = document.querySelectorAll(".gallery-slide");
const galleryDots = document.querySelectorAll(".gallery-dot");
const prevButton = document.querySelector(".gallery-btn--prev");
const nextButton = document.querySelector(".gallery-btn--next");

let currentSlide = 0;

function showSlide(index) {
  // Jangan keluar dari jumlah foto
  if (index < 0) {
    currentSlide = gallerySlides.length - 1;
  } else if (index >= gallerySlides.length) {
    currentSlide = 0;
  } else {
    currentSlide = index;
  }

  // Geser gallery
  galleryTrack.style.transform =
    `translateX(-${currentSlide * 100}%)`;

  // Update indicator
  galleryDots.forEach((dot, i) => {
    dot.classList.toggle(
      "gallery-dot--active",
      i === currentSlide
    );
  });
}

// Tombol sebelumnya
prevButton.addEventListener("click", () => {
  showSlide(currentSlide - 1);
});

// Tombol berikutnya
nextButton.addEventListener("click", () => {
  showSlide(currentSlide + 1);
});

// Klik dot
galleryDots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    showSlide(index);
  });
});

// ==========================================================
// SWIPE DI HP
// ==========================================================

let touchStartX = 0;
let touchEndX = 0;

galleryTrack.addEventListener("touchstart", (event) => {
  touchStartX = event.changedTouches[0].screenX;
});

galleryTrack.addEventListener("touchend", (event) => {
  touchEndX = event.changedTouches[0].screenX;

  const swipeDistance = touchStartX - touchEndX;

  // Swipe kiri
  if (swipeDistance > 50) {
    showSlide(currentSlide + 1);
  }

  // Swipe kanan
  if (swipeDistance < -50) {
    showSlide(currentSlide - 1);
  }
});
document.addEventListener('DOMContentLoaded', () => {
  const rsvpForm = document.getElementById('rsvpForm');
  const rsvpSuccess = document.getElementById('rsvpSuccess');
  const fullNameInput = document.getElementById('fullName');
  const attendanceInput = document.getElementById('attendance');
  const guestCountInput = document.getElementById('guestCount');
  const guestCountGroup = document.getElementById('guestCountGroup');
  
  const attendanceCards = document.querySelectorAll('.attendance-card');
  const segmentBtns = document.querySelectorAll('.segment-btn');
  
  const nameError = document.getElementById('nameError');
  const attendanceError = document.getElementById('attendanceError');

  // --- 1. Handling Pilihan Kehadiran (Interactive Cards) ---
  attendanceCards.forEach(card => {
    card.addEventListener('click', () => {
      const selectedValue = card.dataset.value;

      // Update Active Visual State & ARIA Attributes
      attendanceCards.forEach(c => {
        c.classList.remove('active');
        c.setAttribute('aria-checked', 'false');
      });

      card.classList.add('active');
      card.setAttribute('aria-checked', 'true');
      attendanceInput.value = selectedValue;

      // Reset pesan error kehadiran jika ada
      attendanceError.textContent = '';
      document.querySelector('.attendance-options').classList.remove('input-error');

      // Interaksi Sembunyikan/Disable Jumlah Tamu jika "Tidak Dapat Hadir"
      if (selectedValue === 'declined') {
        guestCountGroup.classList.add('disabled-group');
        guestCountGroup.setAttribute('aria-hidden', 'true');
      } else {
        guestCountGroup.classList.remove('disabled-group');
        guestCountGroup.removeAttribute('aria-hidden');
      }
    });
  });

  // --- 2. Handling Segmented Control (Jumlah Tamu) ---
  segmentBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (guestCountGroup.classList.contains('disabled-group')) return;

      segmentBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-checked', 'false');
      });

      btn.classList.add('active');
      btn.setAttribute('aria-checked', 'true');
      guestCountInput.value = btn.dataset.value;
    });
  });

  // Reset error input nama saat user mengetik
  fullNameInput.addEventListener('input', () => {
    if (fullNameInput.value.trim() !== '') {
      nameError.textContent = '';
      fullNameInput.classList.remove('input-error');
    }
  });

  // --- 3. Form Submission & Validation ---
  rsvpForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Mencegah reload halaman

    let isValid = true;

    // Validasi Nama Lengkap
    if (!fullNameInput.value.trim()) {
      nameError.textContent = 'Nama lengkap wajib diisi.';
      fullNameInput.classList.add('input-error');
      isValid = false;
    } else {
      nameError.textContent = '';
      fullNameInput.classList.remove('input-error');
    }

    // Validasi Konfirmasi Kehadiran
    if (!attendanceInput.value) {
      attendanceError.textContent = 'Silakan pilih status kehadiran Anda.';
      document.querySelector('.attendance-options').classList.add('input-error');
      isValid = false;
    } else {
      attendanceError.textContent = '';
      document.querySelector('.attendance-options').classList.remove('input-error');
    }

    // Jika Validasi Sukses
    if (isValid) {
      // Sembunyikan form dan tampilkan pesan konfirmasi yang elegan
      rsvpForm.style.display = 'none';
      rsvpSuccess.removeAttribute('hidden');
    }
  });
});
// ==========================================================
// SECTION 9: DIGITAL GIFT — COPY NUMBER
// ==========================================================

const giftCopyButtons = document.querySelectorAll('.gift-copy-btn');

giftCopyButtons.forEach((button) => {

  button.addEventListener('click', async () => {

    const numberToCopy = button.dataset.copy;
    const buttonText = button.querySelector('.gift-copy-text');

    if (!numberToCopy || !buttonText) return;

    try {

      await navigator.clipboard.writeText(numberToCopy);

      buttonText.textContent = '✓ BERHASIL DISALIN';

      button.classList.add('copied');

      setTimeout(() => {
        buttonText.textContent = 'SALIN NOMOR';
        button.classList.remove('copied');
      }, 2000);

    } catch (error) {

      console.error('Gagal menyalin nomor:', error);

      buttonText.textContent = 'GAGAL MENYALIN';

      setTimeout(() => {
        buttonText.textContent = 'SALIN NOMOR';
      }, 2000);

    }

  });

});
// ==========================================================
// SECTION 10: WISHES
// ==========================================================

document.addEventListener('DOMContentLoaded', () => {

  const wishesForm = document.getElementById('wishesForm');

  // Pastikan Section 10 memang ada
  if (!wishesForm) return;

  const wishesName = document.getElementById('wishesName');
  const wishesMessage = document.getElementById('wishesMessage');

  const wishesNameError = document.getElementById('wishesNameError');
  const wishesMessageError = document.getElementById('wishesMessageError');

  const wishesCharCount = document.getElementById('wishesCharCount');
  const wishesList = document.getElementById('wishesList');

  const submitButton = wishesForm.querySelector('.wishes-submit-btn');
  const submitText = wishesForm.querySelector('.wishes-submit-text');


  // ========================================================
  // CHARACTER COUNTER
  // ========================================================

  function updateCharacterCount() {

    const currentLength = wishesMessage.value.length;

    wishesCharCount.textContent = currentLength;

  }

  wishesMessage.addEventListener('input', updateCharacterCount);

  updateCharacterCount();


  // ========================================================
  // CLEAR ERROR SAAT USER MENGETIK
  // ========================================================

  wishesName.addEventListener('input', () => {

    if (wishesName.value.trim() !== '') {

      wishesNameError.textContent = '';
      wishesName.classList.remove('input-error');

    }

  });


  wishesMessage.addEventListener('input', () => {

    if (wishesMessage.value.trim() !== '') {

      wishesMessageError.textContent = '';
      wishesMessage.classList.remove('input-error');

    }

  });


  // ========================================================
  // SUBMIT WISHES
  // ========================================================

  wishesForm.addEventListener('submit', (event) => {

    event.preventDefault();

    let isValid = true;


    // ------------------------------------------------------
    // VALIDASI NAMA
    // ------------------------------------------------------

    const name = wishesName.value.trim();

    if (!name) {

      wishesNameError.textContent = 'Nama wajib diisi.';
      wishesName.classList.add('input-error');

      isValid = false;

    } else {

      wishesNameError.textContent = '';
      wishesName.classList.remove('input-error');

    }


    // ------------------------------------------------------
    // VALIDASI UCAPAN
    // ------------------------------------------------------

    const message = wishesMessage.value.trim();

    if (!message) {

      wishesMessageError.textContent = 'Ucapan wajib diisi.';
      wishesMessage.classList.add('input-error');

      isValid = false;

    } else {

      wishesMessageError.textContent = '';
      wishesMessage.classList.remove('input-error');

    }


    // ------------------------------------------------------
    // BERHENTI JIKA VALIDASI GAGAL
    // ------------------------------------------------------

    if (!isValid) return;


    // ======================================================
    // BUAT WISH CARD BARU
    // ======================================================

    const newWishCard = document.createElement('article');

    newWishCard.className = 'wish-card';

    newWishCard.innerHTML = `
      <div class="wish-card-icon" aria-hidden="true">✦</div>

      <div class="wish-card-content">

        <h3 class="wish-card-name">
          ${escapeHTML(name)}
        </h3>

        <p class="wish-card-message">
          ${escapeHTML(message)}
        </p>

      </div>
    `;


    // ======================================================
    // MASUKKAN CARD BARU KE PALING ATAS
    // ======================================================

    wishesList.prepend(newWishCard);


    // ======================================================
    // RESET FORM
    // ======================================================

    wishesForm.reset();

    updateCharacterCount();


    // ======================================================
    // FEEDBACK TOMBOL
    // ======================================================

    submitText.textContent = '✓ UCAPAN TERKIRIM';

    submitButton.classList.add('sent');

    setTimeout(() => {

      submitText.textContent = 'KIRIM UCAPAN';

      submitButton.classList.remove('sent');

    }, 2000);

  });


  // ========================================================
  // ESCAPE HTML
  // MENCEGAH INPUT USER MEMASUKKAN HTML KE CARD
  // ========================================================

  function escapeHTML(text) {

    const div = document.createElement('div');

    div.textContent = text;

    return div.innerHTML;

  }

});
/* ==================================================
   MUSIC CONTROL
   ================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const music = document.getElementById("backgroundMusic");
  const musicToggle = document.getElementById("musicToggle");
  const musicToggleText =
    musicToggle?.querySelector(".music-toggle-text");

  const openInvitation =
    document.querySelector(".btn--primary");

  if (!music || !musicToggle) return;

  function updateMusicUI(isPlaying) {
    musicToggle.classList.toggle("is-playing", isPlaying);

    musicToggle.setAttribute(
      "aria-pressed",
      String(isPlaying)
    );

    musicToggle.setAttribute(
      "aria-label",
      isPlaying
        ? "Matikan musik"
        : "Nyalakan musik"
    );

    if (musicToggleText) {
      musicToggleText.textContent =
        isPlaying ? "MUSIC ON" : "MUSIC OFF";
    }
  }

  async function playMusic() {
    try {
      await music.play();
      updateMusicUI(true);
    } catch (error) {
      updateMusicUI(false);
      console.log("Music belum bisa diputar:", error);
    }
  }

  function pauseMusic() {
    music.pause();
    updateMusicUI(false);
  }

  /* Musik mulai ketika OPEN INVITATION diklik */
  openInvitation?.addEventListener("click", () => {
    playMusic();
  });

  /* Tombol MUSIC ON / OFF */
  musicToggle.addEventListener("click", () => {
    if (music.paused) {
      playMusic();
    } else {
      pauseMusic();
    }
  });

  /* Jika file musik bermasalah */
  music.addEventListener("error", () => {
    updateMusicUI(false);
    musicToggle.disabled = true;
    musicToggle.setAttribute(
      "aria-label",
      "Musik tidak tersedia"
    );
  });

  updateMusicUI(false);
});
// =================================
// ==========================================
// EVERVOW — OPEN INVITATION
// ==========================================

(() => {
  const cover = document.getElementById("cover");
  const opening = document.getElementById("opening");
  const button = document.querySelector(
    '.section--cover .btn--primary[href="#opening"]'
  );

  if (!cover || !opening || !button) return;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  button.addEventListener("click", (event) => {
    event.preventDefault();

    if (cover.classList.contains("is-opening")) return;

    cover.classList.add("is-opening");
    opening.classList.add("opening--revealed");

    window.setTimeout(() => {
      opening.scrollIntoView({
        behavior: reduceMotion.matches ? "auto" : "smooth",
        block: "start"
      });
    }, reduceMotion.matches ? 0 : 850);
  });
})();