import * as React from 'react';
import { MyMoney } from '@waves/balances/src/utils';
import { HTMLAttributes } from 'react';

interface DropdownProps extends HTMLAttributes<any> {
    balance: MyMoney;
    onSelectItem?: (balance: MyMoney) => void;
    inInput?: boolean;
}

export const DropdownItem: React.FC<DropdownProps> = ({ balance, onSelectItem, className, inInput = false }) => (
    <li className={`search-input-dropdown__item ${className}`} key={balance.asset.id} onClick={() => {
        if (onSelectItem) {
            onSelectItem(balance)
        }
    }}>
        <div className='search-input-dropdown__meta-wrapper'>
            <span className='search-input-dropdown__asset-icon' style={{ backgroundImage: `url('${balance.asset.icon}')` }} />
            <span className='search-input-dropdown__asset-ticker'>{balance.asset.ticker || balance.asset.name}</span>
            <span className='search-input-dropdown__asset-name'>{balance.asset.displayName}</span>
        </div>
        {!inInput && <div>
            {balance.toFormat()}
        </div>}
    </li>
);
