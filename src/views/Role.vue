<template>
  <div class="dashboard">
    <el-card>
      <div class="box-search">
        <el-input
          class="search-input"
          placeholder="Nhập vào tên vai trò"
          v-model="search"
          prefix-icon="el-icon-search"
          clearable
          @clear="handleSearch"
          @keydown.enter.native="handleSearch"
        >
        </el-input>
        <el-button class="search-btn" @click="handleSearch">Tìm kiếm</el-button>
        <el-button
          class="show-card"
          type="primary"
          @click="dialogAddRole = true"
          ><i class="fa fa-plus"></i> Thêm mới</el-button
        >
      </div>
    </el-card>
    <el-card class="table-roles">
      <div></div>
      <div class="box-tabel">
        <el-table
          :data="roles"
          height="calc(100vh - 300px)"
          style="width: 100%"
          v-loading="loading"
        >
          <el-table-column prop="name" label="Tên vai trò"> </el-table-column>
          <el-table-column prop="description" label="Mô tả"> </el-table-column>
          <el-table-column prop="created_at" label="Ngày tạo">
            <template slot-scope="scope">
              {{ formatDateCreated(scope.row.created_at) }}
            </template>
          </el-table-column>
          <el-table-column
            label="Hoạt động"
            width="90px"
            align="center"
            class="tabel-work"
          >
            <template slot-scope="scope">
              <el-popover
                class="pop-edit"
                placement="bottom"
                width="100px"
                trigger="click"
              >
                <div class="box-edit-dailog" @click="showPermissions(scope.row._id)">
                  <i class="fa fa-sliders"></i> Quyền hạn
                </div>
                <div class="box-edit-dailog" @click="editRole(scope.row)">
                  <i class="fa fa-pencil"></i> Chỉnh sửa
                </div>
                <div class="box-edit-dailog" @click="handleDeleteRole(scope.row._id)">
                  <i class="el-icon-delete"></i> Xoá bỏ
                </div>
                <div v-if="!scope.row.is_protected" class="btn-edit" slot="reference">
                  <i class="fa fa-ellipsis-v"></i>
                </div>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="paginationWarp">
        <el-col :span="10">
          <div class="textInfo">
            <p>
              Số lượng kết quả: {{ page.from }} - {{ page.to }} của
              {{ page.total }}
            </p>
          </div>
        </el-col>
        <el-col :span="14">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="page.total"
            :page-size="page.pageSize"
            :current-page="page.currentPage"
            @current-change="handleCurrentChange"
          >
          </el-pagination>
        </el-col>
      </div>
    </el-card>
    <el-dialog
        class="dialog-add-category"
        id="dialog-add-category"
        width="600px"
        title="Thêm mới chức vụ"
        top="5vh"
        :visible.sync="dialogAddRole"
    >
      <el-row>
        <el-col :span="24">
          <el-form
              class="form-role"
              :model="form"
              :rules="rules"
              ref="formAddRole"
              label-position="top"
              hide-required-asterisk
              label-width="130px"
              size="small"
          >
            <el-row>
              <el-col :span="24" class="margin-input">
                <el-form-item prop="name">
                  <label class="label-role"
                  >Tên chức vụ <span class="required"> *</span></label
                  >
                  <el-input
                      size="medium"
                      v-model="form.name"
                      autocomplete="off"
                  ></el-input>
                </el-form-item>
                <el-form-item prop="description">
                  <label class="label-role">Mô tả</label>
                  <el-input
                      size="medium"
                      v-model="form.description"
                      :autosize="{ minRows: 4, maxRows: 6 }"
                      autocomplete="off"
                      type="textarea"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAddRole = false">Hủy</el-button>
        <el-button type="primary" @click="storeRole('formAddRole')"
        >Lưu</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
        class="dialog-add-category"
        id="dialog-edit-category"
        width="600px"
        title="Chỉnh sửa chức vụ"
        top="5vh"
        :visible.sync="dialogEditRole"
    >
      <el-row>
        <el-col :span="24">
          <el-form
              class="form-role"
              :model="form"
              :rules="rules"
              ref="formEditRole"
              label-position="top"
              hide-required-asterisk
              label-width="130px"
              size="small"
          >
            <el-row>
              <el-col :span="24" class="margin-input">
                <el-form-item prop="name">
                  <label class="label-role"
                  >Tên chức vụ <span class="required"> *</span></label
                  >
                  <el-input
                      size="medium"
                      v-model="form.name"
                      autocomplete="off"
                  ></el-input>
                </el-form-item>
                <el-form-item prop="description">
                  <label class="label-role">Mô tả</label>
                  <el-input
                      size="medium"
                      v-model="form.description"
                      :autosize="{ minRows: 4, maxRows: 6 }"
                      autocomplete="off"
                      type="textarea"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogEditRole = false">Hủy</el-button>
        <el-button type="primary" @click="handleUpdateRole('formEditRole')"
        >Lưu</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from "../api";
import { mapMutations, mapState } from "vuex";
import { formatDate } from "@/utils/helper";
import _ from "lodash";
import router from "@/router";
export default {
  name: "Customer",
  props: {
    msg: String,
  },
  components: {},
  computed: {
    ...mapState("auth", ["authUser"]),
  },
  data() {
    return {
      search: "",
      total: 0,
      dialogAddRole: false,
      roles: [],
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        from: 0,
        to: 0,
      },
      form: {
        name: "",
        description: "",
      },
      rules: {
        name: [
          {
            required: true,
            message: "Tên chức vụ không được bỏ trống!",
            trigger: "change",
          },
        ],
      },
      loading: false,
      dialogEditRole: false,
      roleEditId: ''
    };
  },
  methods: {
    ...mapMutations(["updateTitle", "updateSideBar"]),
    changePageTitle() {
      this.updateTitle("Vai trò nhân viên");
    },
    changeIndexSidebar() {
      this.updateSideBar("7");
    },
    formatDateCreated(dateString) {
      return formatDate(dateString);
    },
    handleCurrentChange(val) {
      console.log(val)
    },
    getData(params = {}) {
      this.loading = true
      api.getDataRoles(params).then((res) => {
        this.roles = _.get(res, 'data.data.data')
        this.total = res.data.data.total;
        this.page.currentPage = _.get(res, 'data.data.current_page')
        this.page.pageSize = _.get(res, 'data.data.per_page')
        this.page.total = _.get(res, 'data.data.total')
        let from = _.get(res, 'data.data.from', 0)
        let to = _.get(res, 'data.data.to', 0)
        this.page.from = from ? from : 0
        this.page.to = to ? to : 0
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    storeRole(formAddRole) {
      this.$refs[formAddRole].validate((valid) => {
        if (valid) {
          let data = {
            name: this.form.name,
            description: this.form.description
          }
          api.addRole(data).then(() => {
            this.dialogAddRole = false
            this.getData()
            this.$message({
              message: "Thêm mới thành công!",
              type: "success",
            });
          })
        }
      });
    },
    handleSearch() {
      let payload = {
        page: 1
      }
      if (this.search.length > 0) {
        payload.q = this.search
      }
      this.getData(payload)
    },
    editRole(role) {
      this.dialogEditRole = true
      this.roleEditId = role._id
      this.form.name = role.name
      this.form.description = role.description
    },
    handleUpdateRole(formEditRole) {
      this.$refs[formEditRole].validate((valid) => {
        if (valid) {
          let data = {
            name: this.form.name,
            description: this.form.description
          }
          api.updateRole(this.roleEditId, data).then(() => {
            this.dialogEditRole = false
            this.handleSearch()
            this.$message({
              message: "Cập nhật thành công!",
              type: "success",
            });
          }).catch(() => {
            this.$message({
              message: "Cập nhật thất bại!",
              type: "error",
            });
          })
        }
      });
    },
    handleDeleteRole(id) {
      this.$confirm("Bạn có chắc chắn muốn xóa vai trò này?", "Cảnh báo", {
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
        confirmButtonClass: "btn-delete-list",
        type: "warning",
      }).then(() => {
        api.deleteRole(id).then(() => {
          this.handleSearch()
          this.$message({
            message: "Xóa thành công!",
            type: "success",
          });
        }).catch(() => {
          this.$message({
            message: "Xóa thất bại!",
            type: "error",
          });
        })
      })
    },
    showPermissions(id) {
      if (router.currentRoute.name !== "Permission") {
        return router.push({ name: "Permission", query: {id: id} });
      }
    }
  },
  mounted() {
    this.changePageTitle();
    this.changeIndexSidebar();
    this.getData()
  },
  watch: {
    dialogAddRole(value) {
      if (!value) {
        this.$refs.formAddRole.resetFields();
      } else {
        this.form.name = "";
        this.form.description = "";
      }
    },
    dialogEditRole(value) {
      if (!value) {
        if (this.$refs.formAddRole) {
          this.$refs.formAddRole.resetFields();
        }
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import "../assets/styles/variables";

.dashboard {
  label {
    font-weight: bold;
    margin-bottom: 10px;
  }
  .table-roles {
    margin-top: 20px;
  }
  .paginationWarp {
    padding: 20px 0;
    margin-bottom: 10px;

    .el-pagination {
      float: right;
    }

    .textInfo {
      p {
        font-size: 0.92857rem;
        margin: 10px 0;
      }
    }
  }
  .form-role {
    .label-role {
      font-weight: bold;
      .required {
        color: $colorRed;
      }
    }
    .select-categories {
      width: 100%;
    }
  }
}
.text {
  font-size: 14px;
}
.search-input {
  width: 25%;
}
.search-btn {
  margin-left: 20px;
}
.show-card {
  float: right;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
.btn-edit-work {
  margin-left: 7px !important;
}
.box-edit-dailog {
  font-weight: 400;
  color: #212529;
  text-align: inherit;
  margin-top: 5px;
  margin-bottom: 10px;
  height: 30px;
  line-height: 30px;
  i {
    margin-right: 5px;
  }
  cursor: pointer;
}
.box-edit-dailog:hover {
  background-color: #f8f9fa;
}
.pop-edit {
  cursor: pointer;
}
.btn-delete-list {
  background: $colorRed!important;
  border: 1px solid $colorRed;
}
@media only screen and (max-width: 992px){
  .search-input {
    width: 60%;
  }
  .search-btn {
    margin-left: 10px;
  } 
}
@media only screen and (max-width: 768px){
  .search-input {
    width: 83%;
  }
  .show-card {
    display: block;
    float: none;
    margin-top: 10px;
    margin-left: 0px;
  }
  .search-btn {
    margin-left: 10px;
  } 
  .paginationWarp {
    padding: 20px 0!important;
    margin-bottom: 10px!important;
    .el-col-10 {
      width: 100%!important;
      float: none;
    }
    .el-col-14 {
      width: 100%;

    }
    .el-pagination {
      float: none!important;
      text-align: center;
    }
    .textInfo, .pagination-box {
        display: flex;
        align-items: center;
        justify-content: center;
        p {
            font-size: 12px;
            margin-bottom: 10px;
        }
    }
  }
  @media only screen and (max-width: 375px){
    .search-input {
      width: 60%;
    }
  }
}
</style>
