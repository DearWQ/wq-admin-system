export function setupMock() {
  const modules = import.meta.glob('./**/*.(js|ts)',{ eager: true })
  Object.keys(modules).forEach((it) => {
    modules[it]
  })
}
