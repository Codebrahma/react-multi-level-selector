// to stop looping once the option item is found
let optionFound = false;

// function to extract the hierarchial family structure of the selected option item
const findParentStructure = (
  options,
  selectedOption,
  optionValue,
  tree,
  path,
  parent,
  callback,
  found = false,
) => {
  optionFound = found;
  for (let i = 0; i <= tree.length - 1; i += 1) {
    // for each main loop currentPath is set as new array
    // with slice else currentPath will be overrided with previous values
    const currentPath = path.slice();

    if (tree[i].value === optionValue) {
      // condition for the objects which dont have options in the top level.
      if (currentPath.length === 0 && parent === undefined) {
        callback({ value: tree[i].value, label: tree[i].label });
        break;
      }

      // checking whether the options parent and the currentPath last object
      // value is same, bcz some of the options values might be same but have different parent.
      if (currentPath.length && currentPath[currentPath.length - 1].value === parent) {
        optionFound = true;
        callback(findHierarchyAddSelectedOption(currentPath, options, selectedOption));
        break;
      }
    } else {
      // dont continue looping once the option item is found
      if (optionFound) {
        break;
      }
      if (tree[i].options) {
        currentPath.push({ value: tree[i].value, label: tree[i].label, options: [] });
        findParentStructure(options, selectedOption, optionValue,
          tree[i].options, currentPath, parent, callback, optionFound);
      }
    }
  }
};

// currentPath is an array of objects having the hierarchial parenting structure of
// the selected option. once the top to bottom level hierachy is found we arrange it
// in nested structure as the original options data hierachy structure.

const findHierarchyAddSelectedOption = (currentPath, options, selectedOption) => {
  let option = {};
  let temp = {};

  // find the option object from the selected options which matches the top level value
  const optionsData = options.find(item => item.value === currentPath[0].value);

  // when optionsData is available
  if (optionsData !== undefined) {
    return addSelectedOption([optionsData], currentPath, selectedOption);
  }

  // when optionsData is undefined we add the selectedOption in the hierarchial pattern
  // and return the updated object
  for (let i = currentPath.length - 1; i >= 0; i -= 1) {
    if (i === currentPath.length - 1) option = { ...currentPath[i], options: [selectedOption] };
    if (i > 0) {
      temp = { ...currentPath[i - 1], options: [option] };
      option = temp;
    }
  }
  return option;
};

// this functions adds the new selected option along with the previous selected options data

const addSelectedOption = (optionsSelectedData, currentPath, selectedOption) => {
  let options = {};
  let temp = {};

  // this functions returns the array of objects Each having the parent and its options
  // property having previous selected data
  const current = currentPathInHierarchy(optionsSelectedData, currentPath);


  for (let i = current.length - 1; i >= 0; i -= 1) {
    if (i === current.length - 1) {
      // append the selectedOption along with the options already available
      options = { ...current[i], options: [selectedOption, ...current[i].options] };
    }

    if (i > 0) {
      temp = { ...current[i - 1], options: [...current[i - 1].options, options] };
      options = temp;
    }
  }
  return options;
};

// this function takes two input one optionsData which is array of already
// selected options and currentPath which is array of objects with top to
// bottom level parenting of the selected option
const currentPathInHierarchy = (optionsData, currentPath) => {
  for (let i = 0; i <= optionsData.length - 1; i += 1) {
    for (let j = 0; j <= currentPath.length - 1; j += 1) {
      if (optionsData[i].value === currentPath[j].value) {
        if (optionsData[i].options) {
          // to remove the duplicate option created while looping the data
          currentPath[j].options = optionsData[i].options.filter((item) => {
            if (j < currentPath.length - 1) return item.value !== currentPath[j + 1].value;
            return item;
          });
          currentPathInHierarchy(optionsData[i].options, currentPath);
        }
      }
    }
  }
  return currentPath;
};

export default findParentStructure;
