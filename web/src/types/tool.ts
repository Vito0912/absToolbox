export interface ToolField {
  name: string;
  type: 'string' | 'boolean' | 'stringArray' | 'select';
  label: string;
  description?: string;
  required?: boolean;
  options?: string[];
  placeholder?: string;
  default?: string | boolean | string[];
}

export interface ToolResult {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
  timestamp: string;
}

export interface ToolDefinition {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  fields: ToolField[];
  execute: (formData: Record<string, any>) => Promise<ToolResult>;
}

export interface Settings {
  serverUrl: string;
  authMethod: 'token' | 'credentials';
  apiToken: string;
  username: string;
  password: string;
}