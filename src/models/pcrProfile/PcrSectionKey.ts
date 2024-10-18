enum KeyLabels {
  primerMixing = 'primerMixing',
  pcr = 'pcr',
  hotStart = 'hotStart',
  meltCurve = 'meltCurve',
  extraction = 'extraction',
}

type PcrKeySectionType<S1 extends string, S2 extends number> = `${S1}${S2}`;
type PcrSectionKey = PcrKeySectionType<KeyLabels, number> | keyof typeof KeyLabels;

export default PcrSectionKey;
