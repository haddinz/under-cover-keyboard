import { useInjection } from 'inversify-react';
import React, { useEffect, useState } from 'react';
import { FmlxButton } from 'fmlx-common-ui';
import SequenceFile from '../../../models/SequenceFile';
import SequenceService from '../../../services/SequenceService';
import { StampedeModal } from '../../FmlxUi';
import IGetParamsTable from '../../../interfaces/IGetParamsTable';

const params: IGetParamsTable<SequenceFile> = {
  limit: 100,
  order: 'name',
  orderDesc: false,
  page: 0,
};

const SequenceSelectionForm: React.FC<{ open: boolean, selectSequence(seq: SequenceFile), close(): any }> = function ({ open, selectSequence, close }) {
  const service = useInjection(SequenceService);
  const [items, setItems] = useState<SequenceFile[]>([]);
  const loadItems = async () => {
    // const result = await service.getSequences(params);
    // setItems(result.items);
    console.log('items', items);
  }
  useEffect(() => {
    loadItems();
  }, [])
  return (
    <StampedeModal
      open={open}
      title="Choose Sequence"
      onCloseClick={close}
      tertiaryButton={{
        show: true, disabled: false, type: FmlxButton.Type.BASIC, variant: FmlxButton.Variant.PLAIN, label: 'UPLOAD NEW SEQUENCE', onClick: () => {},
      }}
      secondaryButton={{
        show: true, disabled: false, type: FmlxButton.Type.BASIC, variant: FmlxButton.Variant.OUTLINE, label: 'CANCEL', onClick: close,
      }}
      primaryButton={{
        show: true, disabled: false, type: FmlxButton.Type.PRIMARY, variant: FmlxButton.Variant.CONTAIN, label: 'SELECT', onClick: () => {},
      }}
    />
  );
};
export default SequenceSelectionForm;
