self.onmessage = async (e: MessageEvent) => {
  try {
    const { buffer, type, width, height, mode } = e.data;
    
    const blob = new Blob([buffer], { type });
    const imageBitmap = await createImageBitmap(blob);
    
    let targetWidth = imageBitmap.width;
    let targetHeight = imageBitmap.height;

    if (mode === "percentage") {
      const scale = width / 100;
      targetWidth = Math.round(imageBitmap.width * scale);
      targetHeight = Math.round(imageBitmap.height * scale);
    } else if (mode === "exact") {
      targetWidth = width;
      targetHeight = height;
    } else if (mode === "fit") {
      // Fit within max width/height preserving aspect ratio
      const scale = Math.min(width / imageBitmap.width, height / imageBitmap.height);
      targetWidth = Math.round(imageBitmap.width * scale);
      targetHeight = Math.round(imageBitmap.height * scale);
    }

    // Don't resize to 0
    targetWidth = Math.max(1, targetWidth);
    targetHeight = Math.max(1, targetHeight);

    const canvas = new OffscreenCanvas(targetWidth, targetHeight);
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Could not get 2d context for OffscreenCanvas');
    }
    
    ctx.drawImage(imageBitmap, 0, 0, targetWidth, targetHeight);
    
    // Maintain original format if possible, or fallback to jpeg
    const outputType = (type === 'image/jpeg' || type === 'image/png' || type === 'image/webp') ? type : 'image/jpeg';
    
    const resultBlob = await canvas.convertToBlob({ type: outputType, quality: 0.9 });
    
    self.postMessage({ type: 'done', result: resultBlob });
    
  } catch (error: unknown) {
    self.postMessage({ type: 'error', message: error instanceof Error ? error.message : String(error) });
  }
};
