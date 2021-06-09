import * as React from 'react';
import { MyMoney } from '@waves/balances/src/utils';
import { useEffect } from 'react';
import './SearchAsset.scss';
import { useClickOut } from '../../shared/useOutsideClick';
import { DropdownItem } from './components/DropdownItem';

interface SearchInputProps {
    onSelect: (balance: MyMoney) => void;
    balances: Record<string, MyMoney>;
}

export const SearchAsset: React.FC<SearchInputProps> = ({ balances, onSelect }) => {
    const [selectedAsset, setAsset] = React.useState<MyMoney>();
    const [dropdownVisible, setDropdownVisible] = React.useState(false);
    const [currentBalances, setCurrentBalances] = React.useState<MyMoney[]>([]);
    const [isFocused, setIsFocused] = React.useState(false);
    const [inputValue, setInputValue] = React.useState('');
    const dropdownRef = React.useRef();
    const balancesList = React.useMemo(() => Object.values(balances).sort((a, b) => a.asset.hasImage ? -1 : 0), [balances]);

    const onChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setDropdownVisible(true);
        const value = e.target.value.trim();
        setInputValue(value);

        const newBalances = balancesList
            .filter(balance =>
                balance.asset.name.toLowerCase().includes(value.toLowerCase()) ||
                balance.asset.ticker?.toLowerCase().includes(value.toLowerCase()) ||
                balance.asset.id.toLowerCase().includes(value.toLowerCase()))

        setCurrentBalances(newBalances);
    }, [balancesList]);

    useEffect(() => {
        setCurrentBalances(balancesList);
    }, [balancesList]);

    const switchDropdown = (e: React.MouseEvent) => {
        e.preventDefault();
        setDropdownVisible(!dropdownVisible);
    }

    useClickOut(() => {
        setDropdownVisible(false);
        setIsFocused(false);
    }, dropdownRef);

    const isSelectedVisible = React.useMemo(() =>
        selectedAsset && !dropdownVisible && !isFocused,
        [selectedAsset, dropdownVisible, isFocused]);

    return (
        <div className='search-asset-container' ref={dropdownRef}>
            <div className={`search-input-wrapper ${isSelectedVisible ? 'hide-icon' : ''}`}>

                <input
                    value={inputValue}
                    onFocus={() => {
                        setIsFocused(true);
                    }}
                    onBlur={() => {
                        setIsFocused(false);
                    }}
                    onChange={onChange}
                    className={`search-input input ${isSelectedVisible ? 'transparent' : ''}`}
                    type='text'
                    placeholder='Type asset name'/>

                <button className={`search-input-arrow ${dropdownVisible ? 'active' : ''}`} onClick={switchDropdown}/>

                {isSelectedVisible && <DropdownItem className='in-input' balance={selectedAsset} inInput={true}/>}

            </div>

            {dropdownVisible && <ul className='search-input-dropdown'>
                {currentBalances.map(balance => (
                    <DropdownItem key={balance.asset.id} balance={balance} onSelectItem={(balance) => {
                        setDropdownVisible(false);
                        onSelect(balance);
                        setAsset(balance);
                        setInputValue('');
            }} />
                ))}
            </ul>}
        </div>
    );
}
