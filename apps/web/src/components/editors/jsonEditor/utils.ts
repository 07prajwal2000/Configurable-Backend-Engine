/**
 * Utility functions for JSON Editor
 */

import { DataType, JsonValue } from "./types";

/**
 * Determine the data type of a JSON value
 */
export function getDataType(value: JsonValue): DataType {
  if (value === null) return "null";
  if (typeof value === "string") return "string";
  if (typeof value === "number") return "number";
  if (typeof value === "boolean") return "boolean";
  if (Array.isArray(value)) return "array";
  if (typeof value === "object") return "object";
  return "string";
}

/**
 * Create a default value for a given data type
 */
export function createDefaultValue(type: DataType): JsonValue {
  switch (type) {
    case "string":
      return "";
    case "number":
      return 0;
    case "boolean":
      return false;
    case "object":
      return {};
    case "array":
      return [];
    case "null":
      return null;
    default:
      return "";
  }
}

/**
 * Parse a string value based on the target type
 */
export function parseValue(value: string, type: DataType): JsonValue {
  switch (type) {
    case "string":
      return value;
    case "number":
      const num = parseFloat(value);
      return isNaN(num) ? 0 : num;
    case "boolean":
      return value.toLowerCase() === "true" || value === "1";
    case "null":
      return null;
    default:
      return value;
  }
}

/**
 * Convert a value to a string representation
 */
export function valueToString(value: JsonValue): string {
  if (value === null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number") return value.toString();
  if (typeof value === "boolean") return value ? "true" : "false";
  return "";
}

/**
 * Format JSON with proper indentation
 */
export function formatJson(value: JsonValue, indent: number = 2): string {
  return JSON.stringify(value, null, indent);
}

/**
 * Validate if a string is valid JSON
 */
export function isValidJson(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}
