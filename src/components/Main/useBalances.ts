import { useContext, useEffect, useRef, useState } from 'react';
import { Signer } from '@waves/signer';
import { MyMoney } from '@waves/balances/src/utils';
import { Balance } from '@waves/balances';
import { ConfigContext } from '../../context/ConfigContext';

export const useBalances = (signer: Signer|null|undefined, userAddress: string) => {
    const balanceRef = useRef<Balance>(null);
    const [userBalances, setUserBalances] = useState<Record<string, MyMoney>>({});
    const [balancePending, setBalancePending] = useState(false);
    const config = useContext(ConfigContext);

    useEffect(() => {
        if (userAddress) {
            setBalancePending(true);
            balanceRef.current = new Balance({
                iconUrl: config.iconServiceUrl,
                address: userAddress,
                updateBalancesMs: 5000,
                dataServicesUrl: config.dataServicesUrl,
                nodeUrl: config.nodeUrl,
            });

            balanceRef.current.onUpdate((balances) => {
                setBalancePending(false);

                setUserBalances(balances);
            });
        } else {
            balanceRef.current?.destroy();
        }
    }, [userAddress]);

    useEffect(() => {
        return () => {
            balanceRef.current?.destroy();
        }
    }, []);

    return { userBalances, balancePending }
}
