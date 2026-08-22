import JSZip from "jszip";

/**
 * Downloads a Blob to the user's device with the given filename.
 */
export function downloadResult(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  
  // Revoke object URL after a short delay to ensure the download started
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 100);
}

/**
 * Zips an array of files/blobs and triggers a download.
 */
export async function downloadAllAsZip(
  files: { blob: Blob; filename: string }[],
  zipFilename: string = "cluster-tools_results.zip"
) {
  const zip = new JSZip();
  
  files.forEach((file) => {
    zip.file(file.filename, file.blob);
  });
  
  const zipBlob = await zip.generateAsync({ type: "blob" });
  downloadResult(zipBlob, zipFilename);
}

/**
 * Formats bytes to a human-readable string.
 */
export function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
