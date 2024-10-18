import MotorMovement from './MotorMovement';

export default interface PcrStep {
  temp: number;
  holdTime: number;
  motorMovement: MotorMovement;
}
