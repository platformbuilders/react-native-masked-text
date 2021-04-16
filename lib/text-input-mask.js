import React from 'react';
import { TextInput } from 'react-native';
import BaseTextComponent from './base-text-component';

/**
 * TextInputMask
 * @class
 */
class TextInputMask extends BaseTextComponent {
  /**
   * Return an element input
   * @returns {this._inputElement}
   * return an input element
   */
  getElement() {
    return this._inputElement;
  }

  /**
   * @param {string} text The first string.
   * @returns {return}
   * '
   */
  _onChangeText(text) {
    if (!this._checkText(text)) {
      return;
    }

    const { maskedText, rawText } = this.updateValue(text);

    if (this.props.onChangeText) {
      this._trySetNativeProps(maskedText);
      this.props.onChangeText(maskedText, rawText);
    }
  }

  _trySetNativeProps(maskedText) {
    try {
      const element = this.getElement();
      element.setNativeProps && element.setNativeProps({ text: maskedText });
    } catch (error) {
      // silent
    }
  }

  _checkText(text) {
    if (this.props.checkText) {
      return this.props.checkText(this.props.value, text);
    }

    return true;
  }

  _getKeyboardType() {
    return this.props.keyboardType || this._maskHandler.getKeyboardType();
  }

  render() {
    let Input = TextInput;
    let customTextInputProps = {};

    if (this.props.customTextInput) {
      Input = this.props.customTextInput;
      customTextInputProps = this.props.customTextInputProps || {};
    }

    return (
      <Input
        ref={(ref) => {
          if (ref) {
            this._inputElement = ref;

            if (typeof this.props.refInput === 'function') {
              this.props.refInput(ref);
            }
          }
        }}
        keyboardType={this._getKeyboardType()}
        {...this.props}
        {...customTextInputProps}
        onChangeText={(text) => this._onChangeText(text)}
        value={this.getDisplayValueFor(this.props.value)}
      />
    );
  }
}

export default TextInputMask;
