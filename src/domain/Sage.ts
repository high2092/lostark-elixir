import { SageTemplate, SageTypesType } from '../type/sage';
import { AdviceInstance } from './AdviceInstance';

export class Sage {
  name: string;
  type: SageTypesType;
  dialogueEnds: { [key: string]: string };
  stack: number;
  advice: AdviceInstance;
  meditation: boolean;

  constructor(template: SageTemplate) {
    this.name = template.name;
    this.dialogueEnds = template.dialogueEnds;
    this.stack = 0;
    this.advice = null;
    this.meditation = false;
  }
}
