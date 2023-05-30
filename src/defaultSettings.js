import { Local } from '_utils/storage'
export default {
  title: 'xxx管理系统',
  uploadAction: 'http://47.93.4.29:88/upload/',
  filePrefix: 'http://47.93.4.29:82/files/',
  primaryColor: Local.readData('DEFAULT_COLOR') || '#1890FF',
  layoutMode: Local.readData('DEFAULT_LAYOUT_MODE') || 'sidemenu',
  navTheme: Local.readData('DEFAULT_THEME') || 'light'
}
