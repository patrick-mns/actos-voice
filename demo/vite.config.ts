import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@actos-voice/core': path.resolve(__dirname, '../packages/core/src'),
      '@actos-voice/asr-webspeech': path.resolve(__dirname, '../packages/asr-webspeech/src'),
      '@actos-voice/llm-webllm': path.resolve(__dirname, '../packages/llm-webllm/src'),
      '@actos-voice/react': path.resolve(__dirname, '../packages/react/src'),
    }
  }
})
