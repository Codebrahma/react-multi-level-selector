
const findParent = (item, selectedOption, category, tree, path, callback) => {
  for (let i = tree.length - 1; i >= 0; i--) {
    (function () {
      var currentPath = path.slice();

      if (tree[i].value === category) {
        callback(findOption(currentPath, item, selectedOption));
      } else {
        if (tree[i].options) {
          currentPath.push({ value: tree[i].value, label: tree[i].label, options: [] });
          findParent(item, selectedOption, category, tree[i].options, currentPath, callback);
        }
      }
    })(tree[i]);
  }
}

const findOption = (current, item, selectedOption) => {
  let optionData = {};
  let temp2 = {};

  const optionsData = item.find(x => x.value === current[0].value);

  const opt = addNewOptions([optionsData], current, selectedOption);

  if (opt !== undefined) {
    return opt
  }

  for (var i = current.length - 1; i >= 0; i--) {
    if (i === current.length - 1)
      optionData = { ...current[i], options: [] }
    temp2 = { ...current[i - 1], options: [optionData] }
    optionData = temp2;
  }

  return optionData.options
}

const addNewOptions = (optionsData = [], data, parent) => {
  let options = {}
  let temp2 = {}
  if (!optionsData.includes(undefined)) {
    const current = recur(optionsData, data)
    for (var i = current.length - 1; i >= 0; i--) {
      if (i === current.length - 1) {
        options = { ...current[i] }
      }

      if (i > 0) {
        temp2 = { ...current[i - 1], options: [...current[i - 1].options, options] }
        options = temp2;
      }
    }
    return [options];
  }

}

//adds the previous selected options within the options of the parent
const recur = (optionsData, data) => {
  for (let i = 0; i <= optionsData.length - 1; i++) {
    for (let j = 0; j <= data.length - 1; j++) {

      if (optionsData[i].value === data[j].value) {

        if (optionsData[i].options) {

          data[j].options = [...optionsData[i].options.filter(item => {
            if (j < data.length - 1)
              return item.value !== data[j + 1].value
            return item
          })]
          recur(optionsData[i].options, data)
        }
      }
    }
  }
  return data;
}

export default findParent;
