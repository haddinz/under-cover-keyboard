import NotifTypeEnum from '../enums/NotifTypeEnum';

interface INotification {
  source?: string,
  subject?: string,
  type?: keyof typeof NotifTypeEnum,
  message?: string,
}

export default INotification;
