import * as React from 'react';
import Void from '@app/utils/Void';
import '@app/styles/FieldError.css';

export interface FieldErrorProps {
  touched: any;
  error: any;
}

const FieldError: React.SFC<FieldErrorProps> = ({ touched, error }) => (
  <Void>
    {touched && error ? (
      <label className="FieldError-label"> {error}</label>
    ) : null}
  </Void>
);

export default FieldError;
