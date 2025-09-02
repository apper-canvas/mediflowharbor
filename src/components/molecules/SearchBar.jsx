import { useState } from "react";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const SearchBar = ({ placeholder = "Search...", onSearch, className }) => {
  const [value, setValue] = useState("");

  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setValue(searchValue);
    onSearch?.(searchValue);
  };

  return (
    <div className={cn("relative", className)}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <ApperIcon name="Search" size={18} className="text-gray-400" />
      </div>
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleSearch}
        className="pl-10 pr-4"
      />
      {value && (
        <button
          onClick={() => {
            setValue("");
            onSearch?.("");
          }}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          <ApperIcon name="X" size={18} className="text-gray-400 hover:text-gray-600" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;