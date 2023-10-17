import React, { useState } from "react";

const Dropdown = ({ options, onSelect }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSelectOption = (option) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
    if (onSelect) {
      onSelect(option);
    }
  };

  return (
    <div className="dropdown-container">
      <div
        className="dropdown-input"
        onClick={() => setIsDropdownOpen((prev) => !prev)}
      >
        <input
          type="text"
          value={selectedOption ? selectedOption.label : ""}
          readOnly
          placeholder="Select an option"
        />
      </div>
      {isDropdownOpen && (
        <div className="dropdown-options">
          {options.map((option) => (
            <div
              key={option.value}
              className="dropdown-option"
              onClick={() => handleSelectOption(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
