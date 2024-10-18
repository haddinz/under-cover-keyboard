import React from 'react';
import {
  FmlxButton,
  FmlxCheckBox,
  FmlxModal,
  FmlxRadioButton,
  FmlxSwitch,
  FmlxTextBox,
  FmlxTable,
  FmlxTooltip,
} from 'fmlx-common-ui';
import { SizeFmlxUiEnum, TypeFmlxUiEnum, VariantFmlxUiEnum } from '../enums/fmlxUIEnum';

type DefaultSize = 'sm' | 'md' | 'lg' | 'xl' | 'xs';

// BUTTON

type BtnClickArg = { id: any, selected?: boolean };
type Size = 'sm' | 'md' | 'lg' | 'xl' | 'xs';
type BtnType = 'primary' | 'positive' | 'danger' | 'basic';
type BtnVariant = 'contain' | 'outline' | 'plain' | 'action-button';
type WithIcon = 'disable' | 'start' | 'end';
type Placement = 'top' | 'right' | 'left' | 'bottom';
type BtnMode = 'button' | 'switch';

type ButtonProp = {
  id?: any,
  label?: any,
  size?: Size,
  type?: BtnType,
  variant?: BtnVariant,
  withIcon?: WithIcon,
  mode?: BtnMode,
  selected?: boolean,
  disabled?: boolean,
  onlyIcon?: boolean,
  withTooltip?: boolean,
  tooltipDescription?: string,
  tooltipPlacement?: Placement,
  icon?: any,
  onClick?: (e, arg: BtnClickArg) => any,
  fullWidth?: boolean,
};

export const StampedeButton: React.FC<ButtonProp> = function ({
  id,
  label,
  size,
  type,
  variant,
  withIcon,
  mode,
  selected,
  disabled,
  icon,
  onlyIcon,
  withTooltip,
  tooltipDescription,
  tooltipPlacement,
  onClick,
  fullWidth,
}) {
  const handleClick = (e) => {
    if (onClick) {
      onClick(e, { id });
    }
  };

  let sizeArg: FmlxButton.Size;

  switch (size) {
    case SizeFmlxUiEnum.SMALL:
    case SizeFmlxUiEnum.EXTRA_SMALL:
      sizeArg = FmlxButton.Size.SMALL;
      break;
    case SizeFmlxUiEnum.LARGE:
      sizeArg = FmlxButton.Size.LARGE;
      break;
    case SizeFmlxUiEnum.EXTRA_LARGE:
      sizeArg = FmlxButton.Size.EXTRA_LARGE;
      break;
    case SizeFmlxUiEnum.MEDIUM:
    default:
      sizeArg = FmlxButton.Size.MEDIUM;
      break;
  }

  let typeArg: FmlxButton.Type | undefined;

  if (onlyIcon) {
    typeArg = '' as any;
  } else {
    switch (type) {
      case TypeFmlxUiEnum.POSITIVE:
        typeArg = FmlxButton.Type.POSITIVE;
        break;
      case TypeFmlxUiEnum.PRIMARY:
        typeArg = FmlxButton.Type.PRIMARY;
        break;
      case TypeFmlxUiEnum.DANGER:
        typeArg = FmlxButton.Type.DANGER;
        break;
      case TypeFmlxUiEnum.BASIC:
      default:
        typeArg = FmlxButton.Type.BASIC;
        break;
    }
  }

  let variantArg: FmlxButton.Variant | undefined;

  if (onlyIcon) {
    variantArg = '' as any;
  } else {
    switch (variant) {
      case VariantFmlxUiEnum.ACTION_BUTTON:
      case VariantFmlxUiEnum.CONTAIN:
        variantArg = FmlxButton.Variant.CONTAIN;
        break;
      case VariantFmlxUiEnum.OUTLINE:
        variantArg = FmlxButton.Variant.OUTLINE;
        break;
      case VariantFmlxUiEnum.PLAIN:
      default:
        variantArg = FmlxButton.Variant.PLAIN;
    }
  }

  return (
    <FmlxButton
      id={id}
      label={label}
      size={sizeArg}
      type={typeArg}
      variant={variantArg}
      withIcon={withIcon}
      mode={mode}
      selected={selected}
      disabled={disabled}
      icon={icon}
      onlyIcon={onlyIcon}
      withTooltip={withTooltip}
      tooltipDescription={tooltipDescription}
      tooltipPlacement={tooltipPlacement}
      fullWidth={fullWidth}
      onClick={handleClick}
    />
  );
};

StampedeButton.defaultProps = {
  id: 'fmlx-button',
  label: 'Button',
  size: 'md',
  type: 'primary',
  variant: 'contain',
  withIcon: 'disable',
  mode: 'button',
  selected: false,
  disabled: false,
  onlyIcon: false,
  withTooltip: false,
  tooltipPlacement: 'top',
  tooltipDescription: 'Tooltip',
  icon: null,
  onClick: () => {},
  fullWidth: false,
};

// CHECK BOX

type FmlxCheckBoxProps = {
  label?: string,
  hint?: string,
  labelPlacement?: 'left' | 'right' | 'top' | 'bottom',
  checked?: boolean,
  indeterminate?: boolean,
  disabled?: boolean,
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl',
  onChange?: (e: any) => any,
  id?: string,
};

export const StampedeCheckBox: React.FC<FmlxCheckBoxProps> = function FmlxUiCheckBox(props: FmlxCheckBoxProps) {
  let sizeArg: FmlxCheckBox.Size;

  switch (props.size) {
    case SizeFmlxUiEnum.SMALL:
    case SizeFmlxUiEnum.EXTRA_SMALL:
      sizeArg = FmlxCheckBox.Size.SMALL;
      break;
    case SizeFmlxUiEnum.EXTRA_LARGE:
    case SizeFmlxUiEnum.LARGE:
      sizeArg = FmlxCheckBox.Size.LARGE;
      break;
    case SizeFmlxUiEnum.MEDIUM:
    default:
      sizeArg = FmlxCheckBox.Size.MEDIUM;
      break;
  }

  return (
    <FmlxCheckBox
      label={props.label}
      hint={props.hint}
      labelPlacement={props.labelPlacement}
      checked={props.checked}
      indeterminate={props.indeterminate}
      disabled={props.disabled}
      size={sizeArg}
      onChange={props.onChange}
      id={props.id}
    />
  );
};

StampedeCheckBox.defaultProps = {
  label: '',
  hint: '',
  labelPlacement: 'right',
  checked: false,
  indeterminate: false,
  disabled: false,
  size: 'md',
  onChange: () => {},
  id: 'fmlx-checkbox',
};

// MODAL
type ModalBtnProps = {
  show: boolean,
  disabled: boolean,
  label: string,
  type: FmlxButton.Type,
  variant: FmlxButton.Variant,
  onClick: () => any,
}
type FmlxModalProps = {
  open?: boolean,
  onCloseClick?: () => any,
  size?: 'sm' | 'md' | 'lg' | 'xl',
  title?: string,
  children?: any,
  primaryButton?: ModalBtnProps,
  secondaryButton?: ModalBtnProps,
  tertiaryButton?: ModalBtnProps,
  fullScreen?: boolean,
  hideCloseButton?: boolean,
  disableBlur?: boolean,
  customHeader?: any,
  customFooter?: any,
  borderBottomForWizard?: boolean,
  inlineMessage?: any,
  id?: string,
};

export const StampedeModal: React.FC<FmlxModalProps> = function FmlxUiModal(props: FmlxModalProps) {
  let sizeArg: FmlxModal.Size;

  switch (props.size) {
    case SizeFmlxUiEnum.SMALL:
      sizeArg = FmlxModal.Size.SMALL;
      break;
    case SizeFmlxUiEnum.LARGE:
      sizeArg = FmlxModal.Size.LARGE;
      break;
    case SizeFmlxUiEnum.EXTRA_LARGE:
      sizeArg = FmlxModal.Size.EXTRA_LARGE;
      break;
    case SizeFmlxUiEnum.MEDIUM:
    default:
      sizeArg = FmlxModal.Size.MEDIUM;
      break;
  }

  return (
    <FmlxModal
      open={props.open}
      onCloseClick={props.onCloseClick}
      size={sizeArg}
      title={props.title}
      primaryButton={props.primaryButton}
      secondaryButton={props.secondaryButton}
      tertiaryButton={props.tertiaryButton}
      fullScreen={props.fullScreen}
      hideCloseButton={props.hideCloseButton}
      disableBlur={props.disableBlur}
      customHeader={props.customHeader}
      customFooter={props.customFooter}
      borderBottomForWizard={props.borderBottomForWizard}
      inlineMessage={props.inlineMessage}
      id={props.id}
    >
      {props.children}
    </FmlxModal>
  );
};

StampedeModal.defaultProps = {
  open: false,
  onCloseClick: () => { },
  size: SizeFmlxUiEnum.MEDIUM,
  title: '',
  children: '',
  primaryButton: {
    show: false,
    disabled: false,
    label: 'OK',
    type: FmlxButton.Type.PRIMARY,
    variant: FmlxButton.Variant.CONTAIN,
    onClick: () => {},
  },
  secondaryButton: {
    show: false,
    disabled: false,
    label: 'Cancel',
    type: FmlxButton.Type.BASIC,
    variant: FmlxButton.Variant.OUTLINE,
    onClick: () => {},
  },
  tertiaryButton: {
    show: false,
    disabled: false,
    label: 'Retry',
    type: FmlxButton.Type.BASIC,
    variant: FmlxButton.Variant.PLAIN,
    onClick: () => {},
  },
  fullScreen: false,
  hideCloseButton: false,
  disableBlur: false,
  customHeader: null,
  customFooter: null,
  borderBottomForWizard: false,
  inlineMessage: {},
  id: 'fmlx-modal',
};

// RADIO BUTTONS

type FmlxRadioButtonItem = { content: any, disabled: boolean, icon?: any, hint: string, type: FmlxRadioButton.HintType };

type FmlxRadioButtonProps = {
  selectedIndex?: number,
  size?: 'sm' | 'md' | 'lg' | 'xl',
  items?: FmlxRadioButtonItem[],
  alignment?: 'left' | 'center' | 'right',
  direction?: 'row' | 'column',
  labelPlacement?: 'start' | 'end' | 'top' | 'bottom',
  fullWidth?: boolean,
  disabled?: boolean,
  onChange?: (arg: { index: number | string }) => any,
  id?: string,
};

export const StampedeRadioButton: React.FC<FmlxRadioButtonProps> = function FmlxUiRadioButton(props: FmlxRadioButtonProps) {
  return (
    <FmlxRadioButton
      selectedIndex={props.selectedIndex}
      size={props.size}
      items={props.items}
      alignment={props.alignment}
      direction={props.direction}
      labelPlacement={props.labelPlacement}
      fullWidth={props.fullWidth}
      disabled={props.disabled}
      onChange={props.onChange}
      id={props.id}
    />
  );
};

StampedeRadioButton.defaultProps = {
  selectedIndex: undefined,
  size: SizeFmlxUiEnum.MEDIUM,
  items: [
    {
      content: '',
      hint: '',
      type: FmlxRadioButton.HintType.INFORMATION,
      disabled: false,
    },
  ],
  alignment: 'left',
  direction: 'column',
  labelPlacement: 'end',
  fullWidth: false,
  disabled: false,
  onChange: () => {},
  id: 'fmlx-radio-button',
};

// SWITCH

type FmlxSwitchType = {
  size?: 'xs' | 'sm' | 'md' | 'lg',
  withIcon?: boolean,
  checked?: boolean,
  disabled?: boolean,
  onChange?: (val: boolean) => any,
  id?: string,
};

export const StampedeSwitch: React.FC<FmlxSwitchType> = function FmlxUiswitch(props: FmlxSwitchType) {
  return (
    <FmlxSwitch
      id={props.id}
      size={props.size}
      withIcon={props.withIcon}
      checked={props.checked}
      disabled={props.disabled}
      onChange={props.onChange}
    />
  );
};

StampedeSwitch.defaultProps = {
  size: SizeFmlxUiEnum.MEDIUM,
  withIcon: false,
  checked: false,
  disabled: false,
  onChange: () => {},
  id: 'fmlx-switch',
};

// TEXTBOX

type FmlxTextBoxProps = {
  placeholder?: string;
  value?: string | number;
  inlineText?: string;
  size?: DefaultSize;
  mode?: 'text' | 'number' | 'email' | 'textarea' | 'password';
  variant?: 'standard' | 'outline';
  decoration?: 'none' | 'icon' | 'counter' | 'unit',
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  icon?: any;
  minLength?: number;
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
  precision?: number;
  autoValue?: boolean;
  autoComplete?: boolean;
  autoFocus?: boolean;
  showCounter?: boolean;
  step?: number;
  unit?: string;
  rows?: number;
  id?: string;
  onClick?: () => any;
  onChange?: (arg: { value: any, minValue: number, maxValue: number }) => any;
  onBlur?: (arg: { value: any, minValue: number, maxValue: number }) => any;
  onEnterKeyPressed?: (arg: { value: any, minValue: number, maxValue: number }) => any;
};

export const StampedeTextBox: React.FC<FmlxTextBoxProps> = function FmlxUiTextBox({
  mode,
  placeholder,
  unit,
  value,
  size,
  variant,
  decoration,
  rows,
  minLength,
  maxLength,
  minValue,
  maxValue,
  precision,
  disabled,
  required,
  error,
  autoValue,
  autoComplete,
  autoFocus,
  icon,
  onClick,
  onChange,
  onBlur,
  onEnterKeyPressed,
  inlineText,
  showCounter,
  step,
  id,
}) {
  let sizeArg: FmlxTextBox.Size;
  switch (size) {
    case SizeFmlxUiEnum.SMALL:
    case SizeFmlxUiEnum.EXTRA_SMALL:
      sizeArg = FmlxTextBox.Size.SMALL;
      break;
    case SizeFmlxUiEnum.LARGE:
      sizeArg = FmlxTextBox.Size.LARGE;
      break;
    case SizeFmlxUiEnum.EXTRA_LARGE:
      sizeArg = FmlxTextBox.Size.EXTRA_LARGE;
      break;
    case SizeFmlxUiEnum.MEDIUM:
    default:
      sizeArg = FmlxTextBox.Size.MEDIUM;
      break;
  }

  const handleEvent = (arg) => ({
    value: arg.value,
    minValue: arg.minLength,
    maxValue: arg.maxLength,
  });

  return (
    <FmlxTextBox
      // label={label}
      mode={mode}
      placeholder={placeholder}
      unit={unit}
      value={value}
      size={sizeArg}
      variant={variant}
      decoration={decoration}
      rows={rows}
      minLength={minLength}
      maxLength={maxLength}
      minValue={minValue}
      maxValue={maxValue}
      precision={precision}
      disabled={disabled}
      required={required}
      error={error}
      autoValue={autoValue}
      autoComplete={autoComplete}
      autoFocus={autoFocus}
      icon={icon}
      onClick={onClick}
      onChange={!onChange ? undefined : (arg0) => onChange(handleEvent(arg0))}
      onBlur={!onBlur ? undefined : (arg1) => onBlur(handleEvent(arg1))}
      onEnterKeyPressed={!onEnterKeyPressed ? undefined : (arg2) => onEnterKeyPressed(handleEvent(arg2))}
      inlineText={inlineText}
      showCounter={showCounter}
      step={step}
      id={id}
    />
  );
};

StampedeTextBox.defaultProps = {
  mode: 'text',
  placeholder: '',
  value: '',
  unit: 'mm',
  size: 'md',
  variant: 'outline',
  decoration: 'none',
  rows: 3,
  minLength: 0,
  maxLength: 9999,
  minValue: -9999,
  maxValue: 9999,
  precision: 3,
  icon: null,
  disabled: false,
  required: false,
  error: false,
  autoValue: false,
  autoComplete: false,
  autoFocus: false,
  onClick: () => {},
  onChange: () => {},
  onBlur: () => {},
  onEnterKeyPressed: () => {},
  inlineText: '',
  showCounter: false,
  step: 1,
  id: 'fmlx-textbox',
};

type TableType = 'basic' | 'multiselect' | 'collapsible';
type func = () => any;
type TableColumn = {
  Header: string,
  accessor: string,
  filterDefinition: {
    type: FmlxTable.FilterType,
    options?: string,
    datepickerVariant?: 'date' | 'time' | 'dateTime';
    minDate?: string;
    maxDate?: string;
    component?: React.ReactNode;
  },
  editable: boolean,
  disableSort: boolean,
  hideSort: boolean,
  hideFilter: boolean,
  headerStyle: any,
  Cell?: ({ value, row }) => any
};

type StampedeTableType = {
  type?: TableType,
  data?: any[],
  itemsTotal?: number,
  columns?: TableColumn[],
  hiddenColumns?: any[],
  hiddenRowIndexes?: any[],
  getSelectedRow?: ((selectedItems: any[], selectedRowIds: string[]) => void),
  getSortValue?: ((sort: { type: string, column: string }) => void),
  showPagination?: boolean,
  pageSizes?: any[],
  showFilter?: boolean,
  getFilterMap?: func,
  placeholder?: any,
  isLoading?: boolean,
  onInlineEditingChange?: func,
  enableDragSelection?: boolean,
  toolbarAction?: func,
  activateSingleSelect?: boolean,
  onRowDoubleClick?: func,
  onDropdownPaginationChange?: (size: number) => any,
  mappedData?: any[],
  allowSelectedRow?: boolean,
  pageIndex?: number,
  fetchData?: ((arg: { pageSize: number, pageIndex: number }) => any),
  showToolbar?: boolean,
  selectedRowIds?: any[],
  id?: string,
  onRowClick?: func,
};

export const StampedeTable: React.FC<StampedeTableType> = function ({
  type,
  data,
  columns,
  itemsTotal,
  hiddenColumns,
  hiddenRowIndexes,
  getSelectedRow,
  getSortValue,
  showPagination,
  pageSizes,
  showFilter,
  getFilterMap,
  placeholder,
  isLoading,
  onInlineEditingChange,
  enableDragSelection,
  activateSingleSelect,
  onRowDoubleClick,
  onDropdownPaginationChange,
  toolbarAction,
  mappedData,
  allowSelectedRow,
  fetchData,
  pageIndex,
  showToolbar,
  selectedRowIds,
  id,
  onRowClick,
}) {
  return (
    <FmlxTable
      type={type}
      data={data}
      columns={columns}
      itemsTotal={itemsTotal}
      hiddenColumns={hiddenColumns}
      hiddenRowIndexes={hiddenRowIndexes}
      getSelectedRow={getSelectedRow}
      getSortValue={getSortValue}
      showPagination={showPagination}
      pageSizes={pageSizes}
      showFilter={showFilter}
      getFilterMap={getFilterMap}
      placeholder={placeholder}
      isLoading={isLoading}
      onInlineEditingChange={onInlineEditingChange}
      enableDragSelection={enableDragSelection}
      activateSingleSelect={activateSingleSelect}
      onRowDoubleClick={onRowDoubleClick}
      onDropdownPaginationChange={onDropdownPaginationChange}
      toolbarAction={toolbarAction}
      mappedData={mappedData}
      allowSelectedRow={allowSelectedRow}
      fetchData={fetchData}
      pageIndex={pageIndex}
      showToolbar={showToolbar}
      selectedRowIds={selectedRowIds}
      id={id}
      onRowClick={onRowClick}
    />
  );
};

StampedeTable.defaultProps = {
  type: TypeFmlxUiEnum.BASIC,
  data: [],
  itemsTotal: 0,
  columns: [],
  hiddenColumns: [],
  hiddenRowIndexes: [],
  getSelectedRow: () => {},
  getSortValue: () => {},
  showPagination: false,
  pageSizes: [],
  showFilter: false,
  getFilterMap: () => {},
  placeholder: 'No Data',
  isLoading: false,
  onInlineEditingChange: () => {},
  enableDragSelection: false,
  toolbarAction: () => {},
  activateSingleSelect: true,
  onRowDoubleClick: undefined,
  onDropdownPaginationChange: () => {},
  mappedData: undefined,
  allowSelectedRow: true,
  pageIndex: 0,
  fetchData: undefined,
  showToolbar: true,
  selectedRowIds: [],
  id: 'fmlx-table',
  onRowClick: () => {},
};

type ComboBoxVariant = 'combobox' | 'searchField' | 'advancedSearchField';
type StampedeComboBoxType = {
  variant?: ComboBoxVariant,
  items?: { id: number, text: string, type?: 'separator', group?: string }[],
  selectedItem?: any,
  selectedMultipleItem?: any[],
  size?: 'sm' | 'md' | 'lg' | 'xl',
  separator?: boolean,
  placeholder?: string,
  multiple?: boolean,
  loading?: boolean,
  error?: boolean,
  disabled?: boolean,
  renderValue?: ((item: any) => any) | null,
  onChange?: (item: any) => any,
  onSearchClick?: (item: any) => any,
  inlineText?: string,
  advancedSettingContent?: any,
  icon?: boolean,
  id?: string,
};

export const StampedeTooltip: React.FC<{
  id?: string,
  title: string,
  placement?: 'bottom-end' | 'bottom-start' | 'bottom' | 'left-end' | 'left-start' | 'left' | 'right-end' | 'right-start' | 'right'
  | 'top-end' | 'top-start' | 'top',
  children?: any,
}> = function ({ id, title, placement, children }) {
  return <FmlxTooltip id={id} title={title} placement={placement}>{children}</FmlxTooltip>;
};

StampedeTooltip.defaultProps = {
  id: 'fmlx-tooltip',
  placement: 'bottom',
  children: null,
};
