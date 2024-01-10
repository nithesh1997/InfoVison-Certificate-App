export default function downloadFile(response) {
  const CONTENT_DISPOSITION = "content-disposition";
  const file = response.data;
  const filename = response.headers[CONTENT_DISPOSITION].split("filename=")[1];

  const blob = new Blob([file], { type: "application/octet-stream" });

  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.setAttribute("download", filename.slice(1, -1));
  link.click();
}
