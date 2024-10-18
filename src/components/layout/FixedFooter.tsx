import { useInjection } from 'inversify-react';
import React, { useEffect, useState } from 'react';
import CPanelService from '../../services/CPanelService';
import './FixedFooter.scss';

const FixedFooter: React.FC = function () {
  const service = useInjection(CPanelService);
  const [swVersion, setSwVersion] = useState('');
  const loadSwVersion = async () => {
    try {
      const resp = await service.GetSoftwareVersion();
      setSwVersion(resp.content);
    } catch (error) {
      //
    }
  }
  useEffect(() => {
    loadSwVersion();
    return () => {};
  }, [])
  return (
    <div className="fixed-footer px-4">
      <div className="flex-common-x-end h-100">
        <span>Version: {swVersion}</span>
      </div>
    </div>
  );
};
export default FixedFooter;
