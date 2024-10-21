// 匯入 sweetalert2 套件
import Swal from "sweetalert2";

// 顯示提示框函式
export function showPopup(
  title,
  text,
  icon,
  confirmButtonText,
  cancelButtonText,
  showCancelButton,
  timer = null,
  timerProgressBar = false,
  confirmAction = null
) {
  Swal.fire({
    title: title, // 標題
    html: text, // 內容 (HTML 格式)
    icon: icon, // 圖標
    timer: timer, // 計時器
    timerProgressBar: timerProgressBar, // 計時條
    showCancelButton: showCancelButton, // 是否顯示取消按鈕
    confirmButtonText: confirmButtonText, // 確定按鈕字樣
    cancelButtonText: cancelButtonText, // 取消按鈕字樣
    confirmButtonColor: "#3085d6", // 確定按鈕顏色
    cancelButtonColor: "#d33", // 取消按鈕顏色
  }).then((result) => {
    // 當按下確定後，執行對應函式
    if (confirmAction && result.isConfirmed) {
      confirmAction();
    }
  });
}

// 右上角小型警示框
export function miniAlertBox(
  icon,
  title,
  showConfirmButton = null,
  confirmButtonText = null,
  timer = 2500,
  confirmAction = null
) {
  const Toast = Swal.mixin({
    toast: true, // 是否為小型警示框
    position: "top-end", // 位置 (右上)
    showConfirmButton: showConfirmButton, // 是否顯示確定按鈕
    confirmButtonText: confirmButtonText, // 確定按鈕字樣
    confirmButtonColor: "#e74a3b", // 確定按鈕顏色
    timer: timer, // 計時器
  });

  Toast.fire({
    icon: icon, // 圖標
    title: title, // 標題
  }).then((result) => {
    // 當按下確定後，執行對應函式
    if (confirmAction && result.isConfirmed) {
      confirmAction();
    }
  });
}
