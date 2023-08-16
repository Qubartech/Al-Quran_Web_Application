"use client";

function SurahPlayBtn({ playControl }) {
  return (
    <button
      onClick={playControl}
      className="border p-2 rounded-md mt-2"
    >
      Play Audio
    </button>
  );
}

export default SurahPlayBtn;
