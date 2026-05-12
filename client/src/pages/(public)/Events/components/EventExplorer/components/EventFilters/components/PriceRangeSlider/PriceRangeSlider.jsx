const MAX_PRICE = 500;

function PriceRangeSlider({ value, onChange }) {
  const minPrice = Math.round((value[0] / 100) * MAX_PRICE);
  const maxPrice =
    value[1] >= 100
      ? `${MAX_PRICE}+`
      : Math.round((value[1] / 100) * MAX_PRICE);

  const sliderBg = `linear-gradient(to right, #a855f7 0%, #a855f7 ${value[1]}%, #374151 ${value[1]}%, #374151 100%)`;

  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm font-medium text-(--text-primary)">Price Range</span>
      <div className="relative flex items-center">
        <input
          type="range"
          min={0}
          max={100}
          value={value[1]}
          onChange={(e) => onChange([value[0], Number(e.target.value)])}
          className="w-full h-1 rounded-full appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-purple-500
            [&::-webkit-slider-thumb]:shadow-lg
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-white"
          style={{ background: sliderBg }}
        />
      </div>
      <div className="flex justify-between">
        <span className="text-sm text-gray-400">${minPrice}</span>
        <span className="text-sm text-gray-400">${maxPrice}</span>
      </div>
    </div>
  );
}
export default PriceRangeSlider;
