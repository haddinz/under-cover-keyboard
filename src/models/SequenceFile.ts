export default class SequenceFile {
  id?: number;
  name: string;
  created: string;

  constructor(name?: string) {
    if (name) {
      this.name = name;
    }
  }
}
