<template>
  <div class="content">
    <div class="col-md-8 ml-auto mr-auto">
      <h2 class="text-center">{{ $t('roleManagement') }}</h2>
    </div>
    <div class="row mt-5">
      <div class="col-12">
        <card card-body-classes="table-full-width">
          <div>
            <div class="col-12 d-flex justify-content-center justify-content-sm-between align-items-center flex-wrap">
              <div class="d-flex justify-content-center justify-content-sm-between align-items-center flex-wrap xi-gap-05">
                <h6 class="mb-4 text_cap">{{ $t('role') }}</h6>
                <base-input>
                  <el-input type="search" class="mb-3 search-input" clearable prefix-icon="el-icon-search" placeholder="Search records" v-model="searchQuery" aria-controls="datatables"> </el-input>
                </base-input>
              </div>
              <div>
                <base-button type="primary" class="mb-3" size="sm" block>{{ $t('search') }}</base-button>
              </div>
            </div>
            <el-table :data="queriedData">
              <el-table-column v-for="column in tableColumns" :key="column.label" :min-width="column.minWidth" :prop="column.prop" :label="$t(column.label)"> </el-table-column>
              <el-table-column :min-width="135" align="right" :label="$t('action')">
                <div slot-scope="props">
                  <base-button @click.native="handleLike(props.$index, props.row)" class="like btn-link" type="info" size="sm" icon>
                    <i class="tim-icons icon-heart-2"></i>
                  </base-button>
                  <base-button @click.native="handleEdit(props.$index, props.row)" class="edit btn-link" type="warning" size="sm" icon>
                    <i class="tim-icons icon-pencil"></i>
                  </base-button>
                  <base-button @click.native="handleDelete(props.$index, props.row)" class="remove btn-link" type="danger" size="sm" icon>
                    <i class="tim-icons icon-simple-remove"></i>
                  </base-button>
                </div>
              </el-table-column>
            </el-table>
          </div>
          <div slot="footer" class="col-12 d-flex justify-content-center justify-content-sm-between flex-wrap">
            <div class="d-flex justify-content-center justify-content-sm-between align-items-center flex-wrap" style="gap: 4px">
              <div class="page_selector align-items-center d-flex">
                <el-select class="select-primary pagination-select" v-model="pagination.perPage" placeholder="Per page">
                  <el-option class="select-primary" v-for="item in pagination.perPageOptions" :key="item" :label="item" :value="item"> </el-option>
                </el-select>
              </div>
              <p class="card-category">Showing {{ from + 1 }} to {{ to }} of {{ total }} entries</p>
            </div>
            <base-pagination class="pagination-no-border" v-model="pagination.currentPage" :per-page="pagination.perPage" :total="total"> </base-pagination>
          </div>
        </card>
      </div>
    </div>
  </div>
</template>
<script>
import { Table, TableColumn, Select, Option } from 'element-ui';
import { BasePagination } from 'src/components';
import role_demo from './role_demo';
import Fuse from 'fuse.js';
import swal from 'sweetalert2';

export default {
  components: {
    BasePagination,
    [Select.name]: Select,
    [Option.name]: Option,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
  },
  computed: {
    /***
     * Returns a page from the searched data or the whole data. Search is performed in the watch section below
     */
    queriedData() {
      let result = this.tableData;
      if (this.searchedData.length > 0) {
        result = this.searchedData;
      }
      return result.slice(this.from, this.to);
    },
    to() {
      let highBound = this.from + this.pagination.perPage;
      if (this.total < highBound) {
        highBound = this.total;
      }
      return highBound;
    },
    from() {
      return this.pagination.perPage * (this.pagination.currentPage - 1);
    },
    total() {
      return this.searchedData.length > 0 ? this.searchedData.length : this.tableData.length;
    },
  },
  data() {
    return {
      pagination: {
        perPage: 5,
        currentPage: 1,
        perPageOptions: [5, 10, 25, 50],
        total: 0,
      },
      searchQuery: '',
      propsToSearch: ['ID', 'Role', 'Status'],
      tableColumns: [
        {
          prop: 'ID',
          label: 'ID',
          minWidth: 100,
        },
        {
          prop: 'Role',
          label: 'role',
          minWidth: 200,
        },
        {
          prop: 'Created',
          label: 'created',
          minWidth: 250,
        },
        {
          prop: 'Updated',
          label: 'updated',
          minWidth: 250,
        },
        {
          prop: 'Status',
          label: 'status',
          minWidth: 120,
        },
      ],
      tableData: role_demo,
      searchedData: [],
      fuseSearch: null,
    };
  },
  methods: {
    handleLike(index, row) {
      swal.fire({
        title: `You liked ${row.name}`,
        buttonsStyling: false,
        icon: 'success',
        customClass: {
          confirmButton: 'btn btn-success btn-fill',
        },
      });
    },
    handleEdit(index, row) {
      swal.fire({
        title: `You want to edit ${row.name}`,
        buttonsStyling: false,
        customClass: {
          confirmButton: 'btn btn-info btn-fill',
        },
      });
    },
    handleDelete(index, row) {
      swal
        .fire({
          title: 'Are you sure?',
          text: `You won't be able to revert this!`,
          icon: 'warning',
          showCancelButton: true,
          customClass: {
            confirmButton: 'btn btn-success btn-fill',
            cancelButton: 'btn btn-danger btn-fill',
          },
          confirmButtonText: 'Yes, delete it!',
          buttonsStyling: false,
        })
        .then((result) => {
          if (result.value) {
            this.deleteRow(row);
            swal.fire({
              title: 'Deleted!',
              text: `You deleted ${row.name}`,
              icon: 'success',
              confirmButtonClass: 'btn btn-success btn-fill',
              buttonsStyling: false,
            });
          }
        });
    },
    deleteRow(row) {
      let indexToDelete = this.tableData.findIndex((tableRow) => tableRow.id === row.id);
      if (indexToDelete >= 0) {
        this.tableData.splice(indexToDelete, 1);
      }
    },
  },
  mounted() {
    // Fuse search initialization.
    this.fuseSearch = new Fuse(this.tableData, {
      keys: ['name', 'email'],
      threshold: 0.3,
    });
  },
  watch: {
    /**
     * Searches through the table data by a given query.
     * NOTE: If you have a lot of data, it's recommended to do the search on the Server Side and only display the results here.
     * @param value of the query
     */
    searchQuery(value) {
      let result = this.tableData;
      if (value !== '') {
        result = this.fuseSearch.search(this.searchQuery);
      }
      this.searchedData = result;
    },
  },
};
</script>
<style>
.pagination-select,
.search-input {
  width: 200px;
}
.swal2-icon-content {
  font-size: inherit !important;
}
</style>
