import * as React from 'react';
import { Title } from '../Title/Title';
import './TxFormWrapper.scss';
import { Button } from '../Button/Button';

interface TxFormWrapperProps {
    onConfirm: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    title?: string;
    handleLogout?: () => void;
    confirmText?: string;
}

export const TxFormWrapper: React.FC<TxFormWrapperProps> = ({ title, handleLogout, children, onConfirm, confirmText = 'Confirm' }) => (
    <form className='tx-form'>
        <div className='space-between'>
            <Title>{title}</Title>
            {handleLogout && <Button variant='transparent' onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                e.preventDefault();
                handleLogout();
            }}>Log Out</Button>}
        </div>

        {children}

    </form>
);
