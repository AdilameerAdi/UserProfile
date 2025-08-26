// Image optimization utilities for heavy character images

export function compressImage(file, maxWidth = 400, quality = 0.8) {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      const newWidth = img.width * ratio;
      const newHeight = img.height * ratio;
      
      // Set canvas size
      canvas.width = newWidth;
      canvas.height = newHeight;
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      
      // Convert to blob with compression
      canvas.toBlob(resolve, 'image/jpeg', quality);
    };
    
    img.src = URL.createObjectURL(file);
  });
}

export function createImageThumbnail(file, size = 150, quality = 0.7) {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = size;
      canvas.height = size;
      
      // Calculate crop dimensions for square thumbnail
      const minDim = Math.min(img.width, img.height);
      const startX = (img.width - minDim) / 2;
      const startY = (img.height - minDim) / 2;
      
      ctx.drawImage(img, startX, startY, minDim, minDim, 0, 0, size, size);
      
      canvas.toBlob(resolve, 'image/jpeg', quality);
    };
    
    img.src = URL.createObjectURL(file);
  });
}

export function getOptimizedImageDataUrl(file, maxWidth = 400, quality = 0.8) {
  return new Promise((resolve) => {
    compressImage(file, maxWidth, quality).then(blob => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  });
}

// Progressive image loading with blur-up effect
export function createBlurPlaceholder(imageUrl, canvas) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const ctx = canvas.getContext('2d');
      const smallSize = 20; // Very small for blur effect
      
      canvas.width = smallSize;
      canvas.height = smallSize;
      
      ctx.drawImage(img, 0, 0, smallSize, smallSize);
      ctx.filter = 'blur(2px)';
      
      resolve(canvas.toDataURL('image/jpeg', 0.1));
    };
    
    img.onerror = () => resolve(null);
    img.src = imageUrl;
  });
}