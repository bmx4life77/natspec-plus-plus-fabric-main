export interface TagDefinition {
  type: "boolean" | "number" | "string";
  description: string;
  required?: boolean;
  validate?: (value: any) => boolean;
}



export const __forceModule = true;