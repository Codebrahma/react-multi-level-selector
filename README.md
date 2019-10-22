# react-multi-level-selector

🔔 React component for Multi level options Selector for your application.

<img src="demo.gif" alt="" align="middle" />

## Installation

Install it from npm and import it in your root component

```bash
npm install --save react-multi-level-selector
```

## Usage

```Javascript
import React from 'react';
import MultiSelect from 'react-multi-level-selector';

const options = [
  { value: 'department', label: 'Department',
    options: [
      { value: 'customer success', label: 'Customer success' },
      { value: 'marketing', label: 'Marketing' },
    ],
  },
  { value: 'office location', label: 'Office Location',
    options: [
      { value: 'new york', label: 'New York' },
      { value: 'san fransis', label: 'San Fransis' },
      { value: 'dublin', label: 'Dublin' },
    ],
  },

function App() {
  return (
    <div>
      <MultiSelect
        options={options}
      />
      <div>This is a test application</div>
    </div>
  )
}

export default App;
```

## Props

| Name              | Type         | Description                                    |
| ----------------- | ------------ | ---------------------------------------------- |
| **`options`**     | `{Array}`    | Specify the options the user can select from.  |
| **`placeholder`** | `{String}`   | The text displayed when no option is selected. |
| **`onChange`**    | `{function}` | Subscribe to change events.                    |
