# react-multi-level-selector

:bell: React component for Multi level options Selector for your application.

<img src="demo.gif" alt="" align="middle" />

## Installation

Install it from npm and import it in your root component

```bash
npm install --save react-multi-level-selector
```

## Usage

```Javascript
import React from 'react';
import MultiLevelSelect from 'react-multi-level-selector';

const options = [
  { value: 'fruits', label: 'Fruits',
    options: [
       { value: 'apple', label: 'Apple' },
       { value: 'blackberry', label: 'Blackberry' },
       { value: 'cherry', label: 'Cherry' },
    ],
  },
  { value: 'city', label: 'City',
    options: [
      { value: 'dublin', label: 'Dublin' },
      { value: 'new york', label: 'New York' },
      { value: 'san fransis', label: 'San Fransis' },
    ],
  },

function App() {
  return (
    <div>
      <MultiLevelSelect
        options={options}
      />
      <div>This is a test application</div>
    </div>
  )
}

export default App;
```

## Props

| Name              | Type         | Description                                                             |
| ----------------- | ------------ | ----------------------------------------------------------------------- |
| **`options`**     | `{Array}`    | Options for the dropdown. Specify the options for users to select from. |
| **`placeholder`** | `{String}`   | The text displayed when no option is selected.                          |
| **`onChange`**    | `{function}` | Subscribe to change events.                                             |
| **`className`**   | `{String}`   | className to style the selector                                         |
