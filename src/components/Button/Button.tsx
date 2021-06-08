import * as React from 'react';
import './Button.scss';

interface Button {
    variant: 'transparent' | 'primary';
    onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    className?: string;
}

export const Button: React.FC<Button> = ({ children, variant, className, ...rest }) => (
    <button className={`btn btn_${variant} ${className}`} {...rest}>{children}</button>
);
