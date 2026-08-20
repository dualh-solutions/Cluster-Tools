self.onmessage = async (e: MessageEvent) => {
  const { file, settings } = e.data;
  
  try {
    const bitmap = await createImageBitmap(file);
    
    // Calculate new dimensions for rotation if needed
    // For 90/270 degree rotations, we swap width and height
    const isRotated = settings.rotate % 180 !== 0;
    const canvasWidth = isRotated ? bitmap.height : bitmap.width;
    const canvasHeight = isRotated ? bitmap.width : bitmap.height;
    
    const canvas = new OffscreenCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not get 2d context");

    // Apply CSS filters
    const filters = [];
    if (settings.brightness !== 100) filters.push(`brightness(${settings.brightness}%)`);
    if (settings.contrast !== 100) filters.push(`contrast(${settings.contrast}%)`);
    if (settings.saturation !== 100) filters.push(`saturate(${settings.saturation}%)`);
    
    if (filters.length > 0) {
      ctx.filter = filters.join(" ");
    }
    
    // Apply Rotation
    if (settings.rotate !== 0) {
      ctx.translate(canvasWidth / 2, canvasHeight / 2);
      ctx.rotate((settings.rotate * Math.PI) / 180);
      ctx.translate(-bitmap.width / 2, -bitmap.height / 2);
    }
    
    ctx.drawImage(bitmap, 0, 0);
    
    // Convert back to blob
    const type = file.type || "image/jpeg";
    const quality = type === "image/jpeg" || type === "image/webp" ? 0.9 : undefined;
    
    const blob = await canvas.convertToBlob({ type, quality });
    
    self.postMessage({ success: true, blob });
  } catch (error: unknown) {
    self.postMessage({ success: false, error: error instanceof Error ? error.message : String(error) });
  }
};
