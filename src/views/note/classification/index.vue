<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--分类数据-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
            <el-input
              v-model="treeClassificationName"
              placeholder="请输入分类名称"
              clearable
              prefix-icon="Search"
              style="margin-bottom: 20px"
            />
        </div>
        <div class="head-container">
            <el-tree
              :data="classificationOptions"
              :props="{ label: 'classificationName', children: 'children' }"
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              ref="classificationTreeRef"
              node-key="id"
              highlight-current
              default-expand-all
              @node-click="handleNodeClick"
            />
        </div>
      </el-col>

      <!--用户数据-->
      <el-col :span="20" :xs="24">
        <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item label="分类名称" prop="classificationName">
            <el-input
                v-model="queryParams.classificationName"
                placeholder="请输入分类名称"
                clearable
                style="width: 240px"
                @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="创建时间" style="width: 430px;">
            <el-date-picker
                v-model="dateRange"
                value-format="YYYY-MM-DD HH:mm:ss"
                type="datetimerange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
                type="primary"
                plain
                icon="Plus"
                @click="handleAdd"
                v-hasPermi="['note:classification:add']"
            >新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
                type="success"
                plain
                icon="Edit"
                :disabled="single"
                @click="handleUpdate"
                v-hasPermi="['note:classification:edit']"
            >修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
                type="danger"
                plain
                icon="Delete"
                :disabled="multiple"
                @click="handleDelete"
                v-hasPermi="['note:classification:remove']"
            >删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
                type="warning"
                plain
                icon="Download"
                @click="handleExport"
                v-hasPermi="['note:classification:export']"
            >导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="classificationList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="分类主键" align="center" prop="classificationId" />
          <el-table-column label="分类名称" align="center" prop="classificationName" :show-overflow-tooltip="true" />
          <el-table-column label="父类名称" align="center" prop="pName" :show-overflow-tooltip="true" />
          <el-table-column label="创建时间" align="center" prop="createTime" width="180">
            <template #default="scope">
              <span>{{ parseTime(scope.row.createAt) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="备注" align="center" prop="combineCreateBy" :show-overflow-tooltip="true" />
          <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
            <template #default="scope">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:config:edit']" >修改</el-button>
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['system:config:remove']">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
            v-show="total > 0"
            :total="total"
            v-model:page="queryParams.pageNum"
            v-model:limit="queryParams.pageSize"
            @pagination="getList"
        />


      </el-col>
    </el-row>
    
    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body ref="dialogRef">
      <el-form ref="classificationRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="分类名称" prop="classificationName">
          <el-input v-model="form.classificationName" placeholder="分类名称" />
        </el-form-item>
        <el-form-item label="父类信息" prop="pid">
          <el-tree-select
            v-model="form.pid"
            :data="classificationOptions"
            :props="{ value: 'classificationId', label: 'classificationName', children: 'children', level: 'level' }"
            value-key="classificationId"
            placeholder="请选择父类信息"
            class="formSelected"
            check-strictly
            @current-change="changeFormLevel"
          />
        </el-form-item>
        <el-form-item label="描述" prop="remark">
          <el-input v-model="form.description" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="等级" prop="level" v-show="false">
          <el-input v-model="form.level" type="hidden" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm()">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
  <!-- <HelloWorld msg="Hello Vue 3 + Vite" /> -->
</template>

<script setup name="NoteClassification" lang="ts">
import { noteClassificationTreeSelect, listClassification, addClassification, getClassification, delClassification, updateClassification } from "@/api/note/classification";
import { reactive, ref, toRefs, inject } from "vue";
import { ElForm } from "element-plus";
const addDateRange : any = inject('addDateRange')
const modal : any = inject('$modal')
const download : any = inject('download')
const resetFormRef : any = inject('resetFormRef')
const parseTime : any = inject('parseTime')


const classificationList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const dateRange = ref([]);
const classificationRef = ref();
const dialogRef = ref();
const queryRef = ref();

const data = reactive({
  form: {
    classificationId: undefined,
    classificationName: undefined,
    pid: 0,
    level: 0,
    description: undefined
  },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    classificationName: undefined,
    pid: undefined
  },
  rules: {
    classificationName: [{ required: true, message: "参数名称不能为空", trigger: "blur" }]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询参数列表 */
function getList() {
  loading.value = true;
  listClassification(addDateRange(queryParams.value, dateRange.value)).then(response => {
    classificationList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}
/** 取消按钮 */
function cancel() {
  open.value = false;
  reset();
}
/** 表单重置 */
function reset() {
  form.value = {
    classificationId: undefined,
    classificationName: undefined,
    pid: 0,
    level: 0,
    description: undefined
  };
  if (open.value) {
    resetFormRef(classificationRef);
  }
}
/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}
/** 重置按钮操作 */
function resetQuery() {
  dateRange.value = [];
  resetFormRef(queryRef);
  handleQuery();
}
/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.configId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}
/** 新增按钮操作 */
function handleAdd() {
  reset();
  if (queryParams.value.pid) {
    form.value.pid = queryParams.value.pid
  }
  open.value = true;
  title.value = "添加参数";
}
/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const classificationId = row.classificationId || ids.value;
  getClassification(classificationId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改参数";
  });
}
/** 提交按钮 */
function submitForm() {
  console.log('测试提交哦i啊', classificationRef.value, form.value);
  (classificationRef.value).validate(valid => {
    if (valid) {
      if (form.value.classificationId != undefined) {
        updateClassification(form.value).then(() => {
          modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addClassification(form.value).then(() => {
          modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}
/** 删除按钮操作 */
function handleDelete(row) {
  const classificationIds = row.classificationId || ids.value;
  modal.confirm('是否确认删除参数编号为"' + classificationIds + '"的数据项？').then(function () {
    return delClassification(classificationIds);
  }).then(() => {
    getList();
    modal.msgSuccess("删除成功");
  }).catch(() => {});
}
/** 导出按钮操作 */
function handleExport() {
  download("note/classification/export", {
    ...queryParams.value
  }, `noteClassification_${new Date().getTime()}.xlsx`);
}

/* 表单中选择了父类，更改form表单的等级 */
function changeFormLevel(checkedNode) {
  form.value.level = checkedNode.level + 1
}

getList();

/**
 * 树
 */ 
let treeClassificationName = ref("")
let classificationTreeRef = ref()
let classificationOptions = ref(undefined)

// 获取树的数据
/** 查询分类下拉树结构 */
function getNoteClassificationTree() {
  noteClassificationTreeSelect().then(response => {
    classificationOptions.value = response.data
  });
};
// 树的搜索
function filterNode() {}

// 树节点的点击
function handleNodeClick(checkedNode) {
  queryParams.value.pid = checkedNode.classificationId
  getList();
}
getNoteClassificationTree();
</script>

<style scoped lang="scss">
  .formSelected{
    width: 100%;
  }
</style>