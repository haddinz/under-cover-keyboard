export default interface CameraParameter {
  exposure: number;
  gain: number;
  frameRate: number
  awbGains: AwbGains;
}

interface AwbGains {
  red: number;
  blue: number
}
