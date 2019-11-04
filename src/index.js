import React from 'react';
import PropTypes from 'prop-types';
import listensToClickOutside from 'react-onclickoutside';
import suffixedClassName from './suffixedClassName';
import uniqWith from 'lodash.uniqwith';
import isEqual from 'lodash.isequal';
import findParent from './helper';
import './style.scss';

class MultiLevelSelect extends React.Component {
  constructor() {
    super();
    this.state = {
      values: [],
      isMenuOpen: false,
    };
  }

  getClassName = (suffix) => {
    const { className } = this.props;

    return suffixedClassName(className, suffix);
  }

  selectOption = (data, parent, event) => {

    const { values } = this.state;
    const { value, name, checked } = event.target;
    let updatedOption = {};
    if (checked) {

      const selectedOption = {
        value,
        label: name,
      };

      const parentValue = data[0].value;

      const findIndex = values.findIndex(x => x.value === parentValue);

      if (findIndex === -1) {
        return this.setState(
          { values: [...values, ...this.addSelectedOption(data, parent, selectedOption)] },
          this.onOptionsChange,
        );
      }

      updatedOption = this.addSelectedOption(data, parent, selectedOption)[0];

      const newData = values.map(item => {
        if (item.value === parentValue)
          return updatedOption;
        return item
      });
      return this.setState({ values: newData }, this.onOptionsChange);
    }

    const uncheckedOption = this.removeOption(values, value, parent);
    return this.setState({ values: uncheckedOption }, this.onOptionsChange);
  }

  removeOption = (values, removeValue, parent) => {
    return values.filter(item => {
      if (item.value.includes(removeValue)) {
        return false
      }
      if (item.options) {
        return (item.options = this.removeOption(item.options, removeValue, parent)).length
      }
      return item
    })
  }

  addSelectedOption = (data, parent, selectedOption) => {
    return uniqWith(data.map(item => {
      if (item.options) {
        if (item.value === parent) {
          const optionAvailable = item.options.findIndex(x => x.value === selectedOption.value);
          if (optionAvailable === -1) {
            return { ...item, options: [selectedOption, ...item.options] };
          }
          return item
        }
        return { ...item, options: [...this.addSelectedOption(item.options, parent, selectedOption)] }
      }
      return item
    }), isEqual)
  }


  renderOptionsSelected = values => (
    values.map((item, i) => (
      <div
        key={i}
        className={`options-selected-container ${this.getClassName('options-selected-container')}`}
        onClick={event => event.stopPropagation()}
      >

        {this.renderSubOptionsSelected([item], i = 0)}
        <div
          onClick={() => this.removeSelectedGroup(item)}
          className={`remove-group ${this.getClassName('remove-group')}`}
        >
          &#10005;
        </div>
      </div>
    )))

  renderSubOptionsSelected = (data) => {
    return (
      <>
        {data.map((item, index) => (
          <React.Fragment key={`${item.value}-${index}`} >
            {item.options &&
              <div className={`options-group ${this.getClassName('options-group')}`}>
                {` ${item.label}`}
                {' -> '}
                &nbsp;
            </div>
            }
            {!item.options &&
              <div className={`options-value ${this.getClassName('options-value')}`}>
                {(data.length >= 2 && index === data.length - 1)
                  ? (
                    <span>
                      <span className={`or-separator ${this.getClassName('or-separator')}`}>OR</span>
                      <span>
                        &nbsp;
                      {item.label}
                      </span>
                    </span>
                  )
                  : (data.length >= 2 && index !== 0) ? `, ${item.label}` : item.label}
                &nbsp;
            </div>
            }
            {item.options && this.renderSubOptionsSelected(item.options)}
          </React.Fragment>
        ))}
      </>
    )
  }

  onOptionsChange = () => {
    const { onChange } = this.props;
    const { values } = this.state;
    onChange(values);
  }

  removeSelectedGroup = ({ value }) => {
    const { values } = this.state;
    this.setState({ values: values.filter(data => data.value !== value) }, this.onOptionsChange);
  }

  handleClickOutside = () => {
    const { isMenuOpen } = this.state;

    return isMenuOpen && this.setState({ isMenuOpen: false });
  }

  toggleMenu = () => {
    const { isMenuOpen } = this.state;
    this.setState({ isMenuOpen: !isMenuOpen });
  }

  renderCaretButton = () => {
    const { isMenuOpen } = this.state;

    return (
      <div className="multi-selector-button" onClick={this.toggleMenu}>
        <div className={isMenuOpen ? `arrow-up ${this.getClassName('arrow-up')}` : `arrow-down ${this.getClassName('arrow-down')}`} />
      </div>
    );
  }

  renderPlaceholder = () => {
    const { placeholder } = this.props;

    return (
      <div className={`multi-selector-placeholder ${this.getClassName('multi-selector-placeholder')}`}>
        {placeholder || 'Select'}
      </div>
    );
  }

  renderOptions = (options, parent = {}) => {
    return (
      <>
        {
          options.map((item, i) => {
            if (item.options) {
              return (<div key={i} className="options-container">
                <div className={`options-label ${this.getClassName('options-label')}`}>{item.label}</div>
                {this.renderSubMenu(item, parent)}
              </div>);
            }
            return (
              <div key={i}>{this.renderSubMenu(item, parent)}</div>
            );
          })
        }
      </>
    );
  }

  optionChecked = (values, optionValue, parent) => {
    // console.log(optionValue, parent);
    return values.some(e => {
      if (e.value === parent) {
        // console.log('inside')
        return e.options.some(item => {
          // console.log('item', item)
          if (item.value === optionValue) {
            return true
          }
        })
      }
      // console.log('outside')
      if (e.options)
        return this.optionChecked(e.options, optionValue, parent)
      return false;
    })
  }

  renderSubMenu = (item, parent = {}) => {
    const { values } = this.state;
    const { options } = this.props;
    if (item.options) {
      return (
        <>
          <div className={`arrow-right ${this.getClassName('arrow-right')}`} />
          <div className={`options-sub-menu-container ${this.getClassName('options-sub-menu-container')}`}>
            <div
              className={`options-sub-menu-header ${this.getClassName('options-sub-menu-header')}`}
            >
              {item.value}
            </div>
            {this.renderOptions(item.options, item)}
          </div>
        </>
      );
    }
    const checked = this.optionChecked(values, item.value, parent.value);
    if (!parent.value) {
      return (
        <div className="options-container">
          <div className={`options-label ${this.getClassName('options-label')}`}>{item.label}</div>
        </div>
      )
    }
    return (
      <>
        <label>
          <div className={`options-sub-menu ${this.getClassName('options-sub-menu')}`}>
            <input
              type="checkbox"
              value={item.value}
              checked={checked}
              name={item.label}
              onChange={(event) => {
                let self = this
                findParent(values, { value: item.value, label: item.label }, item.value, options, [], function (data) {
                  self.selectOption(data, parent.value, event)
                })
              }}
            />
            <div className="checkbox"><span className="checkmark" /></div>
            <div className={`options-label ${this.getClassName('options-label')}`}>{item.label}</div>
          </div>
        </label>
      </>
    );
  }

  render() {
    const { values, isMenuOpen } = this.state;
    const { options } = this.props;
    return (
      <div className="multi-level-selector-container">
        <div
          className={`multi-selector-container ${this.getClassName('multi-selector-container')} ${isMenuOpen ? `active ${this.getClassName('active')}` : 'inactive'}`}
        >
          <div className="multi-selector" onClick={this.toggleMenu}>
            {!values.length && this.renderPlaceholder()}
            {this.renderOptionsSelected(values)}
          </div>
          {this.renderCaretButton()}
        </div>
        <div className={`multi-level-options-container ${this.getClassName('multi-level-options-container')} ${isMenuOpen ? `menu-open ${this.getClassName('menu-open')}` : `menu-close ${this.getClassName('menu-close')}`}`}>
          <div className="options-main-menu">
            {this.renderOptions(options)}
          </div>
        </div>
      </div>
    );
  }
}

MultiLevelSelect.propTypes = {
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })),
  })),
  className: PropTypes.string,
};

MultiLevelSelect.defaultProps = {
  placeholder: '',
  options: [],
  onChange: () => { },
  className: '',
};

export default listensToClickOutside(MultiLevelSelect);