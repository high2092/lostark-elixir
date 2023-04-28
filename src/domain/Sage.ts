import { SageTemplate } from '../type/sage';

export class Sage {
  name: string;
  dialogueEnds: { [key: string]: string };
  stack: number;
  advice: IAdviceInstance;

  constructor(template: SageTemplate) {
    this.name = template.name;
    this.dialogueEnds = template.dialogueEnds;
    this.stack = 0;
    this.advice = null;
  }
}
