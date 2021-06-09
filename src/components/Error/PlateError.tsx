import * as React from 'react';
import './PlateError.scss';

export const PlateError: React.FC = ({ children }) => {

    return (
        <div className='plate error'>
            {children}
        </div>
    );
}
