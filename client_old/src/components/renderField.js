import React, { Component } from 'react';
import { Form, Input } from 'semantic-ui-react';

class renderField extends Component {
  render() {
    const {
      input,
      label,
      type,
      meta: { touched, error, warning }
    } = this.props;
    return (
      <Form.Field error={touched && !!error}>
        {label && <label>{label}</label>}
        <Input {...input} placeholder={label} type={type} fluid />
        {touched &&
          ((error && <label style={{ fontSize: '0.8em' }}>{error}</label>) ||
            (warning && (
              <label style={{ fontSize: '0.8em' }}>{warning}</label>
            )))}
      </Form.Field>
    );
  }
}

export default renderField;
