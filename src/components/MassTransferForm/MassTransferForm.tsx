import * as React from 'react';
import { TxFormWrapper } from '../TxFormWrapper/TxFormWrapper';
import { SearchAsset } from '../SearchAsset/SearchAsset';
import { MyMoney } from '@waves/balances/src/utils';
import { Signer } from '@waves/signer';
import { useParseTransfers } from './useParseTransfers';
import { Button } from '../Button/Button';
import { Pending } from '../Pending/Pending';
import { PlateError } from '../Error/PlateError';
import { libs } from '@waves/waves-transactions';

export interface ITransferItem {
    recipient: string;
    amount: MyMoney;
}

const TEXTAREA_PLACEHOLDER = 'Use a comma to separate recipient and the amount to send. Use\n' +
    'a new line for each recipient. \n' +
    'Example:\n' +
    'Address1,Amount1\n' +
    'Alias2,Amount2'

interface MassTransferFormProps {
    handleLogout: () => void;
    balances: Record<string, MyMoney>;
    signer: Signer;
    balancePending: boolean;
}

export const MassTransferForm: React.FC<MassTransferFormProps> = ({ handleLogout, balances, signer, balancePending }) => {
    const [selectedAsset, setAsset] = React.useState<MyMoney>();
    const [inputValue, setInputValue] = React.useState('');
    const [descValue, setDescValue] = React.useState('');
    const [error, setError] = React.useState('');

    const handleChange = React.useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        e.preventDefault();

        setInputValue(e.target.value);
        setError('');
    }, [balances]);

    const handleDescChange = React.useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        e.preventDefault();

        setDescValue(e.target.value);
    }, []);

    const onSelect = React.useCallback((balance: MyMoney) => {
        setAsset(balance)
    }, []);

    const { transfers } = useParseTransfers(inputValue, selectedAsset);

    const handleConfirm = React.useCallback(async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setError('');

        try {
            const tx = await signer.massTransfer({
                transfers: transfers.map(item => ({ ...item, amount: item.amount.getTokens().toNumber() })),
                assetId: selectedAsset.asset.id,
                attachment: libs.crypto.base58Encode(descValue)
            }).broadcast();

            // @ts-ignore
            await signer.waitTxConfirm(tx, 0);

            console.log('%c DONE', 'color: #e5b6ed');
        } catch (e) {
            setError(JSON.stringify(e));
        }

    }, [selectedAsset, signer, transfers, descValue]);

    return <TxFormWrapper title={'Mass Transfer'} handleLogout={handleLogout} onConfirm={handleConfirm} confirmText='Transfer'>

        <div className='form__row'>
            <label className='form__label'>Select Asset</label>
            {balancePending ?
                <Pending /> :
                <SearchAsset balances={balances} onSelect={onSelect}/>
            }

        </div>

        <div className='form__row'>
            <div className='space-between'>
                <label className='form__label'>Recipients, Amounts: {transfers.length}/100</label>
                <span className='link'>Import CSV File</span>
            </div>
            <textarea className='input textarea' placeholder={TEXTAREA_PLACEHOLDER} onChange={handleChange}/>
        </div>

        <div className='form__row'>
            <label className='form__label'>Description</label>
            <textarea className='input textarea' placeholder={'Write a message'} onChange={handleDescChange}/>
        </div>

        {error && <PlateError>
            {error}
        </PlateError>}

        <Button className='big' variant='primary' onClick={handleConfirm} disabled={transfers.length === 0 || balancePending}>Transfer</Button>
    </TxFormWrapper>
}
