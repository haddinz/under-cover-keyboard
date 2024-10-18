import { FmlxButton } from 'fmlx-common-ui';
import React, { useState } from 'react';
import PcrSection from '../../../models/pcrProfile/PcrSection';
import PcrSectionType from '../../../models/pcrProfile/PcrSectionType';
import ProtocolModel from '../../../models/protocol/ProtocolModel';
import { StampedeModal, StampedeSwitch, StampedeTable } from '../../FmlxUi';
import FmlxIcon from '../../icon/FmlxIcon';
import ProtocolEditorContext from './ProtocolEditorContext';
import SectionFieldChange from './SectionFieldChange';
import HoldTimeField from './parameterSetting/HoldTimeField';
import MotorOffsetField from './parameterSetting/MotorOffsetField';
import MotorVelocityField from './parameterSetting/MotorVelocityField';
import NumCycleField from './parameterSetting/NumCycleField';
import RampRateField from './parameterSetting/RampRateField';
import SectionAction from './parameterSetting/SectionAction';
import TemperatureField from './parameterSetting/TemperatureField';

const mapSections = (defaultModel?: ProtocolModel) => {
  if (!defaultModel) {
    return new Map();
  }
  const map = new Map<PcrSectionType, PcrSection>();
  defaultModel.sectionEntries.forEach((v) => {
    map.set(v[1].type, v[1]);
  });
  return map;
};

const ProtocolParameterForm: React.FC<{
  model: ProtocolModel,
  sectionFieldChange: SectionFieldChange,
  addSection(s: PcrSection): any,
  removeSection(s: PcrSection): any,
  moveSection(s: PcrSection, right: boolean): any,
  readOnly?: boolean,
  className?: string,
  defaultModel?: ProtocolModel,
}> = function ({ model, sectionFieldChange, addSection, removeSection, moveSection, readOnly, className, defaultModel }) {
  const [sectionToRemove, setSectionToRemove] = useState<PcrSection>();
  const confirmRemoveSection = (s: PcrSection) => {
    setSectionToRemove(s);
  };
  const confirmRemoveSectionCallback = (remove: boolean) => {
    if (sectionToRemove && remove) {
      removeSection(sectionToRemove);
    }
    setSectionToRemove(undefined);
  };
  const sectionsData = getSectionsData(
    model,
    sectionFieldChange,
    addSection,
    confirmRemoveSection,
    moveSection,
    readOnly ?? false,
  );
  const data = [
    { step: 'Status', ...sectionsData.statusFields },
    { step: 'Cycle', ...sectionsData.cycleFields },
    { step: 'Temperature (°C)', ...sectionsData.temperatureFields },
    { step: 'Dwell Time (s)', ...sectionsData.holdTimeFields },
    { step: 'Movement Offset (deg)', ...sectionsData.motorOffsetFields },
    { step: 'Velocity (deg/s)', ...sectionsData.motorVelocityFields },
    { step: 'Ramp rate (°C/s)', ...sectionsData.rampRateFields },
  ];
  const sampleSections = React.useMemo(() => mapSections(defaultModel), [defaultModel]);
  const ContextProvider = ProtocolEditorContext.Provider;
  return (
    <div className={className ?? ''}>
      {sectionToRemove && <DeleteSectionConfirm confirm={confirmRemoveSectionCallback} />}
      <div className="protocol-editor-section-title mt-4">Parameter Settings</div>
      <ContextProvider value={{ defaultModel, sampleSections }}>
        <StampedeTable
          id="protocol-editor-form-table"
          columns={[
            { Header: 'Step', accessor: 'step', disableSort: true, editable: false, hideSort: true, hideFilter: true },
            ...sectionsData.columns as any,
          ]}
          data={data}
          allowSelectedRow={false}
        />
      </ContextProvider>
    </div>
  );
};

const DeleteSectionConfirm: React.FC<{ confirm(ok: boolean): any }> = function ({ confirm }) {
  return (
    <StampedeModal
      open
      onCloseClick={() => confirm(false)}
      title="Warning"
      primaryButton={{
        label: 'CANCEL',
        disabled: false,
        onClick: () => confirm(false),
        show: true,
        type: FmlxButton.Type.PRIMARY,
        variant: FmlxButton.Variant.CONTAIN,
      }}
      secondaryButton={{
        label: 'YES, REMOVE',
        disabled: false,
        onClick: () => confirm(true),
        show: true,
        type: FmlxButton.Type.BASIC,
        variant: FmlxButton.Variant.OUTLINE,
      }}
    >
      <div className="mb-4">
        Are you sure to remove this section?
      </div>
    </StampedeModal>
  );
};

const getSectionsData = (
  model: ProtocolModel,
  sectionFieldChange: SectionFieldChange,
  addSection: (s: PcrSection) => any,
  removeSection: (s: PcrSection) => any,
  moveSection: (s: PcrSection, right: boolean) => any,
  readOnly: boolean,
) => {
  const { sections } = model;
  const keys = Array.from(sections.keys());
  const sectionArr = model.sectionArray;
  const cols = keys.map((key: any) => {
    const section = sections.get(key);
    if (!section) {
      return null;
    }
    return {
      Header: (
        <SectionAction
          sectionArr={sectionArr}
          section={section}
          addSection={addSection}
          removeSection={removeSection}
          move={moveSection}
          readOnly={readOnly}
        />
      ),
      accessor: key,
      disableSort: true,
      editable: false,
      hideSort: true,
      hideFilter: true,
    };
  });
  const statusFields: any = {};
  const cycleFields: any = {};
  const temperatureFields: any = {};
  const holdTimeFields: any = {};
  const motorOffsetFields: any = {};
  const motorVelocityFields: any = {};
  const rampRateFields: any = {};
  keys.forEach((key: any) => {
    const section = sections.get(key);
    if (!section) {
      return;
    }
    statusFields[key] = (
      <div className="protocol-editor-section-field-status">
        {readOnly ?
        (
          <div className="text-center">
            <FmlxIcon
              name={section.enabled ? 'CheckboxCheckedCircle' : 'CancelCircle'}
              customColor={section.enabled ? 'green' : '#313131'}
            />
          </div>
        ) : 
        (
          <StampedeSwitch
            checked={section.enabled}
            size="xs"
            onChange={(val) => sectionFieldChange(key, 'enabled', val)}
          />
        )}
      </div>
    );
    cycleFields[key] = (
      <NumCycleField
        section={section}
        onChange={(val) => sectionFieldChange(key, 'numberOfCycle', val)}
        readOnly={readOnly}
      />
    );
    temperatureFields[key] = (
      <TemperatureField
        section={section}
        onStep1Change={(val) => sectionFieldChange(key, 'step1.temp', val)}
        onStep2Change={(val) => sectionFieldChange(key, 'step2.temp', val)}
        readOnly={readOnly}
      />
    );
    holdTimeFields[key] = (
      <HoldTimeField
        section={section}
        onStep1Change={(val) => sectionFieldChange(key, 'step1.holdTime', val)}
        onStep2Change={(val) => sectionFieldChange(key, 'step2.holdTime', val)}
        readOnly={readOnly}
      />
    );
    motorOffsetFields[key] = (
      <MotorOffsetField
        section={section}
        onStep1Change={(val) => sectionFieldChange(key, 'step1.motorMovement.offset', val)}
        onStep2Change={(val) => sectionFieldChange(key, 'step2.motorMovement.offset', val)}
        readOnly={readOnly}
      />
    );
    motorVelocityFields[key] = (
      <MotorVelocityField
        section={section}
        onStep1Change={(val) => sectionFieldChange(key, 'step1.motorMovement.velocity', val)}
        onStep2Change={(val) => sectionFieldChange(key, 'step2.motorMovement.velocity', val)}
        readOnly={readOnly}
      />
    );
    rampRateFields[key] = (
      <RampRateField
        section={section}
        onChange={(val) => sectionFieldChange(key, 'rampRate', val)}
        readOnly={readOnly}
      />
    );
  });
  return {
    columns: cols.filter((c) => c !== null),
    statusFields,
    cycleFields,
    temperatureFields,
    holdTimeFields,
    motorOffsetFields,
    motorVelocityFields,
    rampRateFields,
  };
};
ProtocolParameterForm.defaultProps = {
  readOnly: false,
  className: undefined,
  defaultModel: undefined,
};
export default ProtocolParameterForm;
