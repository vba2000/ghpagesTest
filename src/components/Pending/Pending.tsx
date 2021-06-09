import * as React from 'react';
import './Pending.scss';

interface PendingProps {

}

export const Pending: React.FC<PendingProps> = (props) => {

    return (<div className='loader'>
        <div className="loader__dot" />
    </div>
);
}
