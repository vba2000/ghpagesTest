import * as React from 'react';
import { ProviderCloud } from '@waves.exchange/provider-cloud';
import { ProviderWeb } from '@waves.exchange/provider-web';
import './LoginModal.scss';
import { Title } from '../Title/Title';
import { Pending } from '../Pending/Pending';

interface LoginModalProps {
    onSelect: (type: typeof ProviderCloud | typeof ProviderWeb) => any;
    onClose?: () => void;
    isPending: boolean;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onSelect, isPending }) => {

    const selectWeb = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        onSelect(ProviderWeb);
    }
    const selectCloud = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        onSelect(ProviderCloud)
    };

    return <form className='login-container'>
        <Title className='login-title'>Connect wallet</Title>
         <div className='buttons-wrapper'>
             {isPending ?
                 <Pending /> :
                 <>
                     <button className='login-btn storage' onClick={selectWeb}>Waves Exchange Storage</button>
                     <button className='login-btn email' onClick={selectCloud}>Email Account</button>
                 </>
             }
        </div>
    </form>
};
