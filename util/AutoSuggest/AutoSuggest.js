import React from 'react';
import Downshift from 'downshift';
import PropTypes from 'prop-types';
import uniqueId from 'lodash/uniqueId';
import TetherComponent from 'react-tether';
import injectIntl from '@folio/stripes-components/lib/InjectIntl';
import TextField from '@folio/stripes-components/lib/TextField';
import reduxFormField from '@folio/stripes-components/lib/ReduxFormField';
import css from './AutoSuggest.css';

const defaultProps = {
  validationEnabled: true,
  tether: {
    attachment: 'top center',
    renderElementTo: null,
    targetAttachment: 'bottom center',
    optimizations: {
      gpu: false,
    },
    constraints: [
      {
        to: 'scrollParent',
      },
    ],
  },
};

const propTypes = {
  error: PropTypes.string,
  id: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  label: PropTypes.string,
  meta: PropTypes.object,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  screenReaderMessage: PropTypes.string,
  tether: PropTypes.object,
  validationEnabled: PropTypes.bool,
  value: PropTypes.string,
};

class AutoSuggest extends React.Component {
  static propTypes = propTypes;
  static defaultProps = defaultProps;

  constructor(props) {
    super(props);
    this.textfield = React.createRef();
    this.testId = this.props.id || uniqueId('detailname-');
    this.autoSuggestId = `list-dropdown-${this.testId}`;
  }

  render() {
    const { tether,
      items,
      label,
      value,
      required,
      validationEnabled, onBlur, error, onChange } = this.props;

    const textfieldRef = this.textfield;
    const mergedTetherProps = { ...AutoSuggest.defaultProps.tether, ...tether };
    const testId = this.testId;
    const autoSuggestId = this.autoSuggestId;
    const inputProps = {
      autoComplete: 'off',
      required,
      label,
      validationEnabled,
      ref: textfieldRef,
      id: testId,
      error,
    };

    return (
      <TetherComponent {...mergedTetherProps}>
        <Downshift
          style={{ display: 'inline-block', position: 'relative' }}
          itemToString={item => (item ? item.value : '')}
          onChange={selectedItem => onChange(selectedItem.value)}
          onStateChange={({ inputValue }) => onChange(inputValue)}
          selectedItem={value}
          inputValue={value}
        >
          {({
              getInputProps,
              getItemProps,
              getMenuProps,
              selectedItem,
              highlightedIndex,
              isOpen,
              inputValue,
            }) => (
              <div className={css.downshift}>
                <div
                  className={css.TextFieldDiv}
                  aria-live="assertive"
                  aria-relevant="additions"
                >
                  <TextField {...getInputProps(
                      { ...inputProps,
                        onBlur: onBlur,
                      }
                    )}
                  />
                </div>
                <ul className={css.AutoSuggest} {...getMenuProps({ id: autoSuggestId })} >
                  {isOpen
                    ? items
                      .filter(item => !inputValue || item.value.includes(inputValue))
                      .map((item, index) => (
                        <li
                          {...getItemProps({
                            key: item.value,
                            index,
                            item,
                            style: {
                              padding: '5px',
                              cursor: 'default',
                              display: 'flex',
                              justifyContent: 'space-between',
                              backgroundColor:
                                highlightedIndex === index ? 'lightgray' : 'white',
                                fontWeight: selectedItem === item ? 'bold' : 'normal',
                            },
                          })}
                        >
                          {item.value}
                        </li>
                      ))
                  : null}
                </ul>
              </div>
              )
            }
        </Downshift>
      </TetherComponent>
    );
  }
}

export default reduxFormField(
  injectIntl(
    AutoSuggest, { withRef: true }
  ), ({ input, meta }) => ({
    dirty: meta.dirty,
    error: (meta.touched && meta.error ? meta.error : ''),
    loading: meta.asyncValidating,
    name: input.name,
    onBlur: input.onBlur,
    onChange: input.onChange,
    onFocus: input.onFocus,
    touched: meta.touched,
    valid: meta.valid,
    value: input.value,
    warning: (meta.touched && meta.warning ? meta.warning : ''),
  })
);
