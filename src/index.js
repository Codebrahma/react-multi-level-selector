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

  renderOptionsSelected = values => (
    values.map((item, i) => (
      <div key={i} className="selected" onClick={event => event.stopPropagation()}>
        <div className="groupHead">
          {item.label}
          {':'}
          &nbsp;
        </div>
        {item.options.map((data, index) => (
          <div key={index}>
            {(item.options.length >= 2 && index === item.options.length - 1)
              ? (
                <span>
                  <span className="or">OR</span>
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
          className="close"
        >
          &#10005;
        </div>
      </div>
    ))
  )

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
    this.state.showMenu && this.setState({ showMenu: false });
  }

  toggleMenu = () => {
    const { showMenu } = this.state;
    this.setState({ showMenu: !showMenu });
  }

  renderButton = () => {
    const { showMenu } = this.state;
    return (
      <div className="select-button" onClick={this.toggleMenu}>
        <div className={showMenu ? 'select-arrow-up' : 'select-arrow-down'} />
      </div>
    );
  }

  renderPlaceholder = () => {
    const { placeholder } = this.props;
    return (
      <div className="placeholder">
        {placeholder ? `${placeholder}` : 'Filter by custom attributes'}
      </div>
    );
  }

  renderOptions = () => {
    const { values } = this.state;
    const { options } = this.props;
    return (
      <div className="main-menu">
        {options.map((item, i) => (
          <div key={i} className="option">
            <div className="option-label">{item.label}</div>
            {item.options && (
              <>
                <div className="select-right" />
                <div className="sub-menu">
                  <div className="option-header">{item.label}</div>
                  {item.options.map((subItem, index) => (
                    <label key={index}>
                      <div className="option-container">
                        {subItem.label}
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
                        <span className="checkmark" />
                      </div>
                    </label>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    );
  }

  render() {
    const { values, showMenu } = this.state;
    return (
      <div className="multi-level-selector-container">
        <div className="multi-select-container">
          <div className="multi-select" onClick={this.toggleMenu}>
            {!values.length && this.renderPlaceholder()}
            {this.renderOptionsSelected(values)}
          </div>
          {this.renderButton()}
        </div>
        <div className={`dropDown-content ${showMenu ? 'open' : 'close'}`}>
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
};

MultiSelect.defaultProps = {
  placeholder: '',
  options: [],
  onChange: () => { },
};

export default listensToClickOutside(MultiSelect);
