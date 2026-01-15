# Tool Calling

Tool system inspired by market standards (OpenAI, Ollama, Gemini).

## Defining a Tool

Each tool follows the JSON Schema standard for parameters:

```typescript
import { Tool } from '@actos-voice/react';

const changeColorTool: Tool = {
  name: 'change_color',
  description: 'Changes the application background color. Use when the user asks to change, swap, or alter the color.',
  parameters: {
    type: 'object',
    properties: {
      color: {
        type: 'string',
        description: 'Color name in English or Portuguese',
        enum: ['red', 'blue', 'green', 'yellow', 'purple', 'black', 'white']
      }
    },
    required: ['color']
  },
  execute: async (args) => {
    document.body.style.backgroundColor = args.color as string;
    return { success: true, data: { appliedColor: args.color } };
  }
};
```

## Comparison with Market Standards

### OpenAI Function Calling

```javascript
// OpenAI Format
{
  "type": "function",
  "function": {
    "name": "change_color",
    "description": "...",
    "parameters": { ... }
  }
}

// ActosVoice Format (simplified)
{
  "name": "change_color",
  "description": "...",
  "parameters": { ... },
  "execute": (args) => { ... }  // ← integrated execution
}
```

### Ollama Tools

```javascript
// Ollama Format
{
  "type": "function",
  "function": {
    "name": "change_color",
    "description": "...",
    "parameters": { ... }
  }
}

// Same structure as OpenAI, ActosVoice is compatible
```

### Google Gemini

```javascript
// Gemini Format
{
  "name": "change_color",
  "description": "...",
  "parameters": {
    "type": "OBJECT",
    "properties": { ... }
  }
}

// ActosVoice uses standard JSON Schema (lowercase type: "object")
```

## Parameter Types

### String

```typescript
{
  type: 'string',
  description: 'Parameter description',
  enum: ['option1', 'option2'],  // optional: allowed values
  default: 'option1'             // optional: default value
}
```

### Number

```typescript
{
  type: 'number',
  description: 'Sound volume',
  minimum: 0,
  maximum: 100,
  default: 50
}
```

### Boolean

```typescript
{
  type: 'boolean',
  description: 'Activate dark mode',
  default: false
}
```

### Array

```typescript
{
  type: 'array',
  description: 'Items list',
  items: {
    type: 'string'
  }
}
```

### Object (nested)

```typescript
{
  type: 'object',
  description: 'Settings',
  properties: {
    volume: { type: 'number' },
    muted: { type: 'boolean' }
  }
}
```

## Registering Tools

### Via Provider

```tsx
const tools = [changeColorTool, playSoundTool, showMessageTool];

<ActosVoiceProvider tools={tools}>
  {children}
</ActosVoiceProvider>
```

### Via Hook (dynamic)

```tsx
const { register, unregister } = useTools();

// Register dynamically
useEffect(() => {
  register(myDynamicTool);
  
  return () => unregister(myDynamicTool.name);
}, []);
```

## Running Tools Manually

```tsx
const { execute } = useTools();

// Run tool manually
const result = await execute('change_color', { color: 'blue' });

if (result.success) {
  console.log('Color changed:', result.data);
} else {
  console.error('Error:', result.error);
}
```

## Tool Result

Every tool must return a `ToolResult`:

```typescript
interface ToolResult {
  success: boolean;      // Successful execution?
  data?: unknown;        // Return data (optional)
  error?: string;        // Error message (if success=false)
}
```

### Return Examples

```typescript
// Simple success
return { success: true };

// Success with data
return { 
  success: true, 
  data: { 
    color: 'blue', 
    timestamp: Date.now() 
  } 
};

// Error
return { 
  success: false, 
  error: 'Invalid color' 
};
```

## Built-in Tools

The library includes some ready-to-use tools:

| Tool | Description |
|------|-----------|
| `console_log` | Logs message to the console |
| `alert` | Shows a native alert |
| `navigate` | Navigates to a URL |
| `clipboard_copy` | Copies text to clipboard |

```tsx
import { builtinTools } from '@actos-voice/react';

<ActosVoiceProvider tools={[...builtinTools, ...myTools]}>
```

## Best Practices

### 1. Clear Descriptions

```typescript
// ❌ Bad
description: 'Changes color'

// ✅ Good
description: 'Changes the application background color. Use when the user asks to change, swap, alter, or modify the background color.'
```

### 2. Parameters with Enum when possible

```typescript
// ❌ Bad - LLM might invent values
color: { type: 'string' }

// ✅ Good - controlled values
color: { 
  type: 'string', 
  enum: ['red', 'blue', 'green'] 
}
```

### 3. Error Handling

```typescript
execute: async (args) => {
  try {
    await doSomething(args);
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
```

### 4. Synchronous vs Asynchronous Tools

```typescript
// Synchronous - simple operations
execute: (args) => {
  document.title = args.title;
  return { success: true };
}

// Asynchronous - operations with I/O
execute: async (args) => {
  await fetch('/api/action', { body: JSON.stringify(args) });
  return { success: true };
}
```
