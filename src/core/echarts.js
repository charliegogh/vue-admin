// 按需导入echarts图表
const echarts = require('echarts/lib/echarts')
// 再引入你需要使用的图表类型，标题，提示信息等
import 'echarts/lib/chart/bar' // 导入柱状图
import 'echarts/lib/chart/line' // 导入折线图
import 'echarts/lib/chart/pie' // 导入饼状图
import 'echarts/lib/chart/map' // 导入饼状图
import 'echarts/lib/chart/scatter'
import 'echarts/lib/chart/effectScatter'
import 'echarts/lib/chart/lines'
import 'echarts/lib/chart/tree'
import 'echarts/lib/chart/parallel'

import 'echarts/lib/component/title'
import 'echarts/lib/component/legend' // 导入
import 'echarts/lib/component/tooltip' // 导入提示
import 'echarts/lib/component/toolbox'
import 'echarts/lib/component/grid'

export default echarts
