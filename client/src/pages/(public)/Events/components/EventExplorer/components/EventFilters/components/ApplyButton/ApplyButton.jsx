function ApplyButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full py-3 text-sm font-semibold tracking-wide text-white transition-colors duration-200 bg-(--primary-color) shadow-lg hover:bg-(--primary-color)/70 active:bg-(--primary-color)/90 rounded-xl shadow-(--primary-color)/40"
    >
      Áp dụng bộ lọc
    </button>
  );
}

export default ApplyButton;
