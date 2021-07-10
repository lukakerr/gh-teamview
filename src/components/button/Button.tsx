import * as React from 'react';

import { Button as MaterialUiButton } from '@material-ui/core';

export interface ButtonProps {
  color?: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  small?: boolean;
  style?: object;
}

export class Button extends React.Component<ButtonProps, {}> {
  render() {
    const { color, onClick, className, disabled, style, small = false } = this.props;

    return (
      <MaterialUiButton
        style={{
          color: color ? color : 'white',
          borderRadius: '0',
          padding: small ? '2px 0' : '10px 0',
          textTransform: 'unset',
          fontSize: small ? '1rem' : '1.2rem',
          opacity: disabled ? 0.5: 1,
          ...style,
        }}
        disabled={disabled}
        className={className ? className : ''}
        onClick={onClick}
        fullWidth
      >
        {this.props.children}
      </MaterialUiButton>
    );
  }
}
