"use client"

import React, { useState } from 'react';

interface Option {
  value: string;
  label: string;
}

function CustomSelect() {
  const [inputValue, setInputValue] = useState<string>('');
  const [filteredOptions, setFilteredOptions] = useState<Option[]>([]);
  const options = [
    { value: 'Option 1', label: 'Option 1', data: [{ fav: "bananaan", hobby: "gaming" ,age:12}] },
    { value: 'Option 2', label: 'Option 2', data: [{ fav: "bananaan1", hobby: "gaming11" ,age:14}] },
    { value: 'Option 3', label: 'Option 3', data: [{ fav: "bananaan2", hobby: "gaming2" ,age:13}] },
    { value: 'Option 4', label: 'Option 4', data: [{ fav: "bananaan3", hobby: "gaming3" ,age:132}] }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setInputValue(inputValue);

    // Filter options based on the input value
    const filteredOptions = options.filter(option =>
      option.label.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredOptions(filteredOptions);
  };

  const handleOptionClick = (option: Option) => {
    setInputValue(option.label);
    setFilteredOptions([]);
  };

  return (
    <>
    <div>
      <label htmlFor="customSelect">Select or Type:</label>
      <input
        type="text"
        id="customSelect"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Type to filter options"
        onFocus={() => setFilteredOptions(options)}
      />
      {inputValue !== '' && filteredOptions.length > 0 && (
        <div className="options">
          {filteredOptions.map((option, index) => (
            <div
              key={index}
              className="option"
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
}

export default CustomSelect;








