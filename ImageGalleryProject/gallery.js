document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements Selector Cache
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  let activeVisibleItems = [...galleryItems];
  let currentImgIndex = 0;

  /* ---------------- CATEGORY FILTERING MODULE ---------------- */
  document.getElementById('filter-controls').addEventListener('click', (e) => {
    const clickedBtn = e.target.closest('.filter-btn');
    if (!clickedBtn || clickedBtn.classList.contains('active')) return;

    // Toggle active classes
    filterButtons.forEach(btn => btn.classList.remove('active'));
    clickedBtn.classList.add('active');

    const filterValue = clickedBtn.dataset.filter;

    // Filter pipeline logic execution
    galleryItems.forEach(item => {
      if (filterValue === 'all' || item.dataset.category === filterValue) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });

    // Remap current runtime state for the active visible lightbox slider items
    activeVisibleItems = galleryItems.filter(item => !item.classList.contains('hidden'));
  });

  /* ---------------- LIGHTBOX SEAMLESS MODULE ---------------- */
  const openLightbox = (item) => {
    currentImgIndex = activeVisibleItems.indexOf(item);
    updateLightboxContent();
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Freeze viewport scroll
    closeBtn.focus();
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // Release viewport scroll
    activeVisibleItems[currentImgIndex]?.focus();
  };

  const navigateLightbox = (direction) => {
    if (activeVisibleItems.length <= 1) return;
    if (direction === 'next') {
      currentImgIndex = (currentImgIndex + 1) % activeVisibleItems.length;
    } else if (direction === 'prev') {
      currentImgIndex = (currentImgIndex - 1 + activeVisibleItems.length) % activeVisibleItems.length;
    }
    updateLightboxContent();
  };

  const updateLightboxContent = () => {
    const targetItem = activeVisibleItems[currentImgIndex];
    if (!targetItem) return;

    const imgSource = targetItem.querySelector('img').src;
    const titleText = targetItem.querySelector('.item-overlay h3').innerText;

    lightboxImg.src = imgSource;
    lightboxImg.alt = targetItem.querySelector('img').alt;
    lightboxCaption.innerText = titleText;
  };

  // Event Action Listeners
  galleryItems.forEach(item => {
    item.addEventListener('click', () => openLightbox(item));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') openLightbox(item);
    });
  });

  closeBtn.addEventListener('click', closeLightbox);
  nextBtn.addEventListener('click', () => navigateLightbox('next'));
  prevBtn.addEventListener('click', () => navigateLightbox('prev'));

  // Background Backdrop Dismiss Click Handler
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
      closeLightbox();
    }
  });

  // Global Keyboard Map Accessible Shortcuts
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') navigateLightbox('next');
    if (e.key === 'ArrowLeft') navigateLightbox('prev');
  });
});