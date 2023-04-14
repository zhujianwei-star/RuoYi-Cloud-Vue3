import { useDict } from '@/utils/dict'
import { parseTime, resetForm, addDateRange, handleTree, selectDictLabel, selectDictLabels } from '@/utils/ruoyi'
import { download } from '@/utils/request'

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    useDict: typeof useDict
    parseTime: typeof parseTime
    resetForm: typeof resetForm
    addDateRange: typeof addDateRange
    handleTree: typeof handleTree
    selectDictLabel: typeof selectDictLabel
    selectDictLabels: typeof selectDictLabels
    download: typeof download
  }
}