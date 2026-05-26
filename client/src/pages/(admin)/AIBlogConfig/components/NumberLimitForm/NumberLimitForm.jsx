import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function NumberLimitForm() {
  const [value, setValue] = useState(1);

  const handleChange = (e) => {
    const number = Number(e.target.value);

    if (number > 100) {
      setValue(100);
      return;
    }

    if (number < 1) {
      setValue(1);
      return;
    }

    setValue(number);
  };

  const handleSubmit = () => {
    console.log("Submitted:", value);
  };

  return (
    <div className="flex items-end gap-3">
      <div className="w-32">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Số lượng
        </label>

        <Input
          type="number"
          min={1}
          max={100}
          value={value}
          onChange={handleChange}
          placeholder="1 - 100"
        />
      </div>

      <Button onClick={handleSubmit}>
        Submit
      </Button>
    </div>
  );
}

export default NumberLimitForm;