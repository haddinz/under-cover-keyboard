import { resolve } from 'inversify-react';
import React, { Component } from 'react';
import config from '../../../config';
import { invokeLater } from '../../../helper/EventHelper';
import UrlHelper from '../../../helper/UrlHelper';
import CPanelService from '../../../services/CPanelService';
import DialogService from '../../../services/DialogService';
import { StampedeButton } from '../../FmlxUi';
import LoadingScreen from '../../loading/LoadingScreen';
import './CameraView.scss';

const newStreamVersion = () => new Date().getTime();

type State = {
  loaded: boolean;
  error: boolean;
  isProcessing: boolean;
};

class CameraView extends Component<any, State> {
  private readonly imageRef = React.createRef<HTMLImageElement>();
  private readonly canvasRef = React.createRef<HTMLCanvasElement>();
  private _isMounted = false;
  @resolve(CPanelService)
  private service: CPanelService;
  @resolve(DialogService)
  private dialog: DialogService;
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      error: false,
      isProcessing: false,
    };
  }
  componentDidMount() {
    this._isMounted = true;
    this.initializeAsync();
  }
  componentWillUnmount() {
    this._isMounted = false;
    if (this.img) {
      this.img.src = '';
    }
  }

  private get canvas() { return this.canvasRef.current; }
  private get img() { return this.imageRef.current; }

  private initializeAsync = () => {
    invokeLater(() => {
      if (!this._isMounted) {
        return;
      }
      if (this.img) {
        this.initialize();
      } else {
        console.warn('image ref [NOT FOUND]');
      }
    }, 300);
  }

  initialize = () => {
    if (!this.img) {
      return;
    }
    this.img.src = '';
    this.img.crossOrigin = 'Anonymous';
    this.img.onload = () => {
      if (this._isMounted) {
        this.setState({ loaded: true, error: false });
      }
    };
    this.img.onerror = (e) => {
      console.error('Camera on error', e);
      if (this._isMounted) {
        this.setState({ loaded: false, error: true });
      }
    };
    (window as any).imgMjpeg = this.img;
    this.img.src = `${config.CAMERA_STREAM_URL}?v=${newStreamVersion()}`;

    this.setState({ error: false });
  };

  captureSnapshot = () => {
    if (!this.img || !this.canvas) {
      return;
    }
    fillCanvas(this.img, this.canvas);
    UrlHelper.openImage(this.canvas.toDataURL(), this.img.width, this.img.height);
  }
  restartMjpeg = () => {
    this.setState({ isProcessing: true }, () => {
      this.service.RestartCameraMjpeg()
        .then(this.initializeAsync)
        .catch(this.dialog.alertError)
        // force delay 500ms after request has finished to prevent multiple request within short interval of time
        .finally(() => invokeLater(this.stopProcessing, 500));
    });
  }
  stopProcessing = () => this.setState({ isProcessing: false });

  render() {
    const {
      loaded,
      error,
      isProcessing,
    } = this.state;
    return (
      <div className="bg-light">
        {
          loaded &&
          (
            <ControlButton
              disabled={isProcessing}
              captureSnapshot={this.captureSnapshot}
              restartMjpeg={this.restartMjpeg}
            />
          )
        }
        {!loaded && <RestartButton disabled={isProcessing} onClick={this.restartMjpeg} />}
        <div className="camera-view-container pos-relative">
          <img
            key="camera-stream"
            id="camera-stream-img"
            ref={this.imageRef}
            alt="Camera Stream"
            className="img-fluid border border-dark camera-view-image"
          />
          <canvas id="canvas" ref={this.canvasRef} className="d-none" />
          {!loaded && !error &&
            (
              <div className="pos-absolute w-100">
                <LoadingCamera />
              </div>
            )}
          {
            !loaded && error &&
            (
              <div className="pos-absolute w-100">
                <div>
                  <LoadingCameraError />
                  <StampedeButton label="Reload" size="sm" onClick={this.initializeAsync} />
                </div>
              </div>
            )
          }
        </div>
      </div>
    );
  }
}
type ControlButtonProps = {
  captureSnapshot(): any,
  restartMjpeg(): any,
  disabled: boolean
}
const ControlButton: React.FC<ControlButtonProps> = function ControlButton({
  captureSnapshot,
  restartMjpeg,
  disabled,
}) {
  return (
    <div className="camera-control">
      <div className="btn-group">
        {/* <button type="button" className="btn btn-sm btn-info" onClick={startRecording}>&#x1F3A6; Record</button> */}
        <button disabled={disabled} type="button" className="btn btn-sm btn-dark" onClick={captureSnapshot}>&#128247; Snapshot</button>
        <RestartButton disabled={disabled} onClick={restartMjpeg} />
      </div>
    </div>
  );
};

const RestartButton: React.FC<{ onClick(): any, disabled: boolean }> = function RestartButton({ onClick, disabled }) {
  return (
    <button
      disabled={disabled}
      type="button"
      className="btn btn-sm btn-success ms-2"
      onClick={onClick}
      style={{ fontFamily: 'Roboto' }}
    >
      &#128257; Restart Connection
    </button>
  );
};

const fillCanvas = (image: HTMLImageElement, cvs: HTMLCanvasElement) => {
  cvs.width = image.width;
  cvs.height = image.height;
  cvs.getContext('2d')?.drawImage(image, 0, 0);
  return cvs;
};

const LoadingCameraError: React.FC = function LoadingCameraError() {
  return (
    <h5 className="text-danger text-wrap">
      Failed to load image: {config.CAMERA_STREAM_URL}
    </h5>
  );
};

const LoadingCamera: React.FC = function LoadingCamera() {
  return (
    <div>
      <div className="d-flex">
        <LoadingScreen show showIconOnly />
      </div>
      <h6>Loading camera image</h6>
    </div>
  );
};

export default CameraView;
