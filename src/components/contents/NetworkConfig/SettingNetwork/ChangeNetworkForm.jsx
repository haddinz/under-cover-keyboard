import { FmlxButton, FmlxTextBox } from 'fmlx-common-ui';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useInjection } from 'inversify-react';
import networkConfigurationApi from '../../../api/networkConfigurationApi';
// import LoadingService from '../../../../services/LoadingService';
import DialogService from '../../../../services/DialogService';
import { TypeOfResultConnectNetwork } from '../../../../enums/networkConfigEnum';
import LoadingService from '../../../../services/LoadingService';

function ChangeNetworkForm({ item, onClose }) {
  const [pass, setPass] = useState('');
  const [error, setError] = useState({ errorText: false, inLineText: '' });

  const { name, isPasswordRequired } = item;

  const loading = useInjection(LoadingService);
  const toastAction = useInjection(DialogService);

  const isDisableChangeNetwork = isPasswordRequired ? pass.trim() === '' : false || error.errorText;

  const handleChangeNetwork = async () => {
    loading.start('Changing network...');

    const data = {
      ssid: name,
      password: pass,
    };

    const response = await networkConfigurationApi.connectNetworkApi(data);

    if (response) {
      if (response.error === TypeOfResultConnectNetwork.NONE) {
        onClose();
        loading.stop();
        toastAction.alertSuccess('Success changed the network');
      } else if (response.error === TypeOfResultConnectNetwork.INCORRECT_PASSWORD) {
        setError({ errorText: true, inLineText: 'Incorrect network password. Please try again.' });
        loading.stop();
      } else {
        loading.stop();
      }
    }
  };

  return (
    <div className={`${isPasswordRequired ? 'list-item-content' : 'list-item-content-without-password'} `}>
      {isPasswordRequired ? (
        <FmlxTextBox
          error={error.errorText}
          inlineText={error.inLineText}
          value={pass}
          mode={FmlxTextBox.Mode.PASSWORD}
          onChange={({ value }) => {
            if (value) {
              setError({
                errorText: false,
                inLineText: '',
              });
            }
            setPass(value);
          }}
        />
      ) : (
        <div>
        No password needed
        </div>
      )}

      <FmlxButton
        label="CHANGE NETWORK"
        disabled={isDisableChangeNetwork}
        onClick={() => {
          handleChangeNetwork();
        }}
      />
    </div>
  );
}

ChangeNetworkForm.defaultProps = {
  item: null,
  onClose: () => {},
};

ChangeNetworkForm.propTypes = {
  item: PropTypes.any,
  onClose: PropTypes.func,
};

export default ChangeNetworkForm;
