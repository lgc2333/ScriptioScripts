declare namespace scriptio {
  interface ListenOptions {
    immediate?: boolean
    scriptPath?: string
  }
  const scriptPath: string
  function listen(
    toggleFunc: (enable: boolean) => void,
    optionsOrImmediate: ListenOptions | boolean,
  ): void
}
