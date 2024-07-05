import { TinyEmitter } from 'tiny-emitter'
import { emitKey } from '@/layouts'
import { inject } from 'vue'
export default function useEmit() {
  return inject<TinyEmitter>(emitKey)
}