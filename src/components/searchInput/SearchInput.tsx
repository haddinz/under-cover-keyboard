import React, { ChangeEvent, Component } from 'react';
import FmlxIcon from '../icon/FmlxIcon';
import './SearchInput.scss';

type Props = {
  placeHolder: string;
  searchOnEnter?: boolean;
  changeDelay?: number | undefined;
  onSearch(value: string): any;
}
type State = {
  searchValue: string;
}

export default class SearchInput extends Component<Props, State> {
  public static defaultProps = { changeDelay: undefined, searchOnEnter: false };
  private onChangeTimeout: NodeJS.Timeout | null = null;
  private readonly changeDelay: number | undefined;
  constructor(props: Props) {
    super(props);
    this.state = {
      searchValue: '',
    };
    this.changeDelay = props.changeDelay;
  }
  shouldComponentUpdate(nextProps: Readonly<Props>, nextState: Readonly<State>, nextContext: any): boolean {
    return nextState.searchValue !== this.state.searchValue;
  }
  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
    const { searchValue } = this.state;
    if (this.props.searchOnEnter === true) {
      return;
    }
    if (this.changeDelay === undefined) {
      this.props.onSearch(searchValue);
      return;
    }
    if (this.onChangeTimeout) {
      clearTimeout(this.onChangeTimeout);
    }
    const onChangeTimeout = setTimeout(() => {
      clearTimeout(onChangeTimeout);
      this.props.onSearch(searchValue);
      this.onChangeTimeout = null;
    }, this.changeDelay);

    this.onChangeTimeout = onChangeTimeout;
  }
  handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchValue: e.target.value });
  }
  reset = () => {
    this.setState({ searchValue: '' }, () => this.props.onSearch(''));
  }
  onKeyUp = (e: React.KeyboardEvent) => {
    if (this.props.searchOnEnter === true && e.code === 'Enter') {
      this.props.onSearch(this.state.searchValue);
      // return;
    }
  }
  render() {
    const { searchValue } = this.state;
    const { placeHolder } = this.props;
    const resetEnabled = searchValue.trim() !== '';
    return (
      <div className="me-3 pos-relative b-dark">
        <input
          autoComplete="off"
          className="search-input"
          onChange={this.handleInputChange}
          onKeyUp={this.onKeyUp}
          value={searchValue}
          placeholder={placeHolder}
        />
        <button type="submit" onClick={resetEnabled ? this.reset : undefined} className="search-submit">
          <FmlxIcon name={resetEnabled ? 'CancelOutline' : 'Search'} fontSize="xs" customColor="#414141" />
        </button>
      </div>
    );
  }
}
