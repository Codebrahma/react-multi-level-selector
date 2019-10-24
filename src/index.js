import React from 'react';
import PropTypes from 'prop-types';
import listensToClickOutside from 'react-onclickoutside';
import suffixedClassName from './suffixedClassName';
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

  selectOption = (data, event) => {
    const { values } = this.state;
    const { value, name, checked } = event.target;

    if (checked) {
      const selectedOption = {
        value,
        label: name,
      };

      let optionNotAvailable = true;

      if (values.length === 0) {
        return this.setState(
          { values: [...values, { ...data, options: [selectedOption] }] },
          this.onOptionsChange,
        );
      }

      const selectedOptions = values.map((item) => {
        if (item.value === data.value) {
          optionNotAvailable = false;
          return { ...item, options: [...item.options, selectedOption] };
        }
        return item;
      });

      if (optionNotAvailable) {
        return this.setState(
          { values: [...values, { ...data, options: [selectedOption] }] },
          this.onOptionsChange,
        );
      }

      return this.setState({ values: selectedOptions }, this.onOptionsChange);
    }

    const uncheckedOption = values.map(item => (
      { ...item, options: item.options.filter(option => option.value !== value) }
    )).filter(filterOption => filterOption.options.length !== 0);
    return this.setState({ values: uncheckedOption }, this.onOptionsChange);
  }

  renderOptionsSelected = values => (
    values.map((item, i) => (
      <div
        key={`${item.value}-${i}`}
        className={`options-selected-container ${this.getClassName('options-selected-container')}`}
        onClick={event => event.stopPropagation()}
      >
        <div className={`options-group ${this.getClassName('options-group')}`}>
          {item.label}
          {' : '}
          &nbsp;
        </div>
        {item.options.map((data, index) => (
          <div key={`${item.value}-${index}`} className={`options-value ${this.getClassName('options-value')}`}>
            {(item.options.length >= 2 && index === item.options.length - 1)
              ? (
                <span>
                  <span className={`or-separator ${this.getClassName('or-separator')}`}>OR</span>
                  <span>
                    &nbsp;
                    {data.label}
                  </span>
                </span>
              )
              : (item.options.length >= 2 && index !== 0) ? `, ${data.label}` : data.label}
            &nbsp;
          </div>
        ))}
        <div
          onClick={() => this.removeSelectedGroup(item)}
          className={`remove-group ${this.getClassName('remove-group')}`}
        >
          &#10005;
        </div>
      </div>
    )))

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

  renderOptions = () => {
    const { values } = this.state;
    const { options } = this.props;

    return (
      <div className="options-main-menu">
        {
          options.map((item, i) => (
            <div key={`${item.value}-${i}`} className="options-container">
              <div className={`options-label ${this.getClassName('options-label')}`}>{item.label}</div>
              {item.options && (
                <>
                  <div className={`arrow-right ${this.getClassName('arrow-right')}`} />
                  <div className={`options-sub-menu-container ${this.getClassName('options-sub-menu-container')}`}>
                    <div
                      className={`options-sub-menu-header ${this.getClassName('options-sub-menu-header')}`}
                    >
                      {item.label}
                    </div>
                    {item.options.map((subItem, index) => (
                      <label key={`${subItem.value}-${index}`}>
                        <div className={`options-sub-menu ${this.getClassName('options-sub-menu')}`}>
                          <input
                            type="checkbox"
                            value={subItem.value}
                            checked={
                              values.some(value => value.value === item.value
                                && value.options.some(data => data.value === subItem.value))
                            }
                            name={subItem.label}
                            onChange={event => this.selectOption(
                              { value: item.value, label: item.label }, event,
                            )}
                          />
                          <div className="checkbox"><span className="checkmark" /></div>
                          <div className={`options-label ${this.getClassName('options-label')}`}>{subItem.label}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))
        }
      </div>
    );
  }

  render() {
    const { values, isMenuOpen } = this.state;

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
          {this.renderOptions()}
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
