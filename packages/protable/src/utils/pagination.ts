import { PaginationInfo, PaginationProps } from 'naive-ui'

interface CustomPaginationInfo extends PaginationProps {
    current?: number;
    total?: number;
    showTotalText?: boolean;
}

export function getDefaultPagination(pagination: CustomPaginationInfo) {
  let basePagination: any = {
    page: pagination.page || pagination.current || 1,
    pageSize: pagination.pageSize || 10,
    itemCount: pagination.itemCount || pagination.total || 0,
    displayOrder: pagination.displayOrder || ['pages', 'size-picker', 'quick-jumper'],
  };

  if (pagination.showSizePicker) {
    basePagination = {
        ...basePagination,
        pageSizes: pagination.pageSizes || [10, 20, 30, 40],
        showSizePicker: true,
    }
  }

  if (pagination.showQuickJumper) {
    basePagination = {
        ...basePagination,
        showQuickJumper: true,
    }
  }
  if (pagination.showTotalText !== false) {
    basePagination = {
        ...basePagination,
        prefix(p: PaginationInfo) {
            return `共 ${p.itemCount} 条数据`
        }
    }
  }

  return basePagination;
}