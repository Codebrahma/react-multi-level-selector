
const findParentStructure = (options, selectedOption, optionValue, tree, path, parent, callback) => {
  for (let i = tree.length - 1; i >= 0; i--) {
    (function () {
      var currentPath = path.slice();

      if (tree[i].value === optionValue) {
        if (currentPath[currentPath.length - 1].value === parent)
          callback(findHierarchyAddSelectedOption(currentPath, options, selectedOption));
      } else {
        if (tree[i].options) {
          currentPath.push({ value: tree[i].value, label: tree[i].label, options: [] });
          findParentStructure(options, selectedOption, optionValue, tree[i].options, currentPath, parent, callback);
        }
      }
    })();
  }
}

//once the top to bottom level hierachy is found we arrange it in nested structure as the original options data hierachy structure.
const findHierarchyAddSelectedOption = (currentPath, options, selectedOption) => {
  let option = {};
  let temp = {};

  //find the main object of that value in the selected options
  const optionsData = options.find(x => x.value === currentPath[0].value);

  if (optionsData !== undefined) {
    return addSelectedOption([optionsData], currentPath, selectedOption)
  }

  for (let i = currentPath.length - 1; i >= 0; i--) {
    if (i === currentPath.length - 1)
      option = { ...currentPath[i], options: [selectedOption] }
    if (i > 0) {
      temp = { ...currentPath[i - 1], options: [option] }
      option = temp;
    }
  }
  return option
}

//add the selected option along with the previous selected options

const addSelectedOption = (optionsSelectedData, currentPath, selectedOption) => {
  let options = {}
  let temp = {}

  const current = currentPathInHierarchy(optionsSelectedData, currentPath)

  for (let i = current.length - 1; i >= 0; i--) {
    if (i === current.length - 1) {
      options = { ...current[i], options: [selectedOption, ...current[i].options] }
    }

    if (i > 0) {
      temp = { ...current[i - 1], options: [...current[i - 1].options, options] }
      options = temp;
    }
  }
  return options;
}


const currentPathInHierarchy = (optionsData, currentPath) => {
  for (let i = 0; i <= optionsData.length - 1; i++) {
    for (let j = 0; j <= currentPath.length - 1; j++) {

      if (optionsData[i].value === currentPath[j].value) {

        if (optionsData[i].options) {

          currentPath[j].options = optionsData[i].options.filter(item => {
            if (j < currentPath.length - 1)
              return item.value !== currentPath[j + 1].value
            return item
          })
          currentPathInHierarchy(optionsData[i].options, currentPath)
        }
      }
    }
  }
  return currentPath;
}

export default findParentStructure;
