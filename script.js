// Canvas Setup
const canvas = document.getElementById('uniformCanvas');
const ctx = canvas.getContext('2d');
let uniformImg = new Image();
let logoImg = new Image();
let logoX = 150, logoY = 150, logoWidth = 100, logoHeight = 100;
let isFront = true;
let currentUniform = 'tshirt_white_front';

// Uniform Images (replace with actual paths)
const uniforms = {
  tshirt_white_front: 'https://i.ibb.co/RTkcbjx2/1000025817.png',
  tshirt_white_back: 'https://i.ibb.co/Fbym9G4Q/1000025824.png',
  tshirt_blue_front: 'images/tshirt_blue_front.png',
  tshirt_blue_back: 'images/tshirt_blue_back.png',
  tshirt_black_front: 'images/tshirt_black_front.png',
  tshirt_black_back: 'images/tshirt_black_back.png',
  shirt_white_front: 'images/shirt_white_front.png',
  shirt_white_back: 'images/shirt_white_back.png',
  shirt_blue_front: 'images/shirt_blue_front.png',
  shirt_blue_back: 'images/shirt_blue_back.png',
  shirt_black_front: 'images/shirt_black_front.png',
  shirt_black_back: 'images/shirt_black_back.png'
};

// Feedback Element
const feedback = document.getElementById('feedback');

function showFeedback(message, type = 'info') {
  feedback.textContent = message;
  feedback.className = `alert alert-${type} d-block`;
  setTimeout(() => feedback.classList.add('d-none'), 3000);
}

// Load Uniform
function loadUniform() {
  uniformImg.src = uniforms[currentUniform] || 'images/tshirt_white_front.png';
  uniformImg.onload = drawCanvas;
  uniformImg.onerror = () => showFeedback('خطأ في تحميل صورة اليونيفورم!', 'danger');
}

// Draw Canvas
function drawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(uniformImg, 0, 0, canvas.width, canvas.height);

  if (logoImg.src) {
    ctx.drawImage(logoImg, logoX, logoY, logoWidth, logoHeight);
  }
}

// Change Uniform Type
document.getElementById('uniformType').addEventListener('change', function() {
  const color = document.getElementById('uniformColor').value;
  currentUniform = `${this.value}_${color}_${isFront ? 'front' : 'back'}`;
  loadUniform();
});

// Change Uniform Color
document.getElementById('uniformColor').addEventListener('change', function() {
  const type = document.getElementById('uniformType').value;
  currentUniform = `${type}_${this.value}_${isFront ? 'front' : 'back'}`;
  loadUniform();
});

// Upload Logo
document.getElementById('logoUpload').addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = function(e) {
      logoImg.src = e.target.result;
      logoImg.onload = () => {
        drawCanvas();
        showFeedback('تم رفع الشعار بنجاح!', 'success');
      };
      logoImg.onerror = () => showFeedback('خطأ في تحميل الشعار!', 'danger');
    };
    reader.readAsDataURL(file);
  } else {
    showFeedback('يرجى رفع ملف صورة صالح (PNG/JPG)!', 'danger');
  }
});

// Adjust Logo Size
document.getElementById('logoSize').addEventListener('input', function() {
  logoWidth = logoHeight = parseInt(this.value);
  drawCanvas();
});

// Drag and Drop Logo
let isDragging = false;
canvas.addEventListener('mousedown', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  if (x > logoX && x < logoX + logoWidth && y > logoY && y < logoY + logoHeight) {
    isDragging = true;
    canvas.style.cursor = 'grabbing';
  }
});

canvas.addEventListener('mousemove', (e) => {
  if (isDragging) {
    const rect = canvas.getBoundingClientRect();
    logoX = e.clientX - rect.left - logoWidth / 2;
    logoY = e.clientY - rect.top - logoHeight / 2;
    drawCanvas();
  }
});

canvas.addEventListener('mouseup', () => {
  if (isDragging) {
    isDragging = false;
    canvas.style.cursor = 'default';
  }
});

// Fix Logo Position
document.getElementById('fixLogoBtn').addEventListener('click', () => {
  if (logoImg.src) {
    showFeedback('تم تثبيت الشعار في مكانه!', 'success');
  } else {
    showFeedback('يرجى رفع شعار أولًا!', 'warning');
  }
});

// Flip Front/Back
document.getElementById('flipBtn').addEventListener('click', () => {
  isFront = !isFront;
  const type = document.getElementById('uniformType').value;
  const color = document.getElementById('uniformColor').value;
  currentUniform = `${type}_${color}_${isFront ? 'front' : 'back'}`;
  loadUniform();
  showFeedback(`عرض الوجه ${isFront ? 'الأمامي' : 'الخلفي'}`, 'info');
});

// Save Design
document.getElementById('saveBtn').addEventListener('click', () => {
  if (uniformImg.src && (logoImg.src || !logoImg.src)) {
    const link = document.createElement('a');
    link.download = 'your_uniform_design.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    showFeedback('تم حفظ التصميم بنجاح!', 'success');
  } else {
    showFeedback('لا يوجد تصميم لحفظه!', 'warning');
  }
});

// Reset Design
document.getElementById('resetBtn').addEventListener('click', () => {
  logoImg.src = '';
  logoX = 150;
  logoY = 150;
  logoWidth = logoHeight = 100;
  isFront = true;
  currentUniform = 'tshirt_white_front';
  loadUniform();
  showFeedback('تم إعادة ضبط التصميم!', 'info');
});

// Order Modal Handling
const orderModal = document.getElementById('orderModal');
const orderForm = document.getElementById('orderForm');
const quantityGroup = document.getElementById('quantityGroup');
const orderTypeInput = document.getElementById('orderType');

orderModal.addEventListener('show.bs.modal', (event) => {
  const button = event.relatedTarget;
  const type = button.getAttribute('data-type');
  orderTypeInput.value = type;
  document.getElementById('orderModalLabel').textContent = type === 'sample' ? 'طلب عينة' : type === 'bulk' ? 'طلب كمية' : 'مشاركة الطلب';
  quantityGroup.classList.toggle('d-none', type !== 'bulk');
});

document.getElementById('submitOrder').addEventListener('click', async () => {
  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;
  const quantity = document.getElementById('quantity').value || 'عينة';
  const orderType = orderTypeInput.value;

  if (!name || !phone) {
    showFeedback('يرجى ملء جميع الحقول!', 'danger');
    return;
  }

  // Upload design to imgbb
  let imageUrl = '';
  if (canvas.toDataURL('image/png').length > 100) {
    const formData = new FormData();
    formData.append('image', canvas.toDataURL('image/png').split(',')[1]);
    try {
      const response = await fetch('https://api.imgbb.com/1/upload?key=bde613bd4475de5e00274a795091ba04', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (data.success) {
        imageUrl = data.data.url;
      } else {
        showFeedback('فشل رفع الصورة!', 'danger');
      }
    } catch (error) {
      showFeedback('خطأ في الاتصال بـ imgbb!', 'danger');
    }
  }

  // Prepare WhatsApp message
  const orderDetails = `طلب ${orderType === 'sample' ? 'عينة' : orderType === 'bulk' ? 'كمية' : 'طلب'}\n` +
                       `الاسم: ${name}\n` +
                       `رقم الهاتف: ${phone}\n` +
                       `اليونيفورم: ${document.getElementById('uniformType').value} (${document.getElementById('uniformColor').value})\n` +
                       `الكمية: ${quantity}\n` +
                       `رابط التصميم: ${imageUrl || 'لا يوجد تصميم'}`;
  const whatsappUrl = `https://wa.me/+201030956097?text=${encodeURIComponent(orderDetails)}`;

  // Redirect to WhatsApp
  window.open(whatsappUrl, '_blank');
  showFeedback('تم إرسال الطلب عبر واتساب!', 'success');
  bootstrap.Modal.getInstance(orderModal).hide();
  orderForm.reset();
});

// Initialize
loadUniform();
