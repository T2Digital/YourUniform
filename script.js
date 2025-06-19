// Canvas Setup
const canvas = document.getElementById('uniformCanvas');
const ctx = canvas.getContext('2d');
let uniformImg = new Image();
let logoImg = new Image();
let logoX = 150, logoY = 150, logoWidth = 100, logoHeight = 100;
let isFront = true;
let currentUniform = 'tshirt_white_front';
let customText = '';
let textColor = '#000000';
let textFont = 'Tajawal';
let textSize = 20;
let textX = 150, textY = 250;

// Uniform Images (External URLs)
const uniforms = {
  tshirt_white_front: 'https://i.ibb.co/RTkcbjx2/1000025817.png',
  tshirt_white_back: 'https://i.ibb.co/Fbym9G4Q/1000025824.png',
  tshirt_blue_front: 'https://i.ibb.co/RTkcbjx2/1000025817.png', // Replace with actual URL
  tshirt_blue_back: 'https://i.ibb.co/Fbym9G4Q/1000025824.png', // Replace with actual URL
  tshirt_black_front: 'https://i.ibb.co/RTkcbjx2/1000025817.png', // Replace with actual URL
  tshirt_black_back: 'https://i.ibb.co/Fbym9G4Q/1000025824.png', // Replace with actual URL
  shirt_white_front: 'https://i.ibb.co/RTkcbjx2/1000025817.png', // Replace with actual URL
  shirt_white_back: 'https://i.ibb.co/Fbym9G4Q/1000025824.png', // Replace with actual URL
  shirt_blue_front: 'https://i.ibb.co/RTkcbjx2/1000025817.png', // Replace with actual URL
  shirt_blue_back: 'https://i.ibb.co/Fbym9G4Q/1000025824.png', // Replace with actual URL
  shirt_black_front: 'https://i.ibb.co/RTkcbjx2/1000025817.png', // Replace with actual URL
  shirt_black_back: 'https://i.ibb.co/Fbym9G4Q/1000025824.png' // Replace with actual URL
};

// Feedback Element
const feedback = document.getElementById('feedback');

function showFeedback(message, type = 'info') {
  feedback.textContent = message;
  feedback.className = `alert alert-${type} d-block`;
  setTimeout(() => feedback.classList.add('d-none'), 3000);
}

// Load Image with CORS Handling
async function loadImage(url) {
  try {
    const response = await fetch(url, { mode: 'cors' });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(blob);
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        resolve(img);
      };
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    });
  } catch (error) {
    console.error('Image load error:', error);
    throw error;
  }
}

// Load Uniform
async function loadUniform() {
  try {
    uniformImg = await loadImage(uniforms[currentUniform]);
    drawCanvas();
    console.log('Uniform loaded:', currentUniform);
  } catch (error) {
    showFeedback('خطأ في تحميل صورة اليونيفورم! جرب رابط آخر.', 'danger');
    drawCanvas(); // Draw with fallback
  }
}

// Draw Canvas
function drawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (uniformImg.src && uniformImg.complete) {
    ctx.drawImage(uniformImg, 0, 0, canvas.width, canvas.height);
  }
  if (logoImg.src && logoImg.complete) {
    ctx.drawImage(logoImg, logoX, logoY, logoWidth, logoHeight);
  }
  if (customText) {
    ctx.fillStyle = textColor;
    ctx.font = `${textSize}px ${textFont}`;
    ctx.fillText(customText, textX, textY);
  }
}

// Close Navbar on Link Click
document.querySelectorAll('.navbar-nav .nav-link, .btn-warning').forEach(link => {
  link.addEventListener('click', () => {
    const navbarCollapse = document.getElementById('navbarNav');
    const bsCollapse = new bootstrap.Collapse(navbarCollapse, { toggle: false });
    bsCollapse.hide();
  });
});

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
document.getElementById('logoUpload').addEventListener('change', async function(event) {
  const file = event.target.files[0];
  if (file && file.type.startsWith('image/')) {
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        logoImg = await loadImage(reader.result);
        drawCanvas();
        showFeedback('تم رفع الشعار بنجاح! المس الشعار لتحريكه.', 'success');
      };
      reader.readAsDataURL(file);
    } catch (error) {
      showFeedback('خطأ في تحميل الشعار!', 'danger');
      console.error('Logo load error:', error);
    }
  } else {
    showFeedback('يرجى رفع ملف صورة صالح (PNG/JPG)!', 'danger');
  }
});

// Adjust Logo Size
document.getElementById('logoSize').addEventListener('input', function() {
  logoWidth = logoHeight = parseInt(this.value);
  drawCanvas();
});

// Adjust Text Size
document.getElementById('textSize').addEventListener('input', function() {
  textSize = parseInt(this.value);
  drawCanvas();
});

// Add Custom Text
document.getElementById('textInput').addEventListener('input', function() {
  customText = this.value;
  drawCanvas();
});

document.getElementById('textColor').addEventListener('input', function() {
  textColor = this.value;
  drawCanvas();
});

document.getElementById('textFont').addEventListener('change', function() {
  textFont = this.value;
  drawCanvas();
});

// Drag and Drop Logo or Text
let isDragging = false;
let draggingText = false;

function startDragging(e) {
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
  const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
  if (customText && x > textX - 50 && x < textX + 50 && y > textY - 20 && y < textY + 20) {
    isDragging = true;
    draggingText = true;
    canvas.style.cursor = 'grabbing';
  } else if (logoImg.src && x > logoX && x < logoX + logoWidth && y > logoY && y < logoY + logoHeight) {
    isDragging = true;
    draggingText = false;
    canvas.style.cursor = 'grabbing';
  }
}

function moveDragging(e) {
  e.preventDefault();
  if (isDragging) {
    const rect = canvas.getBoundingClientRect();
    if (draggingText) {
      textX = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
      textY = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    } else {
      logoX = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left - logoWidth / 2;
      logoY = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top - logoHeight / 2;
    }
    drawCanvas();
  }
}

function stopDragging() {
  if (isDragging) {
    isDragging = false;
    draggingText = false;
    canvas.style.cursor = 'default';
  }
}

canvas.addEventListener('mousedown', startDragging);
canvas.addEventListener('mousemove', moveDragging);
canvas.addEventListener('mouseup', stopDragging);
canvas.addEventListener('touchstart', startDragging);
canvas.addEventListener('touchmove', moveDragging);
canvas.addEventListener('touchend', stopDragging);

// Fix Logo/Text Position
document.getElementById('fixLogoBtn').addEventListener('click', () => {
  if (logoImg.src || customText) {
    showFeedback('تم تثبيت الشعار/النص في مكانه!', 'success');
  } else {
    showFeedback('يرجى رفع شعار أو إضافة نص أولًا!', 'warning');
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

// Save Design as Image
document.getElementById('saveBtn').addEventListener('click', async () => {
  try {
    let dataUrl = canvas.toDataURL('image/png');
    if (dataUrl.length < 100) {
      const canvasElement = await html2canvas(document.getElementById('uniformCanvas'));
      dataUrl = canvasElement.toDataURL('image/png');
      if (dataUrl.length < 100) throw new Error('Canvas is empty');
    }
    const link = document.createElement('a');
    link.download = 'your_uniform_design.png';
    link.href = dataUrl;
    link.click();
    showFeedback('تم حفظ التصميم بنجاح!', 'success');
  } catch (error) {
    console.error('Save error:', error);
    showFeedback('فشل حفظ التصميم! جرب متصفح آخر.', 'danger');
  }
});

// Save Design as PDF
document.getElementById('savePdfBtn').addEventListener('click', async () => {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();

  try {
    // Save Front
    let frontDataUrl = canvas.toDataURL('image/png');
    if (frontDataUrl.length < 100) {
      const canvasElement = await html2canvas(document.getElementById('uniformCanvas'));
      frontDataUrl = canvasElement.toDataURL('image/png');
      if (frontDataUrl.length < 100) throw new Error('Front canvas is empty');
    }
    pdf.addImage(frontDataUrl, 'PNG', 10, 10, 190, 190);
    pdf.setFont('Helvetica');
    pdf.setFontSize(12);
    pdf.text('Front View', 10, 205);

    // Switch to Back
    isFront = false;
    const type = document.getElementById('uniformType').value;
    const color = document.getElementById('uniformColor').value;
    currentUniform = `${type}_${color}_back`;
    await loadUniform();
    await new Promise(resolve => setTimeout(resolve, 100));

    let backDataUrl = canvas.toDataURL('image/png');
    if (backDataUrl.length < 100) {
      const canvasElement = await html2canvas(document.getElementById('uniformCanvas'));
      backDataUrl = canvasElement.toDataURL('image/png');
      if (backDataUrl.length < 100) throw new Error('Back canvas is empty');
    }
    pdf.addPage();
    pdf.addImage(backDataUrl, 'PNG', 10, 10, 190, 190);
    pdf.setFont('Helvetica');
    pdf.setFontSize(12);
    pdf.text('Back View', 10, 205);

    // Revert to Front
    isFront = true;
    currentUniform = `${type}_${color}_front`;
    await loadUniform();

    pdf.save('your_uniform_design.pdf');
    showFeedback('تم حفظ التصميم كـ PDF بنجاح!', 'success');
  } catch (error) {
    console.error('PDF save error:', error);
    showFeedback('فشل حفظ التصميم كـ PDF!', 'danger');
  }
});

// Reset Design
document.getElementById('resetBtn').addEventListener('click', () => {
  logoImg.src = '';
  logoX = 150;
  logoY = 150;
  logoWidth = logoHeight = 100;
  customText = '';
  textX = 150;
  textY = 250;
  textFont = 'Tajawal';
  textSize = 20;
  isFront = true;
  currentUniform = 'tshirt_white_front';
  loadUniform();
  showFeedback('تم إعادة ضبط التصميم!', 'info');
});

// Upload Image to ImgBB
async function uploadProof(file) {
  if (!file) return null;

  const apiKey = 'YOUR_IMGBB_API_KEY'; // Replace with your ImgBB API key
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData
    });
    const data = await response.json();
    if (data.success) {
      console.log('Image uploaded to imgbb:', data.data.url);
      return data.data.url;
    }
    throw new Error(data.error.message || 'فشل رفع الصورة');
  } catch (error) {
    showFeedback('خطأ أثناء رفع الصورة!', 'danger');
    console.error('Upload Error:', error);
    return null;
  }
}

// Open Order Modal
document.getElementById('bulkBtn').addEventListener('click', () => {
  try {
    const orderModal = new bootstrap.Modal(document.getElementById('orderModal'));
    orderModal.show();
    showFeedback('تم فتح نموذج طلب الكمية!', 'success');
  } catch (error) {
    console.error('Modal open error:', error);
    showFeedback('فشل فتح نموذج طلب الكمية! تأكد من إعدادات المتصفح.', 'danger');
  }
});

// Add/Remove Size and Quantity Rows
document.getElementById('addSizeBtn').addEventListener('click', () => {
  const tableBody = document.querySelector('#sizeQuantityTable tbody');
  const newRow = document.createElement('tr');
  newRow.innerHTML = `
    <td>
      <select class="form-control size-select" required>
        <option value="" disabled selected>اختر المقاس</option>
        <option value="M">M</option>
        <option value="L">L</option>
        <option value="XL">XL</option>
        <option value="XXL">XXL</option>
        <option value="XXXL">XXXL</option>
      </select>
    </td>
    <td>
      <input type="number" class="form-control quantity-input" min="1" required>
    </td>
    <td>
      <button type="button" class="btn btn-danger btn-sm remove-row"><i class="bi bi-trash"></i></button>
    </td>
  `;
  tableBody.appendChild(newRow);
});

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('remove-row')) {
    const rows = document.querySelectorAll('#sizeQuantityTable tbody tr');
    if (rows.length > 1) {
      e.target.closest('tr').remove();
    } else {
      showFeedback('لا يمكن إزالة السطر الأخير!', 'warning');
    }
  }
});

// Order Form Submission
const orderModal = document.getElementById('orderModal');
const orderForm = document.getElementById('orderForm');

orderModal.addEventListener('show.bs.modal', () => {
  document.getElementById('orderModalLabel').textContent = 'طلب كمية';
});

document.getElementById('submitOrderBtn').addEventListener('click', async () => {
  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;
  const sizeRows = document.querySelectorAll('#sizeQuantityTable tbody tr');
  let sizesAndQuantities = [];

  sizeRows.forEach(row => {
    const size = row.querySelector('.size-select').value;
    const quantity = row.querySelector('.quantity-input').value;
    if (size && quantity) {
      sizesAndQuantities.push({ size, quantity });
    }
  });

  if (!name || !phone || sizesAndQuantities.length === 0) {
    showFeedback('يرجى ملء جميع الحقول!', 'danger');
    return;
  }

  // Upload design to ImgBB
  let imageUrl = '';
  try {
    let canvasData = canvas.toDataURL('image/png');
    if (canvasData.length < 100) {
      const canvasElement = await html2canvas(document.getElementById('uniformCanvas'));
      canvasData = canvasElement.toDataURL('image/png');
      if (canvasData.length < 100) throw new Error('Canvas is empty');
    }
    const blob = await (await fetch(canvasData)).blob();
    imageUrl = await uploadProof(blob);
  } catch (error) {
    console.error('Canvas upload error:', error);
    showFeedback('فشل رفع الصورة، سيتم إرسال الطلب بدون صورة.', 'warning');
  }

  // Prepare WhatsApp message
  const sizeDetails = sizesAndQuantities.map(item => `المقاس: ${item.size}, الكمية: ${item.quantity}`).join('\n');
  const orderDetails = `طلب كمية\n` +
                       `الاسم: ${name}\n` +
                       `رقم الهاتف: ${phone}\n` +
                       `اليونيفورم: ${document.getElementById('uniformType').value} (${document.getElementById('uniformColor').value})\n` +
                       `${sizeDetails}\n` +
                       `النص: ${customText || 'لا يوجد نص'}\n` +
                       `رابط التصميم: ${imageUrl || 'لا يوجد تصميم'}`;

  // Send to WhatsApp
  const phoneNumber = '201030956097';
  const encodedMessage = encodeURIComponent(orderDetails);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  try {
    const whatsappWindow = window.open(whatsappUrl, '_blank');
    if (!whatsappWindow || whatsappWindow.closed) {
      showFeedback('يرجى تثبيت تطبيق WhatsApp أو السماح بفتح الروابط.', 'danger');
    } else {
      showFeedback('تم إرسال الطلب عبر واتساب!', 'success');
      bootstrap.Modal.getInstance(orderModal).hide();
      orderForm.reset();
      document.querySelector('#sizeQuantityTable tbody').innerHTML = `
        <tr>
          <td>
            <select class="form-control size-select" required>
              <option value="" disabled selected>اختر المقاس</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
              <option value="XXXL">XXXL</option>
            </select>
          </td>
          <td>
            <input type="number" class="form-control quantity-input" min="1" required>
          </td>
          <td>
            <button type="button" class="btn btn-danger btn-sm remove-row"><i class="bi bi-trash"></i></button>
          </td>
        </tr>
      `;
    }
  } catch (error) {
    showFeedback('خطأ أثناء فتح WhatsApp!', 'danger');
    console.error('WhatsApp Error:', error);
  }
});

// Initialize
loadUniform();