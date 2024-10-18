import { injectable } from 'inversify';
import StateUpdateWorker from '../StateUpdateWorker';
import CpanelUpdate from './../../../models/CpanelUpdate';

@injectable()
export default abstract class CpanelUpdateWorker extends StateUpdateWorker<CpanelUpdate> {

}
