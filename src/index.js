import React from 'react';
import PropTypes from 'prop-types';
import listensToClickOutside from 'react-onclickoutside';
import './style.scss';

class MultiSelect extends React.Component {
  constructor() {
    super();
    this.state = {
      values: [],
      showMenu: false,
    };
  }

  selectOption = (data, e) => {
    const { values } = this.state;
    const { value, name, checked } = e.target;
    if (checked) {
      const selectedOption = {
        value,
        label: name,
      };
      if (!values.some(item => item.value === data.value)) {
        this.setState({ values: [...values, { ...data, options: [selectedOption] }] },
          () => this.onOptionsChange());
      } else {
        const selectedOptions = values.map((item) => {
          if (item.value === data.value) {
            return { ...item, options: [...item.options, selectedOption] };
          }
          return item;
        });
        this.setState({ values: selectedOptions }, () => this.onOptionsChange());
      }
    } else {
      const uncheckedOption = values.map(item => (
        { ...item, options: item.options.filter(i => i.value !== value) }
      )).filter(filtering => filtering.options.length !== 0);
      this.setState({ values: uncheckedOption }, () => this.onOptionsChange());
    }
  }

  renderOptionsSelected = (values) => {
    const { className } = this.props;
    return values.map((item, i) => (
      <div
        key={i}
        className={`options-selected-container ${className && `${className}-options-selected-container`}`}
        onClick={event => event.stopPropagation()}
      >
        <div className={`options-group ${className && `${className}-options-group`}`}>
          {item.label}
          {' : '}
          &nbsp;
        </div>
        {item.options.map((data, index) => (
          <div key={index} className={`options-value ${className && `${className}-options-value`}`}>
            {(item.options.length >= 2 && index === item.options.length - 1)
              ? (
                <span>
                  <span className={`or-separator ${className && `${className}-or-separator`}`}>OR</span>
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
          className={`remove-group ${className && `${className}-remove-group`}`}
        >
          &#10005;
        </div>
      </div>
    ));
  }

  onOptionsChange = () => {
    const { onChange } = this.props;
    const { values } = this.state;
    onChange(values);
  }

  removeSelectedGroup = ({ value }) => {
    const { values } = this.state;
    this.setState({ values: values.filter(data => data.value !== value) });
  }

  handleClickOutside = () => {
    const { showMenu } = this.state;
    return showMenu && this.setState({ showMenu: false });
  }

  toggleMenu = () => {
    const { showMenu } = this.state;
    this.setState({ showMenu: !showMenu });
  }

  renderButton = () => {
    const { showMenu } = this.state;
    const { className } = this.props;
    return (
      <div className="multi-selector-button" onClick={this.toggleMenu}>
        <div className={showMenu ? `arrow-up ${className && `${className}-arrow-up`}` : `arrow-down ${className && `${className}-arrow-up`}`} />
      </div>
    );
  }

  renderPlaceholder = () => {
    const { placeholder, className } = this.props;
    return (
      <div className={`multi-selector-placeholder ${className && `${className}-multi-selector-placeholder`}`}>
        {placeholder ? `${placeholder}` : 'Filter by custom attributes'}
      </div>
    );
  }

  renderOptions = () => {
    const { values } = this.state;
    const { options, className } = this.props;

    return (
      <div className="options-main-menu">
        {
          options.map((item, i) => (
            <div key={i} className="options-container">
              <div className={`options-label ${className && `${className}-options-label`}`}>{item.label}</div>
              {item.options && (
                <>
                  <div className={`arrow-right ${className && `${className}-arrow-right`}`} />
                  <div className={`options-sub-menu-container ${className && `${className}-options-sub-menu-container`}`}>
                    <div
                      className={`options-sub-menu-header ${className && `${className}-options-sub-menu-header`}`}
                    >
                      {item.label}
                    </div>
                    {item.options.map((subItem, index) => (
                      <label key={index}>
                        <div className={`options-sub-menu ${className && `${className}-options-sub-menu`}`}>
                          <input
                            type="checkbox"
                            value={subItem.value}
                            checked={
                              values.some(value => value.value === item.value
                                && value.options.some(data => data.value === subItem.value))
                            }
                            name={subItem.label}
                            onChange={e => this.selectOption({ value: item.value, label: item.label }, e)}
                          />
                          <div className="checkbox"><span className="checkmark" /></div>
                          <div className={`options-label ${className && `${className}-options-label`}`}>{subItem.label}</div>
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
    const { values, showMenu } = this.state;
    const { className } = this.props;
    return (
      <div className="multi-level-selector-container">
        <div
          className={`multi-selector-container ${className && `${className}-multi-selector-container`} ${showMenu ? `active ${className && `${className}-active`}` : 'inactive'}`}
        >
          <div className="multi-selector" onClick={this.toggleMenu}>
            {!values.length && this.renderPlaceholder()}
            {this.renderOptionsSelected(values)}
          </div>
          {this.renderButton()}
        </div>
        <div className={`multi-level-options-container ${className && `${className}-multi-level-options-container`} ${showMenu ? `menu-open ${className && `${className}-menu-open`}` : `menu-close ${className && `${className}-menu-open`}`}`}>
          {this.renderOptions()}
        </div>
      </div>
    );
  }
}

MultiSelect.propTypes = {
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

MultiSelect.defaultProps = {
  placeholder: '',
  options: [],
  onChange: () => { },
  className: '',
};

export default listensToClickOutside(MultiSelect);
