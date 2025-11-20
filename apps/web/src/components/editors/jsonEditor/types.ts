/**
 * Type definitions for the JSON Editor component
 */

export type JsonValue = string | number | boolean | JsonObject | JsonArray | null;

export interface JsonObject {
  [key: string]: JsonValue;
}

export interface JsonArray extends Array<JsonValue> {}

export type DataType = "string" | "number" | "boolean" | "object" | "array" | "null";

export interface JsonEditorProps {
  /** Root value type: "object" or "array" */
  rootValueType: "object" | "array";
  /** Default JSON value */
  defaultValue?: JsonValue;
  /** Callback when user saves */
  onSave: (value: JsonValue) => void;
  /** Read-only mode */
  readonly?: boolean;
}

export interface ObjectEditorProps {
  value: JsonObject;
  onChange: (value: JsonObject) => void;
  readonly?: boolean;
  depth?: number;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  label?: string;
}

export interface ArrayEditorProps {
  value: JsonArray;
  onChange: (value: JsonArray) => void;
  readonly?: boolean;
  depth?: number;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  label?: string;
}

export interface KeyValueRowProps {
  keyName: string;
  value: JsonValue;
  onKeyChange: (newKey: string) => void;
  onValueChange: (newValue: JsonValue) => void;
  onDelete: () => void;
  readonly?: boolean;
}

export interface ValueRendererProps {
  value: JsonValue;
  onChange: (newValue: JsonValue) => void;
  readonly?: boolean;
  depth?: number;
}

export interface TypeSelectorProps {
  currentType: DataType;
  onTypeChange: (type: DataType) => void;
  readonly?: boolean;
}

export interface ArrayItemProps {
  value: JsonValue;
  index: number;
  onValueChange: (newValue: JsonValue) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  readonly?: boolean;
  depth?: number;
}
