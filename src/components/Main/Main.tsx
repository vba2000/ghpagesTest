import React, { useCallback, useContext, useEffect, useState } from 'react';
import { MassTransferForm } from '../MassTransferForm/MassTransferForm';
import { LoginModal } from '../LoginModal/LoginModal';
import { ProviderWeb } from '@waves.exchange/provider-web';
import { ProviderCloud } from '@waves.exchange/provider-cloud';
import { Signer } from '@waves/signer';
import { ConfigContext } from '../../context/ConfigContext';
import { BigNumber } from '@waves/bignumber';
import { useBalances } from './useBalances';
import { Modal } from '../Modal/Modal';

interface MainProps {

}

export const Main: React.FC<MainProps> = (props) => {
    const config = useContext(ConfigContext);
    const [signer, setSigner] = useState<Signer|null|undefined>(null);
    const [userAddress, setUserAddress] = useState('');
    const [onSelectSigner, setOnSelectedSigner] = useState<boolean>();
    const [loginResults, setLoginResults] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(true);

    const { userBalances } = useBalances(signer, userAddress);

    console.log('%c config', 'color: #e5b6ed', config);

    const onLogin = useCallback(async (provider: typeof ProviderWeb | typeof ProviderCloud) => {
        setOnSelectedSigner(false);
        setUserAddress('');
        const currentSigner = signer || new Signer({ NODE_URL: config.nodeUrl });
        currentSigner.setProvider(new provider() as any);
        setSigner(currentSigner);
        try {
            const user = await currentSigner.login();
            setUserAddress(user.address);
            loginResults && loginResults.res({ ...user, signer: currentSigner });
            setIsModalOpen(false)
            return user;
        } catch (e) {
            loginResults && loginResults.rej();
            return;
        }
    }, [signer, loginResults]);

    const logout = useCallback(async () => {
        setIsModalOpen(true);
        if (!signer) {
            return;
        }

        try {
            await signer.logout();
            setUserAddress('');
            setSigner(null);
        } catch (e) {
            return;
        }
    }, [signer]);


    return <div>
        <MassTransferForm handleLogout={logout} balances={userBalances} signer={signer}/>
        {isModalOpen && (
            <Modal onClose={() => setIsModalOpen(false)}>
                <LoginModal onSelect={onLogin} onClose={() => setIsModalOpen(false)}/>
            </Modal>
        )}
    </div>
}
